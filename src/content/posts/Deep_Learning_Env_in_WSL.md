---
title: 深度学习开发环境一条龙
published: 2025-09-20
tags:
  - Linux
  - Windows
  - Deep Learning
draft: false
description: WSL, Docker, UV, Clash Tun, VS Code
---

## WSL

如果你有一台正儿八经的高性能Linux开发服务器能使用，那显而是完美的，但大多数本科生基本没有机会去接触。不过问题不大，如果你使用的是Windows，你可以直接使用WSL2来获取Linux开发环境；如果你使用的是macOS，那你基本可以享受到和Linux相同的开发环境。

网络上已经存在非常多的WSL安装教程，安装很简单，其中也没什么坑。

对于选择要安装的Linux Distro，我推荐Ubuntu和Fedora，后者是我个人常用的，因为我比较喜欢滚动更新。请不要选择Debian，Debian确实非常稳定，但它不适合开发环节，只适合生产环节。

## Docker

容器化是个好东西，他能帮你把屁股擦的干干净净，让你不需要再煎熬痛苦的配置各种环境、处理冲突，只需要全身心的投入开发。

## UV

`conda`很好，但也没那么好，笨重、缓慢以及和Pip不相通的软件源让人有些无语。还好，我们可以使用更现代更快速更通用的Python项目管理软件`uv`。

如果你使用过MCP Server，那你可能已经间接使用过`uv`了，有许多MCP Server都是通过`uv`来运行的，`uvx`就是`uv run`的alias

## VS Code



## 特殊网络环境

从Github上clone repo到本地、`docker pull`拉取镜像等等操作均需要特殊的网络环境。

### 为什么我没有使用镜像源

1. 配置麻烦
2. 可能失效

从全局进行代理是更加简单且优雅的方案。

### 我有软路由

那太棒了，这方面应该不需要再多说了。

### 我只有一台电脑

没关系，你依然可以拥有较好的体验。

我推荐你使用Clash Verge Rev。但截止到2025/09/14，Clash Verge Rev的最新版本2.4.2问题奇多，非常不稳定，所以我回退到了2.3.1版本。如果你看到这篇Blog时，Clash Verge Rev已经推出更好的稳定版本，你可以选择更新。

至于另一个东西，你可以选择自建，也可以直接购买别人的服务，注意，不要太贪小便宜，便宜、高速、稳定三者不可兼得。

为了更干净、更便于调试的网络环境，我强烈建议你不要使用Tun模式，只使用系统代理已经足够。使用WSL的镜像网络模式时（networkingMode=mirrored），WSL会自动将Windows上的Proxy设置同步到WSL中，不过你还需要手动设置一下Docker的代理，可以参考这篇文章。
