---
title: Coding Agent Guide
published: 2026-01-13
draft: false
---
**2026-09-23 Update**：按照codex cli 0.156.0版本更新了一些内容

现在是一个Coding Agent井喷式爆发的时期，网络上出现了开源的、闭源的各种各样的Coding Agent，再加之各路KOL的营销炒作，令人眼花缭乱。那么我们该如何挑选一个省心又好用的Coding Agent呢？

## TL;DR

用Claude Code和Codex。

而对于这两个Coding Agent，具体用哪个取决你的个人需求：

- Claude Code：闭源，API成本高，效果可能更好一些，前后端兼通
- Codex：开源，API成本极低，在后端上效果基本和Claude Code持平甚至超越，前端能力稍薄弱

对我个人而言，Codex是绝对的最佳选择。

**2026-09-23 Update**：现在可以加一个dsh，deepseek v4.1 flash的性能速度以及价格很均衡，处理一些简单机械任务很不错

## 其他Coding Agent

除了Claude Code和Codex，市面上还有其他许多Coding Agent，例如Kimi CLI、Gemini CLI等等。

这些Coding Agent在价格和免费额度上可能有一些优势，能力上也许能做到Claude Code和Codex的六七成，但这是建立在使用官方API的基础上的。而当我们使用中转站API，Codex逆向能做到极低的价格，性价比极高，再加上Codex本身的成熟设计，那我们已经完全没有理由使用其他任何Coding Agent了。

至于Github Copilot，除了学生包免费之外已经基本没有什么使用的理由了，能力和Claude Code、Codex差太多，不建议使用。

**2026-09-23 Update**：最近发生了ZCode、Grok等Agent自动上传整个Code repo的恶性偷数据事件，提醒尽量使用Codex、dsh、Pi这种开源Agent，或者Claude Code这种使用人数极大的闭源Agent。

## 安装与配置

下面我以我个人常用的Codex为例，讲讲从配置到实战的全流程。

### 安装前置

要使用Codex，我们需要先安装node

Windows：

```powershell
winget install -e --id OpenJS.NodeJS
```

macOS：

```bash
brew install node
```

linux：

根据具体的包管理器，安装node

**2026-09-23 Update**：实际上并不需要安装node，只是使用npm下载一下binary而已，你甚至可以直接用官方的shell脚本安装。

### 安装Codex

安装完node后，我们就可以安装Codex了：

```bash
npm install -g @openai/codex
```

此教程原先使用了bun来安装codex，但根据其他用户报告，以及我个人的使用体验，使用bun安装的codex可能出现内存泄露，而npm安装的codex不存在这个问题。只能说bun还得练啊，碰到edge case就跪了，目前还是用更稳定的node/npm吧。

### 配置Codex

安装完Codex后，我们还需要对其进行一些配置才能正常使用。

#### API Key

首先，我们需要一个能接入到Codex的API Key。这里对模型没有限制，可以使用gpt系列，也能使用其他开源模型。但考虑到Codex逆向出来的gpt价格如此之低，我仍然强烈推荐你直接使用gpt。

对于中转站，我推荐ikuncode，低价且稳定，aff链接：https://api.ikuncode.cc/register?aff=wAM2

如果你也想使用这个中转站，可以考虑点击我的aff链接给我一些邀请奖励。

**2026-09-23 Update**：实际上并没有邀请奖励hh

#### Codex config

获取完API Key后，我们还需要为Codex配置一下，我们需要创建并修改两个文件：

`~/.codex/config.toml`:

```toml
model_provider = "ikuncode"
model = "gpt-5.4"
model_reasoning_effort = "xhigh"
network_access = "enabled"
disable_response_storage = true
web_search = "live"
personality = "pragmatic"

[model_providers.ikuncode]
name = "ikuncode"
base_url = "https://api.ikuncode.cc/v1"
wire_api = "responses"
requires_openai_auth = true

[sandbox_workspace_write]
network_access = true
```

`~/.codex/auth.json`:

```json
{
  "OPENAI_API_KEY": "your api key"
}
```

注意你需要在`~/.codex/auth.json`文件中放入你自己的API Key。

**2026-09-23 Update**：下面的config只适用于codex cli 0.156.0及以上版本。

我主要做出了以下几个改动：

1. 模型更新到最新
1. 调整reasoning effort至medium，平衡性能与价格
1. 关闭sandbox，改用YOLO模式。现在的模型已经基本不会做危险行为了，sandbox应该用在agent训练中，而不是在实际使用中浪费人的时间，可以回忆一下你是不是无脑approve。
1. 增加了timeout设置，减少重连现象
1. 一些外观上的调整，个人喜好，你可以随意自定义

```toml
model = "gpt-6-sol"
model_reasoning_effort = "medium"
web_search = "live"
plan_mode_reasoning_effort = "medium"
sandbox_mode = "danger-full-access"
approval_policy = "never"
service_tier = "default"

model_provider = "api"

[model_providers.api]
name = "api"
base_url = "https://api.ikuncode.cc/v1"
wire_api = "responses"
requires_openai_auth = true
stream_idle_timeout_ms = 1200000

[tui]
theme = "ansi"
status_line = ["model-with-reasoning", "five-hour-limit", "weekly-limit", "git-branch"]
status_line_use_colors = false
session_picker_view = "dense"
screen_reader_detection_done = true

[tui.effects]
starfield = false
shimmer = false
welcome = false
effort = false
progress = true
title = false
```

## 实战

安装和配置完成后，我们就可以在项目中使用Codex了，随意以一个项目为例，我们运行命令进入Codex。

![](attachments/Pasted%20image%2020260310114517.png)

在首次进入一个项目时，Codex会让我们确定一些基础的权限，对于有version control的项目，可以直接给予Codex编辑和运行部分命令的权限，运行其他命令仍然需要你手动同意。当然，为了最高的权限控制，你也可以让Codex的每次修改文件和运行命令都要经过你的同意。

**2026-09-23 Update**：别浪费时间

![](attachments/Pasted%20image%2020260310113843.png)

我们选择1

![](attachments/Pasted%20image%2020260310114534.png)

现在的界面就很熟悉了，一个简单的对话框，但这次对话框后是一个全副武装的Coding Agent。

你可以随意开始对话，让Codex帮你理解项目结构、开发新功能、写测试案例、补全项目文档。

此外，还有一些特殊的命令。

#### commands

在对话框中输入`/`，Codex会自动展示命令列表，通过上下方向键可以快速选择命令。

![](attachments/Pasted%20image%2020260310115422.png)

命令后有对应的作用描述，比较常用的命令有：

- /resume
- /new
- /fork
- /init
- /rename
- /plan
- /review
- /ps
- /exit

#### skills

在对话框中输入`$`，Codex会自动展示skills列表，通过上下方向键可以快速选择Skill。

![](attachments/Pasted%20image%2020260310115504.png)

也可以使用Codex自带的Skill Creator创建自己的Skill。

#### 指定文件

在对话框中输入`@`，可以快速选择文件路径，Codex会在对话中自行调用工具读取。

![](attachments/Pasted%20image%2020260310125319.png)

注意，如果你已经输入了一些文字，然后想使用`@`指定文件路径，你需要在文本和`@`之间先打上一个空格。

## 关于Prompt

在Codex的助力下，管理上下文、调用工具、指定读取文件等操作都变得极为简单，但你的Prompt也变得更为重要。Codex的特点是指令遵循能力强，你说什么，他就做什么。你说对了，他就基本能做对，但你要是说错了，他可能也会被你带歪。

Codex能帮你从机械重复的Coding中解放出来，让你有更多时间和精力来思考关于架构设计、系统结构的问题，但这显然也要求使用者本身具有极高的工程思维，并能准确的在Prompt中表述自己的思想。

而工程思维的培养，以及如何将自己的思想准确转化具体的、有逻辑的文字，这两件事实际上是很难的，前者需要大量的工程实践，后者需要培养逻辑与不断的输出练习。而在AI时代，我们逐渐习惯：不懂的就问AI，获取到相关知识点，当场使用然后遗忘。这其中基本完全没有我们个人的工程实践和输出，更多的是我们在充当AI与具体问题环境间的桥梁，信息在桥梁上来来往往，但桥梁最终什么也没留下。我在之前的**什么是知识**那篇文章介绍过知识与知识点的区别，同时转载的**记录的力量**中也提到过记录，也就是不断输出的重要性。

庆幸，我本人在大学刚开始时，AI的能力还没那么强，同时我自己对于计算机也有强烈的兴趣，这也就促使我自己不断接触各种计算机场景与问题，并与AI协作解决：实践->遇到问题->思考并开始解决->遇到不懂的地方->从AI获取知识点->思考并解决问题->写笔记记录->继续实践。这让我有了比较好的工程能力底子，在随后AI的不断发展中，也进一步强化了自己的能力。

而相反的是，我在学院开设的工程实践创新课程上，发现大部分同学对于计算机的理解只能说是惨不忍睹，AI能力在不断强化，导致他们遇到问题时下意识就不思考并去询问AI来解决问题，并且毫无输出，导致自己的能力一直得不到提升，在日后每次遇到相似问题时都会浪费大量的时间来解决，并且由于AI回答带来的信息茧房，他们很难接触到最新的、更易用的工具链。像micromamba、uv、docker这些现代化开发工具，能极大的加速代码开发流程，但我至今没看到身边有多少人在使用，更多还是业界和开源项目中先用起来，要经过很长时间才能扩散到整个社群。

AI时代，愿我们都能保持好奇、独立思考，并不断输出。

**2026-09-23 Update**：不要滥用AI！不要滥用AI！不要滥用AI！这会毁了你的工程素养和系统思维。你应该在学习时独立自主的探索，遇到不懂的可以询问AI，但绝不要让AI帮你做hw、lab、proj！

然后在实习与工作中和Agent结对推进，继续提升自己的能力。当你认为自己已经对计算机系统、GPU编程模型等等你所工作的领域了如指掌后，你才应该化身leader指挥agent。