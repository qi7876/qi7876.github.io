---
title: "[AI Infra] 1-linux"
published: 2026-03-01
tags:
  - linux
draft: false
---
## Linux / 网络 / 进程 / 内存管理

### Linux Kernel

Linux的核心是Linux Kernel，内核解决三件事：

1. 抽象硬件：把不同的CPU/GPU/内存/网卡/磁盘变成统一可用的接口
2. 管理资源：管理谁用多少CPU/内存/IO，怎么隔离，怎么共享
3. 提供接口：让用户态程序以受控的方式调用内核能力