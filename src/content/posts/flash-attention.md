---
title: Flash Attention
published: 2026-03-29
draft: false
---

Flash Attention 没有改变 Attention 的算法复杂度，但通过底层算法优化，将数据分块并在片上完成计算，大幅降低了显存占用和显存 IO 开销。

Flash Attention 的核心算法是 Online Softmax，用于替换传统的 Softmax，可以证明 Online Softmax 得到的最终结果和传统 Softmax 得到的结果相同。而 Online Softmax 的分块处理特性和增量更新机制让其计算可以在 on-chip memory 上进行，无需多次写回 HBM，解决了传统 Softmax 的显存瓶颈痛点。
