---
title: 解决macOS上RDP高延迟问题
published: 2025-09-09
tags:
  - macOS
  - Windows
draft: false
description: 究竟是谁的锅？？？
---

## 高延迟背后的两个问题

macOS上，Windows App的时延很高，远不如Windows上RDP的效果，这背后有两个问题：

1. macOS上的Windows App不支持UDP，这是最根本的问题；
2. macOS上有TCP Delayed ACK，由于macOS上Windows App只能使用TCP进行连接，这时的TCP延迟确认就很致命了。

## 解决方法

原因知道了，现在我们来解决问题，但显然，第一个问题我们解决不掉，只能等着微软改进，所以，我们只能对第二个问题下手：

1. 关闭macOS的TCP Delayed ACK

    ```sh
    sudo -s
    sysctl net.inet.tcp.delayed_ack=0
    ```

1. 如果你想在mac重启后仍然保持生效，将其写入配置文件

    ```sh
    echo net.inet.tcp.delayed_ack=0 >> /etc/sysctl.conf
    ```

## References

[Why are remote desktop clients (RDP) very slow on my Mac?](https://superuser.com/questions/319693/why-are-remote-desktop-clients-rdp-very-slow-on-my-mac/368719#368719)
