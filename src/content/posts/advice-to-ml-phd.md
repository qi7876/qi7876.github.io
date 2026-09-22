---
title: Some advice to anyone starting a PhD in ML
published: 2026-04-05
draft: false
---
Some advice to anyone starting a PhD in ML, or things that I heard from more experienced researchers and I tried to follow:

1. focus on a real problem. Something tangible, that can benefit people. Talk to industry folks if you're looking for open problems. Talk to the end users to figure out what the actual issues are
2. start by doing a survey of the task. Basically a long detailed paper that summarizes the field. Use Anki to memorize techniques/papers/authors in your field
3. do a benchmark paper. Take the top open-source methods and empirically see how they perform. Keep it fair. Find out if existing metrics and datasets are relevant in the real world.
4. keep focusing on real problems and real value, instead of appeasing R2. After a survey and benchmark you should know what the main real issues are. And it probably isn't improving the results by 0.5%. Personally I did follow 1, 3, 4 (I skipped 2 because my supervisor had just published a survey), and it helped me a lot. Fun fact, I created CosPlace in 2020 as an industry project, I thought it was unpublishable so I didn't actually write a paper until over a year later, and then it got accepted at CVPR 2022 and became my most cited paper. In short, everyone back then was training on Pitts30k (a 30k images dataset) which was unrealistic IRW (images in localization domain are abundant). For an industry project, I had to come up with a technique to train on millions of images (CosPlace) which gave great results, while existing methods could not be trained on large datasets. I thought CosPlace was unpublishable because it uses more training data than competitors. I was more concerned about appeasing R2 than publishing something valuable to the community. Luckily a year later I realized that focusing on the real problem (i.e. creating a scalable training technique) was more important than appeasing R2, and wrote that paper.