import React, { createContext, useState, useContext, ReactNode } from 'react';
import { TripFormData, GeneratedTrip } from '../utils/api';

// 定义保存的行程类型
export interface SavedTrip {
  id: string;
  title: string;
  days: number;
  nights: number;
  places: number; // 估算活动地点数量
  image: string;
  formData: TripFormData;
  tripPlan: GeneratedTrip;
}

interface TripContextType {
  formData: TripFormData | null;
  setFormData: (data: TripFormData | null) => void;
  tripPlan: GeneratedTrip | null;
  setTripPlan: (plan: GeneratedTrip | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  savedTrips: SavedTrip[];
  saveTrip: (trip: SavedTrip) => void;
  deleteSavedTrip: (id: string) => void;
  getSavedTrip: (id: string) => SavedTrip | undefined;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [tripPlan, setTripPlan] = useState<GeneratedTrip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 从localStorage加载已保存的行程，如果没有则设为空数组
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(() => {
    const saved = localStorage.getItem('savedTrips');
    return saved ? JSON.parse(saved) : [];
  });

  // 保存行程到savedTrips和localStorage
  const saveTrip = (trip: SavedTrip) => {
    // 检查是否已存在相同ID的行程
    const exists = savedTrips.some(t => t.id === trip.id);
    
    let newTrips: SavedTrip[];
    if (exists) {
      // 如果存在，更新它
      newTrips = savedTrips.map(t => t.id === trip.id ? trip : t);
    } else {
      // 添加到数组前端
      newTrips = [trip, ...savedTrips];
    }
    
    setSavedTrips(newTrips);
    localStorage.setItem('savedTrips', JSON.stringify(newTrips));
  };

  // 删除保存的行程
  const deleteSavedTrip = (id: string) => {
    const newTrips = savedTrips.filter(trip => trip.id !== id);
    setSavedTrips(newTrips);
    localStorage.setItem('savedTrips', JSON.stringify(newTrips));
  };

  // 获取指定ID的行程
  const getSavedTrip = (id: string) => {
    return savedTrips.find(trip => trip.id === id);
  };

  return (
    <TripContext.Provider value={{
      formData,
      setFormData,
      tripPlan,
      setTripPlan,
      isLoading,
      setIsLoading,
      savedTrips,
      saveTrip,
      deleteSavedTrip,
      getSavedTrip
    }}>
      {children}
    </TripContext.Provider>
  );
}; 