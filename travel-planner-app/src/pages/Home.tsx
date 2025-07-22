import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSuitcase, faCheckCircle, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import TripCard, { TripCardProps } from '../components/TripCard';
import { useTripContext, SavedTrip } from '../contexts/TripContext';
import '../styles/tripCard.scss';
import '../styles/home.scss';

// 示例行程数据
const sampleItineraries: Omit<TripCardProps, 'onDelete' | 'onClick'>[] = [
  {
    id: 'sample-1',
    title: '香港两日游｜在 citywalk 中穿梭港岛巷弄',
    days: 2,
    nights: 1,
    places: 10,
    image: 'https://source.unsplash.com/featured/200x200?hongkong'
  },
  {
    id: 'sample-2',
    title: '东京艺术探索｜博物馆与现代建筑的交融',
    days: 3,
    nights: 2,
    places: 12,
    image: 'https://source.unsplash.com/featured/200x200?tokyo'
  },
  {
    id: 'sample-3',
    title: '曼谷美食之旅｜从街头小吃到米其林餐厅',
    days: 4,
    nights: 3,
    places: 15,
    image: 'https://source.unsplash.com/featured/200x200?bangkok'
  },
  {
    id: 'sample-4',
    title: '京都古寺巡礼｜探访日本传统文化的发源地',
    days: 5,
    nights: 4,
    places: 8,
    image: 'https://source.unsplash.com/featured/200x200?kyoto'
  },
  {
    id: 'sample-5',
    title: '首尔购物狂欢｜从明洞到弘大的时尚之旅',
    days: 3,
    nights: 2,
    places: 6,
    image: 'https://source.unsplash.com/featured/200x200?seoul'
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { savedTrips, deleteSavedTrip, setTripPlan, setFormData } = useTripContext();
  const [itineraries, setItineraries] = useState<Array<TripCardProps & { isSaved?: boolean }>>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 组件加载时，合并已保存行程和示例行程
  useEffect(() => {
    // 将savedTrips转换为TripCardProps格式
    const savedTripCards = savedTrips.map(trip => ({
      id: trip.id,
      title: trip.title,
      days: trip.days,
      nights: trip.nights,
      places: trip.places,
      image: trip.image,
      isSaved: true,
      onDelete: (id: string) => handleDeleteItinerary(id),
      onClick: () => handleTripCardClick(trip.id)
    }));
    
    // 转换示例行程数据
    const sampleTripCards = sampleItineraries.map(sample => ({
      ...sample,
      isSaved: false,
      onDelete: (id: string) => handleDeleteItinerary(id),
      onClick: () => handleTripCardClick(sample.id)
    }));
    
    // 优先展示已保存的行程，然后是示例行程
    const displayTrips = [...savedTripCards];
    
    // 如果保存的行程不足5个，添加一些示例行程补充
    if (displayTrips.length < 5) {
      displayTrips.push(...sampleTripCards.slice(0, 5 - displayTrips.length));
    }
    
    setItineraries(displayTrips);
  }, [savedTrips]);
  
  // 删除行程
  const handleDeleteItinerary = (id: string) => {
    // 检查是否为已保存的行程
    const isSavedTrip = savedTrips.some(trip => trip.id === id);
    
    if (isSavedTrip) {
      // 从savedTrips中删除
      deleteSavedTrip(id);
      showNotificationMessage('行程已删除');
    } else {
      // 示例行程不允许删除，显示提示
      showNotificationMessage('示例行程无法删除');
    }
  };
  
  // 处理行程卡片点击
  const handleTripCardClick = (id: string) => {
    // 查找已保存的行程
    const savedTrip = savedTrips.find(trip => trip.id === id);
    
    if (savedTrip) {
      // 设置行程数据到上下文
      setTripPlan(savedTrip.tripPlan);
      setFormData(savedTrip.formData);
      
      // 跳转到行程详情页
      navigate(`/trip/${id}`);
      showNotificationMessage('正在加载行程详情...');
    } else {
      // 如果是示例行程，跳转到创建页面
      setTripPlan(null);
      setFormData(null);
      navigate('/create');
      showNotificationMessage('示例行程，前往创建页面...');
    }
  };
  
  // 创建行程
  const handleCreateItinerary = () => {
    // 清空上下文中的数据
    setTripPlan(null);
    setFormData(null);
    showNotificationMessage('前往 AI 行程创建页面...');
    // 使用React Router导航到创建页面
    setTimeout(() => {
      navigate('/create');
    }, 500);
  };
  
  // 显示通知
  const showNotificationMessage = (text: string) => {
    setNotificationText(text);
    setShowNotification(true);
    
    // 3秒后隐藏通知
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
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
  
  // 组件加载时添加淡入动画
  useEffect(() => {
    document.body.classList.add('fade-in');
    return () => {
      document.body.classList.remove('fade-in');
    };
  }, []);

  return (
    <div className="app-container">
      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">我的旅行</h1>
          <div className="theme-toggle" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="app-main">
        <div className="section-title">
          <h2>我的行程</h2>
          <div className="micro-line"></div>
        </div>

        {/* 行程卡片列表 */}
        {itineraries.length > 0 ? (
          <div className="itinerary-list">
            {itineraries.map((itinerary) => (
              <TripCard
                key={itinerary.id}
                id={itinerary.id}
                title={itinerary.title}
                days={itinerary.days}
                nights={itinerary.nights}
                places={itinerary.places}
                image={itinerary.image}
                onDelete={handleDeleteItinerary}
                onClick={() => handleTripCardClick(itinerary.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FontAwesomeIcon icon={faSuitcase} />
            <p>暂无行程计划</p>
            <small>点击右下角 "+" 按钮创建您的第一个行程</small>
          </div>
        )}

        {/* 创建行程按钮 */}
        <div className="create-btn" onClick={handleCreateItinerary}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </main>

      {/* 底部导航栏 */}
      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-text">AI行程规划 · 轻松出行</span>
        </div>
      </footer>

      {/* 操作通知提示 */}
      <div className={`notification ${showNotification ? 'show' : ''}`}>
        <FontAwesomeIcon icon={faCheckCircle} />
        <span>{notificationText}</span>
      </div>
    </div>
  );
};

export default Home; 