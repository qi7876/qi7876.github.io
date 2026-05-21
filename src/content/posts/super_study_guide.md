---
title: "[Note] Super Study Guide: Transformers and Large Language Models"
published: 2026-05-21
tags:
  - artificial-intelligence
draft: false
---
趁着NIPS投稿结束，终于抽出两周时间断断续续给这本书看完了，不过其中有些部分还是稍微跳过了一些，比如最后preference tuning和model compression的内容。

## Foundations

这一部分的内容比较简单，主要是基础知识。

## Embeddings

这部分讲了embedding相关的知识
### Tokenization

我们需要将一句话分成token sequence，这样才能放进transformer中。

token的选取分为不同level：

1. word：单词作为token
2. subword：子词作为token
3. character：人类能看懂的最小字符作为token
4. byte：byte encoding作为token

从上到下，词汇表逐渐变小，分出的token sequence逐渐变长，out of vocabulary问题逐渐变小。目前最常用的是subword分词，其综合性能最佳。

subword分词算法中，有BPE和Unigram两种算法，其中最常用的是BPE

### Token Embeddings

得到token sequence后，我们需要将token转换为embedding，也就是需要vocabulary中每个词到embedding的映射。

最简单的是one hot编码，但是其dimension随vocabulary size而增大，同时embedding无法反映词间的similarity

目前常用的是continuous encoding，也就是每个词的embedding的每一个dimension都是一个float，dimension的数量是固定的，常见的是CBOW和skip gram，训练时常用的加速手段是negative sampling，GloVe了解一下就可以

### Document embeddings

之前我们学习了如何将一句话分为token sequence，并接着转为embedding sequence。另一个问题是如何将一个文档转为一个embedding。这里只给了BOW、TF-IDF这两个传统的启发式算法，二者都基于词频来决定document embedding，目前更常用的是BERT的各种衍生模型或混合算法。

然后讲了RNN相关知识，这里了解一下就好

### Embedding operations

我们通常用cosine similarity量化embedding之间的相关性。

然后是t-SNE降维算法，用来可视化高维embedding

最后是给定query embedding，找到最相似的Top-K向量，经典算法是LSH

## Transformer

前两个subsection讲的比较基础，对transformer比较熟悉的话，可以直接跳到3.3

### Computational improvements

首先是position embedding，比较基础的是learned embedding和sinusoid embedding，目前最常用的是RoPE以及其变种，推荐阅读：[苏剑林的blog](https://kexue.fm/archives/8265)

然后是layer-level的tricks：

1. attention layer：原始transformer使用的是MHA，为了提高性能，我们可以使用对query进行分组的GQA，当query全部被分到一组时，最后就简化为了MQA
2. others：其他tricks例如residual connections、masking、LN、label smoothing都比较简单

### Architecture variations

transformer的原始架构是encoder-decoder，后续衍生出了encoder-only和decoder-only的诸多变种，其中最出名的是decoder-only的GPT系列。

encoder-only中最出名的是BERT，其pretrain策略影响很大：

1. Masked Language Model, MLM：挑一些token，80%换成`[MASK]`这个special token，10%换成随机词，10%不变，让模型预测这些token
2. Next Sentence Prediction, NSP：用`[CLS]`预测两句话是否连续

后续的finetuning让BERT在特定任务上表现更好

其他encoder-only模型还有DistilBERT、ALBERT、RoBERTa、ELECTRA

来到decoder-only模型，有两个系列：GPT、LLaMA。GPT系列只开源到3，后续成为了OpenAI的property model不再开源。LLaMA来自Meta，是开源LLM的经典工作，有很多变种

最后是decoder-only模型的scaling law，来自论文[Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)，可以阅读这篇论文笔记：[DOCSAID Chinchilla](https://docsaid.org/papers/transformers/chinchilla/)

接着是传统的encoder-decoder模型，比较出名的是google的T5，以及ByT5、BART

最后是新兴的MoE模型，主要是对transformer中的FFN/MLP进行了修改，添加了多个并行的前馈网络，每个就作为一个专家。目前最常见的是Top-K专家，router对每个token计算expert的得分，然后将token送入前k个专家，输出按权重进行合并，这个方式称为sparse MoE，相对的有Dense MoE，每个token都送入所有专家，再加权求和。Switch Transformer是典型的Top-1 MoE

### Attention computations speedup

首先是不同的sparse attention：

1. reformer：只计算相似token间的attention，这里又使用了LSH来寻找相似token，复杂度降至$O(N \log{N})$
2. longformer：对attention map下手，部分token为global，可以被所有token看到同时看到所有token，其余token使用sliding window attention，只能看到局部的token，还有可选的dilated sliding window，每隔几个token看一个token

然后是low rank attention，sparse attention直接让每个token只attend部分token，而low rank attention选择使用低秩结构近似完整的attention：

1. linformer：为KV矩阵加入低秩矩阵以降低复杂度
2. performer：利用kernel trick降低attention计算复杂度

### Hardware optimization

最出名、常用的是Flash attention，由DAO Lab提出，通过将attention的计算切成小块，将数据留在SRAM上，减少对HBM的使用，降低了memory的IO操作

### Interpretability

如何对模型进行解释分析？

最简单的方式是画attention map，看不同token的attention score，但其实不同的attention score可能对应同样的output，所以这个方法不是很准确

更通用的方法有TCAV、Integrated gradients、LIME、TracIn

## Large language model

### Notations

大模型的训练一般分为三个阶段：pretraining、finetuning、preference tuning

pretraining让模型学习数据的generalities，finetuning让模型学习特定的任务，preference tuning让模型学习输出好的答案

finetuning和preference tuning可以合称为alignment，都包含在post-training中，post-training的方向很多：

1. Supervised fine-tuning / SFT
2. Preference tuning / alignment optimization
3. Reinforcement learning / RL-style post-training
4. Reasoning-oriented post-training
5. Distillation / teacher-student training
6. Domain adaptation / continual fine-tuning
7. Tool-use / agentic training
8. Safety / refusal / policy behavior training
9. Long-context / memory / retrieval-oriented training
10. Efficient adaptation: LoRA, QLoRA, adapters, prompt tuning

然后是emergent abilities，随着model size的增长，模型能力会在一个临界点后显著提高

### Response generation

LLM在生成token时有几种不同的策略。

我们已经知道了生成token时会计算vocabulary中所有词的softmax score，那么我们直接选取得分最高的词，就是Greedy search。总所周知，greedy不一定能得到全局最优，那么我们可以同时探索多条生成路径，这就是Beam search

目前实际上最常用的是Sampling-based generation。首先是最最最常见的Temperature sampling，在计算softmax前，对所有logits除以Temperature，也就是同时进行缩放。我们知道指数函数的增长速度很恐怖，所以当T<1时，logits都被放大，计算softmax时，大的数值得分变的更高了，当T>1时，logits都被缩小，计算softmax时，得分被拉近了。

接着我们继续应用Top token sampling。先来Top-K token sampling，非常简单，取前K个，其他的丢了。然后是Top-p sampling，取累积概率到p的最小token集合，其他的丢了。

最后进行概率归一化，然后按概率进行随机采样，得到最终token。

### Pretraining

首先是data mixture，目前比较常见的数据源有：Common Crawl、C4、BookCorpus、Multilingual datasets、GitHub、StackOverflow

接着就开始训练了，在准备好的数据上通过Next token prediction任务进行大规模的self supervised learning

### Prompt engineering

坏输入会得到坏结果，一个好的prompt应该包含什么？context、instruction、input、examples、constrains

context window和context length也需要了解一下，前者是LLM的最大容量，后者是总的输入长度。需要注意的是，context window大不代表模型真的能处理的好context window内的所有内容，用美国豆包gemini来举例，gemini的单轮或少轮对话表现还不错，但当context length增长到一个临界点后，gemini的大海捞针得分会断崖式下跌（flash和pro都是如此，截止2026-05-20，google新发布的3.5flash仍然如此，无愧美国豆包的名号。google家coding agent垃圾也是预料之中，反观gpt5.5只是少量下跌，真是codex成功的一等功臣）。

接着，我们来介绍一些用来增强模型能力的prompting strategies。

首先是In Context Learning，给模型几个例子，然后给出新问题，这个方法叫Few-shot learning，如果不给例子直接给问题，就是Zero-shot learning。

然后是CoT，通过让模型在推理时显示输出reasoning过程来提高模型表现，idea就是让模型在新问题上复用训练语料中的推理模式

接着是Self-consistency，让模型在不同sampling hyperparameter下生成答案，然后选择出现次数最高的

接着是ToT，树状的去搜索答案，说实话没见过真正的应用，只能说有启发意义

最后是ReAct，将Thought、Action、Observation交替进行从而提高模型能力，这是后续agent发展的基石理论。有趣的是，相近的但适用于人类的决策模型早在1970s就出现了：[Wiki pedia OODA Loop](https://en.wikipedia.org/wiki/OODA_loop)，我在Anthropic的一个leader的blog中也看到其在使用这个决策模型，所以也写进了自己的blog里。

prompt也存在安全问题，比如prompt injection attack，以及model hallucination。

### Finetuning

首先是SFT，SFT提高模型在tasks of interest上的表现，SFT training data需要quality>quantity，数量k级已经足够，pretraining获得的model在SFT training data上继续进行NTP任务。相近的是Instruction tuning，其希望模型在未见过的instruction上表现更好，也就是提高指令遵循能力。

然后是Parameter efficient finetuning。在微调时，模型的全部参数并不都需要改变，实际上，仅仅调整一个subset就足够。最经典常用的工作是LoRA，其一般作用在QV矩阵上，训练后能merge回原权重。还有adapter，其插入了一些权重可更新的module，微调时只调整这些adapter。最后是Prefix tuning，其在KV前加入一段virtual token，这些token位于continuous space，在微调时只更新这些virtual token的值，相当于给模型提供了一段虚拟的上下文用于指导输出。

### Preference tuning

preference tuning用来让模型生成更好的、更贴近我们preference的答案。训练需要preference data，我们一般使用pairwise data，因为其比较简单

接着，我们就要使用这些数据，通过RLHF来让模型对齐人类的偏好。RLHF先用这些数据训练出一个RM，然后用RM去评价模型的输出是否符合preference，最后，用PPO更新模型权重。

其他比较常见的还有rejection sampling、DPO、IPO。

### Model compression

模型压缩主要有两条路：蒸馏和量化。这块就不再细讲了。