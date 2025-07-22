/**
 * 工具函数索引文件
 * 集中导出所有工具类和函数
 */

// 辅助函数
export { default as formatDate } from './formatDate';
export { formatDateToFriendly, getDayOfWeek } from './formatDate';

/**
 * 计算两个日期之间的天数差
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 天数差值
 */
export function dateDiff(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // 包含开始和结束日期
}

/**
 * 格式化持续时间（秒）为友好显示格式
 * @param durationInSeconds 持续时间（秒）
 * @returns 格式化后的持续时间
 */
export function formatDuration(durationInSeconds: number): string {
  if (durationInSeconds < 60) {
    return `${durationInSeconds}秒`;
  } else if (durationInSeconds < 3600) {
    const minutes = Math.floor(durationInSeconds / 60);
    return `${minutes}分钟`;
  } else if (durationInSeconds < 86400) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    return `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ''}`;
  } else {
    const days = Math.floor(durationInSeconds / 86400);
    const hours = Math.floor((durationInSeconds % 86400) / 3600);
    return `${days}天${hours > 0 ? ` ${hours}小时` : ''}`;
  }
}

/**
 * 格式化距离（米）为友好显示格式
 * @param distanceInMeters 距离（米）
 * @returns 格式化后的距离
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${distanceInMeters}米`;
  } else {
    const km = (distanceInMeters / 1000).toFixed(1);
    return `${km}公里`;
  }
}

/**
 * 生成一个UUID
 * @returns UUID字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
} 