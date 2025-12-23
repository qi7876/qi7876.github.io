---
title: Python（深度学习）开发环境指北
published: 2025-09-20
tags:
  - Linux
  - Windows
  - Deep Learning
draft: false
description: WSL, Docker, UV, VS Code
---
这篇文章没有详细的介绍各个工具该如何使用，只是想让你知道，原来还有这些更现代更好用的工具。在了解后，你可以使用AI或者阅读其他人的教程来深入学习这些工具，熟练掌握这些工具将会很大的助力你的科研/工作。

## WSL

如果你有一台正儿八经的高性能Linux开发服务器能使用，那显而是完美的，但大多数本科生基本没有机会去接触。不过问题不大，如果你使用的是Windows，你可以直接使用WSL2来获取Linux开发环境；如果你使用的是macOS，那你基本可以享受到和Linux相同的开发环境。

网络上已经存在非常多的WSL安装教程，安装很简单，其中也没什么坑。

对于选择要安装的Linux Distro，我推荐Ubuntu和Fedora，后者是我个人常用的，因为我比较喜欢滚动更新。请不要选择Debian，Debian确实非常稳定，但它不适合开发环节，只适合生产环节。

## Docker

容器化是个好东西，他能帮你把屁股擦的干干净净，让你不需要再煎熬痛苦的配置各种环境、处理冲突，只需要全身心的投入开发。

## uv

`conda`很好，但也没那么好，笨重、缓慢以及和Pip不相通的软件源让人有些无语。还好，我们可以使用更现代更快速更通用的Python项目管理软件`uv`。

如果你使用过MCP Server，那你可能已经间接使用过`uv`了，有许多MCP Server都是通过`uv`来运行的，`uvx`就是`uv run`的alias.

## VS Code

顶级的远程开发能力，和WSL的最佳搭档，无须多言。

## 特殊网络环境

从Github上clone repo到本地、`docker pull`拉取镜像等等操作均需要特殊的网络环境。

### 使用镜像源

使用镜像源是最佳解决方案，将下载服务器切换至国内镜像能从根本上解决问题，稳定性与速度都比使用代理高很多。

### Fallback

可惜，没有镜像源的情况要占大多数，这时我们只能使用代理服务器。

Linux上使用代理没有在Windows使用代理那么简单，但也不难。Windows上有大量的套壳代理软件，例如Clash for Windows、Clash Verge Rev、FlClash等等，这些代理软件均使用了Clash/Mihomo内核，再搭配了一个便于管理内核的GUI。事实上，我们完全可以只运行Mihomo内核（Clash内核的继任者），并使用REST API + cURL或者公用的WebUI来管理，这么做比使用那些套壳软件更加高效稳定（点名Clash Verge Rev，一个不稳定的壳连累内核的典范）。Mihomo内核同样提供了Linux下的可执行文件，我们只需要在CLI下运行Mihomo内核就可以方便的使用代理。

至于另一个东西，你可以选择自建，也可以直接购买别人的服务，注意，不要太贪小便宜，便宜、高速、稳定三者不可兼得。