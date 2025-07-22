import { Request, Response } from 'express';
import { generateTripPlan } from '../utils/tripService';
import { TripFormData } from '../utils/types';

/**
 * 生成行程规划控制器
 */
export const generateTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    const formData: TripFormData = req.body;
    
    // 基本表单验证
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      res.status(400).json({
        success: false,
        message: '请提供目的地、开始日期和结束日期'
      });
      return;
    }
    
    console.log('收到行程生成请求:', formData);
    
    // 生成行程规划
    const tripPlan = await generateTripPlan(formData);
    
    // 返回生成的行程规划
    res.status(200).json({
      success: true,
      data: tripPlan
    });
  } catch (error: any) {
    console.error('生成行程规划失败:', error);
    res.status(500).json({
      success: false,
      message: `生成行程规划失败: ${error.message || '未知错误'}`
    });
  }
};

/**
 * 健康检查控制器
 */
export const healthCheck = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: '行程规划服务正常运行',
    timestamp: new Date().toISOString()
  });
}; 