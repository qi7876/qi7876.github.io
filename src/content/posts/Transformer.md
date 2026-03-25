---
title: Transformer
published: 2024-04-12
tags:
  - artificial-intelligence
draft: false
---
提到Transformer，我们会迅速想起自注意力、多头注意力、位置编码、encoder-decoder这些概念，但还有一个不那么引人注目又非常重要的创新：计算并行化。计算并行化直接让Transformer的工程可用性捅破了天花板，我随便列出几个优点：

1. 大幅提高训练速度
2. 榨干硬件资源
3. 支持大规模预训练

这也能解释，为什么Transformer出现后，AI的发展速度明显加快了，因为Transformer极大的降低了试错的时间成本。