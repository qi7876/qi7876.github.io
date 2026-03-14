---
title: Mean, Var and Typical Scale
published: 2026-03-08
tags:
  - math
  - artificial-intelligence
draft: false
---
标准差衡量了一个变量的典型大小（数量级）

Transformer 中，在计算 Attention 时，对于 $Q \cdot K^T$ 除了一个 $\sqrt{d}$ ，这是为了将点积结果的典型大小拉回 $1$，避免softmax的梯度消失问题。

这个 $\sqrt{d}$ 就是每个向量的标准差。不过你有没有想过为什么是除以 $\sqrt{d}$ ？而不是 $d$ ?

因为 $d$ 是方差，如果我们设一个随机变量的均值为 0，那么可以求出 $\sigma^2=E[X^2]$，可以看到，方差和样本平方值的大小相关，所以我们需要标准差而不是方差。

本质上，这个问题和随机游走以及中心极限定理是相同的。

在人类如此复杂的作品中，概率论就这么默默的参与其中，一个小小的 $\sqrt{d}$ 联系起了 Transformer 与随机游走，这种感觉还是很奇妙的。