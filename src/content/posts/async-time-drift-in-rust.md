---
title: Rsut中的async时间漂移
published: 2026-09-25
draft: false
---

有一个简单的异步程序

```rust
use std::time::Duration;

fn main() {
    trpl::block_on(async {
        let (tx0, mut rx) = trpl::channel();
        let tx1 = tx0.clone();

        let tx0_fut = async move {
            let vals = vec![
                String::from("tx0: 0"),
                String::from("tx0: 1"),
                String::from("tx0: 2"),
                String::from("tx0: 3"),
            ];

            for val in vals {
                tx0.send(val).unwrap();
                trpl::sleep(Duration::from_millis(500)).await;
            }
        };

        let tx1_fut = async move {
            let vals = vec![
                String::from("tx1: 0"),
                String::from("tx1: 1"),
                String::from("tx1: 2"),
                String::from("tx1: 3"),
            ];

            for val in vals {
                tx1.send(val).unwrap();
                trpl::sleep(Duration::from_millis(1500)).await;
            }
        };

        let rx_fut = async {
            while let Some(value) = rx.recv().await {
                println!("{value}");
            }
        };

        trpl::join!(tx0_fut, tx1_fut, rx_fut);
    });
}
```

此时的输出为

```
tx0: 0
tx1: 0
tx0: 1
tx0: 2
tx1: 1
tx0: 3
tx1: 2
tx1: 3
```

如果我们改变一下`join!`中的两个tx的顺序

```rust
trpl::join!(tx1_fut, tx0_fut, rx_fut);
```

这时的输出变成了

```
tx1: 0
tx0: 0
tx0: 1
tx0: 2
tx1: 1
tx0: 3
tx1: 2
tx1: 3
```

这很好理解，因为`join!`是有调度顺序的，但是为什么只有前两个输出的顺序变了，1500ms时的两个输出顺序却保持不变，一直是tx1在前

```
tx1: 1
tx0: 3
```

因为程序中出现了隐藏的时间开销，让tx0的调度落后了。这里程序中写了

```rust
trpl::sleep(Duration::from_millis(500)).await;
```

但这只能保证某个future至少500ms后才能被再次poll，并不能保证周期就是500ms。实际上每次被poll都会有do something+调度耗时的time drift，最终导致tx0落后于tx1。

我们将500ms缩短至499ms，这时再交换就会发生1500ms处的变化了，当然这个和个人机器有关，可能无法稳定复现。

我们直接测出具体时间：

```rust
use std::time::{Duration, Instant};

fn main() {
    trpl::block_on(async {
        let start = Instant::now();
        let (tx0, mut rx) = trpl::channel();
        let tx1 = tx0.clone();

        let tx0_fut = async move {
            let vals = vec![
                String::from("tx0: 0"),
                String::from("tx0: 1"),
                String::from("tx0: 2"),
                String::from("tx0: 3"),
            ];

            for val in vals {
                println!("{:?}: tx0 sending {val}", start.elapsed());
                tx0.send(val).unwrap();
                trpl::sleep(Duration::from_millis(500)).await;
            }
        };

        let tx1_fut = async move {
            let vals = vec![
                String::from("tx1: 0"),
                String::from("tx1: 1"),
                String::from("tx1: 2"),
                String::from("tx1: 3"),
            ];

            for val in vals {
                println!("{:?}: tx1 sending {val}", start.elapsed());
                tx1.send(val).unwrap();
                trpl::sleep(Duration::from_millis(1500)).await;
            }
        };

        let rx_fut = async {
            while let Some(value) = rx.recv().await {
                println!("rx: {value}");
            }
        };

        trpl::join!(tx0_fut, tx1_fut, rx_fut);
    });
}

```

输出

```
// tx0, tx1
117.833µs: tx0 sending tx0: 0
234.125µs: tx1 sending tx1: 0
rx: tx0: 0
rx: tx1: 0
502.381333ms: tx0 sending tx0: 1
rx: tx0: 1
1.004606875s: tx0 sending tx0: 2
rx: tx0: 2
1.501925375s: tx1 sending tx1: 1
rx: tx1: 1
1.505311083s: tx0 sending tx0: 3
rx: tx0: 3
3.004003375s: tx1 sending tx1: 2
rx: tx1: 2
4.506329s: tx1 sending tx1: 3
rx: tx1: 3

// tx1, tx0
143.708µs: tx1 sending tx1: 0
301µs: tx0 sending tx0: 0
rx: tx1: 0
rx: tx0: 0
502.448416ms: tx0 sending tx0: 1
rx: tx0: 1
1.004695875s: tx0 sending tx0: 2
rx: tx0: 2
1.502794666s: tx1 sending tx1: 1
rx: tx1: 1
1.506181166s: tx0 sending tx0: 3
rx: tx0: 3
3.005453375s: tx1 sending tx1: 2
rx: tx1: 2
4.507735583s: tx1 sending tx1: 3
rx: tx1: 3
```

所以，如果有固定周期的需求，应该使用`interval`而不是直接加一个Duration