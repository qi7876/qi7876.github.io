---
title: Docker Proxy Guide
published: 2024-03-20
draft: false
---
docker需要实现三个情景下的代理设置：

1. `docker pull`
2. `docker build`
3. `docker run`

本文将解决Linux下这三个情景的代理问题，不过在这之前还有一些准备工作：

1. 你已经部署了代理；
2. 你不应该使用Tun模式，除非你真的知道它究竟做了什么并且你必须使用Tun，否则可能会给你给你的网络环境带来不必要的混乱；
3. 如果你使用了WSL，请将WSL的网络模式切换到NAT并且在WSL中单独部署代理，不要复用Windows下的代理，避免可能出现的混乱；
4. 不要使用docker desktop，那是个垃圾。

## `docker pull`

参考：[https://docs.docker.com/engine/daemon/proxy/](https://docs.docker.com/engine/daemon/proxy/)

`docker pull`很特殊，当你拉取镜像时，实际上发起网络请求的是Docker Daemon（`dockerd`），因此需要配置daemon代理。这又有两种方式，选择其中一种即可：

### `daemon.json`

我们配置`/etc/docker/daemon.json`文件：

```json
{
  "proxies": {
    "httpProxy": "http://127.0.0.1:7890",
    "httpsProxy": "http://127.0.0.1:7890",
    "noProxy": "localhost,127.0.0.1"
  }
}
```

### `systemd`

我们配置`systemd`的环境变量，文件`/etc/systemd/system/docker.service.d/proxy.conf`：

```toml
[Service]
Environment="HTTPS_PROXY=http://127.0.0.1:7890"
Environment="HTTP_PROXY=http://127.0.0.1:7890"
Environment="NO_PROXY=localhost,127.0.0.1"
```

## `docker build`和`docker run`

参考：[https://docs.docker.com/engine/cli/proxy/](https://docs.docker.com/engine/cli/proxy/)

这二者都会使用`~/.docker/config.json`下的配置，所以配置一份文件就好：

```json
{
  "proxies": {
    "default": {
      "httpProxy": "http://127.0.0.1:7890",
      "httpsProxy": "http://127.0.0.1:7890",
      "noProxy": "localhost,127.0.0.1"
    }
  }
}
```

注意修改端口。