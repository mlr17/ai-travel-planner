import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faArrowLeft, 
  faMoon, 
  faMapMarkerAlt, 
  faCalendarAlt,
  faWallet,
  faSpinner,
  faPalette,
  faDownload,
  faCheckCircle,
  faSun,
  faCloudSun,
  faMoneyBillWave,
  faInfoCircle,
  faCar,
  faHotel
} from '@fortawesome/free-solid-svg-icons';
import '../styles/createTrip.scss';
import { useTripContext } from '../contexts/TripContext';
import { generateTripPlan, TripFormData } from '../utils/api';
// import ChinaRegionSelect from '../components/ChinaRegionSelect';

// 声明高德地图全局变量类型
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
  }
}

interface CreateTripProps {
  onBack?: () => void;
}

const CreateTrip: React.FC<CreateTripProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { setFormData, setTripPlan, setIsLoading, isLoading } = useTripContext();
  
  // 状态管理
  const [currentSection, setCurrentSection] = useState<'input' | 'itinerary' | 'card'>('input');
  const [formValues, setFormValues] = useState<TripFormData>({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    preferences: '',
    travelType: 'leisure'
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);

  // 当组件挂载时获取用户的位置
  useEffect(() => {
    // 获取用户当前位置并设置为出发地
    const getUserLocation = async () => {
      try {
        setLocationLoading(true);
        
        // 1. 首先尝试加载高德地图脚本（如果尚未加载）
        if (typeof window.AMap === 'undefined') {
          // 设置高德地图安全配置
          window._AMapSecurityConfig = {
            securityJsCode: 'a6100f6e82cf32098673bcd89ec55609'
          };
          
          // 加载高德地图脚本，确保包含Geocoder插件
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            // 确保userKey正确配置，并且加载所需要的插件
            script.src = 'https://webapi.amap.com/maps?v=2.0&key=b44439943ce1b7617e01ed4155c62fd5&plugin=AMap.Geocoder,AMap.CitySearch';
            script.async = true;
            script.onload = () => {
              console.log('高德地图脚本加载成功');
              // 验证脚本是否正确加载并可访问
              if (typeof window.AMap === 'undefined') {
                console.error('高德地图脚本加载成功但AMap对象未定义');
                reject(new Error('高德地图脚本加载异常'));
                return;
              }
              resolve();
            };
            script.onerror = (error) => {
              console.error('高德地图脚本加载失败：', error);
              reject(new Error('加载高德地图脚本失败'));
            };
            document.head.appendChild(script);
          });
        }
        
        // 2. 使用浏览器Geolocation API获取用户位置
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              console.log('获取到用户坐标:', latitude, longitude);
              
              try {
                // 3. 使用高德地图的逆地理编码服务将坐标转换为地址
                const geocoder = new window.AMap.Geocoder({
                  city: '全国', // 城市设置为全国范围
                  radius: 1000, // 设置搜索半径
                  key: 'b44439943ce1b7617e01ed4155c62fd5' // 显式传入key参数
                });
                
                // 创建经纬度对象 - 注意顺序是经度在前，纬度在后
                const lnglat = [longitude, latitude];
                
                // 调用逆地理编码接口
                geocoder.getAddress(lnglat, (status, result) => {
                  console.log('逆地理编码返回结果:', status, result);
                  
                  if (status === 'complete' && result.info === 'OK') {
                    // 从结果中获取城市信息
                    const addressComponent = result.regeocode.addressComponent;
                    // 城市可能为空（直辖市情况），此时用省份代替
                    const city = addressComponent.city || addressComponent.province;
                    
                    console.log('逆地理编码结果:', city);
                    
                    setFormValues(prev => ({
                      ...prev,
                      origin: city
                    }));
                  } else {
                    // 如果逆地理编码失败，尝试使用IP定位
                    console.error('逆地理编码失败，状态:', status, '结果:', result);
                    fallbackToIpLocation();
                  }
                  setLocationLoading(false);
                });
              } catch (error) {
                console.error('逆地理编码失败:', error);
                fallbackToIpLocation();
              }
            },
            (error) => {
              console.error('获取位置失败:', error.message);
              fallbackToIpLocation();
            },
            { timeout: 10000, enableHighAccuracy: false }
          );
        } else {
          console.log('浏览器不支持Geolocation API');
          fallbackToIpLocation();
        }
      } catch (error) {
        console.error('位置服务错误:', error);
        fallbackToIpLocation();
      }
    };
    
    // 备用方法：使用高德IP定位
    const fallbackToIpLocation = () => {
      try {
        console.log('使用IP定位作为备用方法');
        // 确保高德地图已加载
        if (typeof window.AMap === 'undefined' || !window.AMap.CitySearch) {
          console.error('高德地图或CitySearch插件未加载，设置默认城市');
          setFormValues(prev => ({
            ...prev,
            origin: '北京市'
          }));
          setLocationLoading(false);
          return;
        }
        
        // 创建CitySearch实例
        const citySearch = new window.AMap.CitySearch({
          key: 'b44439943ce1b7617e01ed4155c62fd5' // 显式传入key参数
        });
        
        // 获取当前城市信息
        citySearch.getLocalCity((status, result) => {
          console.log('IP定位返回结果:', status, result);
          
          if (status === 'complete' && result.info === 'OK') {
            setFormValues(prev => ({
              ...prev,
              origin: result.city
            }));
            console.log('IP定位获取到城市:', result.city);
          } else {
            // 默认城市设置为北京
            console.error('IP定位失败，状态:', status, '结果:', result);
            setFormValues(prev => ({
              ...prev,
              origin: '北京市'
            }));
            console.log('IP定位失败，使用默认城市');
          }
          setLocationLoading(false);
        });
      } catch (error) {
        console.error('IP定位失败:', error);
        // 设置默认城市
        setFormValues(prev => ({
          ...prev,
          origin: '北京市'
        }));
        setLocationLoading(false);
      }
    };
    
    getUserLocation();
  }, []);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // 处理旅行类型选择
  const handleTravelTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      travelType: e.target.value as 'leisure' | 'adventure' | 'cultural' | 'culinary'
    });
  };

  // 处理生成行程
  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!formValues.destination || !formValues.startDate || !formValues.endDate) {
      showNotificationMessage('请填写必要的信息');
      return;
    }
    
    // 保存表单数据到上下文
    setFormData(formValues);
    setIsLoading(true);
    
    try {
      // 调用API生成行程规划
      console.log('正在调用 MCP 客户端生成行程规划...');
      const tripPlan = await generateTripPlan(formValues);
      console.log('行程规划生成成功:', tripPlan);
      
      // 保存生成的行程规划到上下文
      setTripPlan(tripPlan);
      
      // 生成临时ID - 这里使用时间戳，实际项目可能需要更健壮的ID生成方式
      const tempId = `temp-${Date.now()}`;
      
      // 导航到行程规划页面，带上临时ID作为参数
      navigate(`/trip/${tempId}`);
    } catch (error) {
      console.error('生成行程规划失败:', error);
      showNotificationMessage('生成行程规划失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 返回首页
  const handleBackToHome = () => {
    navigate('/');
  };

  // 返回输入页面
  const handleBackToInput = () => {
    setCurrentSection('input');
  };

  // 生成行程卡片
  const handleGenerateCard = () => {
    setCurrentSection('card');
  };

  // 返回行程页面
  const handleBackToItinerary = () => {
    setCurrentSection('itinerary');
  };

  // 保存行程卡片
  const handleSaveCard = () => {
    setShowNotification(true);
    showNotificationMessage('行程卡片已保存到相册');
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

  // 计算行程天数
  const calculateDays = () => {
    if (!formValues.startDate || !formValues.endDate) return '-';
    
    const start = new Date(formValues.startDate);
    const end = new Date(formValues.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} 天 ${diffDays - 1} 晚`;
  };

  return (
    <div className="app-container">
      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">AI 旅行规划</h1>
          <div className="theme-toggle" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="app-main">
        {/* 输入表单部分 */}
        <section className={`input-section ${currentSection === 'input' ? 'visible' : ''}`}>
          <div className="section-title">
            <h2>创建您的旅行计划</h2>
            <div className="micro-line"></div>
          </div>

          <form className="travel-form" onSubmit={handleGenerateItinerary}>
            <div className="form-group">
              <label htmlFor="origin">出发地</label>
              <input 
                type="text" 
                id="origin" 
                name="origin" 
                placeholder={locationLoading ? "正在获取您的位置..." : "输入您的出发地点"} 
                required
                value={formValues.origin}
                onChange={handleInputChange}
                disabled={locationLoading}
              />
              {locationLoading && <div className="location-loading">定位中...</div>}
            </div>
            <div className="form-group">
              <label htmlFor="destination">目的地</label>
              <input 
                type="text" 
                id="destination" 
                name="destination" 
                placeholder="输入您想去的地方" 
                required
                value={formValues.destination}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="startDate">开始日期</label>
                <input 
                  type="date" 
                  id="startDate" 
                  name="startDate" 
                  required
                  value={formValues.startDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group half">
                <label htmlFor="endDate">结束日期</label>
                <input 
                  type="date" 
                  id="endDate" 
                  name="endDate" 
                  required
                  value={formValues.endDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="budget">预算 (人民币)</label>
              <input 
                type="number" 
                id="budget" 
                name="budget" 
                placeholder="输入您的旅行预算" 
                min="0" 
                step="100"
                value={formValues.budget}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferences">偏好与需求</label>
              <textarea 
                id="preferences" 
                name="preferences" 
                placeholder="描述您的兴趣爱好、饮食要求、住宿偏好等..." 
                rows={4}
                value={formValues.preferences}
                onChange={handleInputChange}
                className="form-textarea"
              ></textarea>
            </div>

            <div className="form-group travel-type">
              <label>旅行类型</label>
              <div className="travel-type-options">
                <div className="travel-type-option">
                  <input 
                    type="radio" 
                    id="leisure" 
                    name="travelType" 
                    value="leisure" 
                    checked={formValues.travelType === 'leisure'}
                    onChange={handleTravelTypeChange}
                  />
                  <label htmlFor="leisure">休闲</label>
                </div>
                <div className="travel-type-option">
                  <input 
                    type="radio" 
                    id="adventure" 
                    name="travelType" 
                    value="adventure"
                    checked={formValues.travelType === 'adventure'}
                    onChange={handleTravelTypeChange}
                  />
                  <label htmlFor="adventure">探险</label>
                </div>
                <div className="travel-type-option">
                  <input 
                    type="radio" 
                    id="cultural" 
                    name="travelType" 
                    value="cultural"
                    checked={formValues.travelType === 'cultural'}
                    onChange={handleTravelTypeChange}
                  />
                  <label htmlFor="cultural">文化</label>
                </div>
                <div className="travel-type-option">
                  <input 
                    type="radio" 
                    id="culinary" 
                    name="travelType" 
                    value="culinary"
                    checked={formValues.travelType === 'culinary'}
                    onChange={handleTravelTypeChange}
                  />
                  <label htmlFor="culinary">美食</label>
                </div>
              </div>
            </div>

            <button type="submit" className="primary-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <span>生成行程</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>
          </form>
        </section>

        {/* 行程展示部分 */}
        <section className={`itinerary-section ${currentSection === 'itinerary' ? 'visible' : ''}`}>
          <div className="section-header">
            <button className="back-button" onClick={handleBackToInput}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className="section-title">
              <h2>{useTripContext().tripPlan?.title || '您的旅行计划'}</h2>
              <div className="micro-line"></div>
            </div>
          </div>

          <div className="itinerary-summary">
            <div className="summary-info">
              <div className="info-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{useTripContext().tripPlan?.summary.destination || formValues.destination || '-'}</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>{useTripContext().tripPlan?.summary.duration || calculateDays()}</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faWallet} />
                <span>{useTripContext().tripPlan?.summary.budget || (formValues.budget ? `¥${formValues.budget}` : '-')}</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faCloudSun} />
                <span>{useTripContext().tripPlan?.summary.weather || '-'}</span>
              </div>
            </div>
          </div>

          {/* AI生成内容展示区 */}
          {isLoading && (
            <div className="loading-spinner">
              <FontAwesomeIcon icon={faSpinner} spin />
              <span>AI正在为您精心规划行程...</span>
            </div>
          )}

          {/* 行程内容 */}
          <div className="itinerary-days">
            {useTripContext().tripPlan?.itinerary.map(day => (
              <div key={day.day} className="itinerary-day">
                <div className="day-header">
                  <div className="day-number">第 {day.day} 天</div>
                  <div className="day-date">{day.date}</div>
                </div>
                <div className="day-activities">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-time">{activity.time}</div>
                      <div className="activity-content">
                        <div className="activity-title">{activity.title}</div>
                        <div className="activity-description">{activity.description}</div>
                        {activity.location && (
                        <div className="activity-location">
                          <FontAwesomeIcon icon={faMapMarkerAlt} />
                          <span>{activity.location}</span>
                            {activity.cost && (
                              <span className="activity-cost">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="ml-3 mr-1" />
                                {activity.cost}
                              </span>
                            )}
                          </div>
                        )}
                        {activity.tips && (
                          <div className="activity-tips">
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                            {activity.tips}
                        </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* 当天交通信息 */}
                  {day.transportation && (
                    <div className="transportation-info">
                      <FontAwesomeIcon icon={faCar} className="mr-2" />
                      <span>{day.transportation.method}</span>
                      <span className="mx-2">|</span>
                      <span>{day.transportation.duration}</span>
                      <span className="mx-2">|</span>
                      <span>{day.transportation.cost}</span>
                    </div>
                  )}
                  
                  {/* 当天住宿信息 */}
                  {day.accommodation && (
                    <div className="accommodation-info">
                      <FontAwesomeIcon icon={faHotel} className="mr-2" />
                      <span>{day.accommodation.name}</span>
                      <span className="mx-2">|</span>
                      <span>{day.accommodation.price}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="itinerary-actions">
            <button className="primary-button" onClick={handleGenerateCard}>
              <span>生成行程卡片</span>
              <FontAwesomeIcon icon={faPalette} />
            </button>
          </div>
        </section>

        {/* 行程卡片预览部分 */}
        <section className={`card-section ${currentSection === 'card' ? 'visible' : ''}`}>
          <div className="section-header">
            <button className="back-button" onClick={handleBackToItinerary}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className="section-title">
              <h2>行程卡片</h2>
              <div className="micro-line"></div>
            </div>
          </div>

          <div className="card-preview-container">
            <div className="card-preview">
              <div className="card-header">
                <h3>{useTripContext().tripPlan?.title}</h3>
                <p>{useTripContext().tripPlan?.summary.duration}</p>
                <p className="card-weather">{useTripContext().tripPlan?.summary.weather}</p>
              </div>
              <div className="card-body">
                {useTripContext().tripPlan?.itinerary.map(day => (
                  <div key={day.day} className="card-day">
                    <div className="card-day-header">第 {day.day} 天 · {day.date}</div>
                    <div className="card-day-activities">
                      {day.activities.map((activity, index) => (
                        <div key={index} className="card-activity">
                          <div className="card-activity-time">{activity.time.split(' - ')[0]}</div>
                          <div className="card-activity-content">
                          <div className="card-activity-title">{activity.title}</div>
                            <div className="card-activity-location">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                              {activity.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-footer">
                <div className="card-tips">
                  {useTripContext().tripPlan?.summary.tips.slice(0, 2).map((tip, index) => (
                    <div key={index} className="card-tip">
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                      {tip}
                    </div>
                  ))}
                </div>
                <div className="card-signature">
                AI旅行规划 · 极简风格
                </div>
              </div>
            </div>
          </div>

          <div className="card-actions">
            <button className="primary-button" onClick={handleSaveCard}>
              <span>保存到手机</span>
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
        </section>
      </main>

      {/* 底部导航栏 */}
      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-text">极简风格 · 轻松出行</span>
        </div>
      </footer>

      {/* 保存成功提示 */}
      <div className={`notification ${showNotification ? 'show' : ''}`}>
        <FontAwesomeIcon icon={faCheckCircle} />
        <span>{notificationText}</span>
      </div>
    </div>
  );
};

export default CreateTrip; 