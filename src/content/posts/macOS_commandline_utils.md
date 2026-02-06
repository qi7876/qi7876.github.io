---
title: macOS 上 command-line tools 的坑
published: 2026-02-06
tags:
  - macOS
draft: false
description: 意想不到的问题
---

众所周知，在 macOS 上我们可以通过 `xcode-select --install` 来安装常用的命令行工具，但是这些默认的工具往往版本老旧，例如 `rsync`。

对于有些工具，可能没有影响，但对于 `rsync`，版本老旧直接导致其无法兼容其他主机上的 3.x 版本，你在参数完全正确的情况下还是无法完成操作。这时，你需要通过 Homebrew 安装最新版本，来替换掉自带的 2.x 版本的 `rsync`。

此外，macOS 上自带的 Bash 版本也十分老旧，还停留在 3.x 版本（为了规避更高版本 Bash 的 License），而最新版 Bash 实际上已经来到了 5.x。如果你追求最大化兼容性/稳定性而使用 Bash，同样的，你也需要通过 Homebrew 安装最新版本，并通过 chsh 来切换。

如果你也在 macOS 上碰到了奇怪的命令问题，不妨使用 `xxx --version`，看看是不是 macOS command-line tools 搞得鬼。
