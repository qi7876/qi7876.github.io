---
title: Mac使用iPhone USB以太网时配置代理
published: 2026-06-29
tags:
  - macos
draft: false
---
之前使用iPhone USB来连接热点时，Mac总会无法使用代理。今天稍微debug了一下，找出了背后的原因。

Mac上不同网络服务的代理设置是分开的，不像Windows一样是统一设置的。而我们常只设置Wi-Fi的代理，因此使用iPhone USB时，其代理配置并没有被设置过，因此也就无法使用代理。

如果只是这样的话，其实也无所谓，我们再单独设置一下iPhone USB的代理就行了嘛。但是，逆天的苹果并没有把iPhone USB的代理配置放进设置的GUI中，明明这是一个如此常用的功能。

我们只能通过命令行来配置。首先列出网络服务，看看是否有iPhone USB：

```bash
networksetup -listallnetworkservices
```

然后配置http、https、socks5三个代理并打开：

```bash
networksetup -setwebproxy "iPhone USB" 127.0.0.1 7890 off
networksetup -setsecurewebproxy "iPhone USB" 127.0.0.1 7890 off
networksetup -setsocksfirewallproxy "iPhone USB" 127.0.0.1 7890 off

networksetup -setwebproxystate "iPhone USB" on
networksetup -setsecurewebproxystate "iPhone USB" on
networksetup -setsocksfirewallproxystate "iPhone USB" on
```

最后可以验证一下配置：

```bash
networksetup -getwebproxy "iPhone USB"
networksetup -getsecurewebproxy "iPhone USB"
networksetup -getsocksfirewallproxy "iPhone USB"
```