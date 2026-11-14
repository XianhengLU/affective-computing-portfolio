# mindvr-src —— MindVR 沉浸式演示的前端源码

本目录是站点内嵌 MindVR 演示（`../mindvr/`）的**前端源码**，基于上游
[XIUGOU-AMEN/MindVR](https://github.com/XIUGOU-AMEN/MindVR)（MIT License，见 `./LICENSE`）改造。
`../mindvr/` 内是本目录 `npm run build` 的产物，二者改动保持同步。

## 相对上游的主要改动（均为本站原创部分）

- **`src/components/Scene.tsx`** —— 3D 房间整体重写：反光地板、墙体/天花/踢脚线、窗景，
  家具全部替换为官方 PBR GLB 资产（Khronos glTF-Sample-Assets，CC BY 4.0）+ `GLBModel` 归一化加载组件，
  光照/雾/`@react-three/postprocessing`（Bloom + Vignette，XR 会话下自动关闭）。
- **`src/components/CatPlay.tsx`** —— 新增组件：追毛线球的燕尾服小猫（Tuxedo Cat Animated 2.0，DreamNoms，CC BY 4.0），
  AnimationMixer 驱动 6 段骨骼动画（待机/走路/甩尾/坐下/坐姿/起身），扑击用程序化抛物线补足，
  毛线球带简化刚体物理（重力/弹跳/摩擦/边界反弹/滚动）。
- **`src/components/VRStage.tsx`** —— 全屏开关（不重载场景）、`xrOk` 下关闭后期处理。
- **`vite.config.ts`** —— `base: "./"` 相对路径产物，可从任意子目录/iframe 加载。
- **`src/cat-test.tsx` + `cat-test.html`** —— 小猫的独立调试页（`vite` dev server 下访问 `/cat-test.html`）。

## 如何构建

```bash
# 1) 依赖
npm install

# 2) 模型：构建时需要 public/models/ 下的 GLB，
#    仓库为免重复存储未在此处再放一份，请从 ../mindvr/models/ 复制过来：
cp -r ../mindvr/models/* public/models/

# 3) 构建（产物在 dist/，同步到站点时拷贝到 ../mindvr/）
npm run build

# 开发联调（默认 5173 端口；分析后端 /api/v1/* 需另行部署，见上游仓库）
npm run dev
```

## 许可

- 本目录代码：继承上游 **MIT License**（`./LICENSE`）
- 房间家具模型：[KhronosGroup/glTF-Sample-Assets](https://github.com/KhronosGroup/glTF-Sample-Assets)，CC BY 4.0
- 小猫模型：Tuxedo Cat Animated 2.0 by [DreamNoms](https://sketchfab.com/DreamNoms)，CC BY 4.0
  （许可文件见 `../mindvr/models/TuxedoCat.license.txt`）
- 分析后端（不在本仓库内）：参照上游 [XIUGOU-AMEN/MindVR](https://github.com/XIUGOU-AMEN/MindVR) 自行部署；
  部署后把环境变量 `MINDVR_API` 指向它即可（见根目录 README 的环境变量表）
