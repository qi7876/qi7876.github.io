---
title: 深度学习开发环境一条龙
published: 2025-03-12
tags:
  - Linux
  - Windows
  - Deep Learning
draft: false
description: WSL, Docker, UV, Clash Tun, VS Code
---

## WSL



## Docker



## UV



## VS Code



## 特殊网络环境

### 我有软路由

那太棒了，这方面应该不需要再多说了。

### 我只有一台电脑

没关系，你依然可以拥有较好的体验。

我推荐你使用Clash Verge Rev。但截止到2025/09/14，Clash Verge Rev的最新版本2.4.2问题奇多，非常不稳定，所以我回退到了2.3.1版本。如果你看到这篇Blog时，Clash Verge Rev已经推出更好的稳定版本，你可以选择更新。

至于另一个东西，你可以选择自建，也可以直接购买别人的服务，注意，不要太贪小便宜，便宜、高速、稳定三者不可兼得。

为了一步到位，建议你直接开启Tun模式，也就是虚拟网卡模式。本机的全部流量会经过这个虚拟网卡，这其中也包含WSL的流量，后续你不需要再在WSL中设置各种环境变量、国内镜像，少了很多麻烦。但代价是？由于Linux是不支持热插拔的，包括Clash Verge Rev创建的虚拟网卡，也就是说，当你在Windows上的Clash Verge Rev中切换了配置文件，导致Clash内核重新加载时，你的WSL会直接断网，你必须重启WSL才能恢复其网络。为了规避这个问题，你可以手动创建一个Local配置文件，然后在全局拓展配置中添加你的多个服务提供商，这样可以尽可能的减少切换配置文件导致Clash内核重启的情况。
