---
title: Docker Proxy设置终极指北
published: 2025-09-20
tags:
  - Linux
  - Docker
draft: false
description: Docker, Proxy

---
**WIP**

## 目标

实现三个情景下的代理设置：

1. `docker pull`
2. `docker builds build`
3. `docker run`

## 步骤

在网上你能搜索出大量相关教程，但其大部分都缺东少西，方法背后的原理也没有解释清楚。能正常使用就不说了，有些教程中的方法甚至都无法正常使用，误导了很多人。本指北将全面而深入的解决这个问题，并附带背后的原理。

### `docker pull`

