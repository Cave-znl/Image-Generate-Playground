# Image Generate Playground

一个基于 Next.js 的自托管图像生成与编辑工作台，用于对接 GPT Image、Grok 图像模型以及 OpenAI 兼容的图像生成接口。

本项目基于 [alasano/gpt-image-playground](https://github.com/alasano/gpt-image-playground) 进行二次开发。感谢原作者提供的基础界面、图像生成/编辑流程、历史记录与存储能力。本仓库会在此基础上继续加入更多模型适配、中文化体验、提示词库、登录与访问控制等能力。

## 项目定位

Image Generate Playground 更偏向个人或团队自部署场景：

- 统一管理图像生成、图像编辑、参数调试和历史记录
- 支持 OpenAI 兼容接口，可配置自定义 API Base URL
- 支持 GPT 与 Grok 图像模型，并可为不同模型配置不同 API Key
- 支持中英文界面与 dark/light 主题切换
- 支持本地服务器部署，也可按需适配 serverless 平台
- 后续会逐步增强中文工作流、提示词库、登录系统和权限控制

## 当前支持模型

生成模式：

- `gpt-image-2`
- `grok-imagine-image`

编辑模式：

- `gpt-image-2`
- `grok-imagine-image-edit`

说明：Grok 模型通过 OpenAI 兼容格式请求当前配置的中转接口。`gpt-image-2` 使用 `OPENAI_API_KEY`，Grok 模型使用 `GROK_API_KEY`。调用 Grok 图像模型时会强制传入 `response_format: "b64_json"`，以便后端统一按 base64 图片数据保存和返回。

## 当前能力

- 文生图：通过文本提示词生成图片
- 图像编辑：上传图片并通过提示词进行编辑
- 蒙版编辑：支持通过蒙版限定编辑区域
- 提示词模板库：生成和编辑模式均可从提示词输入区打开模板库，支持分类浏览、搜索、替换当前提示词或追加到现有提示词；中文界面会显示本地化模板标题、描述、标签和提示词正文
- AI 提示词优化：可一键调用聊天补全模型优化当前提示词，优化过程中按钮会显示等待状态并禁止重复点击
- 图片反推提示词：可上传 JPEG、PNG 或 WebP 图片，通过支持视觉输入的 GPT5.5 兼容接口生成可复用的生图提示词，并直接填入当前提示词输入框
- 参数控制：尺寸、质量、格式、压缩、背景、审核、生成数量等
- 自定义尺寸：支持 `gpt-image-2` 的 2K/4K 与自定义分辨率
- 下载原图：可直接下载当前选中的最终原图
- 中英文切换：支持中文和英文界面
- 主题切换：支持 dark/light 模式
- 历史记录：保存生成参数、图片结果与费用估算
- 存储模式：
    - `fs`：图片保存到服务器 `generated-images` 目录
    - `indexeddb`：图片保存到浏览器 IndexedDB，适合 serverless 部署
- 访问密码：可通过 `APP_PASSWORD` 开启简单密码校验
- 自定义接口：可通过 `OPENAI_API_BASE_URL` 接入兼容 OpenAI Images API 的服务

## 开发计划

后续计划包括：

- 新增更多图像模型和兼容接口适配
- 增强提示词模板管理、收藏与团队复用能力
- 增加登录选项与更完整的访问控制
- 优化移动端与中文使用体验
- 增强历史记录、收藏、复用和批量管理能力

## 环境要求

- Node.js `>= 20.9.0`
- npm

推荐使用 Node.js 22：

```bash
node -v
npm -v
```

## 本地运行

安装依赖：

```bash
npm install
```

创建 `.env.local`：

```dotenv
OPENAI_API_KEY=your_gpt_api_key_here
GROK_API_KEY=your_grok_api_key_here
OPENAI_API_BASE_URL=https://your-compatible-api.example.com/v1
OPENAI_IMAGE_API_TIMEOUT_MS=900000
NEXT_PUBLIC_IMAGE_STORAGE_MODE=fs
PROMPT_OPTIMIZER_API_KEY=your_prompt_optimizer_api_key_here

# 可选：开启访问密码
APP_PASSWORD=your_password_here
```

启动开发服务：

```bash
npm run dev
```

访问：

```text
http://localhost:3000
```

## 生产部署

构建：

```bash
npm run build
```

启动：

```bash
npm run start
```

后台运行可使用 PM2：

```bash
npm install -g pm2
pm2 start npm --name image-generate-playground -- run start
pm2 save
```

如果使用 Nginx 反向代理，通常将域名代理到本地 Next.js 服务：

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_connect_timeout 900s;
    proxy_read_timeout 900s;
    proxy_send_timeout 900s;
    send_timeout 900s;
    proxy_buffering off;
}
```

## 环境变量

| 变量                             | 必填 | 说明                                                                                                                     |
| -------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------ |
| `OPENAI_API_KEY`                 | 是   | GPT 图像模型接口密钥                                                                                                     |
| `GROK_API_KEY`                   | 否   | Grok 图像模型接口密钥，使用 `grok-imagine-image` 或 `grok-imagine-image-edit` 时需要；Grok 请求会强制要求返回 `b64_json` |
| `OPENAI_API_BASE_URL`            | 否   | OpenAI 兼容接口地址，不填则使用默认 OpenAI 接口                                                                          |
| `OPENAI_IMAGE_API_TIMEOUT_MS`    | 否   | 图像生成与编辑接口等待上游返回的超时时间，单位毫秒，默认 `900000`；反向代理超时时间应不小于该值                         |
| `NEXT_PUBLIC_IMAGE_STORAGE_MODE` | 否   | 图片存储模式，支持 `fs` 或 `indexeddb`                                                                                   |
| `PROMPT_OPTIMIZER_API_KEY`       | 否   | AI 提示词优化与图片反推提示词接口密钥；未配置时无法使用相关按钮                                                          |
| `PROMPT_OPTIMIZER_API_URL`       | 否   | AI 提示词优化与图片反推提示词接口地址，默认 `https://api.hyhawang.com/v1/chat/completions`                               |
| `PROMPT_OPTIMIZER_MODEL`         | 否   | AI 提示词优化与图片反推提示词模型，默认 `gpt-5.5`；图片反推要求该接口支持 OpenAI 兼容的视觉输入                           |
| `APP_PASSWORD`                   | 否   | 设置后前端请求需要输入访问密码；生图、删图、AI 提示词优化和图片反推提示词都会进行校验                                    |

注意：不要把 `OPENAI_API_KEY`、`GROK_API_KEY`、`APP_PASSWORD` 写入任何 `NEXT_PUBLIC_` 开头的变量。

## 安全提示

- `.env.local` 只应保存在部署环境，不要提交到 Git 仓库
- 不要把 API Key 暴露在前端代码或公开日志中
- 如果部署到公网，建议启用 `APP_PASSWORD` 或增加更完整的登录系统
- Nginx 可增加点文件拦截，避免误暴露 `.env.local` 等敏感文件：

```nginx
location ~ /\.(?!well-known) {
    deny all;
    access_log off;
    log_not_found off;
}
```

## 上游项目

本项目基于以下开源项目二次开发：

- 原仓库：[alasano/gpt-image-playground](https://github.com/alasano/gpt-image-playground)
- License：MIT

本仓库会根据自身部署和使用需求继续演进，相关二次开发内容会在后续版本中逐步完善。

## License

MIT
