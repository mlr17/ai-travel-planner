import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import type { CascaderProps } from 'antd';
import chinaRegions from '../data/chinaRegions';

// 定义地区数据接口
interface RegionData {
  value: string;
  label: string;
  children?: RegionData[];
}

interface ChinaRegionSelectProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const ChinaRegionSelect: React.FC<ChinaRegionSelectProps> = ({ 
  value, 
  placeholder = '请选择地区', 
  onChange,
  disabled = false,
  style
}) => {
  const [options, setOptions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  
  // 加载省市区数据
  useEffect(() => {
    const fetchRegionData = async () => {
      try {
        setLoading(true);
        // 这里我们使用一个公共的中国省市区数据的CDN
        const response = await fetch(
          'https://unpkg.com/china-location/dist/location.json'
        );
        if (!response.ok) {
          throw new Error('无法获取地区数据');
        }
        
        const data = await response.json();
        const provinces = Object.keys(data).map((provinceCode) => {
          const province = data[provinceCode];
          
          // 构建省级选项
          return {
            value: province.name,
            label: province.name,
            children: Object.keys(province.cities || {}).map((cityCode) => {
              const city = province.cities[cityCode];
              
              // 构建市级选项
              return {
                value: city.name,
                label: city.name,
                children: Object.keys(city.districts || {}).map((districtCode) => {
                  const district = city.districts[districtCode];
                  
                  // 构建区/县级选项
                  return {
                    value: district,
                    label: district,
                  };
                }),
              };
            }),
          };
        });
        
        setOptions(provinces);
      } catch (error) {
        console.error('加载地区数据失败:', error);
        // 使用本地数据作为备用
        console.log('使用本地中国地区数据');
        setOptions(chinaRegions);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegionData();
  }, []);
  
  // 当外部value改变时更新内部状态
  useEffect(() => {
    if (value) {
      // 尝试将地址字符串拆分为省市区
      const addressParts = value.split(/[省市区县]/);
      const validParts = addressParts.filter(part => part.trim().length > 0);
      setSelectedValue(validParts);
    } else {
      setSelectedValue([]);
    }
  }, [value]);
  
  // 处理选择改变
  const handleChange: CascaderProps['onChange'] = (values, selectedOptions) => {
    if (values && values.length > 0) {
      const fullAddress = selectedOptions.map(option => option.label).join('');
      setSelectedValue(values as string[]);
      onChange?.(fullAddress);
    } else {
      setSelectedValue([]);
      onChange?.('');
    }
  };
  
  const displayRender = (labels: string[]) => {
    return labels.join(' / ');
  };
  
  return (
    <Cascader
      options={options}
      value={selectedValue}
      onChange={handleChange}
      placeholder={placeholder}
      showSearch
      disabled={disabled || loading}
      loading={loading}
      style={{ width: '100%', ...style }}
      displayRender={displayRender}
    />
  );
};

export default ChinaRegionSelect; 