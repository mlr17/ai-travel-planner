/**
 * 行程表单数据类型定义
 */
export interface TripFormData {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  preferences: string;
  travelType: 'leisure' | 'adventure' | 'cultural' | 'culinary';
}

/**
 * 活动接口
 */
export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  coordinates?: [number, number];
  tips?: string;
  cost?: string;
}

/**
 * 交通接口
 */
export interface Transportation {
  method: string;
  duration: string;
  cost?: string;
}

/**
 * 住宿接口
 */
export interface Accommodation {
  name: string;
  address: string;
  price: string;
  coordinates?: [number, number];
}

/**
 * 餐饮接口
 */
export interface Dining {
  name: string;
  cuisine: string;
  price: string;
  specialties?: string;
  coordinates?: [number, number];
}

/**
 * 每日计划接口
 */
export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  transportation?: Transportation;
  accommodation?: Accommodation;
  dining?: Dining[];
}

/**
 * 行程总结接口
 */
export interface Summary {
  destination: string;
  duration: string;
  budget: string;
  weather?: string;
  tips?: string[];
}

/**
 * 生成的行程接口
 */
export interface GeneratedTrip {
  title: string;
  days: number;
  nights: number;
  destination?: {
    name: string;
    coordinates: [number, number];
  };
  itinerary: DayPlan[];
  summary: Summary;
} 