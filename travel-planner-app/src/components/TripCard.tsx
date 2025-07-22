import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// 行程卡片类型定义
export interface TripCardProps {
  id: string;
  title: string;
  days: number;
  nights: number;
  places: number;
  image: string;
  onDelete: (id: string) => void;
  onClick?: () => void;  // 添加点击事件处理函数
}

const TripCard: React.FC<TripCardProps> = ({ 
  id, 
  title, 
  days, 
  nights, 
  places, 
  image, 
  onDelete,
  onClick 
}) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const clickThreshold = 5; // 判断为点击而非滑动的阈值

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    currentXRef.current = e.touches[0].clientX;
    const diffX = currentXRef.current - startXRef.current;
    
    // 只允许向左滑动，最大滑动距离80px
    if (diffX < 0 && diffX > -80) {
      if (cardRef.current) {
        cardRef.current.style.transform = `translateX(${diffX}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    
    const diffX = currentXRef.current - startXRef.current;
    
    // 判断是点击还是滑动
    if (Math.abs(diffX) < clickThreshold && onClick) {
      onClick();
      setIsSwiping(false);
      return;
    }
    
    // 如果滑动超过40px，则显示删除按钮
    if (diffX < -40) {
      setIsSwiped(true);
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(-80px)';
      }
    } else {
      setIsSwiped(false);
      if (cardRef.current) {
        cardRef.current.style.transform = '';
      }
    }
    
    setIsSwiping(false);
  };

  // 处理鼠标事件（桌面端支持）
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    
    currentXRef.current = e.clientX;
    const diffX = currentXRef.current - startXRef.current;
    
    // 只允许向左滑动，最大滑动距离80px
    if (diffX < 0 && diffX > -80) {
      if (cardRef.current) {
        cardRef.current.style.transform = `translateX(${diffX}px)`;
      }
    }
  };

  const handleMouseUp = () => {
    if (!isSwiping) return;
    
    const diffX = currentXRef.current - startXRef.current;
    
    // 判断是点击还是滑动
    if (Math.abs(diffX) < clickThreshold && onClick) {
      onClick();
      setIsSwiping(false);
      return;
    }
    
    // 如果滑动超过40px，则显示删除按钮
    if (diffX < -40) {
      setIsSwiped(true);
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(-80px)';
      }
    } else {
      setIsSwiped(false);
      if (cardRef.current) {
        cardRef.current.style.transform = '';
      }
    }
    
    setIsSwiping(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 如果不是在滑动状态下，直接调用onClick
    if (!isSwiping && onClick) {
      onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    onDelete(id);
  };

  return (
    <div 
      className={`itinerary-card ${isSwiped ? 'swiped' : ''} fade-in`}
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCardClick}
    >
      <div className="card-content">
        <div className="card-image" style={{ backgroundImage: `url(${image})` }}></div>
        <div className="card-info">
          <div className="card-title">{title}</div>
          <div className="card-meta">
            <div className="meta-item">
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>{days} 天 {nights} 晚</span>
            </div>
            <div className="meta-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{places} 个地点</span>
            </div>
          </div>
        </div>
      </div>
      <div className="delete-btn" onClick={handleDelete}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </div>
    </div>
  );
};

export default TripCard; 