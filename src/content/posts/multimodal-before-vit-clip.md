---
title: ViT/CLIP前的多模态学习
published: 2025-06-15
draft: false
---
CLIP出现，通过使用ViT与全新的训练方式，改写了多模态学习的范式。那么今天，我们来总结性的回顾一下，ViT/CLIP出现前的多模态学习是什么样的。

本文主要针对LXMERT、ViLBERT、VisualBERT、VL-BERT、UNITER等几个「Transformer后ViT/CLIP前时代」比较有代表性的多模态学习工作来进行总结。

## 单张图片的特征提取

19年，ViT还没有被提出，当时学界普遍将句子的组成方式套用在图片上：句子由一个个词组成，相近的，图片也由图片中的一个个物体组成，如果我们能从图片中提取出这一个个小物体，拿到相应的特征向量，就可以像组织文本嵌入序列一样组织这些「图片物体特征向量」，然后将它们塞进Transformer进行训练。

那么，如何从图片中提取出这些小物体并拿到相应的特征向量呢？答案已经呼之欲出了——R-CNN。当时的主流做法是：

1. 将图像输入到ResNet，拿到C4的Feature Map
2. 使用预训练Faster R-CNN在C4的Feature Map找Bounding Box
3. 将RoI抠出来，并输入ResNet的C5，经过池化后拿到最终的区域特征表示

然而这种做法计算开销巨大，并使得模型非端到端，导致Visual Encoder无法一块训练甚至拉低整体性能，因为如果Faster R-CNN无法检测到一个种类的物体，那么模型就永远学不到相关信息。所以，在ViT横空出世后，这种做法就被扫进历史的垃圾堆了。

## Single-Stream vs. Dual-Stream

在当时主要流行两种架构：单流与双流。

单流是指将图片区域特征向量和文本嵌入序列放入同一个Transformer进行训练，而双流是指使用一个专用的Visual Encoder配合文本Transformer，通过Cross Attention进行信息交换。

时间来到现在，目前的多模态大模型架构大致可以分成3类：单流、双流与原生多模态。

单流指通过Visual Encoder+Projecter，将视觉信息转换到文本向量空间，然后和文本序列一块放入Transformer中进行训练；双流指的是像CLIP这种模型；原生多模态指的是类似Gemini系列的模型，在预训练过程中就使用统一的Tokenizer和Transformer处理不同模态的信息，这时，处理的Token就不仅仅指文本嵌入了，而是指更广义的，所有模态共同向量空间下的向量。

## 类BERT的训练策略

当时的多模态学习预训练基本是「视觉版本的BERT预训练」，当然，很多模型本身也是基于BERT来构建的。

当时常用的任务有：

1. Masked Language Modeling (MLM)：遮住一个词，利用周围的词和图片区域来预测它。
2. Masked Region Modeling (MRM)：遮住一个图片区域（置零或掩码），利用周围区域和**文本**来预测该区域的特征或类别。
3. Image-Text Matching (ITM)：给定一对图文，判断它们是否匹配。

可以看出基本沿用了BERT的预训练策略。