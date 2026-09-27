---
title: Research Agent Workflow
published: 2026-02-21
draft: false
---

诸如 Claude Code、Codex 这样的 Coding Agent 其实可以拿来做很多 Coding 之外的工作，比如科研。以我个人常用的 Codex 为例，我会用它来辅助我写代码、读论文、调研、写论文等等其他工作。注意我这里用的是「辅助」一词，这些事还是需要以你个人为主体的，全权交给 Codex 会让你迅速失去对项目的掌握，就像 Vibe Coding 一样，它只适合做 Toy Project，不适合做严肃的工作。你可以用一句话来提醒自己：如果你不知道 AI 在干什么，那就不要让它做。

下面我会介绍一下我自己是如何增强 Codex 的科研能力的。

## PDF 转 Markdown Skill

Claude Code 貌似是支持直接读取 pdf 文件的，但 Codex 不支持，这就导致 Codex 会自行调用 python 来处理 pdf 文件，解析结果很差，所以我们首先要解决读取 pdf 文件的问题。

这里我使用了 MinerU 的 API 来将 pdf 转换为 markdown，并通过创建一个 skill 来将这个能力暴露出来。

## Zotero 的局限

Zotero 是一个很流行的文献管理软件，但是其是一个 GUI 应用，无法通过 CLI 调用，天然和 Agent 有摩擦。这一点 Obsidian 做的就很好，在已有 GUI 应用的基础上，推出了 CLI 版本来供 Agent 进行调用。

现在存在另一个问题，我们需要生成论文的 BibTeX 来供我们引用，但是我们缺少论文 pdf 对应的 metadata。好在，这个问题很容易解决。整体流程大致如下：

1. 从 PDF 前几页提取文本
1. 抓出：
   - DOI
   - title
   - first author
1. 用 title+author 查 arXiv
1. 如果 arXiv 高置信命中：
   - 采用 arXiv title/authors/abstract/arxiv_id
   - 再看是否能从 PDF 或 arXiv 记录中拿到 DOI
   - 若有 DOI，再去 Crossref 拉正式 metadata 和 BibTeX
1. 如果 arXiv 没命中：
   - 直接走 DOI/Crossref
   - 没 DOI 就用 title/author 查 Crossref

我们仍然可以通过创建 skill 来包装这个流程，供模型使用。

## 文献调研

上面两个 skill，解决了让 Agent 能读 PDF 和找到 pdf 对应的 metadata 这两个问题。下一步，我们的目标是：让 Agent 能去根据已有论文内容和工作方向，去自主调研论文，将论文保存到本地，并调用上面两个 skill 来处理这些论文，最后，阅读这些论文并在自己的论文中引用。

同样的，我们依旧可以用一个 skill 来将这些封装起来。

根据我的测试，调研 40-50 篇论文，一趟流程走下来大概需要 30-60 分钟。

## 论文写作规范 review

找到了一个实验室开源的 skill：<https://github.com/Master-cai/Research-Paper-Writing-Skills>

## 结语

这是我在写我的第一篇论文时产生的想法，在稍微调整后将其实现为了 skill，目前自己用起来效果还不错。

希望能让 Zotero 能通过 CLI 被调用，这样就不需要我们自己再去实现抓 metadata 的 skill 了，后面有时间了尝试一下。
