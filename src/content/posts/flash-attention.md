---
title: Flash Attention
published: 2026-03-29
draft: false
---
Flash Attention没有改变Attention的算法复杂度，但通过底层算法优化，将数据分块并在片上完成计算，大幅降低了显存占用和显存IO开销。

Flash Attention的核心算法是Online Softmax，用于替换传统的Softmax，可以证明Online Softmax得到的最终结果和传统Softmax得到的结果相同。而Online Softmax的分块处理特性和增量更新机制让其计算可以在on-chip memory上进行，无需多次写回HBM，解决了传统Softmax的显存瓶颈痛点。