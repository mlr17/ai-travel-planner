# Travel Planner Server

这是一个基于 Express.js 的旅行规划服务器应用，结合了高德地图 MCP 服务和 Claude-3.5-Sonnet 大模型，为客户端提供旅行行程规划生成功能。

## 功能特点

- 利用 MCP (Model Context Protocol) 客户端与 Claude 大模型通信
- 集成高德地图 API 工具，提供准确的地理信息
- 生成详细的旅行行程规划，包括活动、交通、住宿和餐饮推荐
- 提供 RESTful API 接口，方便客户端集成
- 支持无 MCP 模式：即使没有高德地图 MCP 服务器，仍能生成基本行程

## 安装

```bash
# 克隆项目
git clone [项目仓库URL]

# 进入项目目录
cd travel-planner-server

# 安装依赖
npm install

# 配置环境变量
npm run prepare-env
# 编辑.env文件，添加必要的API密钥

# 启动开发服务器
npm run dev

# 或构建并启动生产服务器
npm run build
npm start
```

## MCP 服务器配置

服务器会自动尝试查找高德地图 MCP 服务器，默认查找路径：

1. 环境变量中指定的路径 (`MCP_SERVER_PATH`)
2. 当前项目中的路径 (`node_modules/@amap/amap-maps-mcp-server/build/index.js`)
3. 客户端项目中的路径 (`../travel-planner-app/node_modules/@amap/amap-maps-mcp-server/build/index.js`)

如果找不到 MCP 服务器，服务器将自动切换到直接使用 Claude API 生成行程的模式（功能受限但仍然可用）。

## API 接口

### 生成行程规划

```
POST /api/trips/generate
```

请求体示例：

```json
{
  "origin": "北京",
  "destination": "杭州",
  "startDate": "2025-06-01",
  "endDate": "2025-06-05",
  "budget": "5000",
  "preferences": "喜欢美食和历史景点",
  "travelType": "leisure"
}
```

响应示例：

```json
{
  "success": true,
  "data": {
    "title": "杭州5日休闲之旅",
    "days": 5,
    "nights": 4,
    "destination": {
      "name": "杭州",
      "coordinates": [120.153576, 30.287459]
    },
    "itinerary": [
      {
        "day": 1,
        "date": "2025-06-01",
        "activities": [
          {
            "time": "14:00 - 15:30",
            "title": "抵达杭州",
            "description": "抵达杭州站/杭州东站，乘坐出租车前往酒店",
            "location": "杭州东站",
            "coordinates": [120.209781, 30.283027]
          },
          // ... 更多活动
        ]
      },
      // ... 更多天数
    ],
    "summary": {
      "destination": "杭州",
      "duration": "5天4晚",
      "budget": "5000人民币",
      "weather": "初夏温暖，平均气温20-28°C",
      "tips": [
        "西湖景区人多，建议早晨参观",
        "准备舒适的步行鞋，多数景点需要步行"
      ]
    }
  }
}
```

### 健康检查

```
GET /api/trips/health
```

响应示例：

```json
{
  "success": true,
  "message": "行程规划服务正常运行",
  "timestamp": "2025-05-10T12:34:56.789Z"
}
```

## 客户端集成指南

要将此服务器与客户端 `travel-planner-app` 集成，需要对客户端代码进行以下修改：

1. 创建 API 服务器连接配置：

```typescript
// travel-planner-app/src/utils/apiConfig.ts
const API_BASE_URL = 'http://localhost:3001/api';

export default API_BASE_URL;
```

2. 修改客户端 API 文件，使用服务器端接口：

```typescript
// travel-planner-app/src/utils/api.ts
import API_BASE_URL from './apiConfig';
import axios from 'axios';
import { TripFormData, GeneratedTrip } from '../types';

/**
 * 生成行程规划
 * @param formData 用户填写的表单数据
 * @returns 生成的行程规划
 */
export const generateTripPlan = async (formData: TripFormData): Promise<GeneratedTrip> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/trips/generate`, formData);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '生成行程失败');
    }
  } catch (error: any) {
    console.error('生成行程规划失败:', error);
    throw error;
  }
};
```

3. 对于在前端使用的其他 MCP 相关代码，应移除或调整为通过服务器API调用

## 部署说明

### 使用 Docker 部署

1. 创建 Dockerfile：

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

2. 构建和运行 Docker 镜像：

```bash
docker build -t travel-planner-server .
docker run -p 3001:3001 -d --env-file .env travel-planner-server
```

### 直接部署

```bash
# 在服务器上
git clone [项目仓库URL]
cd travel-planner-server
npm install
npm run prepare-env
# 编辑 .env 文件，设置环境变量
npm run build
npm start
```

## 环境变量

在 `.env` 文件中配置以下环境变量：

- `PORT`: 服务器端口（默认 3001）
- `ANTHROPIC_API_KEY`: Anthropic Claude API 密钥
- `ANTHROPIC_BASE_URL`: Anthropic API 基础 URL
- `AMAP_MAPS_API_KEY`: 高德地图 API 密钥
- `MCP_SERVER_PATH`: MCP 服务器脚本路径（可选，会自动查找）

## 技术栈

- Node.js 和 Express.js
- TypeScript
- Anthropic Claude API
- 高德地图 MCP 服务（如可用）
- Model Context Protocol (MCP) SDK

## 开发者

- [您的姓名/组织]

## 许可证

[许可证类型] 