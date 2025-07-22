import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendarAlt, faMap, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/navigation.scss';

// 导航项类型定义
interface NavItem {
  to: string;
  icon: any;
  label: string;
}

const Navigation: React.FC = () => {
  // 导航项列表
  const navItems: NavItem[] = [
    { to: '/', icon: faHome, label: '首页' },
    { to: '/planner', icon: faCalendarAlt, label: '行程' },
    { to: '/map', icon: faMap, label: '地图' },
    { to: '/about', icon: faInfoCircle, label: '关于' }
  ];

  return (
    <nav className="app-navigation">
      <ul>
        {navItems.map((item, index) => (
          <li key={index}>
            <Link to={item.to}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 