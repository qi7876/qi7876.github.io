---
title: ViT/CLIP前的多模态学习
published: 2025-06-15
draft: false
---

CLIP 出现，通过使用 ViT 与全新的训练方式，改写了多模态学习的范式。那么今天，我们来总结性的回顾一下，ViT/CLIP 出现前的多模态学习是什么样的。

本文主要针对 LXMERT、ViLBERT、VisualBERT、VL-BERT、UNITER 等几个「Transformer 后 ViT/CLIP 前时代」比较有代表性的多模态学习工作来进行总结。

## 单张图片的特征提取

19 年，ViT 还没有被提出，当时学界普遍将句子的组成方式套用在图片上：句子由一个个词组成，相近的，图片也由图片中的一个个物体组成，如果我们能从图片中提取出这一个个小物体，拿到相应的特征向量，就可以像组织文本嵌入序列一样组织这些「图片物体特征向量」，然后将它们塞进 Transformer 进行训练。

那么，如何从图片中提取出这些小物体并拿到相应的特征向量呢？答案已经呼之欲出了——R-CNN。当时的主流做法是：

1. 将图像输入到 ResNet，拿到 C4 的 Feature Map
1. 使用预训练 Faster R-CNN 在 C4 的 Feature Map 找 Bounding Box
1. 将 RoI 抠出来，并输入 ResNet 的 C5，经过池化后拿到最终的区域特征表示

然而这种做法计算开销巨大，并使得模型非端到端，导致 Visual Encoder 无法一块训练甚至拉低整体性能，因为如果 Faster R-CNN 无法检测到一个种类的物体，那么模型就永远学不到相关信息。所以，在 ViT 横空出世后，这种做法就被扫进历史的垃圾堆了。

## Single-Stream vs. Dual-Stream

在当时主要流行两种架构：单流与双流。

单流是指将图片区域特征向量和文本嵌入序列放入同一个 Transformer 进行训练，而双流是指使用一个专用的 Visual Encoder 配合文本 Transformer，通过 Cross Attention 进行信息交换。

时间来到现在，目前的多模态大模型架构大致可以分成 3 类：单流、双流与原生多模态。

单流指通过 Visual Encoder+Projecter，将视觉信息转换到文本向量空间，然后和文本序列一块放入 Transformer 中进行训练；双流指的是像 CLIP 这种模型；原生多模态指的是类似 Gemini 系列的模型，在预训练过程中就使用统一的 Tokenizer 和 Transformer 处理不同模态的信息，这时，处理的 Token 就不仅仅指文本嵌入了，而是指更广义的，所有模态共同向量空间下的向量。

## 类 BERT 的训练策略

当时的多模态学习预训练基本是「视觉版本的 BERT 预训练」，当然，很多模型本身也是基于 BERT 来构建的。

当时常用的任务有：

1. Masked Language Modeling (MLM)：遮住一个词，利用周围的词和图片区域来预测它。
1. Masked Region Modeling (MRM)：遮住一个图片区域（置零或掩码），利用周围区域和**文本**来预测该区域的特征或类别。
1. Image-Text Matching (ITM)：给定一对图文，判断它们是否匹配。

可以看出基本沿用了 BERT 的预训练策略。
