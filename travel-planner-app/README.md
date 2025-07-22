# AI 旅行规划应用

这是一个使用 React、TypeScript 和 Claude API 构建的 AI 旅行规划应用。应用通过后端服务器与 Claude 模型通信，并使用高德地图 API 获取位置信息，生成详细的旅行行程规划。

## 功能特点

- 🏠 **智能首页** - 展示已保存行程和示例行程，支持暗黑模式切换
- ✨ **AI 行程生成** - 基于用户偏好和目的地智能生成个性化行程
- 🗺️ **实时地图显示** - 集成高德地图，显示景点位置和路线规划
- 💾 **行程保存管理** - 本地存储行程数据，支持保存、删除和查看
- 📱 **响应式设计** - 移动端优先的设计，支持多种设备
- 🌙 **主题切换** - 支持明暗主题切换，提供更好的用户体验
- 📍 **位置服务** - 自动获取用户当前位置作为出发地

## 技术栈

### 前端技术
- **React 18** - 现代化的 React 框架
- **TypeScript** - 类型安全的 JavaScript
- **React Router DOM** - 客户端路由管理
- **SCSS/Sass** - CSS 预处理器
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Font Awesome** - 图标库
- **Axios** - HTTP 客户端

### 后端技术
- **Express.js** - Node.js Web 框架
- **MCP (Model Context Protocol)** - 与 Claude API 通信
- **高德地图 API** - 地理位置和路线规划服务

### AI 服务
- **Claude 3.5 Sonnet** - Anthropic 大语言模型
- **高德地图 MCP 服务器** - 地图数据获取工具

## 项目结构

```
travel-planner-app/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── TripCard.tsx     # 行程卡片组件
│   │   ├── Navigation.tsx   # 导航组件
│   │   └── ThemeToggle.tsx  # 主题切换组件
│   ├── contexts/            # React Context
│   │   └── TripContext.tsx  # 行程数据管理
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx         # 首页
│   │   ├── CreateTrip.tsx   # 创建行程页
│   │   └── TravelPlan.tsx   # 行程详情页
│   ├── styles/              # 样式文件
│   ├── utils/               # 工具函数
│   │   ├── api.ts           # API 接口
│   │   └── formatDate.ts    # 日期格式化
│   └── types/               # TypeScript 类型定义
├── public/                  # 静态资源
└── docs/                    # 文档
```

## 核心功能

### 1. 智能行程生成
- 支持多种旅行类型：休闲、冒险、文化、美食
- 基于用户预算、偏好和日期生成个性化行程
- 包含详细的活动安排、交通信息、住宿和餐饮推荐

### 2. 地图集成
- 使用高德地图 API 显示景点位置
- 支持路线规划和导航
- 自动获取用户当前位置

### 3. 数据管理
- 使用 React Context 管理全局状态
- 本地存储保存用户行程数据
- 支持行程的增删改查操作

## 项目设置和启动

### 前提条件

- Node.js 16+ 和 npm 已安装
- 后端服务器已启动（travel-planner-server）

### 环境变量配置

在项目根目录创建 `.env.local` 文件，并添加以下内容：

```
REACT_APP_API_BASE_URL=http://localhost:3001
```

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
# 标准启动
npm start

# 静默启动（推荐）
npm run start:quiet
```

### 构建生产版本

```bash
# 开发构建
npm run build

# 生产构建
npm run build:prod
```

### 其他命令

```bash
# 类型检查
npm run type-check

# 运行测试
npm test

# 测试行程生成
npm run test:trip-gen
```

## 后端服务器

本项目需要配合 `travel-planner-server` 后端服务使用。后端服务提供：

- Claude API 集成
- 高德地图 MCP 服务器
- 行程生成 API 接口

### 启动后端服务

```bash
# 进入后端目录
cd travel-planner-server

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 主要页面

### 首页 (Home)
- 展示已保存的行程和示例行程
- 支持创建新行程
- 暗黑模式切换
- 行程卡片管理

### 创建行程页 (CreateTrip)
- 智能表单收集用户偏好
- 自动获取用户当前位置
- AI 行程生成
- 实时加载状态显示

### 行程详情页 (TravelPlan)
- 详细的行程展示
- 地图集成显示
- 支持保存和分享
- 响应式布局设计

## 开发说明

### 样式系统
- 使用 SCSS 预处理器
- 支持 CSS 变量管理
- 响应式设计
- 暗黑模式支持

### 状态管理
- React Context 用于全局状态
- localStorage 用于数据持久化
- 组件内部状态管理

### API 集成
- 通过 setupProxy.js 配置代理
- 支持本地开发和生产环境
- 错误处理和重试机制

## 注意事项

- 确保后端服务器正常运行
- 高德地图 API 需要有效的密钥
- Claude API 可能产生费用，请监控使用情况
- 本地存储有容量限制，注意数据清理

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

ISC License 