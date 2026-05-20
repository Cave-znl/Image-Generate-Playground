# Image Generate Playground

一个基于 Next.js 的自托管图像生成与编辑工作台，用于对接 GPT Image 系列模型以及 OpenAI 兼容的图像生成接口。

本项目基于 [alasano/gpt-image-playground](https://github.com/alasano/gpt-image-playground) 进行二次开发。感谢原作者提供的基础界面、图像生成/编辑流程、历史记录与存储能力。本仓库会在此基础上继续加入更多模型适配、中文化体验、提示词库、登录与访问控制等能力。

## 项目定位

Image Generate Playground 更偏向个人或团队自部署场景：

- 统一管理图像生成、图像编辑、参数调试和历史记录
- 支持 OpenAI 兼容接口，可配置自定义 API Base URL
- 默认使用 `gpt-image-2`
- 支持本地服务器部署，也可按需适配 serverless 平台
- 后续会逐步增强中文工作流、模型切换和权限控制

## 当前能力

- 文生图：通过文本提示词生成图片
- 图像编辑：上传图片并通过提示词进行编辑
- 蒙版编辑：支持通过蒙版限定编辑区域
- 参数控制：尺寸、质量、格式、压缩、背景、审核、生成数量等
- 自定义尺寸：支持 `gpt-image-2` 的 2K/4K 与自定义分辨率
- 历史记录：保存生成参数、图片结果与费用估算
- 存储模式：
  - `fs`：图片保存到服务器 `generated-images` 目录
  - `indexeddb`：图片保存到浏览器 IndexedDB，适合 serverless 部署
- 访问密码：可通过 `APP_PASSWORD` 开启简单密码校验
- 自定义接口：可通过 `OPENAI_API_BASE_URL` 接入兼容 OpenAI Images API 的服务

## 开发计划

后续计划包括：

- 新增更多图像模型和兼容接口适配
- 增加中文界面选项
- 增加提示词库与提示词模板管理
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
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE_URL=https://your-compatible-api.example.com/v1
NEXT_PUBLIC_IMAGE_STORAGE_MODE=fs

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
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    proxy_buffering off;
}
```

## 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 是 | 图像接口密钥 |
| `OPENAI_API_BASE_URL` | 否 | OpenAI 兼容接口地址，不填则使用默认 OpenAI 接口 |
| `NEXT_PUBLIC_IMAGE_STORAGE_MODE` | 否 | 图片存储模式，支持 `fs` 或 `indexeddb` |
| `APP_PASSWORD` | 否 | 设置后前端请求需要输入访问密码 |

注意：不要把 `OPENAI_API_KEY`、`APP_PASSWORD` 写入任何 `NEXT_PUBLIC_` 开头的变量。

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
