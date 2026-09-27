---
title: 17.06 Transformer
published: 2025-03-12
draft: false
---

提到 Transformer，我们会迅速想起自注意力、多头注意力、位置编码、encoder-decoder 这些概念，但还有一个不那么引人注目又非常重要的创新：计算并行化。计算并行化直接让 Transformer 的工程可用性捅破了天花板，我随便列出几个优点：

1. 大幅提高训练速度
1. 榨干硬件资源
1. 支持大规模预训练

这也能解释，为什么 Transformer 出现后，AI 的发展速度明显加快了，因为 Transformer 极大的降低了试错的时间成本。

不过，这时候 Transformer 的底层算子还没那么成熟，后续 Tri Dao 实验室提出的 Flash Attentation 等技术又让 Transformer 的工程可用性强了一大截。
