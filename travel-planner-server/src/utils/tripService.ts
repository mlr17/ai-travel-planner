import { TripFormData, GeneratedTrip } from './types';
import { MCPClient } from './mcpClient';
import config from '../config/config';
import * as path from 'path';
import * as fs from 'fs';

//const mockResponse = `好的，我理解您的要求。我将使用高德地图API来获取必要的信息，并为您设计一份从重庆到成都的2天1晚自驾休闲度假行程。我会按照您提供的JSON格式返回结果。首先，让我们获取一些必要的信息。
//[调用工具 maps_geo]
//{
//  "title": "重庆到成都休闲自驾之旅",
//  "days": 2,
//  "nights": 1,
//  "destination": {
//    "name": "成都",
//    "coordinates": [104.066301, 30.572961]
//  },
//  "itinerary": [
//    {
//      "day": 1,
//      "date": "2025-08-01",
//      "activities": [
//        {
//          "time": "08:00 - 12:00",
//          "title": "重庆出发，自驾前往成都",
//          "description": "从重庆出发，沿G93高速公路自驾前往成都，全程约300公里。",
//          "location": "G93高速公路",
//          "coordinates": [104.066301, 30.572961],
//          "tips": "途中可在服务区休息，注意行车安全。",
//          "cost": "油费约200元，过路费约150元",
//          "weather": "晴天，温度28-35℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约4小时",
//            "cost": "350元"
//          }
//        },
//        {
//          "time": "12:30 - 14:00",
//          "title": "午餐at钟水饺",
//          "description": "品尝成都地道小吃，尤其是著名的钟水饺。",
//          "location": "钟水饺春熙路店",
//          "coordinates": [104.078467, 30.658307],
//          "tips": "推荐三鲜水饺和红油抄手。",
//          "cost": "人均50元",
//          "weather": "晴天，温度33℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "15分钟",
//            "cost": "停车费10元"
//          }
//        },
//        {
//          "time": "14:30 - 17:30",
//          "title": "参观杜甫草堂",
//          "description": "游览著名诗人杜甫的故居，感受古代文人雅致。",
//          "location": "杜甫草堂博物馆",
//          "coordinates": [104.032867, 30.665597],
//          "tips": "可以租赁语音导览设备，深入了解杜甫生平。",
//          "cost": "门票60元/人",
//          "weather": "多云，温度31℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "20分钟",
//            "cost": "停车费15元"
//          }
//        },
//        {
//          "time": "18:00 - 20:00",
//          "title": "晚餐at川西坝子",
//          "description": "品尝正宗川菜，体验成都的美食文化。",
//          "location": "川西坝子（春熙路店）",
//          "coordinates": [104.078467, 30.658307],
//          "tips": "推荐尝试毛血旺、辣子鸡、夫妻肺片等经典川菜。",
//          "cost": "人均150元",
//          "weather": "晴天，温度29℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "15分钟",
//            "cost": "停车费10元"
//          }
//        },
//        {
//          "time": "20:30 - 22:00",
//          "title": "漫步锦里古街",
//          "description": "夜游锦里，感受成都的夜生活氛围。",
//          "location": "锦里古街",
//          "coordinates": [104.047293, 30.640297],
//          "tips": "可以品尝各种小吃，购买特色手工艺品。",
//          "cost": "免费入场，小吃和购物自理",
//          "weather": "晴天，温度27℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "10分钟",
//            "cost": "停车费10元"
//          }
//        }
//      ],
//      "transportation": {
//        "method": "自驾",
//        "duration": "全天",
//        "cost": "约450元（包括油费、过路费和停车费）"
//      },
//      "accommodation": {
//        "name": "成都望江宾馆",
//        "address": "成都市锦江区滨江东路9号",
//        "price": "500-600元/晚",
//        "coordinates": [104.086791, 30.646917]
//      },
//      "dining": [
//        {
//          "name": "钟水饺春熙路店",
//          "cuisine": "川菜",
//          "price": "30-80元/人",
//          "specialties": "三鲜水饺、红油抄手",
//          "address": "成都市锦江区春熙路南段2号",
//          "coordinates": [104.078467, 30.658307]
//        },
//        {
//          "name": "川西坝子（春熙路店）",
//          "cuisine": "川菜",
//          "price": "100-200元/人",
//          "specialties": "毛血旺、辣子鸡、夫妻肺片",
//          "address": "成都市锦江区春熙路南段2号时代百货5楼",
//          "coordinates": [104.078467, 30.658307]
//        }
//      ]
//    },
//    {
//      "day": 2,
//      "date": "2025-08-02",
//      "activities": [
//        {
//          "time": "09:00 - 12:00",
//          "title": "游览大熊猫繁育研究基地",
//          "description": "近距离观察大熊猫，了解熊猫保护工作。",
//          "location": "成都大熊猫繁育研究基地",
//          "coordinates": [104.144554, 30.737499],
//          "tips": "建议早上去，熊猫活动较多。记得带相机。",
//          "cost": "门票58元/人",
//          "weather": "多云，温度26-32℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "30分钟",
//            "cost": "停车费20元"
//          }
//        },
//        {
//          "time": "12:30 - 14:00",
//          "title": "午餐at陈麻婆豆腐",
//          "description": "品尝正宗的陈麻婆豆腐，感受百年老字号的魅力。",
//          "location": "陈麻婆豆腐（青华路店）",
//          "coordinates": [104.082206, 30.675251],
//          "tips": "除了麻婆豆腐，推荐尝试宫保鸡丁和夫妻肺片。",
//          "cost": "人均80元",
//          "weather": "多云，温度32℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "20分钟",
//            "cost": "停车费10元"
//          }
//        },
//        {
//          "time": "14:30 - 17:00",
//          "title": "参观武侯祠",
//          "description": "了解三国历史，参观诸葛亮和刘备的纪念祠堂。",
//          "location": "武侯祠博物馆",
//          "coordinates": [104.047293, 30.640297],
//          "tips": "可以在园内的茶馆小憩，品尝当地茶文化。",
//          "cost": "门票50元/人",
//          "weather": "多云，温度30℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "15分钟",
//            "cost": "停车费15元"
//          }
//        },
//        {
//          "time": "17:30 - 19:30",
//          "title": "逛宽窄巷子",
//          "description": "漫步成都最具特色的古街区，感受老成都的生活氛围。",
//          "location": "宽窄巷子",
//          "coordinates": [104.059543, 30.671276],
//          "tips": "可以在这里品尝各种成都小吃，购买特色手工艺品。",
//          "cost": "免费入场，小吃和购物自理",
//          "weather": "晴天，温度28℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "10分钟",
//            "cost": "停车费10元"
//          }
//        },
//        {
//          "time": "20:00 - 22:00",
//          "title": "晚餐at蜀九香火锅",
//          "description": "品尝正宗成都火锅，体验地道的成都味道。",
//          "location": "蜀九香火锅（春熙路店）",
//          "coordinates": [104.078467, 30.658307],
//          "tips": "推荐尝试鸳鸯锅，既可以吃到麻辣，也可以品尝清淡口味。",
//          "cost": "人均150元",
//          "weather": "晴天，温度26℃",
//          "transportation": {
//            "method": "自驾",
//            "duration": "15分钟",
//            "cost": "停车费10元"
//          }
//        }
//      ],
//      "transportation": {
//        "method": "自驾",
//        "duration": "全天",
//        "cost": "约100元（主要是停车费）"
//      },
//      "accommodation": {
//        "name": "返回重庆",
//        "address": "自驾返回重庆",
//        "price": "油费约200元，过路费约150元",
//        "coordinates": [106.551556, 29.563009]
//      },
//      "dining": [
//        {
//          "name": "陈麻婆豆腐（青华路店）",
//          "cuisine": "川菜",
//          "price": "60-100元/人",
//          "specialties": "麻婆豆腐、宫保鸡丁、夫妻肺片",
//          "address": "成都市青羊区青华路7号",
//          "coordinates": [104.082206, 30.675251]
//        },
//        {
//          "name": "蜀九香火锅（春熙路店）",
//          "cuisine": "川式火锅",
//          "price": "120-180元/人",
//          "specialties": "鸳鸯锅底、毛肚、牛肉",
//          "address": "成都市锦江区春熙路南段2号时代百货负一楼",
//          "coordinates": [104.078467, 30.658307]
//        }
//      ]
//    }
//  ],
//  "summary": {
//    "destination": "成都",
//    "duration": "2天1晚",
//    "budget": "约3000元",
//    "weather": "夏季，晴朗到多云，温度26-35℃",
//    "tips": [
//      "成都夏季较热，请携带防晒用品和遮阳伞",
//      "品尝川菜和火锅时注意辣度，可以要求少辣或不辣",
//      "自驾游请注意查看路况信息，避开拥堵时段",
//      "参观景点时建议提前购票，避免排队等待",
//      "注意保管好随身物品，特别是在人流密集的景区"
//    ]
//  }
//}
//{
//  "title": "成都休闲自驾之旅",
//  "days": 2,
//  "nights": 1,
//  "destination": {
//    "name": "成都",
//    "coordinates": [104.066301, 30.572961]
//  },
//  "itinerary": [
//    {
//      "day": 1,
//      "date": "2025-08-01",
//      "activities": [
//        {
//          "time": "09:00 - 10:30",
//          "title": "从重庆出发前往成都",
//          "description": "自驾从重庆出发，沿G93成渝环线高速公路前往成都",
//          "location": "G93成渝环线高速公路",
//          "coordinates": [104.066301, 30.572961],
//          "tips": "请提前检查车辆状况，确保油量充足",
//          "cost": "约200元（油费+过路费）",
//          "weather": "多云，温度26°C-33°C",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约3小时30分钟",
//            "cost": "200元"
//          }
//        },
//        {
//          "time": "11:00 - 12:30",
//          "title": "参观杜甫草堂",
//          "description": "游览著名诗人杜甫的故居，感受浓厚的文化氛围",
//          "location": "杜甫草堂",
//          "coordinates": [104.034296, 30.659343],
//          "tips": "建议提前购买门票，避免排队",
//          "cost": "门票60元/人",
//          "weather": "多云，温度28°C-34°C",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约20分钟",
//            "cost": "停车费约10元"
//          }
//        },
//        {
//          "time": "13:00 - 14:30",
//          "title": "午餐at陈麻婆豆腐",
//          "description": "品尝正宗川菜，感受麻辣鲜香",
//          "location": "陈麻婆豆腐（青羊宫店）",
//          "coordinates": [104.062159, 30.674318],
//          "tips": "建议点招牌陈麻婆豆腐和回锅肉",
//          "cost": "人均80-100元",
//          "weather": "多云，温度29°C-35°C",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约15分钟",
//            "cost": "停车费约10元"
//          }
//        },
//        {
//          "time": "15:00 - 17:30",
//          "title": "游览宽窄巷子",
//          "description": "漫步成都著名的历史文化街区，体验老成都的生活气息",
//          "location": "宽窄巷子",
//          "coordinates": [104.056932, 30.673079],
//          "tips": "可以品尝各种小吃，购买特色手工艺品",
//          "cost": "免费入场，小吃和购物约100-200元/人",
//          "weather": "多云转晴，温度27°C-33°C",
//          "transportation": {
//            "method": "步行",
//            "duration": "约10分钟",
//            "cost": "0元"
//          }
//        },
//        {
//          "time": "18:00 - 20:00",
//          "title": "晚餐at蚝英雄",
//          "description": "享用新鲜海鲜和特色川菜",
//          "location": "蚝英雄（太古里店）",
//          "coordinates": [104.080988, 30.654701],
//          "tips": "推荐蒜蓉生蚝和麻辣小龙虾",
//          "cost": "人均150-200元",
//          "weather": "晴，温度25°C-30°C",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约20分钟",
//            "cost": "停车费约15元"
//          }
//        }
//      ],
//      "transportation": {
//        "method": "自驾",
//        "duration": "全天",
//        "cost": "约250元（包括油费、停车费）"
//      },
//      "accommodation": {
//        "name": "成都安仁华美达酒店",
//        "address": "成都市锦江区东大街下东大街段199号",
//        "price": "400-500元/晚",
//        "coordinates": [104.082107, 30.657378]
//      },
//      "dining": [
//        {
//          "name": "陈麻婆豆腐（青羊宫店）",
//          "cuisine": "川菜",
//          "price": "80-100元/人",
//          "specialties": "陈麻婆豆腐，回锅肉",
//          "address": "成都市青羊区西御河沿街97号",
//          "coordinates": [104.062159, 30.674318]
//        },
//        {
//          "name": "蚝英雄（太古里店）",
//          "cuisine": "海鲜、川菜",
//          "price": "150-200元/人",
//          "specialties": "蒜蓉生蚝，麻辣小龙虾",
//          "address": "成都市锦江区中纱帽街8号成都远洋太古里M68-70号",
//          "coordinates": [104.080988, 30.654701]
//        }
//      ]
//    },
//    {
//      "day": 2,
//      "date": "2025-08-02",
//      "activities": [
//        {
//          "time": "09:00 - 11:30",
//          "title": "游览大熊猫繁育研究基地",
//          "description": "近距离观看可爱的大熊猫，了解熊猫保护工作",
//          "location": "成都大熊猫繁育研究基地",
//          "coordinates": [104.148598, 30.737681],
//          "tips": "建议早上去，熊猫活动较多",
//          "cost": "门票58元/人",
//          "weather": "晴，温度25°C-32°C",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约40分钟",
//            "cost": "停车费约20元"
//          }
//        },
//        {
//          "time": "12:00 - 13:30",
//          "title": "午餐at马路边边麻辣烫",
//          "description": "品尝地道的成都街头小吃",
//          "location": "马路边边麻辣烫（太古里店）",
//          "coordinates": [104.081497, 30.654221],
//          "tips": "推荐牛肉丸和土豆片",
//          "cost": "人均50-70元",
//          "weather": "晴，温度28°C-34°C",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约35分钟",
//            "cost": "停车费约15元"
//          }
//        },
//        {
//          "time": "14:00 - 16:30",
//          "title": "参观成都博物馆",
//          "description": "了解成都悠久的历史文化",
//          "location": "成都博物馆",
//          "coordinates": [104.056572, 30.671595],
//          "tips": "免费参观，需要提前预约",
//          "cost": "免费",
//          "weather": "晴转多云，温度29°C-35°C",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约15分钟",
//            "cost": "停车费约10元"
//          }
//        },
//        {
//          "time": "17:00 - 19:00",
//          "title": "逛锦里古街",
//          "description": "体验古蜀文化，品尝各种小吃",
//          "location": "锦里古街",
//          "coordinates": [104.046894, 30.643056],
//          "tips": "可以购买一些特色手工艺品作为纪念",
//          "cost": "小吃和购物约100-200元/人",
//          "weather": "多云，温度26°C-32°C",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约20分钟",
//            "cost": "停车费约15元"
//          }
//        },
//        {
//          "time": "19:30 - 21:00",
//          "title": "晚餐at钟水饺",
//          "description": "品尝成都著名的传统小吃",
//          "location": "钟水饺（春熙路店）",
//          "coordinates": [104.082215, 30.657516],
//          "tips": "推荐三鲜水饺和红油抄手",
//          "cost": "人均40-60元",
//          "weather": "多云，温度24°C-29°C",
//          "transportation": {
//            "method": "自驾",
//            "duration": "约15分钟",
//            "cost": "停车费约10元"
//          }
//        }
//      ],
//      "transportation": {
//        "method": "自驾",
//        "duration": "全天",
//        "cost": "约300元（包括油费、停车费）"
//      },
//      "accommodation": {
//        "name": "返回重庆",
//        "address": "自驾返回重庆",
//        "price": "约200元（油费+过路费）",
//        "coordinates": [106.551556, 29.563009]
//      },
//      "dining": [
//        {
//          "name": "马路边边麻辣烫（太古里店）",
//          "cuisine": "川式小吃",
//          "price": "50-70元/人",
//          "specialties": "麻辣烫，牛肉丸，土豆片",
//          "address": "成都市锦江区中纱帽街8号成都远洋太古里M19-22号",
//          "coordinates": [104.081497, 30.654221]
//        },
//        {
//          "name": "钟水饺（春熙路店）",
//          "cuisine": "川式小吃",
//          "price": "40-60元/人",
//          "specialties": "三鲜水饺，红油抄手",
//          "address": "成都市锦江区春熙路南段2号",
//          "coordinates": [104.082215, 30.657516]
//        }
//      ]
//    }
//  ],
//  "summary": {
//    "destination": "成都",
//    "duration": "2天1晚",
//    "budget": "3000元人民币",
//    "weather": "8月初成都天气较热，温度在24°C-35°C之间，以晴天和多云天气为主",
//    "tips": [
//      "自驾出行请注意交通安全，遵守交通规则",
//      "成都美食众多，建议适量品尝，注意饮食卫生",
//      "参观景点时请遵守当地规定，保护环境",
//      "注意防晒和补水，夏季天气炎热",
//      "建议提前预订热门景点门票和餐厅，避免排队等待"
//    ]
//  }
//}`;
// MCP 客户端配置
const mcpConfig = {
  apiKey: config.anthropic.apiKey,
  baseURL: config.anthropic.baseURL,
  amapApiKey: config.amap.apiKey
};
// 系统提示词，指导 Claude 如何生成行程规划
const TRIP_PROMPT_TEMPLATE_MCP = `你是一位专业的旅行规划师，使用中文帮助用户规划详细的行程。请根据以下信息设计一份旅行规划：

出发地: {{origin}}
目的地: {{destination}} {{coordinates}}
日期: 从 {{startDate}} 到 {{endDate}} (共 {{days}} 天 {{nights}} 晚)
预算: {{budget}}
偏好: {{preferences}}
旅行类型: {{travelType}}
天气: {{weather}}
{{poiInfo}}
## 生成行程要求

行程规划需包含以下元素：
1. 行程标题区：目的地名称、旅行日期和总天数、天气信息摘要
2. 行程概览区：按日期分区的行程简表、每天主要活动/景点的概览、使用图标标识不同类型的活动
3. 详细时间表区：以时间轴形式呈现详细行程、包含时间、地点、活动描述、每个景点的停留时间、标注门票价格和必要预订信息
4. 交通信息区：主要交通换乘点及方式、预计交通时间、使用箭头或连线表示行程路线
5. 住宿与餐饮区：酒店/住宿地址和联系方式、推荐餐厅列表（标注特色菜和价格区间及地址）
6. 实用信息区：紧急联系电话、重要提示和注意事项、预算摘要、行李清单提醒

非常重要：每个活动和景点必须包含它的坐标（经度，纬度），这样才能在地图上准确标注。同时，每个活动必须包含到达该地点的交通方式以及当地天气状况。请根据用户提供的起点、目的地、日期、预算和偏好，生成完整的旅行行程，不要返回重复的JSON数据，每次只返回给我一个JSON数据！

在生成行程时，请考虑以下因素：
1. 合理安排每天的行程，避免过于紧凑或过于松散
2. 考虑景点之间的距离和交通方式
3. 根据用户的预算提供合适的住宿、餐饮和活动建议
4. 考虑用户的偏好和兴趣
5. 包含当地特色体验和美食推荐

你可以使用高德地图的 API 工具获取以下信息来辅助行程规划：
- 使用 amap-maps_maps_geo 获取地点的经纬度
- 使用 amap-maps_maps_text_search 搜索目的地的景点、餐厅、酒店等
- 使用 amap-maps_maps_around_search 搜索特定位置周边的景点、餐厅等
- 使用 amap-maps_maps_search_detail 获取特定 POI 的详细信息
- 使用 amap-maps_maps_direction_driving 和 amap-maps_maps_direction_walking 计算地点之间的距离和所需时间
- 使用 amap-maps_maps_weather 获取目的地的天气信息

请以JSON格式返回结果，格式如下：
\`\`\`json
{
  "title": "行程标题",
  "days": 天数,
  "nights": 晚数,
  "destination": {
    "name": "目的地名称",
    "coordinates": [经度, 纬度]
  },
  "itinerary": [
    {
      "day": 1,
      "date": "日期",
      "activities": [
        {
          "time": "开始时间 - 结束时间",
          "title": "活动标题",
          "description": "活动描述",
          "location": "活动地点",
          "coordinates": [经度, 纬度],
          "tips": "注意事项或建议",
          "cost": "费用信息",
          "weather": "当地天气状况",
          "transportation": {
            "method": "前往该地点的交通方式",
            "duration": "所需时间",
            "cost": "交通费用"
          }
        }
      ],
      "transportation": {
        "method": "当天主要交通方式",
        "duration": "所需时间",
        "cost": "交通费用"
      },
      "accommodation": {
        "name": "住宿名称",
        "address": "住宿地址",
        "price": "价格范围",
        "coordinates": [经度, 纬度]
      },
      "dining": [
        {
          "name": "餐厅名称",
          "cuisine": "菜系",
          "price": "价格范围",
          "specialties": "推荐菜品",
          "address": "餐厅地址",
          "coordinates": [经度, 纬度]
        }
      ]
    }
  ],
  "summary": {
    "destination": "目的地",
    "duration": "行程时长",
    "budget": "预算",
    "weather": "天气概况",
    "tips": ["实用贴士1", "实用贴士2"]
  }
}
\`\`\`

请确保所有活动和安排符合目的地的特点和旅行者的偏好，为旅行者提供一个难忘的旅行体验。
在生成每个景点、餐厅或活动时，请先使用高德MCP服务获取其准确坐标，再添加到行程中。
此外，确保所有日期、时间、地点和活动都尽可能准确，使用真实存在的景点、餐厅和酒店。
如果用户提供的信息不足，请基于目的地的特点做出合理的推荐。
注意：请以JSON格式返回结果，不要返回重复的JSON数据，每次只返回给我一个JSON数据！给我的JSON数据不要转义，而且不需要你JSON字符串化，直接给我JSON.parse后的数据`;


//// 直接用 Claude 生成行程的提示词
//const DIRECT_PROMPT_TEMPLATE = `
//请根据以下信息设计一份旅行规划：

//出发地: {{origin}}
//目的地: {{destination}}
//日期: 从 {{startDate}} 到 {{endDate}} (共 {{days}} 天 {{nights}} 晚)
//预算: {{budget}}
//偏好: {{preferences}}
//旅行类型: {{travelType}}

//## 生成行程要求

//请生成一个详细的旅行计划，包括以下内容：
//1. 行程标题：描述目的地和旅行时长
//2. 每天的活动安排：包括景点游览、餐饮、休闲活动等
//3. 交通安排：从出发地到目的地以及在目的地内的交通方式
//4. 住宿建议：适合预算的住宿选择
//5. 实用贴士：关于该目的地的实用建议

//请以JSON格式返回结果，每个活动尽可能添加地点描述和预估费用。尽管没有实时地图数据，请尽量提供相对准确的行程建议，考虑活动之间的距离和交通时间。

//请以如下JSON格式返回：
//\`\`\`json
//{
//  "title": "行程标题",
//  "days": 天数,
//  "nights": 晚数,
//  "destination": {
//    "name": "目的地名称"
//  },
//  "itinerary": [
//    {
//      "day": 1,
//      "date": "日期",
//      "activities": [
//        {
//          "time": "开始时间 - 结束时间",
//          "title": "活动标题",
//          "description": "活动描述",
//          "location": "活动地点",
//          "tips": "注意事项或建议",
//          "cost": "费用信息"
//        }
//      ],
//      "transportation": {
//        "method": "交通方式",
//        "duration": "所需时间",
//        "cost": "交通费用"
//      },
//      "accommodation": {
//        "name": "住宿名称",
//        "address": "住宿地址",
//        "price": "价格范围"
//      }
//    }
//  ],
//  "summary": {
//    "destination": "目的地",
//    "duration": "行程时长",
//    "budget": "预算",
//    "tips": ["实用贴士1", "实用贴士2"]
//  }
//}
//\`\`\`
//`;
/**
 * 生成行程规划
 * @param formData 用户填写的表单数据
 * @returns 生成的行程规划
 */
export const generateTripPlan = async (formData: TripFormData): Promise<GeneratedTrip> => {
  const mcpClient = new MCPClient(mcpConfig);
  
  try {
    // 计算旅行天数
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 检查 MCP 服务器路径是否存在
    const mcpServerPath = config.mcpServer.path;
    const mcpServerExists = fs.existsSync(mcpServerPath);
    
    //if (!mcpServerExists) {
    //  console.warn(`MCP 服务器路径不存在: ${mcpServerPath}`);
    //  console.log('使用直接生成方式...');
    //  return await directGenerateTripPlan(formData, diffDays);
    //}
    
    console.log('使用 MCP 方式生成行程...');
    
    // 使用模板构建提示词
    let userPrompt = TRIP_PROMPT_TEMPLATE_MCP
      .replace('{{origin}}', formData.origin)
      .replace('{{destination}}', formData.destination)
      .replace('{{startDate}}', formData.startDate)
      .replace('{{endDate}}', formData.endDate)
      .replace('{{days}}', diffDays.toString())
      .replace('{{nights}}', (diffDays - 1).toString())
      .replace('{{budget}}', formData.budget ? formData.budget + ' 人民币' : '未指定')
      .replace('{{preferences}}', formData.preferences || '无特殊偏好')
      .replace('{{travelType}}', getTravelTypeInChinese(formData.travelType))
      .replace('{{weather}}', '当前季节的天气情况')
      .replace('{{coordinates}}', '')
      .replace('{{poiInfo}}', '请使用高德地图API获取目的地相关信息');
    
    console.log('发送行程规划请求到 MCP 客户端...');
    
    try {
      // 连接到MCP服务器
      await mcpClient.connectToServer(mcpServerPath);
      
      // 发送查询请求
      const response = await mcpClient.processQuery(userPrompt);
      //const response = mockResponse;
      console.log('MCP 客户端返回响应：', response);
      
      // 解析 JSON 响应
      try {
        // 尝试从响应中提取 JSON 部分
        const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*?\}(?=\s*\{|\s*$)/) || 
                          response.match(/```\n([\s\S]*?)\n```/) ||
                          response.match(/{[\s\S]*?}/);

        let jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response;

        // 尝试清理 JSON 字符串中的格式问题
        jsonStr = jsonStr.trim();
        console.log('解析前的 JSON 字符串:', jsonStr);
        // 如果提取的是一个完整的 JSON 对象，尝试修复常见的格式问题
        if (jsonStr.startsWith('{') && jsonStr.includes('}')) {
          // 修复多余的逗号
          jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
          // 修复缺少逗号的情况
          jsonStr = jsonStr.replace(/(["\d])\s*\n\s*"/g, '$1,\n"');
          // 修复属性名没有引号的情况
          jsonStr = jsonStr.replace(/(\{|\,)\s*(\w+)\s*\:/g, '$1"$2":');
        }
        
        const tripPlan = JSON.parse(jsonStr);
        
        // 确保返回的数据符合预期格式
        validateTripPlan(tripPlan);
        
        return tripPlan;
      } catch (error) {
        console.error('解析 MCP 响应失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('MCP 方式生成行程失败:', error);
      
      //// 如果启用了备用模式，直接使用 Claude 生成
      //if (config.mcpServer.enableFallback) {
      //  console.log('切换到直接生成方式...');
      //  return await directGenerateTripPlan(formData, diffDays);
      //}
      
      throw error;
    }
  } catch (error) {
    console.error('生成行程规划失败:', error);
    
    // 如果 API 调用失败，提供一个默认行程
    return generateFallbackTripPlan(formData, calculateDays(formData.startDate, formData.endDate));
  } finally {
    // 清理 MCP 客户端资源
    await mcpClient.cleanup();
  }
};

/**
 * 直接使用 Claude 生成行程规划（不使用 MCP 工具）
 * @param formData 用户填写的表单数据
 * @param days 天数
 * @returns 生成的行程规划
 */
//const directGenerateTripPlan = async (formData: TripFormData, days: number): Promise<GeneratedTrip> => {
//  const mcpClient = new MCPClient(mcpConfig);
  
//  try {
//    // 使用模板构建提示词
//    let userPrompt = DIRECT_PROMPT_TEMPLATE
//      .replace('{{origin}}', formData.origin)
//      .replace('{{destination}}', formData.destination)
//      .replace('{{startDate}}', formData.startDate)
//      .replace('{{endDate}}', formData.endDate)
//      .replace('{{days}}', days.toString())
//      .replace('{{nights}}', (days - 1).toString())
//      .replace('{{budget}}', formData.budget ? formData.budget + ' 人民币' : '未指定')
//      .replace('{{preferences}}', formData.preferences || '无特殊偏好')
//      .replace('{{travelType}}', getTravelTypeInChinese(formData.travelType));
    
//    console.log('直接发送行程规划请求到 Claude...');
    
//    // 直接调用 Claude API（不使用工具）
//    const messages :any[]= [
//      {
//        role: "user",
//        content: userPrompt,
//      },
//    ];
    
//    // 创建 Anthropic 实例
//    const anthropic = mcpClient.getAnthropicClient();
    
//    // 调用 API
//    const response = await anthropic.messages.create({
//      model: "claude-3-5-sonnet-latest",
//      max_tokens: 4000,
//      messages: messages,
//    });
    
//    const responseText = response.content[0].type === "text" ? response.content[0].text : "";
    
//    // 解析 JSON 响应
//    try {
//      // 尝试从响应中提取 JSON 部分
//      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
//                        responseText.match(/```\n([\s\S]*?)\n```/) ||
//                        responseText.match(/{[\s\S]*?}/);
                      
//      let jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
      
//      // 尝试清理 JSON 字符串中的格式问题
//      jsonStr = jsonStr.trim();
      
//      // 如果提取的是一个完整的 JSON 对象，尝试修复常见的格式问题
//      if (jsonStr.startsWith('{') && jsonStr.includes('}')) {
//        // 修复多余的逗号
//        jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
//        // 修复缺少逗号的情况
//        jsonStr = jsonStr.replace(/(["\d])\s*\n\s*"/g, '$1,\n"');
//        // 修复属性名没有引号的情况
//        jsonStr = jsonStr.replace(/(\{|\,)\s*(\w+)\s*\:/g, '$1"$2":');
//      }
      
//      console.log('准备解析的 Claude 响应 JSON 字符串:', jsonStr.substring(0, 100) + '...');
      
//      const tripPlan = JSON.parse(jsonStr);
      
//      // 确保返回的数据符合预期格式
//      validateTripPlan(tripPlan);
      
//      return tripPlan;
//    } catch (error) {
//      console.error('解析 Claude 响应失败:', error);
      
//      // 如果解析失败，提供一个默认行程
//      return generateFallbackTripPlan(formData, days);
//    }
//  } catch (error) {
//    console.error('直接生成行程规划失败:', error);
    
//    // 如果 API 调用失败，提供一个默认行程
//    return generateFallbackTripPlan(formData, days);
//  }
//};

/**
 * 根据旅行类型获取中文描述
 * @param travelType 旅行类型
 * @returns 旅行类型的中文描述
 */
const getTravelTypeInChinese = (travelType: string): string => {
  switch (travelType) {
    case 'leisure':
      return '休闲度假';
    case 'adventure':
      return '探险';
    case 'cultural':
      return '文化体验';
    case 'culinary':
      return '美食之旅';
    default:
      return '休闲度假';
  }
};

/**
 * 计算旅行天数
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 天数
 */
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 验证行程规划数据结构，并尝试修复不完整的数据
 * @param tripPlan 行程规划
 */
const validateTripPlan = (tripPlan: any): void => {
  if (!tripPlan) throw new Error('行程规划为空');
  
  // 确保标题存在
  if (!tripPlan.title) {
    tripPlan.title = `${tripPlan.destination?.name || '未知目的地'}旅行计划`;
    console.log('自动添加标题:', tripPlan.title);
  }
  
  // 确保行程安排存在
  if (!tripPlan.itinerary || !Array.isArray(tripPlan.itinerary) || tripPlan.itinerary.length === 0) {
    console.log('行程安排不存在或格式不正确，创建默认行程');
    // 创建默认行程
    const days = tripPlan.days || 1;
    tripPlan.itinerary = [];
    
    for (let i = 0; i < days; i++) {
      const today = new Date();
      today.setDate(today.getDate() + i);
      
      tripPlan.itinerary.push({
        day: i + 1,
        date: today.toISOString().split('T')[0],
        activities: [
          {
            time: "09:00 - 17:00",
            title: "自由活动",
            description: "根据个人喜好安排",
            location: tripPlan.destination?.name || "目的地"
          }
        ]
      });
    }
  }
  
  // 确保天数正确
  if (tripPlan.days === undefined) {
    tripPlan.days = tripPlan.itinerary.length;
    console.log('自动设置天数:', tripPlan.days);
  }
  
  // 确保晚数正确
  if (tripPlan.nights === undefined) {
    tripPlan.nights = Math.max(0, tripPlan.days - 1);
    console.log('自动设置晚数:', tripPlan.nights);
  }
  
  // 确保每天的行程都有正确的格式
  tripPlan.itinerary.forEach((day: any, index: number) => {
    // 确保 day 字段正确
    if (!day.day) {
      day.day = index + 1;
      console.log(`自动设置第 ${index + 1} 天的 day 字段`);
    }
    
    // 确保 date 字段存在
    if (!day.date) {
      const today = new Date();
      today.setDate(today.getDate() + index);
      day.date = today.toISOString().split('T')[0];
      console.log(`自动设置第 ${day.day} 天的日期:`, day.date);
    }
    
    // 确保 activities 字段存在且为数组
    if (!day.activities || !Array.isArray(day.activities) || day.activities.length === 0) {
      day.activities = [
        {
          time: "09:00 - 17:00",
          title: "自由活动",
          description: "根据个人喜好安排",
          location: tripPlan.destination?.name || "目的地"
        }
      ];
      console.log(`自动添加第 ${day.day} 天的活动`);
    }
  });
  
  // 确保目的地信息存在
  if (!tripPlan.destination) {
    tripPlan.destination = {
      name: tripPlan.itinerary[0]?.activities[0]?.location || '未知目的地'
    };
    console.log('自动添加目的地信息:', tripPlan.destination.name);
  }
  
  // 确保摘要信息存在
  if (!tripPlan.summary) {
    tripPlan.summary = {
      destination: tripPlan.destination.name || '未知目的地',
      duration: `${tripPlan.days}天${tripPlan.nights}晚`,
      budget: '根据个人消费习惯',
      weather: '请查看当地天气预报',
      tips: ['提前预订酒店和景点门票', '了解当地特色美食', '准备舒适的旅行装备']
    };
    console.log('自动添加摘要信息');
  }
};

/**
 * 生成备用行程规划（在 API 调用失败时使用）
 * @param formData 用户填写的表单数据
 * @param days 天数
 * @returns 默认行程规划
 */
const generateFallbackTripPlan = (formData: TripFormData, days: number): GeneratedTrip => {
  const startDate = new Date(formData.startDate);
  const defaultActivities = [
    { title: '抵达目的地', time: '14:00 - 16:00', type: '交通', description: '抵达目的地，办理入住手续', location: formData.destination },
    { title: '晚餐', time: '18:00 - 19:30', type: '用餐', description: '享用当地特色美食', location: `${formData.destination}餐厅` },
    { title: '夜游', time: '20:00 - 21:30', type: '休闲', description: '夜游城市，感受夜景', location: `${formData.destination}夜景区` }
  ];
  
  const secondDayActivities = [
    { title: '早餐', time: '08:00 - 09:00', type: '用餐', description: '酒店早餐', location: '酒店餐厅' },
    { title: '景点游览', time: '09:30 - 12:00', type: '观光', description: '参观当地著名景点', location: `${formData.destination}景点` },
    { title: '午餐', time: '12:30 - 14:00', type: '用餐', description: '品尝当地特色美食', location: `${formData.destination}餐厅` },
    { title: '景点游览', time: '14:30 - 17:30', type: '观光', description: '参观当地著名景点', location: `${formData.destination}景点` },
    { title: '晚餐', time: '18:00 - 19:30', type: '用餐', description: '享用当地特色美食', location: `${formData.destination}餐厅` }
  ];
  
  const lastDayActivities = [
    { title: '早餐', time: '08:00 - 09:00', type: '用餐', description: '酒店早餐', location: '酒店餐厅' },
    { title: '景点游览', time: '09:30 - 12:00', type: '观光', description: '参观当地著名景点', location: `${formData.destination}景点` },
    { title: '午餐', time: '12:30 - 14:00', type: '用餐', description: '品尝当地特色美食', location: `${formData.destination}餐厅` },
    { title: '返程', time: '16:00 - 18:00', type: '交通', description: '返回出发地', location: formData.origin }
  ];
  
  const itinerary = [];
  
  // 生成每天的行程
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    let dayActivities;
    if (i === 0) {
      dayActivities = defaultActivities;
    } else if (i === days - 1) {
      dayActivities = lastDayActivities;
    } else {
      dayActivities = secondDayActivities;
    }
    
    itinerary.push({
      day: i + 1,
      date: dateString,
      activities: dayActivities
    });
  }
  
  return {
    title: `${formData.origin}到${formData.destination}的${days}天旅行`,
    days: days,
    nights: days - 1,
    summary: {
      destination: formData.destination,
      duration: `${days}天${days - 1}晚`,
      budget: formData.budget || '中等预算',
      weather: '天气良好',
      tips: ['提前预订酒店和景点门票', '了解当地特色美食', '准备舒适的旅行装备']
    },
    itinerary: itinerary
  };
}; 