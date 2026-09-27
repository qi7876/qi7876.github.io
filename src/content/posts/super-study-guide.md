---
title: "[Note] Super Study Guide: Transformers and Large Language Models"
published: 2026-05-21
draft: false
---

趁着 NIPS 投稿结束，终于抽出两周时间断断续续给这本书看完了，不过其中有些部分还是稍微跳过了一些，比如最后 preference tuning 和 model compression 的内容。

## Foundations

这一部分的内容比较简单，主要是基础知识。

## Embeddings

这部分讲了 embedding 相关的知识

### Tokenization

我们需要将一句话分成 token sequence，这样才能放进 transformer 中。

token 的选取分为不同 level：

1. word：单词作为 token
1. subword：子词作为 token
1. character：人类能看懂的最小字符作为 token
1. byte：byte encoding 作为 token

从上到下，词汇表逐渐变小，分出的 token sequence 逐渐变长，out of vocabulary 问题逐渐变小。目前最常用的是 subword 分词，其综合性能最佳。

subword 分词算法中，有 BPE 和 Unigram 两种算法，其中最常用的是 BPE

### Token Embeddings

得到 token sequence 后，我们需要将 token 转换为 embedding，也就是需要 vocabulary 中每个词到 embedding 的映射。

最简单的是 one hot 编码，但是其 dimension 随 vocabulary size 而增大，同时 embedding 无法反映词间的 similarity

目前常用的是 continuous encoding，也就是每个词的 embedding 的每一个 dimension 都是一个 float，dimension 的数量是固定的，常见的是 CBOW 和 skip gram，训练时常用的加速手段是 negative sampling，GloVe 了解一下就可以

### Document embeddings

之前我们学习了如何将一句话分为 token sequence，并接着转为 embedding sequence。另一个问题是如何将一个文档转为一个 embedding。这里只给了 BOW、TF-IDF 这两个传统的启发式算法，二者都基于词频来决定 document embedding，目前更常用的是 BERT 的各种衍生模型或混合算法。

然后讲了 RNN 相关知识，这里了解一下就好

### Embedding operations

我们通常用 cosine similarity 量化 embedding 之间的相关性。

然后是 t-SNE 降维算法，用来可视化高维 embedding

最后是给定 query embedding，找到最相似的 Top-K 向量，经典算法是 LSH

## Transformer

前两个 subsection 讲的比较基础，对 transformer 比较熟悉的话，可以直接跳到 3.3

### Computational improvements

首先是 position embedding，比较基础的是 learned embedding 和 sinusoid embedding，目前最常用的是 RoPE 以及其变种，推荐阅读：[苏剑林的 blog](https://kexue.fm/archives/8265)

然后是 layer-level 的 tricks：

1. attention layer：原始 transformer 使用的是 MHA，为了提高性能，我们可以使用对 query 进行分组的 GQA，当 query 全部被分到一组时，最后就简化为了 MQA
1. others：其他 tricks 例如 residual connections、masking、LN、label smoothing 都比较简单

### Architecture variations

transformer 的原始架构是 encoder-decoder，后续衍生出了 encoder-only 和 decoder-only 的诸多变种，其中最出名的是 decoder-only 的 GPT 系列。

encoder-only 中最出名的是 BERT，其 pretrain 策略影响很大：

1. Masked Language Model, MLM：挑一些 token，80% 换成 `[MASK]` 这个 special token，10% 换成随机词，10% 不变，让模型预测这些 token
1. Next Sentence Prediction, NSP：用 `[CLS]` 预测两句话是否连续

后续的 finetuning 让 BERT 在特定任务上表现更好

其他 encoder-only 模型还有 DistilBERT、ALBERT、RoBERTa、ELECTRA

来到 decoder-only 模型，有两个系列：GPT、LLaMA。GPT 系列只开源到 3，后续成为了 OpenAI 的 property model 不再开源。LLaMA 来自 Meta，是开源 LLM 的经典工作，有很多变种

最后是 decoder-only 模型的 scaling law，来自论文 [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)，可以阅读这篇论文笔记：[DOCSAID Chinchilla](https://docsaid.org/papers/transformers/chinchilla/)

接着是传统的 encoder-decoder 模型，比较出名的是 google 的 T5，以及 ByT5、BART

最后是新兴的 MoE 模型，主要是对 transformer 中的 FFN/MLP 进行了修改，添加了多个并行的前馈网络，每个就作为一个专家。目前最常见的是 Top-K 专家，router 对每个 token 计算 expert 的得分，然后将 token 送入前 k 个专家，输出按权重进行合并，这个方式称为 sparse MoE，相对的有 Dense MoE，每个 token 都送入所有专家，再加权求和。Switch Transformer 是典型的 Top-1 MoE

### Attention computations speedup

首先是不同的 sparse attention：

1. reformer：只计算相似 token 间的 attention，这里又使用了 LSH 来寻找相似 token，复杂度降至$O(N \log{N})$
1. longformer：对 attention map 下手，部分 token 为 global，可以被所有 token 看到同时看到所有 token，其余 token 使用 sliding window attention，只能看到局部的 token，还有可选的 dilated sliding window，每隔几个 token 看一个 token

然后是 low rank attention，sparse attention 直接让每个 token 只 attend 部分 token，而 low rank attention 选择使用低秩结构近似完整的 attention：

1. linformer：为 KV 矩阵加入低秩矩阵以降低复杂度
1. performer：利用 kernel trick 降低 attention 计算复杂度

### Hardware optimization

最出名、常用的是 Flash attention，由 DAO Lab 提出，通过将 attention 的计算切成小块，将数据留在 SRAM 上，减少对 HBM 的使用，降低了 memory 的 IO 操作

### Interpretability

如何对模型进行解释分析？

最简单的方式是画 attention map，看不同 token 的 attention score，但其实不同的 attention score 可能对应同样的 output，所以这个方法不是很准确

更通用的方法有 TCAV、Integrated gradients、LIME、TracIn

## Large language model

### Notations

大模型的训练一般分为三个阶段：pretraining、finetuning、preference tuning

pretraining 让模型学习数据的 generalities，finetuning 让模型学习特定的任务，preference tuning 让模型学习输出好的答案

finetuning 和 preference tuning 可以合称为 alignment，都包含在 post-training 中，post-training 的方向很多：

1. Supervised fine-tuning / SFT
1. Preference tuning / alignment optimization
1. Reinforcement learning / RL-style post-training
1. Reasoning-oriented post-training
1. Distillation / teacher-student training
1. Domain adaptation / continual fine-tuning
1. Tool-use / agentic training
1. Safety / refusal / policy behavior training
1. Long-context / memory / retrieval-oriented training
1. Efficient adaptation: LoRA, QLoRA, adapters, prompt tuning

然后是 emergent abilities，随着 model size 的增长，模型能力会在一个临界点后显著提高

### Response generation

LLM 在生成 token 时有几种不同的策略。

我们已经知道了生成 token 时会计算 vocabulary 中所有词的 softmax score，那么我们直接选取得分最高的词，就是 Greedy search。总所周知，greedy 不一定能得到全局最优，那么我们可以同时探索多条生成路径，这就是 Beam search

目前实际上最常用的是 Sampling-based generation。首先是最最最常见的 Temperature sampling，在计算 softmax 前，对所有 logits 除以 Temperature，也就是同时进行缩放。我们知道指数函数的增长速度很恐怖，所以当 T<1 时，logits 都被放大，计算 softmax 时，大的数值得分变的更高了，当 T>1 时，logits 都被缩小，计算 softmax 时，得分被拉近了。

接着我们继续应用 Top token sampling。先来 Top-K token sampling，非常简单，取前 K 个，其他的丢了。然后是 Top-p sampling，取累积概率到 p 的最小 token 集合，其他的丢了。

最后进行概率归一化，然后按概率进行随机采样，得到最终 token。

### Pretraining

首先是 data mixture，目前比较常见的数据源有：Common Crawl、C4、BookCorpus、Multilingual datasets、GitHub、StackOverflow

接着就开始训练了，在准备好的数据上通过 Next token prediction 任务进行大规模的 self supervised learning

### Prompt engineering

坏输入会得到坏结果，一个好的 prompt 应该包含什么？context、instruction、input、examples、constrains

context window 和 context length 也需要了解一下，前者是 LLM 的最大容量，后者是总的输入长度。需要注意的是，context window 大不代表模型真的能处理的好 context window 内的所有内容，用美国豆包 gemini 来举例，gemini 的单轮或少轮对话表现还不错，但当 context length 增长到一个临界点后，gemini 的大海捞针得分会断崖式下跌（flash 和 pro 都是如此，截止 2026-05-20，google 新发布的 3.5flash 仍然如此，无愧美国豆包的名号。google 家 coding agent 垃圾也是预料之中，反观 gpt5.5 只是少量下跌，真是 codex 成功的一等功臣）。

接着，我们来介绍一些用来增强模型能力的 prompting strategies。

首先是 In Context Learning，给模型几个例子，然后给出新问题，这个方法叫 Few-shot learning，如果不给例子直接给问题，就是 Zero-shot learning。

然后是 CoT，通过让模型在推理时显示输出 reasoning 过程来提高模型表现，idea 就是让模型在新问题上复用训练语料中的推理模式

接着是 Self-consistency，让模型在不同 sampling hyperparameter 下生成答案，然后选择出现次数最高的

接着是 ToT，树状的去搜索答案，说实话没见过真正的应用，只能说有启发意义

最后是 ReAct，将 Thought、Action、Observation 交替进行从而提高模型能力，这是后续 agent 发展的基石理论。有趣的是，相近的但适用于人类的决策模型早在 1970s 就出现了：[Wiki pedia OODA Loop](https://en.wikipedia.org/wiki/OODA_loop)，我在 Anthropic 的一个 leader 的 blog 中也看到其在使用这个决策模型，所以也写进了自己的 blog 里。

prompt 也存在安全问题，比如 prompt injection attack，以及 model hallucination。

### Finetuning

首先是 SFT，SFT 提高模型在 tasks of interest 上的表现，SFT training data 需要 quality>quantity，数量 k 级已经足够，pretraining 获得的 model 在 SFT training data 上继续进行 NTP 任务。相近的是 Instruction tuning，其希望模型在未见过的 instruction 上表现更好，也就是提高指令遵循能力。

然后是 Parameter efficient finetuning。在微调时，模型的全部参数并不都需要改变，实际上，仅仅调整一个 subset 就足够。最经典常用的工作是 LoRA，其一般作用在 QV 矩阵上，训练后能 merge 回原权重。还有 adapter，其插入了一些权重可更新的 module，微调时只调整这些 adapter。最后是 Prefix tuning，其在 KV 前加入一段 virtual token，这些 token 位于 continuous space，在微调时只更新这些 virtual token 的值，相当于给模型提供了一段虚拟的上下文用于指导输出。

### Preference tuning

preference tuning 用来让模型生成更好的、更贴近我们 preference 的答案。训练需要 preference data，我们一般使用 pairwise data，因为其比较简单

接着，我们就要使用这些数据，通过 RLHF 来让模型对齐人类的偏好。RLHF 先用这些数据训练出一个 RM，然后用 RM 去评价模型的输出是否符合 preference，最后，用 PPO 更新模型权重。

其他比较常见的还有 rejection sampling、DPO、IPO。

### Model compression

模型压缩主要有两条路：蒸馏和量化。这块就不再细讲了。
