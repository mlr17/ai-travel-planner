import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faWallet, 
  faHome, 
  faSun, 
  faCloud, 
  faMoon,
  faInfoCircle,
  faCommentDots,
  faSuitcase,
  faCloudSun,
  faBed,
  faUtensils,
  faCamera,
  faSave,
  faCheck,
  faPlane,
  faTrain,
  faBus,
  faTaxi,
  faCar,
  faMoneyBillWave,
  faTicketAlt,
  faHotel,
  faLink,
  faShoppingBag,
  faSubway,
  faRoad
} from '@fortawesome/free-solid-svg-icons';
import { useTripContext, SavedTrip } from '../contexts/TripContext';
import '../styles/travelPlan.scss';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

// 重新添加全局Window接口定义
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
    initAMap: () => void;
  }
}

/**
 * 声明AMap类型，解决TypeScript类型检查问题
 */
declare namespace AMap {
  class Map {
    constructor(container: string | HTMLElement, options?: any);
    setZoom(zoom: number): void;
    setCenter(center: LngLat): void;
    getCenter(): LngLat;
    setMapStyle(style: string): void;
    plugin(pluginList: string[], callback: Function): void;
    getCity(callback: Function): void;
    on(event: string, handler: Function): void;
    remove(overlay: any | Array<any>): void;
    getAllOverlays(type?: string): Array<any>;
    setFitView(overlays?: Array<any>, padding?: Array<number>, immediately?: boolean, avoid?: Array<number>): void;
    clearInfoWindow(): void;
  }
  
  class LngLat {
    constructor(lng: number, lat: number);
    getLng(): number;
    getLat(): number;
  }
  
  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LngLat;
    setPosition(position: LngLat): void;
    on(event: string, handler: Function): void;
    setLabel(label: any): void;
    getContent(): any;
    setContent(content: string | HTMLElement): void;
    hide(): void;
    show(): void;
  }
  
  class Text {
    constructor(options: TextOptions);
    setMap(map: Map | null): void;
    getContent(): HTMLElement;
  }
  
  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, position: LngLat | Array<number>): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
  }
  
  class Pixel {
    constructor(x: number, y: number);
  }
  
  class Bounds {
    constructor(southWest: Array<number> | LngLat, northEast: Array<number> | LngLat);
    contains(point: LngLat): boolean;
    extend(point: LngLat): void;
  }
  
  class MouseTool {
    constructor(map: Map);
    marker(): void;
    close(clear?: boolean): void;
    on(event: string, handler: Function): void;
  }
  
  class Polyline {
    constructor(options: PolylineOptions);
    setMap(map: Map | null): void;
    getPath(): Array<LngLat>;
    setPath(path: Array<LngLat>): void;
    hide(): void;
    show(): void;
  }
  
  interface MarkerOptions {
    position?: LngLat;
    map?: Map;
    offset?: Pixel;
    icon?: string | Icon;
    content?: string | HTMLElement;
    topWhenClick?: boolean;
    extData?: any;
    clickable?: boolean;
    draggable?: boolean;
    visible?: boolean;
    zIndex?: number;
    angle?: number;
    label?: { content: string; offset: Pixel };
    title?: string;
  }
  
  interface TextOptions {
    text?: string;
    position?: LngLat;
    map?: Map;
    offset?: Pixel;
    style?: any;
  }
  
  interface InfoWindowOptions {
    content?: string | HTMLElement;
    position?: LngLat;
    offset?: Pixel;
    size?: Size;
    autoMove?: boolean;
    closeWhenClickMap?: boolean;
  }
  
  class Icon {
    constructor(options: IconOptions);
  }
  
  interface IconOptions {
    size?: Size;
    imageSize?: Size;
    imageOffset?: Pixel;
    image?: string;
  }
  
  class Size {
    constructor(width: number, height: number);
  }
  
  interface PolylineOptions {
    path?: Array<LngLat>;
    map?: Map;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    strokeStyle?: string;
    isOutline?: boolean;
    outlineColor?: string;
    borderWeight?: number;
    lineJoin?: string;
    lineCap?: string;
    zIndex?: number;
  }
}

// 添加message类型用于显示通知
interface Message {
  error(content: string, duration?: number): void;
  success(content: string, duration?: number): void;
  warning(content: string, duration?: number): void;
  info(content: string, duration?: number): void;
}

declare const message: Message;

// 添加 TripPlan 类型定义
interface TripPlan {
  id?: string;
  title: string;
  days: number;   // 添加days属性
  nights: number; // 添加nights属性
  startDate?: string;
  endDate?: string;
  destination?: {
    name: string;
    coordinates: [number, number];
  };
  itinerary: Array<{     // 从dailyPlans更名为itinerary
    day: number;
    date: string;
    activities: Array<{
      id?: string;
      title: string;
      time: string;
      type?: string;
      description?: string;
      notes?: string;
      coordinates?: [number, number];
      location?: string;
      cost?: string;
      tips?: string;
      weather?: string;
      transportation?: {
        method: string;
        duration: string;
        cost: string;
      };
      dining?: Array<{
        name: string;
        specialties: string;
        price: string;
        address?: string;
      }>;
    }>;
    transportation?: {
      method: string;
      duration: string;
      cost: string;
    };
    accommodation?: {
      name: string;
      address: string;
      price: string;
      coordinates?: [number, number];
    };
    dining?: Array<{
      name: string;
      cuisine?: string;
      price: string;
      specialties: string;
      address?: string;
      coordinates?: [number, number];
    }>;
  }>;
  summary: {   // 添加summary字段
    destination: string;
    duration: string;
    budget: string;
    weather?: string;
    tips?: string[];
  };
}

// 修改TripActivity接口，确保与Activity类型兼容
interface TripActivity {
  activityName: string;
  activityTime?: string;
  activityLocation?: string;
  activityDescription?: string;
  
  // 添加Activity类型可能使用的属性
  title?: string;
  time?: string;
  location?: string;
  description?: string;
  weather?: string;
  transportation?: {
    method: string;
    duration: string;
    cost: string;
  };
}

// 使用高德地图JS SDK中的Geocoder组件进行地理编码
const getGeocodeFromAMapSDK = (address: string): Promise<{ lng: number, lat: number }> => {
  return new Promise((resolve, reject) => {
    if (!window.AMap) {
      reject(new Error('AMap SDK未加载'));
      return;
    }
    
    // 创建地理编码实例
    const geocoder = new window.AMap.Geocoder({
      city: "", // 全国范围内查询
      radius: 1000 // 设置较大搜索半径
    });
    
    // 开始地理编码
    geocoder.getLocation(address, (status: string, result: any) => {
      if (status === 'complete' && result.geocodes.length) {
        const location = result.geocodes[0].location;
        resolve({
          lng: location.lng,
          lat: location.lat
        });
      } else {
        reject(new Error('地理编码失败: ' + status));
      }
    });
  });
};

const TravelPlan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { tripPlan, formData, saveTrip, savedTrips, getSavedTrip } = useTripContext();
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const [currentTripPlan, setCurrentTripPlan] = useState(tripPlan);
  const [currentFormData, setCurrentFormData] = useState(formData);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const mouseTool = useRef<any>(null);
  const mapMarkers = useRef<any[]>([]);
  const mapPolylines = useRef<any[]>([]);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 在TravelPlan组件内添加保存地图标记和路线的状态
  const [markersByDay, setMarkersByDay] = useState<Record<number, AMap.Marker[]>>({});
  const [labelsByDay, setLabelsByDay] = useState<Record<number, AMap.Marker[]>>({});
  const [polylinesByDay, setPolylinesByDay] = useState<Record<number, any>>({});
  const [allMarkers, setAllMarkers] = useState<AMap.Marker[]>([]);

  // 从URL参数获取行程数据
  useEffect(() => {
    console.log("Travel Plan: ID parameter received:", id);
    console.log("Travel Plan: Current context data:", { tripPlan, formData });
    
    if (id) {
      if (id.startsWith('temp-')) {
        // 临时ID，表示刚从创建页面生成的行程，直接使用上下文中的数据
        console.log("Travel Plan: Using context data for temp ID");
        if (tripPlan && formData) {
          setCurrentTripPlan(tripPlan);
          setCurrentFormData(formData);
        } else {
          console.error("Travel Plan: No trip data in context for temp ID");
          navigate('/create');
        }
      } else {
        // 正常ID，从已保存行程中查找
        console.log("Travel Plan: Looking for saved trip with ID:", id);
        const savedTrip = getSavedTrip(id);
        if (savedTrip) {
          console.log("Travel Plan: Found saved trip:", savedTrip.title);
          setCurrentTripPlan(savedTrip.tripPlan);
          setCurrentFormData(savedTrip.formData);
          setIsAlreadySaved(true);
        } else if (!tripPlan || !formData) {
          // 如果找不到保存的行程，且上下文中没有行程数据，返回首页
          console.error("Travel Plan: No saved trip found and no context data");
          navigate('/');
        } else {
          // 找不到保存的行程，但上下文中有数据
          console.log("Travel Plan: No saved trip found, using context data");
          setCurrentTripPlan(tripPlan);
          setCurrentFormData(formData);
        }
      }
    } else {
      console.error("Travel Plan: No ID parameter");
    }
  }, [id, getSavedTrip, navigate, tripPlan, formData]);

  // 检查是否有行程数据，如果没有则返回创建页面
  useEffect(() => {
    if (!currentTripPlan || !currentFormData) {
      console.error("Travel Plan: No trip data available, redirecting to create page");
      navigate('/create');
    } else {
      console.log("Travel Plan: Trip data loaded successfully", { 
        title: currentTripPlan.title,
        days: currentTripPlan.days,
        destination: currentFormData.destination
      });
    }
  }, [currentTripPlan, currentFormData, navigate]);

  // 检查行程是否已保存
  useEffect(() => {
    if (currentTripPlan && savedTrips) {
      // 检查当前行程是否已经保存过
      const tripExists = savedTrips.some(
        (trip) => trip.tripPlan.title === currentTripPlan.title && 
                  trip.formData.destination === currentFormData?.destination &&
                  trip.formData.startDate === currentFormData?.startDate
      );
      setIsAlreadySaved(tripExists);
    }
  }, [currentTripPlan, currentFormData, savedTrips]);

  // 加载高德地图脚本
  useEffect(() => {
    console.log("Travel Plan: Setting up AMap");
    
    // 设置高德地图安全配置
    window._AMapSecurityConfig = {
      securityJsCode: 'e6d0a1a9a9a6bdf8e45dc40c41d36d16'
    };

    // 定义回调函数
    window.initAMap = () => {
      console.log("Travel Plan: AMap initialization callback triggered");
      setMapLoaded(true);
    };

    const loadAMapScript = () => {
      console.log("Travel Plan: Starting to load AMap script");
      
      if (typeof window.AMap !== 'undefined') {
        console.log("Travel Plan: AMap already loaded");
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?v=2.0&key=99d2c85b99831da3254233f32b1e2a68&callback=initAMap';
      
      script.onload = () => {
        console.log("Travel Plan: AMap script loaded successfully");
      };
      
      script.onerror = (error) => {
        console.error('Travel Plan: AMap script loading failed', error);
        showStaticMap();
      };
      
      document.head.appendChild(script);
      console.log("Travel Plan: AMap script added to document head");
    };

    loadAMapScript();

    // 添加淡入效果
    const fadeElements = document.querySelectorAll('.fade-in');
    console.log(`Travel Plan: Found ${fadeElements.length} fade-in elements`);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });
    
    fadeElements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      // 卸载时清理observer
      observer.disconnect();
      console.log("Travel Plan: Cleaned up IntersectionObserver");
    };
  }, []);

  // 在地图加载完成后初始化地图
  useEffect(() => {
    console.log("Travel Plan: Map loaded state change:", { 
      mapLoaded, 
      mapInitialized, 
      hasCurrentTripPlan: !!currentTripPlan 
    });
    
    if (mapLoaded && !mapInitialized && currentTripPlan) {
      console.log("Travel Plan: Calling initMap()");
      initMap();
    }
  }, [mapLoaded, mapInitialized, currentTripPlan]);

  // 显示静态地图
  const showStaticMap = () => {
    const mapLoading = document.getElementById('mapLoading');
    const staticMap = document.getElementById('staticMap');
    
    if (mapLoading) mapLoading.style.display = 'none';
    if (staticMap) staticMap.style.display = 'block';
  };

  const findPresetCoordinates = (address: string): { lng: number, lat: number } | null => {
    // 预设一些热门景点的坐标
    const presetLocations: Record<string, { lng: number, lat: number }> = {
      '故宫': { lng: 116.397428, lat: 39.908823 },
      '长城': { lng: 116.570374, lat: 40.431908 },
      '西湖': { lng: 120.143441, lat: 30.236144 },
      '黄山': { lng: 118.141521, lat: 30.272546 },
      '三亚': { lng: 109.511861, lat: 18.252865 },
      '张家界': { lng: 110.479918, lat: 29.117096 },
      '泰山': { lng: 117.095527, lat: 36.267422 },
      '颐和园': { lng: 116.275548, lat: 39.99818 },
      '香山': { lng: 116.184185, lat: 40.057611 },
      '八达岭': { lng: 116.024067, lat: 40.354591 },
      '鸟巢': { lng: 116.3907, lat: 39.9915 },
      '水立方': { lng: 116.3897, lat: 39.9932 },
      '天坛': { lng: 116.414339, lat: 39.882364 },
      '长隆': { lng: 113.329579, lat: 23.000286 },
      '迪士尼': { lng: 121.656999, lat: 31.162649 },
      '陆家嘴': { lng: 121.501461, lat: 31.239204 },
      '外滩': { lng: 121.490148, lat: 31.236177 },
      '环球': { lng: 121.369739, lat: 31.149058 },
      '峨眉山': { lng: 103.484467, lat: 29.520548 },
      '春熙路': { lng: 104.084998, lat: 30.655822 },
      '武侯祠': { lng: 104.05145, lat: 30.642854 },
      '大唐不夜城': { lng: 108.970057, lat: 34.222772 },
      '兵马俑': { lng: 109.278627, lat: 34.381961 },
      '华山': { lng: 110.089232, lat: 34.565153 },
      '丽江古城': { lng: 100.241369, lat: 26.876189 },
      '玉龙雪山': { lng: 100.182002, lat: 27.101405 },
      '乐山大佛': { lng: 103.770479, lat: 29.547899 },
      '九寨沟': { lng: 103.925819, lat: 33.160029 },
      '滇池': { lng: 102.665486, lat: 24.967962 },
      '石林': { lng: 103.325007, lat: 24.77185 }
    };
    
    // 检查地址是否包含预设地点
    for (const [key, value] of Object.entries(presetLocations)) {
      if (address.includes(key)) {
        return value;
      }
    }
    
    return null;
  };

  // 为目的地获取基础地理位置
  const getBaseLocationForDestination = (destination: string): { lng: number, lat: number } => {
    // 中国主要城市坐标
    const cityLocations: Record<string, { lng: number, lat: number }> = {
      '北京': { lng: 116.407526, lat: 39.90403 },
      '上海': { lng: 121.473701, lat: 31.230416 },
      '广州': { lng: 113.264434, lat: 23.129162 },
      '深圳': { lng: 114.057868, lat: 22.543099 },
      '杭州': { lng: 120.155070, lat: 30.274084 },
      '南京': { lng: 118.796877, lat: 32.060255 },
      '武汉': { lng: 114.305392, lat: 30.593098 },
      '成都': { lng: 104.066801, lat: 30.572961 },
      '重庆': { lng: 106.551556, lat: 29.563009 },
      '西安': { lng: 108.948024, lat: 34.263161 },
      '青岛': { lng: 120.383428, lat: 36.105215 },
      '厦门': { lng: 118.089425, lat: 24.479833 },
      '大连': { lng: 121.614682, lat: 38.914003 },
      '苏州': { lng: 120.58576, lat: 31.299379 },
      '三亚': { lng: 109.511861, lat: 18.252865 },
      '丽江': { lng: 100.227750, lat: 26.855047 },
      '拉萨': { lng: 91.1170031, lat: 29.647951 },
      '大理': { lng: 100.267638, lat: 25.606486 },
      '张家界': { lng: 110.479918, lat: 29.117096 },
      '香港': { lng: 114.165460, lat: 22.275340 },
      '澳门': { lng: 113.543028, lat: 22.186835 },
      '台北': { lng: 121.520076, lat: 25.030724 },
      '昆明': { lng: 102.833221, lat: 24.883738 },
      '桂林': { lng: 110.290194, lat: 25.273566 },
      '西宁': { lng: 101.778228, lat: 36.617144 },
      '海口': { lng: 110.199890, lat: 20.044220 },
      '哈尔滨': { lng: 126.535797, lat: 45.802158 },
      '长白山': { lng: 127.505825, lat: 42.032289 },
      '敦煌': { lng: 94.661967, lat: 40.142128 },
      '西藏': { lng: 91.1170031, lat: 29.647951 },
      '贵州': { lng: 106.713478, lat: 26.578343 },
      '贵阳': { lng: 106.713478, lat: 26.578343 },
      '遵义': { lng: 107.297104, lat: 27.725654 },
      '安顺': { lng: 105.932188, lat: 26.245544 },
      '黄果树': { lng: 105.677994, lat: 25.832899 },
      '荔波': { lng: 107.874665, lat: 25.292582 },
      '镇远': { lng: 108.429640, lat: 27.049730 },
      '梵净山': { lng: 108.656575, lat: 27.905837 },
      '西江': { lng: 108.370735, lat: 26.587850 }
    };
    
    // 检查目的地是否为已知城市
    for (const [key, value] of Object.entries(cityLocations)) {
      if (destination.includes(key)) {
        return value;
      }
    }
    
    // 默认返回中国中心点
    return { lng: 104.195397, lat: 35.86166 };
  };

  // 初始化地图
  const initMap = () => {
    if (!currentTripPlan || mapInitialized) return;

    try {
      console.log('正在初始化地图...');
      setMapInitialized(true);
      
      // 确定地图中心点
      let centerLng = 104.195397;
      let centerLat = 35.86166;
      let initialZoom = 7;
      
      // 优先使用目的地坐标
      if (currentTripPlan.destination && currentTripPlan.destination.coordinates) {
        centerLng = currentTripPlan.destination.coordinates[0];
        centerLat = currentTripPlan.destination.coordinates[1];
        initialZoom = 11; // 更适合城市级别的缩放
        console.log(`使用目的地坐标作为地图中心点: [${centerLng}, ${centerLat}]`);
      } else if (currentFormData?.destination) {
        // 尝试从预设地点获取坐标
        const baseLocation = getBaseLocationForDestination(currentFormData.destination);
        centerLng = baseLocation.lng;
        centerLat = baseLocation.lat;
        console.log(`使用目的地名称获取的坐标作为地图中心点: [${centerLng}, ${centerLat}]`);
      }
      
      // 创建地图实例
      const newMap = new window.AMap.Map('map', {
        zoom: initialZoom,
        center: [centerLng, centerLat],
        viewMode: '2D', // 使用2D视图，更容易看清标记
        mapStyle: isDarkMode ? 'amap://styles/dark' : 'amap://styles/normal',
        resizeEnable: true,
        jogEnable: true,
        animateEnable: true,
        showIndoorMap: false,
        showBuildingBlock: true
      });
      
      mapInstance.current = newMap;
      setMap(newMap);
      
      // 添加初始化完成事件
      newMap.on('complete', function() {
        console.log('地图初始化完成');
        const mapLoading = document.getElementById('mapLoading');
        if (mapLoading) mapLoading.style.display = 'none';
        
        // 先初始化地图中心点
        initializeMapMarkers();
        
        // 地图初始化完成后，添加标记
        if (currentTripPlan) {
          try {
            setTimeout(() => {
              setupMapMarkersAndRoutes().catch(error => {
                console.error('设置地图标记和路线失败:', error);
                // 即使失败也至少初始化地图中心点
                initializeMapMarkers();
              });
            }, 500);
          } catch (error) {
            console.error('启动地图标记设置失败:', error);
            initializeMapMarkers();
          }
        }
      });
      
      newMap.on('error', function(e) {
        console.error('地图加载错误', e);
        showStaticMap();
      });
      
      // 添加控件
      newMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geocoder', 'AMap.ControlBar'], function() {
        console.log('地图控件和地理编码服务加载完成');
        
        // 添加工具条
        newMap.addControl(new window.AMap.ToolBar({
          position: 'RT',
          ruler: false,
          direction: false  // 不显示指南针
        }));
        
        // 添加比例尺
        newMap.addControl(new window.AMap.Scale({
          position: 'LB'
        }));
        
        // 添加3D视角控制条
        newMap.addControl(new window.AMap.ControlBar({
          position: {
            right: '10px',
            top: '120px'
          }
        }));
      });
      
      // 注册地图点击事件，方便调试
      newMap.on('click', function(e) {
        console.log('地图点击位置:', e.lnglat.getLng(), e.lnglat.getLat());
      });
      
    } catch (error) {
      console.error('地图初始化失败:', error);
      showStaticMap();
    }
  };

  // 返回创建页面
  const handleBackToCreate = () => {
    navigate('/create');
  };

  // 切换暗黑模式
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    if (!isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  // 获取日期的星期
  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekdays[date.getDay()];
  };

  // 保存行程到首页
  const handleSaveTrip = () => {
    if (!currentTripPlan || !currentFormData) return;

    // 计算行程中有多少个地点
    const places = currentTripPlan.itinerary.reduce((total, day) => total + day.activities.length, 0);
    
    // 构建保存的行程数据
    const savedTrip: SavedTrip = {
      id: uuidv4(), // 生成唯一ID
      title: currentTripPlan.title.replace(/[：:]/g, '｜'),
      days: currentTripPlan.days,
      nights: currentTripPlan.nights,
      places: places,
      // 使用目的地名称获取相关图片
      image: `https://source.unsplash.com/featured/200x200?${encodeURIComponent(currentFormData.destination)}`,
      formData: currentFormData,
      tripPlan: {
        ...currentTripPlan,
        title: currentTripPlan.title.replace(/[：:]/g, '｜')
      }
    };
    
    // 保存到上下文
    saveTrip(savedTrip);
    
    // 显示成功通知
    setShowSaveNotification(true);
    
    // 更新保存状态
    setIsAlreadySaved(true);
    
    // 在通知显示一段时间后跳转到首页
    setTimeout(() => {
      setShowSaveNotification(false);
      navigate('/');
    }, 1500);
  };

  // 格式化时间显示函数
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return `<div class="time-display">${timeString}</div>`;
  };

  // 清除地图上的所有标记
  const clearMapMarkers = () => {
    if (mapMarkers.current.length > 0) {
      mapMarkers.current.forEach(marker => {
          marker.setMap(null);
      });
      mapMarkers.current = [];
    }
  };

  // 清除地图上的所有标记和路线
  const clearMapMarkersAndRoutes = () => {
    // 清除所有标记和路线
    Object.keys(markersByDay).forEach(day => {
      const dayNum = parseInt(day);
      if (markersByDay[dayNum]) {
        markersByDay[dayNum].forEach(marker => {
          marker.setMap(null);
        });
      }
      
      if (labelsByDay[dayNum]) {
        labelsByDay[dayNum].forEach(label => {
          label.setMap(null);
        });
      }
      
      if (polylinesByDay[dayNum]) {
        polylinesByDay[dayNum].setMap(null);
      }
    });
    
    // 重置状态
    setMarkersByDay({});
    setLabelsByDay({});
    setPolylinesByDay({});
    setAllMarkers([]);
  };

  // 添加处理天数标签点击的函数
  const handleDayTabClick = (dayNumber: number) => {
    if (!mapInstance.current) return;
    
    console.log(`切换到第${dayNumber}天的标记`, { 
      markersByDay,
      dayNumber
    });
        
        // 隐藏所有标记点和路线
    Object.keys(markersByDay).forEach(day => {
      const dayNum = parseInt(day);
      if (markersByDay[dayNum]) {
          markersByDay[dayNum].forEach(marker => {
          marker.hide();
          });
      }
          
      if (labelsByDay[dayNum]) {
          labelsByDay[dayNum].forEach(label => {
          label.hide();
          });
      }
          
          if (polylinesByDay[dayNum]) {
        polylinesByDay[dayNum].hide();
      }
    });
    
    // 显示特定天的标记和路线
    if (markersByDay[dayNumber]) {
      markersByDay[dayNumber].forEach(marker => {
        marker.show();
      });
    }
    
    if (labelsByDay[dayNumber]) {
      labelsByDay[dayNumber].forEach(label => {
        label.show();
      });
    }
    
    if (polylinesByDay[dayNumber]) {
      polylinesByDay[dayNumber].show();
        }
        
        // 调整视图以显示所有可见标记
    if (markersByDay[dayNumber] && markersByDay[dayNumber].length > 0) {
      console.log(`设置地图视图以适应第${dayNumber}天的标记`, markersByDay[dayNumber]);
      try {
        mapInstance.current.setFitView(markersByDay[dayNumber]);
      } catch (e) {
        console.error('调整地图视图失败', e);
      }
    }
  };

  // 添加CSS样式到文档，为自定义标记提供样式
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .custom-marker {
        width: 24px;
        height: 24px;
        background-color: ${isDarkMode ? '#3366DD' : '#3366CC'};
        border: 2px solid white;
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        color: white;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .custom-marker:hover {
        transform: scale(1.2);
        background-color: ${isDarkMode ? '#4488FF' : '#4488DD'};
      }
      
      .custom-marker.auto-layout {
        background-color: ${isDarkMode ? '#DD5555' : '#CC5555'};
      }
      
      .custom-marker-label {
        background-color: ${isDarkMode ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
        color: ${isDarkMode ? '#FFFFFF' : '#333333'};
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap;
        border: 1px solid ${isDarkMode ? 'rgba(60, 60, 60, 0.8)' : 'rgba(230, 230, 230, 0.8)'};
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      .info-window {
        min-width: 200px;
        max-width: 300px;
      }
      
      .info-window-title {
        font-weight: 500;
        font-size: 14px;
        padding-bottom: 5px;
        border-bottom: 1px solid #eee;
        margin-bottom: 5px;
      }
      
      .info-window-body {
        font-size: 12px;
        color: #666;
      }
      
      .info-window-body p {
        margin-bottom: 3px;
      }
      
      .auto-layout-notice {
        color: #CC5555;
        font-style: italic;
        margin-top: 5px;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [isDarkMode]);

  // 添加一个初始化标记的函数，确保即使地理编码失败也能显示标记
  const initializeMapMarkers = () => {
    if (!mapInstance.current || !currentTripPlan) return;
    
    console.log('初始化地图标记...');
    
    // 设置地图中心点到目的地
    if (currentFormData?.destination) {
      const baseLocation = getBaseLocationForDestination(currentFormData.destination);
      const centerPoint = new AMap.LngLat(baseLocation.lng, baseLocation.lat);
      mapInstance.current.setCenter(centerPoint);
      mapInstance.current.setZoom(9); // 设置一个合适的缩放级别
      
      console.log(`已将地图中心设置到目的地: [${baseLocation.lng}, ${baseLocation.lat}]`);
    }
  };

  // 优化setupMapMarkersAndRoutes函数
  const setupMapMarkersAndRoutes = async () => {
    if (!mapInstance.current || !currentTripPlan) {
      console.error('地图实例或行程数据不存在，无法设置标记');
      return;
    }
    
    console.log('设置地图标记和路线...');
    console.log('行程数据:', currentTripPlan);
    
    // 清除之前的标记和路线
    clearMapMarkersAndRoutes();
    
    // 设置超时处理，确保函数不会无限等待
    const setupTimeout = setTimeout(() => {
      console.warn('设置地图标记和路线超时，使用备用方法');
      initializeMapMarkers();
    }, 10000); // 10秒超时
    
    try {
      let hasAutoLayoutMarkers = false;
      const newMarkersByDay: Record<number, AMap.Marker[]> = {};
      const newLabelsByDay: Record<number, AMap.Marker[]> = {};
      const newPolylinesByDay: Record<number, any> = {};
      const newAllMarkers: AMap.Marker[] = [];
      
      // 如果有目的地坐标，先初始化地图中心点
      if (currentTripPlan.destination && currentTripPlan.destination.coordinates) {
        const [lng, lat] = currentTripPlan.destination.coordinates;
        console.log(`设置地图中心到目的地坐标: [${lng}, ${lat}]`);
        const centerPoint = new AMap.LngLat(lng, lat);
        mapInstance.current.setCenter(centerPoint);
        mapInstance.current.setZoom(11); // 设置一个合适的缩放级别
      }
      
      // 遍历每天的活动
      for (let dayIndex = 0; dayIndex < currentTripPlan.itinerary.length; dayIndex++) {
        const day = currentTripPlan.itinerary[dayIndex];
        const dayNumber = day.day; // 使用day.day而不是dayIndex + 1
        
        console.log(`处理第${dayNumber}天的活动`, day);
        
        newMarkersByDay[dayNumber] = [];
        newLabelsByDay[dayNumber] = [];
        
        const dayPoints: Array<{
          name: string;
          position: [number, number];
          desc: string;
          activity: any;
          isAutoLayout?: boolean;
        }> = [];
        
        // 为每个活动获取地理位置信息
        for (let activityIndex = 0; activityIndex < day.activities.length; activityIndex++) {
          const activity = day.activities[activityIndex];
          
          console.log(`处理活动: ${activity.title}`, activity);
          
          try {
            // 优先使用活动中已有的坐标信息
            if (activity.coordinates && Array.isArray(activity.coordinates) && activity.coordinates.length === 2) {
              console.log(`使用活动自带的坐标: [${activity.coordinates[0]}, ${activity.coordinates[1]}]`);
              
              dayPoints.push({
                name: activity.title,
                position: [activity.coordinates[0], activity.coordinates[1]],
                desc: activity.description || '',
                activity: {
                  activityName: activity.title,
                  activityTime: activity.time,
                  activityLocation: activity.location,
                  activityDescription: activity.description
                }
              });
              continue; // 已有坐标，跳过后续地理编码步骤
            }
            
            // 如果没有坐标，尝试地理编码
            let addressStr = activity.location || '';
            
            // 如果有目的地信息，拼接到地址中增加准确性
            if (currentFormData?.destination && !addressStr.includes(currentFormData.destination)) {
              addressStr = currentFormData.destination + ' ' + addressStr;
            }
            
            if (!addressStr) {
              console.warn(`活动 "${activity.title}" 没有位置信息，将尝试使用标题作为位置`);
              // 如果没有地址，尝试使用活动标题作为地址
              addressStr = activity.title;
              if (currentFormData?.destination) {
                addressStr = currentFormData.destination + ' ' + addressStr;
              }
            }
            
            console.log(`尝试获取地址 "${addressStr}" 的坐标`);
            
          } catch (error) {
            console.error(`无法获取活动 "${activity.title}" 的位置信息:`, error);
            
            // 使用自动布局（基于目的地位置的随机偏移）
            let baseLocation = { lng: 104.195397, lat: 35.86166 }; // 默认位置
            
            // 优先使用目的地坐标
            if (currentTripPlan.destination && currentTripPlan.destination.coordinates) {
              baseLocation = {
                lng: currentTripPlan.destination.coordinates[0],
                lat: currentTripPlan.destination.coordinates[1]
              };
            } else if (currentFormData?.destination) {
              // 如果没有目的地坐标，使用目的地名称获取基础位置
              baseLocation = getBaseLocationForDestination(currentFormData.destination);
            }
            
            const randomOffset = 0.01 + (activityIndex * 0.002); // 增加不同活动之间的距离
            const randomAngle = Math.random() * Math.PI * 2; // 随机角度
            const randomLng = baseLocation.lng + (randomOffset * Math.cos(randomAngle));
            const randomLat = baseLocation.lat + (randomOffset * Math.sin(randomAngle));
            
            console.log(`使用自动布局坐标: [${randomLng}, ${randomLat}]`);
            
            dayPoints.push({
              name: activity.title,
              position: [randomLng, randomLat],
              desc: activity.description || '',
              activity: {
                activityName: activity.title,
                activityTime: activity.time,
                activityLocation: activity.location,
                activityDescription: activity.description
              },
              isAutoLayout: true
            });
            
            hasAutoLayoutMarkers = true;
          }
        }
        
        console.log(`第${dayNumber}天共有 ${dayPoints.length} 个标记点`);
        
        // 为每个点创建标记，使用不同颜色标识不同天的活动
        const dayColors = [
          '#FF5252', '#7B1FA2', '#303F9F', '#0288D1', 
          '#388E3C', '#FFA000', '#E64A19', '#5D4037'
        ];
        const dayColor = dayColors[dayNumber % dayColors.length];
        
        dayPoints.forEach((point, pointIndex) => {
          try {
            // 创建圆圈标记
            const circleContent = document.createElement('div');
            circleContent.className = point.isAutoLayout ? 'custom-marker auto-layout' : 'custom-marker';
            circleContent.style.width = '24px';
            circleContent.style.height = '24px';
            circleContent.style.backgroundColor = point.isAutoLayout ? '#DD5555' : dayColor;
            circleContent.style.border = '2px solid white';
            circleContent.style.borderRadius = '50%';
            circleContent.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            
            // 添加标号
            const markerLabel = document.createElement('span');
            markerLabel.textContent = String(pointIndex + 1);
            markerLabel.style.position = 'absolute';
            markerLabel.style.top = '50%';
            markerLabel.style.left = '50%';
            markerLabel.style.transform = 'translate(-50%, -50%)';
            markerLabel.style.color = '#fff';
            markerLabel.style.fontSize = '12px';
            markerLabel.style.fontWeight = 'bold';
            
            circleContent.appendChild(markerLabel);
            
            // 创建经纬度坐标点
            const positionPoint = new AMap.LngLat(point.position[0], point.position[1]);
            
            const marker = new AMap.Marker({
              position: positionPoint,
              title: point.name,
              map: mapInstance.current,
              content: circleContent
            });
            
            // 创建标签显示信息
            const labelContent = document.createElement('div');
            labelContent.className = 'custom-marker-label';
            labelContent.innerHTML = `<strong>${point.name}</strong>`;
            labelContent.style.padding = '2px 5px';
            labelContent.style.backgroundColor = 'rgba(255,255,255,0.8)';
            labelContent.style.border = `1px solid ${point.isAutoLayout ? '#DD5555' : dayColor}`;
            labelContent.style.borderRadius = '3px';
            labelContent.style.fontSize = '12px';
            
            const label = new AMap.Marker({
              position: positionPoint,
              map: mapInstance.current,
              content: labelContent,
              offset: new AMap.Pixel(0, -30),
              zIndex: 90
            });
            
            // 添加点击事件，显示详情信息窗口
            marker.on('click', () => {
              // 创建信息窗口内容
              const infoWindowContent = document.createElement('div');
              infoWindowContent.className = 'info-window';
              infoWindowContent.style.padding = '10px';
              infoWindowContent.style.maxWidth = '300px';
              
              const titleDiv = document.createElement('div');
              titleDiv.className = 'info-window-title';
              titleDiv.textContent = point.name;
              titleDiv.style.fontWeight = 'bold';
              titleDiv.style.fontSize = '16px';
              titleDiv.style.marginBottom = '8px';
              titleDiv.style.borderBottom = `2px solid ${point.isAutoLayout ? '#DD5555' : dayColor}`;
              titleDiv.style.paddingBottom = '5px';
              infoWindowContent.appendChild(titleDiv);
              
              if (point.activity.activityTime) {
                const timeDiv = document.createElement('div');
                timeDiv.className = 'info-window-item';
                timeDiv.innerHTML = `<strong>时间:</strong> ${point.activity.activityTime}`;
                timeDiv.style.marginBottom = '5px';
                infoWindowContent.appendChild(timeDiv);
              }
              
              if (point.activity.activityLocation) {
                const locationDiv = document.createElement('div');
                locationDiv.className = 'info-window-item';
                locationDiv.innerHTML = `<strong>地点:</strong> ${point.activity.activityLocation}`;
                locationDiv.style.marginBottom = '5px';
                infoWindowContent.appendChild(locationDiv);
              }
              
              if (point.desc) {
                const descDiv = document.createElement('div');
                descDiv.className = 'info-window-item';
                descDiv.innerHTML = `<strong>描述:</strong> ${point.desc}`;
                descDiv.style.marginBottom = '5px';
                infoWindowContent.appendChild(descDiv);
              }
              
              const dayInfoDiv = document.createElement('div');
              dayInfoDiv.className = 'info-window-day';
              dayInfoDiv.innerHTML = `<strong>行程日:</strong> 第${dayNumber}天`;
              dayInfoDiv.style.marginTop = '8px';
              dayInfoDiv.style.fontSize = '12px';
              dayInfoDiv.style.color = point.isAutoLayout ? '#DD5555' : dayColor;
              infoWindowContent.appendChild(dayInfoDiv);
              
              if (point.isAutoLayout) {
                const autoLayoutNotice = document.createElement('div');
                autoLayoutNotice.className = 'auto-layout-notice';
                autoLayoutNotice.innerHTML = '注意：此位置为自动布局，可能不准确';
                autoLayoutNotice.style.marginTop = '5px';
                autoLayoutNotice.style.fontSize = '11px';
                autoLayoutNotice.style.fontStyle = 'italic';
                autoLayoutNotice.style.color = '#DD5555';
                infoWindowContent.appendChild(autoLayoutNotice);
              }
              
              // 创建信息窗口
              const infoWindow = new AMap.InfoWindow({
                content: infoWindowContent,
                offset: new AMap.Pixel(0, -35),
                closeWhenClickMap: true
              });
              
              infoWindow.open(mapInstance.current, marker.getPosition());
            });
            
            // 保存标记和标签
            newMarkersByDay[dayNumber].push(marker);
            newLabelsByDay[dayNumber].push(label);
            newAllMarkers.push(marker);
          } catch (error) {
            console.error(`创建标记点失败: ${point.name}`, error);
          }
        });
        
        // 如果当天有多个点，添加连线
        try {
          if (newMarkersByDay[dayNumber] && newMarkersByDay[dayNumber].length > 1) {
            const markerPositions = newMarkersByDay[dayNumber].map(marker => marker.getPosition());
            
            const polyline = new AMap.Polyline({
              path: markerPositions,
              isOutline: true,
              outlineColor: '#FFFFFF',
              borderWeight: 1,
              strokeColor: dayColor,
              strokeOpacity: 0.8,
              strokeWeight: 4,
              strokeStyle: 'solid',
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50,
            });
            
            polyline.setMap(mapInstance.current);
            newPolylinesByDay[dayNumber] = polyline;
          }
        } catch (error) {
          console.error(`创建路线失败: 第${dayNumber}天`, error);
        }
      }
      
      console.log('设置标记完成', { 
        markersByDay: newMarkersByDay, 
        labelsByDay: newLabelsByDay,
        polylinesByDay: newPolylinesByDay
      });
      
      // 保存所有标记和路线
      setMarkersByDay(newMarkersByDay);
      setLabelsByDay(newLabelsByDay);
      setPolylinesByDay(newPolylinesByDay);
      setAllMarkers(newAllMarkers);
      
      // 初始情况下显示第一天
      if (currentTripPlan.itinerary.length > 0) {
        const firstDayNumber = currentTripPlan.itinerary[0].day;
        console.log(`初始显示第${firstDayNumber}天`);
        handleDayTabClick(firstDayNumber);
        setActiveDay(firstDayNumber);
      }
      
      // 如果使用了自动布局，显示警告
      if (hasAutoLayoutMarkers) {
        console.warn('某些位置无法准确定位，已使用自动布局。红色标记表示位置可能不准确。');
      }
      
      // 清除超时
      clearTimeout(setupTimeout);
    } catch (error) {
      console.error('设置地图标记和路线过程中出错:', error);
      // 确保在出错时，仍然设置地图中心点
      initializeMapMarkers();
      
      // 清除超时
      clearTimeout(setupTimeout);
    }
  };

  // 如果没有行程数据，则显示加载状态
  if (!currentTripPlan || !currentFormData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faCloud} spin />
          <span>正在加载行程...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 返回按钮和主题切换按钮 */}
      <div className="flex justify-between items-center mb-6">
        <button className="back-button" onClick={handleBackToCreate}>
          <FontAwesomeIcon icon={faHome} /> 返回
        </button>
        <div className="theme-toggle" onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </div>
      </div>
      
      {/* 标题区 */}
      <header className="title-box text-center">
        <h1 className="text-4xl md:text-5xl mb-3">{currentTripPlan.title.replace(/[：:]/g, '｜')}</h1>
        <p className="ultra-thin text-lg text-gray-500">{currentFormData.destination}</p>
        <p className="text-sm text-gray-400 mt-3">
          {currentFormData.startDate} - {currentFormData.endDate}
        </p>
      </header>

      {/* 行程地图 */}
      <div className="map-container fade-in">
        <h3 className="text-xl p-4 bg-white bg-opacity-70">行程路线图</h3>
        
        {/* 添加日期切换标签 */}
        <div className="map-tabs">
          {currentTripPlan?.itinerary.map((day, index) => (
            <div 
              key={day.day} 
              className={`map-tab ${activeDay === day.day ? 'active' : ''}`} 
              onClick={() => {
                setActiveDay(day.day);
                handleDayTabClick(day.day);
              }}
            >
              第{day.day}天
            </div>
          ))}
        </div>
        
        <div id="map"></div>
        <div className="map-loading" id="mapLoading">
          <p>地图加载中...</p>
        </div>
        
        {/* 静态地图备用 */}
        <div id="staticMap" style={{display: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', paddingTop: '50px', textAlign: 'center'}}>
          <p className="text-gray-600 text-sm mb-2">地图加载失败，显示静态路线图</p>
          <div className="overflow-auto p-4" style={{height: 'calc(100% - 30px)'}}>
            <div className="bg-white bg-opacity-90 p-4 rounded">
              <h4 className="text-lg mb-3">{currentTripPlan.title.replace(/[：:]/g, '｜')} 行程路线</h4>
              <ul className="text-left">
                {currentTripPlan.itinerary.map(day => (
                  <li key={day.day} className="flex items-center mb-4">
                    <span className="inline-block w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">{day.day}</span>
                    <div>
                      <strong>第{day.day}天：{day.date}</strong>
                      <p className="text-sm text-gray-600">
                        {day.activities.slice(0, 2).map(a => a.title).join('、')}
                        {day.activities.length > 2 ? '...' : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="subtle-pattern"></div>
        
        {/* 行程详情 - 优化UI，添加时间轴和统一样式 */}
        {currentTripPlan.itinerary.map(day => (
          <div key={day.day} className="card fade-in">
            <div className="day-marker">第{day.day}天 | {day.date} ({getDayOfWeek(day.date)})</div>
            <h3 className="text-xl mb-4">{day.activities[0]?.title || `第${day.day}天行程`}</h3>
            
            <div className="activities-timeline">
            {day.activities.map((activity, index) => (
              <div key={index} className="time-item">
                <div className="time">{activity.time}</div>
                <div className="activity">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-desc">{activity.description}</div>
                    
                    {/* 地点、门票、注意事项使用统一样式 */}
                    <div className="activity-info-group">
                  {activity.location && (
                        <div className="activity-info">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="info-icon" />
                          <span className="info-text">{activity.location}</span>
                    </div>
                  )}
                      
                      {activity.cost && (
                        <div className="activity-info">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="info-icon" />
                          <span className="info-text">{activity.cost}</span>
                        </div>
                      )}
                      
                      {activity.tips && (
                        <div className="activity-info tips-info">
                          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                          <span className="info-text">{activity.tips}</span>
                        </div>
                      )}
                    </div>
                </div>
              </div>
            ))}
            </div>

            {/* 当天的用餐信息 - 修改为2-3个选择并加粗餐厅名称 */}
            {day.dining && day.dining.length > 0 && (
              <div className="info-section">
                <div className="info-header">
                  <FontAwesomeIcon icon={faUtensils} className="info-icon" />
                  <span>推荐餐厅</span>
                </div>
                {day.dining.slice(0, 3).map((restaurant, idx) => (
                  <div key={idx} className="info-content">
                    <div className="info-item"><strong>{restaurant.name}</strong></div>
                    <div className="info-item">特色：{restaurant.specialties}</div>
                    <div className="info-item">人均：{restaurant.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* 住宿推荐 */}
        <div className="card fade-in">
          <h3 className="text-xl mb-4">住宿推荐</h3>
          
          <div className="timeline-section">
            {currentTripPlan.itinerary.map((day, index) => (
              day.accommodation && (
                <div key={day.day} className="timeline-item">
                  <div className="timeline-marker">{day.day}</div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <FontAwesomeIcon icon={faHotel} className="mr-2" />
                      第{day.day}晚 ({day.date})
                    </div>
                    <div className="hotel-info">
                      <div className="hotel-name">{day.accommodation.name}</div>
                      <div className="hotel-details">
                        <p>地址: {day.accommodation.address}</p>
                        <p>价格: {day.accommodation.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        
        {/* 旅行贴士 */}
        <div className="card fade-in">
          <h3 className="text-xl mb-4">旅行贴士</h3>
          
          <div className="tips-section">
            <div className="tip-item">
              <div className="tip-title"><FontAwesomeIcon icon={faSuitcase} className="mr-2" />行李打包</div>
              <div>轻便衣物、舒适鞋子、防晒霜（SPF50+）、帽子、墨镜、保温水杯、雨伞、常用药品</div>
            </div>
            
            <div className="tip-item">
              <div className="tip-title"><FontAwesomeIcon icon={faCloudSun} className="mr-2" />气候提醒</div>
              <div>{currentFormData?.destination}地区气候宜人，但昼夜温差较大，请适当携带保暖衣物</div>
            </div>
            
            <div className="tip-item">
              <div className="tip-title"><FontAwesomeIcon icon={faBed} className="mr-2" />住宿建议</div>
              <div>建议选择交通便利、安全可靠的住宿区域，可提前在线预订以获得更好的价格</div>
            </div>
            
            <div className="tip-item">
              <div className="tip-title"><FontAwesomeIcon icon={faUtensils} className="mr-2" />美食推荐</div>
              <div>尝试当地特色美食，但注意饮食卫生，避免生冷食物，随身携带肠胃药品</div>
            </div>
            
            <div className="tip-item">
              <div className="tip-title"><FontAwesomeIcon icon={faCamera} className="mr-2" />摄影建议</div>
              <div>日出日落、古城夜景、自然风光是不可错过的摄影点，建议携带充电宝和备用电池</div>
            </div>
          </div>
        </div>
        
        {/* 目的地天气 */}
        <div className="card fade-in">
          <h3 className="text-xl mb-4">目的地天气</h3>
          
          <div className="info-box">
            <div className="info-icon">
              <FontAwesomeIcon icon={faCloudSun} />
            </div>
            <div className="info-content">
              <h4 className="text-lg mb-1">{currentFormData?.destination}</h4>
              <p className="text-sm text-gray-500">{currentTripPlan.summary.duration}</p>
              <div className="weather-info mt-2">
                <p>{currentTripPlan.summary.weather}</p>
                </div>
              
              {/* 每日天气预报 */}
              <div className="weather-box mt-4">
                {currentTripPlan.itinerary.map((day, index) => (
                  <div key={day.day} className="weather-item">
                    <div className="weather-date">{day.date.split('-').slice(1).join('/')}</div>
                    <div className="weather-temp">
                      {index % 3 === 0 ? '25°C/15°C' : 
                       index % 3 === 1 ? '27°C/12°C' : '24°C/13°C'}
              </div>
                    <div className="text-xs">
                      {index % 3 === 0 ? '晴' : 
                       index % 3 === 1 ? '多云' : '小雨'}
            </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 预算明细 */}
        <div className="card fade-in">
          <h3 className="text-xl mb-4">预算明细</h3>
          
          <div className="budget-detail">
            <table>
              <thead>
                <tr>
                  <th>类别</th>
                  <th>项目</th>
                  <th>单价</th>
                  <th>数量</th>
                  <th>小计</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={4}>交通费用</td>
                  <td>往返机票/火车票</td>
                  <td>¥800</td>
                  <td>2程</td>
                  <td>¥1,600</td>
                </tr>
                <tr>
                  <td>当地交通（公交/地铁）</td>
                  <td>¥15</td>
                  <td>{currentTripPlan.days}天</td>
                  <td>¥{currentTripPlan.days * 15}</td>
                </tr>
                <tr>
                  <td>出租车/网约车</td>
                  <td>¥50</td>
                  <td>4次</td>
                  <td>¥200</td>
                </tr>
                <tr>
                  <td>机场接送</td>
                  <td>¥100</td>
                  <td>2次</td>
                  <td>¥200</td>
                </tr>
                
                <tr>
                  <td rowSpan={2}>住宿费用</td>
                  <td>酒店住宿</td>
                  <td>¥450</td>
                  <td>{currentTripPlan.nights}晚</td>
                  <td>¥{currentTripPlan.nights * 450}</td>
                </tr>
                <tr>
                  <td>额外服务费</td>
                  <td>¥150</td>
                  <td>1项</td>
                  <td>¥150</td>
                </tr>
                
                <tr>
                  <td rowSpan={2}>门票费用</td>
                  <td>景点门票</td>
                  <td>¥80</td>
                  <td>{currentTripPlan.itinerary.reduce((total, day) => total + day.activities.length, 0)}个</td>
                  <td>¥{currentTripPlan.itinerary.reduce((total, day) => total + day.activities.length, 0) * 80}</td>
                </tr>
                <tr>
                  <td>特色体验</td>
                  <td>¥300</td>
                  <td>1项</td>
                  <td>¥300</td>
                </tr>
                
                <tr>
                  <td rowSpan={4}>餐饮费用</td>
                  <td>早餐</td>
                  <td>¥30</td>
                  <td>{currentTripPlan.days}天</td>
                  <td>¥{currentTripPlan.days * 30}</td>
                </tr>
                <tr>
                  <td>午餐</td>
                  <td>¥60</td>
                  <td>{currentTripPlan.days}天</td>
                  <td>¥{currentTripPlan.days * 60}</td>
                </tr>
                <tr>
                  <td>晚餐</td>
                  <td>¥80</td>
                  <td>{currentTripPlan.days}天</td>
                  <td>¥{currentTripPlan.days * 80}</td>
                </tr>
                <tr>
                  <td>特色餐厅</td>
                  <td>¥300</td>
                  <td>1顿</td>
                  <td>¥300</td>
                </tr>
                
                <tr>
                  <td rowSpan={3}>购物其他</td>
                  <td>纪念品购物</td>
                  <td>¥500</td>
                  <td>1项</td>
                  <td>¥500</td>
                </tr>
                <tr>
                  <td>旅游保险</td>
                  <td>¥100</td>
                  <td>1份</td>
                  <td>¥100</td>
                </tr>
                <tr>
                  <td>备用金</td>
                  <td>¥500</td>
                  <td>1项</td>
                  <td>¥500</td>
                </tr>
                
                <tr className="budget-total">
                  <td colSpan={4}><strong>总预算</strong></td>
                  <td><strong>¥{
                    2000 + (currentTripPlan.days * 15) + 400 + 
                    (currentTripPlan.nights * 450) + 150 + 
                    (currentTripPlan.itinerary.reduce((total, day) => total + day.activities.length, 0) * 80) + 300 +
                    (currentTripPlan.days * 170) + 300 + 1100
                  }</strong></td>
                </tr>
                
                <tr>
                  <td colSpan={4}>人均预算</td>
                  <td>¥{Math.round((
                    2000 + (currentTripPlan.days * 15) + 400 + 
                    (currentTripPlan.nights * 450) + 150 + 
                    (currentTripPlan.itinerary.reduce((total, day) => total + day.activities.length, 0) * 80) + 300 +
                    (currentTripPlan.days * 170) + 300 + 1100
                  ) / 1)}</td>
                </tr>
                
                <tr>
                  <td colSpan={4}>每日均价</td>
                  <td>¥{Math.round((
                    2000 + (currentTripPlan.days * 15) + 400 + 
                    (currentTripPlan.nights * 450) + 150 + 
                    (currentTripPlan.itinerary.reduce((total, day) => total + day.activities.length, 0) * 80) + 300 +
                    (currentTripPlan.days * 170) + 300 + 1100
                  ) / currentTripPlan.days)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="budget-notes mt-4">
            <h4 className="text-base mb-2">预算说明</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              <li>以上预算为参考价格，实际费用可能因季节、预订时间等因素有所浮动</li>
              <li>建议提前预订机票和酒店以获得更优惠的价格</li>
              <li>餐饮费用可根据个人喜好和消费水平适当调整</li>
              <li>备用金用于应对突发情况，建议随身携带</li>
            </ul>
          </div>
        </div>
        
        {/* 重要信息 */}
        <div className="card fade-in">
          <h3 className="text-xl mb-4">重要信息</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-base mb-2">紧急联系电话</h4>
              <ul className="list-disc pl-5 text-sm">
                <li>旅游咨询: 12301</li>
                <li>紧急救援: 120</li>
                <li>报警电话: 110</li>
                <li>消费者投诉: 12315</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 保存行程按钮 */}
        <div className="save-trip-section fade-in">
          <button 
            className={`save-trip-button ${isAlreadySaved ? 'saved' : ''}`} 
            onClick={handleSaveTrip}
            disabled={isAlreadySaved}
          >
            <FontAwesomeIcon icon={isAlreadySaved ? faCheck : faSave} />
            <span>{isAlreadySaved ? '已保存到首页' : '保存行程到首页'}</span>
          </button>
          <p className="save-trip-desc">保存后可从首页查看此行程</p>
        </div>
      </section>

      {/* 保存成功通知 */}
      <div className={`save-notification ${showSaveNotification ? 'show' : ''}`}>
        <FontAwesomeIcon icon={faCheck} />
        <span>行程已成功保存到首页</span>
      </div>
    </div>
  );
};

export default TravelPlan; 