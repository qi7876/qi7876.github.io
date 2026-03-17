---
title: Research Agent Workflow
published: 2026-02-21
tags:
  - artificial-intelligence
  - reflection
draft: false
---
诸如Claude Code、Codex这样的Coding Agent其实可以拿来做很多Coding之外的工作，比如科研。以我个人常用的Codex为例，我会用它来辅助我写代码、读论文、调研、写论文等等其他工作。注意我这里用的是「辅助」一词，这些事还是需要以你个人为主体的，全权交给Codex会让你迅速失去对项目的掌握，就像Vibe Coding一样，它只适合做Toy Project，不适合做严肃的工作。你可以用一句话来提醒自己：如果你不知道AI在干什么，那就不要让它做。

下面我会介绍一下我自己是如何增强Codex的科研能力的。

## PDF转Markdown Skill

Claude Code貌似是支持直接读取pdf文件的，但Codex不支持，这就导致Codex会自行调用python来处理pdf文件，解析结果很差，所以我们首先要解决读取pdf文件的问题。

这里我使用了MinerU的API来将pdf转换为markdown，并通过创建一个skill来将这个能力暴露出来。

## Zotero的局限

Zotero是一个很流行的文献管理软件，但是其是一个GUI应用，无法通过CLI调用，天然和Agent有摩擦。这一点Obsidian做的就很好，在已有GUI应用的基础上，推出了CLI版本来供Agent进行调用。

在我的工作流中，Zotero已经被边缘化了，我目前更倾向于在一个project中，将参考论文pdf和自己论文的tex文件放在一起，通过之前的PDF转Markdown skill来让Codex能准确读取论文内容，这样可以更精准的辅助我阅读和写作，而笔记直接放在Obsidian中，这样Agent和我都能读取到。

现在存在另一个问题，我们需要生成论文的BibTeX来供我们引用，但是我们缺少论文pdf对应的metadata。好在，这个问题很容易解决。整体流程大致如下：

1. 从PDF前几页提取文本
2. 抓出：
    - DOI
    - title
    - first author
3. 用title+author查arXiv    
4. 如果arXiv高置信命中：
    - 采用arXiv title/authors/abstract/arxiv_id
    - 再看是否能从PDF或arXiv记录中拿到DOI
    - 若有DOI，再去Crossref拉正式metadata和BibTeX
5. 如果arXiv没命中：
    - 直接走DOI/Crossref
    - 没DOI就用title/author查Crossref

我们仍然可以通过创建skill来包装这个流程，供模型使用。

## 文献调研

上面两个skill，解决了让Agent能读PDF和找到pdf对应的metadata这两个问题。下一步，我们的目标是：让Agent能去根据已有论文内容和工作方向，去自主调研论文，将论文保存到本地，并调用上面两个skill来处理这些论文，最后，阅读这些论文并在自己的论文中引用。

同样的，我们依旧可以用一个skill来将这些封装起来。

根据我的测试，调研40-50篇论文，一趟流程走下来大概需要30-60分钟。

## 论文写作规范review

找到了一个实验室开源的skill：https://github.com/Master-cai/Research-Paper-Writing-Skills

## 结语

这是我在写我的第一篇论文时产生的想法，在稍微调整后将其实现为了skill，目前自己用起来效果还不错。

其实想法还有很多：

1. 做一个轻量化的CLI工具彻底取代Zotero，这样就可以将前两个skill合成为一个
2. 自动化整篇论文的写作，而不仅仅是文献调研后的related work和后续的introduction，只要实验结果、工作细节说明清楚，效果应该也不错
3. 将论文和实验放在一块，让Agent自己跑实验，自己写论文

后面有时间了尝试一下。