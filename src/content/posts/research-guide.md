---
title: 科研指南
published: 2026-11-11
---

整合了一下此前所有关于科研的 post

## 论文阅读

使用 3 遍阅读法：

1. Overview：了解论文是什么，主题、领域、主要贡献、大致结构
2. Grasp the Key Ideas：理解怎么做，方法、实验设计、核心论据，不深究公式或证明
3. Reproduce & Critique：深入理解为什么，推导逻辑、隐含假设、潜在问题、尝试复现

带着批判性思维去读，思考一些问题，比如：

1. 因果关系是否正确？证据是否充分？
2. 假设是否正确？是否隐藏了假设？
3. 对比是否公平？

## 引用管理

有一些需要注意的地方：

1. Zotero 中生成的 bibtex 条目有时并不是正确的，应该优先使用每个会议官方 paper 列表中生成的 bibtex 条目
2. arxiv 可以直接在相关页面生成 bibtex 条目
3. 如果论文已经正式发表，应该使用会议生成的 bibtex 条目而不是 arxiv 上的
4. bib 文件建议长期手动维护，并且最好在下载 paper 时就把顺便把 bibtex 条目加进去，不然后面一个一个找太麻烦了

我个人放弃了 Zotero，太重，不如直接用文件夹管理。

## 赶 DDL

2026-05-07 是 NeurIPS 2026 的 Deadline。最终，在一位同学的帮助下，我在 DDL 前一小时左右完成了投稿。讲真，我感觉文章内容还有许多能打磨的地方，包括图表，但是时间确实不太够了。

我发现我对论文草稿上的批注有一些恐惧。但显然，写论文并不是一个线性的、一下就能成功的事，作为一个开放性的问题，我们也能难说什么样的文章是最好的。不过我们可以尽力写出更好的论文，运用 OODA 循环，在快速的反馈迭代中，打磨自己的论文。

[和导师一起赶文章死线（Deadline）的十大注意事项](https://mp.weixin.qq.com/s?__biz=MzI2NTY2NTU3NQ==&mid=2247483755&idx=1&sn=21c69c10dd131ac4a4c42cd5254b5e2d)

[和导师一起赶文章“死线”（Deadline）的十大注意事项（之二）](https://mp.weixin.qq.com/s?__biz=MzI2NTY2NTU3NQ==&mid=2247483760&idx=1&sn=26dfc9ebbe321c93c683074975d7c3ec)

[I hated writing—until I learned there’s a science to it](https://www.science.org/content/article/i-hated-writing-until-i-learned-there-s-science-it)

## Some advice to anyone starting a PhD in ML

[Source](https://x.com/gabriberton/status/1950894495479845295)

Some advice to anyone starting a PhD in ML, or things that I heard from more experienced researchers and I tried to follow:

1. focus on a real problem. Something tangible, that can benefit people. Talk to industry folks if you're looking for open problems. Talk to the end users to figure out what the actual issues are
2. start by doing a survey of the task. Basically a long detailed paper that summarizes the field. Use Anki to memorize techniques/papers/authors in your field
3. do a benchmark paper. Take the top open-source methods and empirically see how they perform. Keep it fair. Find out if existing metrics and datasets are relevant in the real world.
4. keep focusing on real problems and real value, instead of appeasing R2. After a survey and benchmark you should know what the main real issues are. And it probably isn't improving the results by 0.5%. Personally I did follow 1, 3, 4 (I skipped 2 because my supervisor had just published a survey), and it helped me a lot. Fun fact, I created CosPlace in 2020 as an industry project, I thought it was unpublishable so I didn't actually write a paper until over a year later, and then it got accepted at CVPR 2022 and became my most cited paper. In short, everyone back then was training on Pitts30k (a 30k images dataset) which was unrealistic IRW (images in localization domain are abundant). For an industry project, I had to come up with a technique to train on millions of images (CosPlace) which gave great results, while existing methods could not be trained on large datasets. I thought CosPlace was unpublishable because it uses more training data than competitors. I was more concerned about appeasing R2 than publishing something valuable to the community. Luckily a year later I realized that focusing on the real problem (i.e. creating a scalable training technique) was more important than appeasing R2, and wrote that paper.
