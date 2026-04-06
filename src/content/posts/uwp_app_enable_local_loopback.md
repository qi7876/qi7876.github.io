---
title: UWP应用开启本地回环
published: 2023-11-03
tags:
  - windows
draft: false
---
Windows默认情况下不允许uwp应用访问本地回环，这就导致uwp应用用不了代理，还好我们可以手动开启uwp应用的本地回环访问权限。

以admin权限运行：

```powershell
Get-AppxPackage -AllUsers | ForEach-Object {
    $name = $_.PackageFamilyName
    CheckNetIsolation.exe LoopbackExempt -a -n=$name
}
```

即可一次性为所有uwp应用开启本地回环访问权限。

或者，更方便一点，使用一个GUI小工具：

https://github.com/tiagonmas/Windows-Loopback-Exemption-Manager