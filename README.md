# React + TypeScript + Tailwind CSS + Ant Design 项目

这是一个使用现代技术栈构建的 React 项目，集成了以下技术：

- ⚛️ **React 19** - 用户界面库
- 📘 **TypeScript** - 类型安全的 JavaScript
- 🎨 **Tailwind CSS v4** - 实用优先的 CSS 框架
- 🐜 **Ant Design** - 企业级 UI 设计语言和组件库
- ⚡ **Vite** - 下一代前端构建工具

## 功能特性

- ✅ React 19 + TypeScript 开发环境
- ✅ Tailwind CSS v4 样式系统
- ✅ Ant Design 组件库集成
- ✅ 热模块替换 (HMR)
- ✅ TypeScript 类型检查
- ✅ ESLint 代码检查

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── App.tsx            # 主应用组件
├── App.css            # 应用样式
├── main.tsx           # 应用入口
└── index.css          # 全局样式 (包含 Tailwind CSS)
```

## 使用说明

### 使用 Ant Design 组件

```tsx
import { Button, Card } from 'antd'

function MyComponent() {
  return (
    <Card>
      <Button type="primary">按钮</Button>
    </Card>
  )
}
```

### 使用 Tailwind CSS

```tsx
<div className="flex items-center justify-center p-4 bg-blue-500">
  <h1 className="text-2xl font-bold text-white">标题</h1>
</div>
```

## 技术栈版本

- React: ^19.2.0
- TypeScript: ~5.9.3
- Tailwind CSS: ^4.1.17
- Ant Design: ^6.0.0
- Vite: ^7.2.4

## 许可证

MIT
