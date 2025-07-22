/**
 * 日期格式化工具函数
 * 提供各种格式化日期的实用工具
 */

/**
 * 格式化日期为指定格式
 * @param date 日期对象或日期字符串
 * @param format 格式模板，例如 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    console.error('无效的日期:', date);
    return 'Invalid Date';
  }
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  const formatMap: Record<string, string | number> = {
    'YYYY': year,
    'YY': String(year).slice(-2),
    'MM': padZero(month),
    'M': month,
    'DD': padZero(day),
    'D': day,
    'HH': padZero(hours),
    'H': hours,
    'hh': padZero(hours > 12 ? hours - 12 : hours),
    'h': hours > 12 ? hours - 12 : hours,
    'mm': padZero(minutes),
    'm': minutes,
    'ss': padZero(seconds),
    's': seconds,
    'A': hours >= 12 ? '下午' : '上午',
    'a': hours >= 12 ? 'pm' : 'am'
  };
  
  return format.replace(/YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g, (match) => {
    return String(formatMap[match] || match);
  });
}

/**
 * 为数字添加前导零
 * @param num 数字
 * @returns 添加前导零后的字符串
 */
function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

/**
 * 格式化日期为友好显示格式
 * @param date 日期对象或日期字符串
 * @returns 友好格式的日期字符串
 */
export function formatDateToFriendly(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  
  // 今天的日期
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // 昨天的日期
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  // 明天的日期
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dateWithoutTime = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  if (dateWithoutTime.getTime() === today.getTime()) {
    return '今天';
  } else if (dateWithoutTime.getTime() === yesterday.getTime()) {
    return '昨天';
  } else if (dateWithoutTime.getTime() === tomorrow.getTime()) {
    return '明天';
  } else {
    // 超过1天的日期显示完整日期
    return formatDate(d, 'YYYY年MM月DD日');
  }
}

/**
 * 获取日期的星期几
 * @param date 日期对象或日期字符串
 * @param short 是否返回短格式
 * @returns 星期几
 */
export function getDayOfWeek(date: Date | string | number, short: boolean = false): string {
  const d = new Date(date);
  const weekDays = short ? 
    ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] : 
    ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekDays[d.getDay()];
}

export default formatDate; 