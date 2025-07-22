// 行程表单数据类型定义
export interface TripFormData {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  preferences: string;
  travelType: 'leisure' | 'adventure' | 'cultural' | 'culinary';
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  coordinates?: [number, number];
  tips?: string;
  cost?: string;
  weather?: string;
  transportation?: Transportation;
}

export interface Transportation {
  method: string;
  duration: string;
  cost: string;
}

export interface Accommodation {
  name: string;
  address: string;
  price: string;
  coordinates?: [number, number];
}

export interface Dining {
  name: string;
  cuisine: string;
  price: string;
  specialties: string[];
  address: string;
  coordinates?: [number, number];
}

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  transportation?: Transportation;
  accommodation?: Accommodation;
  dining?: Dining[];
}

export interface Summary {
  destination: string;
  duration: string;
  budget: string;
  weather?: string;
  tips?: string[];
}

export interface GeneratedTrip {
  title: string;
  days: number;
  nights: number;
  destination: {
    name: string;
    coordinates: [number, number];
  };
  itinerary: DayPlan[];
  summary: Summary;
}

import axios from 'axios';
// const mockData = {
//   title: "南京美食休闲两日游",
//   days: 2,
//   nights: 1,
//   destination: {
//     name: "南京",
//     coordinates: [118.796877, 32.060255] as [number, number],
//   },
//   itinerary: [
//     {
//       day: 1,
//       date: "2025-06-06",
//       activities: [
//         {
//           time: "09:00 - 10:30",
//           title: "夫子庙景区游览",
//           description: "游览南京标志性景点夫子庙，感受秦淮风情",
//           location: "夫子庙秦淮风光带",
//           coordinates: [118.789501, 32.018834] as [number, number],
//           tips: "建议从秦淮河畔开始游览，可以体验摇橹船",
//           cost: "120元（含船票）",
//           weather: "晴天，33℃，西南风1-3级",
//           transportation: {
//             method: "地铁3号线",
//             duration: "30分钟",
//             cost: "4元",
//           },
//         },
//         {
//           time: "11:00 - 12:30",
//           title: "老门东美食探索",
//           description: "品尝南京特色小吃",
//           location: "老门东历史街区",
//           coordinates: [118.793318, 32.016726] as [number, number],
//           tips: "必试鸭血粉丝汤和盐水鸭",
//           cost: "80元/人",
//           weather: "晴天，33℃，西南风1-3级",
//           transportation: {
//             method: "步行",
//             duration: "10分钟",
//             cost: "0元",
//           },
//         },
//         {
//           time: "14:00 - 16:00",
//           title: "总统府参观",
//           description: "参观中国近代史上重要的历史建筑",
//           location: "南京总统府",
//           coordinates: [118.792199, 32.047559] as [number, number],
//           tips: "建议提前在线预约门票",
//           cost: "40元",
//           weather: "晴转中雨，33℃-24℃",
//           transportation: {
//             method: "地铁2号线",
//             duration: "15分钟",
//             cost: "3元",
//           },
//         },
//       ],
//       transportation: {
//         method: "地铁和步行",
//         duration: "全天",
//         cost: "20元",
//       },
//       accommodation: {
//         name: "南京金鹰珠江壹号酒店",
//         address: "南京市秦淮区中华路1号",
//         price: "588元/晚",
//         coordinates: [118.792295, 32.040891] as [number, number],
//       },
//       dining: [
//         {
//           name: "南京大排档",
//           cuisine: "金陵本帮菜",
//           price: "150元/人",
//           specialties: ["盐水鸭", "鸭血粉丝汤", "干菜烧肉"],
//           address: "秦淮区瞻园路11号",
//           coordinates: [118.789876, 32.019234] as [number, number],
//         },
//       ],
//     },
//     {
//       day: 2,
//       date: "2025-06-07",
//       activities: [
//         {
//           time: "09:30 - 11:30",
//           title: "南京博物院参观",
//           description: "参观江苏省规模最大的综合性博物馆",
//           location: "南京博物院",
//           coordinates: [118.830396, 32.039596] as [number, number],
//           tips: "遇雨天最适合室内参观",
//           cost: "免费（需要预约）",
//           weather: "大雨，29℃，东风1-3级",
//           transportation: {
//             method: "地铁2号线",
//             duration: "25分钟",
//             cost: "4元",
//           },
//         },
//         {
//           time: "12:00 - 13:30",
//           title: "南京大牌档用餐",
//           description: "品尝正宗南京特色菜",
//           location: "南京大牌档湖南路店",
//           coordinates: [118.795461, 32.045971] as [number, number],
//           tips: "建议尝试狮子头和盐水鸭",
//           cost: "120元/人",
//           weather: "大雨，29℃，东风1-3级",
//           transportation: {
//             method: "地铁2号线",
//             duration: "15分钟",
//             cost: "3元",
//           },
//         },
//       ],
//       transportation: {
//         method: "地铁和步行",
//         duration: "全天",
//         cost: "15元",
//       },
//       dining: [
//         {
//           name: "马爷爷的店",
//           cuisine: "南京小吃",
//           price: "50元/人",
//           specialties: ["鸭血粉丝汤", "盐水毛豆"],
//           address: "秦淮区夫子庙贡院西街27号",
//           coordinates: [118.788543, 32.018675] as [number, number],
//         },
//       ],
//     },
//   ],
//   summary: {
//     destination: "南京",
//     duration: "2天1晚",
//     budget: "预计总支出约1200元/人",
//     weather: "第一天晴转中雨，第二天大雨",
//     tips: [
//       "建议携带雨具，第二天有大雨",
//       "夏季天气炎热，建议做好防晒",
//       "景点门票建议提前网上预订",
//       "地铁是主要交通工具，建议购买交通卡",
//     ],
//   },
// };
export const generateTripPlan = async (formData: TripFormData): Promise<GeneratedTrip> => {
  try {
    // 通过后端接口生成行程
    const response = await axios.post(
      process.env.REACT_APP_API_URL + '/trips/generate',
      formData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.data && response.data.success && response.data.data) {
      return response.data.data as GeneratedTrip;
    } else {
      throw new Error(response.data.message || '生成行程失败');
    }
  } catch (error) {
    // 兜底：本地生成一个简单行程
    console.error('生成行程规划失败:', error);
    const days = calculateDays(formData.startDate, formData.endDate);
    return generateFallbackTripPlan(formData, days);
  }
};

/**
 * 根据旅行类型获取中文描述
 * @param travelType 旅行类型
 * @returns 旅行类型的中文描述
 */
// const getTravelTypeInChinese = (travelType: string): string => {
//   switch (travelType) {
//     case 'leisure':
//       return '休闲度假';
//     case 'adventure':
//       return '探险';
//     case 'cultural':
//       return '文化体验';
//     case 'culinary':
//       return '美食之旅';
//     default:
//       return '休闲度假';
//   }
// };

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
 * 验证行程规划数据结构
 * @param tripPlan 行程规划
 */
const validateTripPlan = (tripPlan: any): void => {
  if (!tripPlan) throw new Error('行程规划为空');
  if (!tripPlan.title) throw new Error('行程规划缺少标题');
  if (!tripPlan.itinerary || !Array.isArray(tripPlan.itinerary)) {
    throw new Error('行程规划缺少行程安排或格式不正确');
  }
  
  // 确保天数正确
  if (tripPlan.days === undefined) {
    tripPlan.days = tripPlan.itinerary.length;
  }
  
  // 确保晚数正确
  if (tripPlan.nights === undefined) {
    tripPlan.nights = Math.max(0, tripPlan.days - 1);
  }
  
  // 确保每天的行程都有正确的格式
  tripPlan.itinerary.forEach((day: any) => {
    if (!day.day || !day.date || !day.activities || !Array.isArray(day.activities)) {
      throw new Error(`第 ${day.day || '未知'} 天的行程格式不正确`);
    }
  });
  
  // 确保摘要信息存在
  if (!tripPlan.summary) {
    tripPlan.summary = {
      destination: tripPlan.itinerary[0]?.activities[0]?.location || '未知目的地',
      duration: `${tripPlan.days}天${tripPlan.nights}晚`,
      budget: '根据个人消费习惯',
      weather: '请查看当地天气预报',
      tips: ['提前预订酒店和景点门票', '了解当地特色美食', '准备舒适的旅行装备']
    };
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
  
  // 根据目的地生成特定的活动内容
  const getDestinationSpecificContent = (destination: string) => {
    const dest = destination.toLowerCase();
    
    if (dest.includes('贵州') || dest.includes('贵阳') || dest.includes('黔')) {
      return {
        cityName: '贵州',
        coordinates: [106.713478, 26.578343] as [number, number],
        attractions: [
          { name: '黄果树瀑布', description: '中国最大的瀑布群', coordinates: [105.677994, 25.832899] as [number, number] },
          { name: '西江千户苗寨', description: '世界最大的苗族聚居村寨', coordinates: [108.370735, 26.587850] as [number, number] },
          { name: '荔波小七孔', description: '世界自然遗产地', coordinates: [107.874665, 25.292582] as [number, number] },
          { name: '镇远古镇', description: '历史文化名镇', coordinates: [108.429640, 27.049730] as [number, number] },
          { name: '梵净山', description: '佛教名山，世界自然遗产', coordinates: [108.656575, 27.905837] as [number, number] }
        ],
        restaurants: [
          { name: '丝娃娃店', cuisine: '贵州特色', specialties: ['丝娃娃', '酸汤鱼'], coordinates: [106.713478, 26.578343] as [number, number] },
          { name: '老凯俚酸汤鱼', cuisine: '贵州菜', specialties: ['酸汤鱼', '折耳根'], coordinates: [106.713478, 26.578343] as [number, number] },
          { name: '花溪牛肉粉', cuisine: '贵州小吃', specialties: ['牛肉粉', '豆腐圆子'], coordinates: [106.713478, 26.578343] as [number, number] }
        ],
        hotels: [
          { name: '贵阳喜来登贵航酒店', address: '贵阳市云岩区中华北路187号', price: '500-800元/晚' },
          { name: '贵阳世纪金源大饭店', address: '贵阳市南明区中山南路1号', price: '300-500元/晚' }
        ],
        weather: '贵州气候温和湿润，四季分明，适宜旅游',
        tips: [
          '贵州多山区，建议穿舒适的登山鞋',
          '当地酸辣口味较重，不习惯可提前告知',
          '苗寨参观时请尊重当地民族文化',
          '山区天气多变，建议携带雨具',
          '部分景区海拔较高，注意防寒保暖'
        ]
      };
    } else if (dest.includes('南京')) {
      return {
        cityName: '南京',
        coordinates: [118.796877, 32.060255] as [number, number],
        attractions: [
          { name: '中山陵', description: '国父陵寝', coordinates: [118.848930, 32.067850] as [number, number] },
          { name: '夫子庙', description: '秦淮风光带', coordinates: [118.788543, 32.018675] as [number, number] },
          { name: '明孝陵', description: '明朝皇帝陵墓', coordinates: [118.845663, 32.060046] as [number, number] }
        ],
        restaurants: [
          { name: '南京大牌档', cuisine: '南京菜', specialties: ['盐水鸭', '鸭血粉丝汤'], coordinates: [118.795461, 32.045971] as [number, number] }
        ],
        hotels: [
          { name: '南京金陵饭店', address: '南京市新街口', price: '400-600元/晚' }
        ],
        weather: '南京四季分明，春秋最佳',
        tips: ['建议乘坐地铁出行', '夏季炎热，注意防晒']
      };
    } else {
      // 默认通用内容
      return {
        cityName: destination,
        coordinates: [104.195397, 35.86166] as [number, number],
        attractions: [
          { name: `${destination}博物馆`, description: '了解当地历史文化', coordinates: [104.195397, 35.86166] as [number, number] },
          { name: `${destination}公园`, description: '休闲散步好去处', coordinates: [104.195397, 35.86166] as [number, number] }
        ],
        restaurants: [
          { name: `${destination}特色餐厅`, cuisine: '当地菜', specialties: ['当地特色美食'], coordinates: [104.195397, 35.86166] as [number, number] }
        ],
        hotels: [
          { name: `${destination}酒店`, address: `${destination}市中心`, price: '300-500元/晚' }
        ],
        weather: '请查看当地天气预报',
        tips: ['提前了解当地文化', '准备合适的旅行装备']
      };
    }
  };
  
  const destContent = getDestinationSpecificContent(formData.destination);
  
  // 生成活动内容
  const generateActivities = (dayIndex: number, attractions: any[], restaurants: any[]) => {
    if (dayIndex === 0) {
      // 第一天：抵达
      return [
        {
          title: `抵达${destContent.cityName}`,
          time: '14:00 - 16:00',
          type: '交通',
          description: `从${formData.origin}顺利抵达${destContent.cityName}，开启精彩旅程`,
          location: `${destContent.cityName}机场/车站`,
          coordinates: destContent.coordinates,
          cost: '根据交通方式而定'
        },
        {
          title: '酒店办理入住',
          time: '16:30 - 18:00',
          type: '住宿',
          description: '办理酒店入住手续，稍作休息整理行李',
          location: '酒店',
          coordinates: destContent.coordinates
        },
        {
          title: '当地美食初体验',
          time: '18:30 - 20:00',
          type: '用餐',
          description: `品尝${destContent.cityName}地道特色美食，感受当地风味`,
          location: restaurants[0]?.name || `${destContent.cityName}餐厅`,
          coordinates: restaurants[0]?.coordinates || destContent.coordinates,
          cost: '80-120元/人'
        }
      ];
    } else if (dayIndex === days - 1) {
      // 最后一天：返程
      return [
        {
          title: '酒店早餐时光',
          time: '08:00 - 09:00',
          type: '用餐',
          description: '享用丰盛的酒店早餐，为新的一天补充能量',
          location: '酒店餐厅',
          coordinates: destContent.coordinates
        },
        {
          title: '告别游览',
          time: '09:30 - 12:00',
          type: '观光',
          description: `最后一次领略${destContent.cityName}的美景，留下美好回忆`,
          location: attractions[Math.min(dayIndex - 1, attractions.length - 1)]?.name || `${destContent.cityName}景点`,
          coordinates: attractions[Math.min(dayIndex - 1, attractions.length - 1)]?.coordinates || destContent.coordinates,
          cost: '门票50-80元/人'
        },
        {
          title: '特产购买',
          time: '12:30 - 14:00',
          type: '购物',
          description: '购买当地特产和纪念品，为旅程画下圆满句号',
          location: `${destContent.cityName}特产店`,
          coordinates: destContent.coordinates,
          cost: '根据购买物品而定'
        },
        {
          title: '返程归家',
          time: '16:00 - 18:00',
          type: '交通',
          description: `告别美丽的${destContent.cityName}，踏上回程之路`,
          location: `${destContent.cityName}机场/车站`,
          coordinates: destContent.coordinates
        }
      ];
    } else {
      // 中间天：正常游览
      const attractionIndex = (dayIndex - 1) % attractions.length;
      const restaurantIndex = dayIndex % restaurants.length;
      
      if (destContent.cityName === '贵州') {
        // 贵州特色行程
        if (dayIndex === 1) {
          return [
            {
              title: '黄果树瀑布探索',
              time: '09:00 - 12:00',
              type: '观光',
              description: '欣赏中国最大的瀑布群，感受大自然的壮丽景观',
              location: '黄果树瀑布景区',
              coordinates: [105.677994, 25.832899],
              cost: '门票180元/人'
            },
            {
              title: '当地农家午餐',
              time: '12:30 - 14:00',
              type: '用餐',
              description: '品尝地道的贵州农家菜，体验乡村风味',
              location: '黄果树附近农家乐',
              coordinates: [105.677994, 25.832899],
              cost: '60-80元/人'
            },
            {
              title: '天星桥景区游览',
              time: '14:30 - 17:00',
              type: '观光',
              description: '漫步天然盆景园，欣赏奇石怪树和飞瀑流泉',
              location: '天星桥景区',
              coordinates: [105.677994, 25.832899]
            },
            {
              title: '苗族特色晚餐',
              time: '18:30 - 20:00',
              type: '用餐',
              description: '享用正宗苗族美食，感受民族文化魅力',
              location: '苗族特色餐厅',
              coordinates: [105.677994, 25.832899],
              cost: '100-150元/人'
            }
          ];
        } else if (dayIndex === 2) {
          return [
            {
              title: '西江千户苗寨体验',
              time: '09:00 - 12:00',
              type: '文化',
              description: '参观世界最大的苗族聚居村寨，了解苗族传统文化',
              location: '西江千户苗寨',
              coordinates: [108.370735, 26.587850],
              cost: '门票100元/人'
            },
            {
              title: '苗寨长桌宴',
              time: '12:30 - 14:00',
              type: '用餐',
              description: '参与苗族传统长桌宴，品尝酸汤鱼等特色美食',
              location: '苗寨内餐厅',
              coordinates: [108.370735, 26.587850],
              cost: '120-180元/人'
            },
            {
              title: '苗族歌舞表演',
              time: '14:30 - 16:30',
              type: '文化',
              description: '观看精彩的苗族歌舞表演，感受浓郁的民族风情',
              location: '苗寨表演广场',
              coordinates: [108.370735, 26.587850],
              cost: '表演票80元/人'
            },
            {
              title: '苗寨夜景漫步',
              time: '19:00 - 21:00',
              type: '观光',
              description: '欣赏千户苗寨璀璨夜景，感受梦幻般的灯火辉煌',
              location: '观景台',
              coordinates: [108.370735, 26.587850]
            }
          ];
        } else {
          return [
            {
              title: '荔波小七孔探秘',
              time: '09:00 - 12:00',
              type: '观光',
              description: '游览世界自然遗产地，欣赏如诗如画的山水风光',
              location: '荔波小七孔景区',
              coordinates: [107.874665, 25.292582],
              cost: '门票130元/人'
            },
            {
              title: '布依族风味午餐',
              time: '12:30 - 14:00',
              type: '用餐',
              description: '品尝布依族传统美食，体验不同的民族风味',
              location: '布依族餐厅',
              coordinates: [107.874665, 25.292582],
              cost: '70-100元/人'
            },
            {
              title: '卧龙潭漂流',
              time: '14:30 - 17:00',
              type: '娱乐',
              description: '体验刺激的漂流项目，在清澈的溪水中感受清凉',
              location: '卧龙潭',
              coordinates: [107.874665, 25.292582],
              cost: '漂流150元/人'
            },
            {
              title: '当地特色晚餐',
              time: '18:30 - 20:00',
              type: '用餐',
              description: '享用贵州特色菜肴，品尝折耳根、丝娃娃等美味',
              location: '当地餐厅',
              coordinates: [107.874665, 25.292582],
              cost: '80-120元/人'
            }
          ];
        }
      } else {
        // 通用行程模板
        return [
          {
            title: `${attractions[attractionIndex]?.name || destContent.cityName + '文化探索'}`,
            time: '09:00 - 12:00',
            type: '观光',
            description: attractions[attractionIndex]?.description || '深入了解当地历史文化，感受城市独特魅力',
            location: attractions[attractionIndex]?.name || `${destContent.cityName}文化景点`,
            coordinates: attractions[attractionIndex]?.coordinates || destContent.coordinates,
            cost: '门票80-120元/人'
          },
          {
            title: '地道美食体验',
            time: '12:30 - 14:00',
            type: '用餐',
            description: '品尝当地知名特色菜肴，享受地道的美食文化',
            location: restaurants[restaurantIndex]?.name || `${destContent.cityName}特色餐厅`,
            coordinates: restaurants[restaurantIndex]?.coordinates || destContent.coordinates,
            cost: '80-120元/人'
          },
          {
            title: `${destContent.cityName}深度游览`,
            time: '14:30 - 17:30',
            type: '观光',
            description: '深入探索城市魅力，发现隐藏的美丽角落',
            location: attractions[Math.min(attractionIndex + 1, attractions.length - 1)]?.name || `${destContent.cityName}特色景点`,
            coordinates: attractions[Math.min(attractionIndex + 1, attractions.length - 1)]?.coordinates || destContent.coordinates
          },
          {
            title: '休闲晚餐时光',
            time: '18:30 - 20:00',
            type: '用餐',
            description: '在轻松的氛围中享用晚餐，回味一天的精彩经历',
            location: restaurants[(restaurantIndex + 1) % restaurants.length]?.name || `${destContent.cityName}餐厅`,
            coordinates: restaurants[(restaurantIndex + 1) % restaurants.length]?.coordinates || destContent.coordinates,
            cost: '100-150元/人'
          }
        ];
      }
    }
  };
  
  const itinerary: DayPlan[] = [];
  
  // 生成每天的行程
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    const dayActivities = generateActivities(i, destContent.attractions, destContent.restaurants);
    
    // 生成住宿信息（除了最后一天）
    const accommodation = i < days - 1 ? {
      name: destContent.hotels[i % destContent.hotels.length]?.name || `${destContent.cityName}酒店`,
      address: destContent.hotels[i % destContent.hotels.length]?.address || `${destContent.cityName}市中心`,
      price: destContent.hotels[i % destContent.hotels.length]?.price || '300-500元/晚',
      coordinates: destContent.coordinates
    } : undefined;
    
    // 生成餐饮推荐
    const dining = destContent.restaurants.slice(0, 2).map((restaurant, index) => ({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      price: '80-150元/人',
      specialties: restaurant.specialties,
      address: `${destContent.cityName}市区`,
      coordinates: restaurant.coordinates
    }));
    
    const dayPlan: DayPlan = {
      day: i + 1,
      date: dateString,
      activities: dayActivities
    };
    
    if (accommodation) {
      dayPlan.accommodation = accommodation;
    }
    
    if (dining.length > 0) {
      dayPlan.dining = dining;
    }
    
    itinerary.push(dayPlan);
  }
  
  return {
    title: `${destContent.cityName}探险之旅：山水画卷中的奇幻冒险`,
    days: days,
    nights: days - 1,
    destination: {
      name: destContent.cityName,
      coordinates: destContent.coordinates
    },
    itinerary: itinerary,
    summary: {
      destination: destContent.cityName,
      duration: `${days}天${days - 1}晚`,
      budget: formData.budget || `预计${days * 800}元/人`,
      weather: destContent.weather,
      tips: destContent.tips
    }
  };
}; 