# Affective Computing · 情感计算交互空间

一个情感计算主题的交互演示网站：**粒子情绪核心 + MindVR 沉浸式情感评估演示 + 凌空手势交互小游戏 + 漂流瓶信箱**。

- 线上演示：<https://xianheng-portfolio.app.workbuddy.host/?sharecode=6UJYJEE2NZ>
- 技术栈：原生 HTML/CSS/JS（首页）、React + three.js（MindVR 演示，构建产物内嵌）、零依赖 Node.js 服务

## 功能一览

| 模块 | 说明 |
| --- | --- |
| 情绪核心 | 首页 WebGL 粒子「情绪核心」，随窗口滚动与鼠标互动聚散成形，开机动画以粒子拼出 "Affective Computing" |
| MindVR 演示 | 沉浸式 VR 场景内嵌（`mindvr/`），含访谈文本抑郁风险评估示例、可交互 3D 房间与一只会追毛线球的小猫；分析接口经服务端反向代理（`/api/v1/*`） |
| 凌空手势 | 摄像头手部追踪驱动的三种玩法：电子沙袋 / 切水果 / 排球，共用同一舞台与手势引擎 |
| 漂流瓶信箱 | 访客投瓶提问、随机捞瓶回信的匿名留言河道；数据落盘 `data/bottles.json`，原子写入 |

## 快速开始

```bash
npm start          # 等价于 node server.js，默认端口 3000
# 或指定端口
PORT=8080 node server.js
```

打开 `http://localhost:3000` 即可。**零依赖**（只用 Node 内置模块），无需 `npm install`。

### 环境变量

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `PORT` | 3000 | 监听端口 |
| `ADMIN_TOKEN` | 读 `data/admin-token.txt` | 漂流瓶管理口令（新回信队列 `/api/pending`、删除瓶子）。两者都没有时管理接口自动关闭 |
| `MINDVR_API` | `http://1.95.112.107:8080` | MindVR 分析后端反向代理上游，可指向自建后端 |
| `MINDVR_TIMEOUT` | 60000 | 反代超时（毫秒） |
| `XL_DATA_DIR` | `./data` | 数据目录（测试隔离用） |
| `XL_RATE_POST` / `XL_RATE_REPLY` | 6 / 20 | 每 IP 每小时投瓶 / 回信限流阈值 |

首次运行会在 `data/` 下自动创建空瓶子数据。站主查看新回信：

```bash
curl "http://localhost:3000/api/pending?token=<你的口令>"
```

## 目录结构

```
├── index.html          # 单文件首页（粒子核心、手势舞台、漂流瓶 UI、多语言）
├── assets/             # 首页静态资源（JS/CSS/i18n，7 种语言）
├── mindvr/             # MindVR 演示（Vite 构建产物 + GLB 模型）
│   ├── index.html
│   ├── assets/
│   └── models/         # Khronos glTF Sample Assets（CC BY 4.0）
├── mindvr-src/         # MindVR 演示的前端源码（基于上游 MIT 项目改造，改动说明见其 README）
├── server.js           # 零依赖 Node 服务：静态托管 + 漂流瓶 API + MindVR 反代
├── package.json
└── data/               # 运行期数据（gitignore，不入库）
```

## 隐私与安全设计

- 漂流瓶**不收集邮箱**，公开接口永不返回任何 email 字段
- 所有用户输入做长度截断与 HTML 转义后落盘
- `server.js` / `package.json` / `data/` 不允许静态下载；管理接口需口令
- 访客留言数据（`data/bottles.json`）与站长口令（`data/admin-token.txt`）均在 `.gitignore` 中，不会进仓库

## 致谢与许可

- 3D 模型来自 [KhronosGroup/glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)，采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可
- 追毛线球的小猫基于 **Tuxedo Cat Animated 2.0**（作者 [DreamNoms](https://sketchfab.com/DreamNoms)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)，详见 `mindvr/models/TuxedoCat.license.txt`）
- MindVR 演示基于 [XIUGOU-AMEN/MindVR](https://github.com/XIUGOU-AMEN/MindVR)（MIT）场景改造：本仓库含改造后的前端源码（`mindvr-src/`）与其构建产物（`mindvr/`）；分析后端请参照原仓库自行部署
- 本项目代码采用 [MIT License](./LICENSE)
