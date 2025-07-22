// 设置环境变量
process.env.REACT_APP_API_URL = 'http://localhost:3001/api';

// 导入行程生成函数
// const { generateTripPlan } = require('../utils/api');
import { generateTripPlan } from '../utils/api.mjs';

// 测试用的表单数据
const testFormData = {
  origin: '上海',
  destination: '杭州',
  startDate: '2024-08-01',
  endDate: '2024-08-03',
  budget: '3000',
  preferences: '西湖风景,历史古迹,茶文化',
  travelType: 'cultural'
};

/**
 * 测试行程生成
 */
async function testTripGeneration() {
  console.log('====== 开始测试行程生成 ======');
  console.log(`目的地: ${testFormData.destination}`);
  console.log(`日期: ${testFormData.startDate} 至 ${testFormData.endDate}`);
  console.log(`预算: ${testFormData.budget} 元`);
  console.log(`偏好: ${testFormData.preferences}`);
  console.log(`旅行类型: ${testFormData.travelType}`);
  
  try {
    console.log('\n正在生成行程，请稍候...');
    const tripPlan = await generateTripPlan(testFormData);
    
    // 打印行程基本信息
    console.log('\n====== 生成的行程信息 ======');
    console.log(`标题: ${tripPlan.title}`);
    console.log(`目的地: ${tripPlan.destination?.name || '未指定'}`);
    console.log(`坐标: ${tripPlan.destination?.coordinates?.[0]},${tripPlan.destination?.coordinates?.[1]}`);
    console.log(`天数: ${tripPlan.days}天${tripPlan.nights}晚`);
    
    // 检查所有活动是否有坐标
    console.log('\n====== 坐标检查 ======');
    let totalActivities = 0;
    let activitiesWithCoordinates = 0;
    
    tripPlan.itinerary.forEach(day => {
      if (day.activities) {
        totalActivities += day.activities.length;
        
        day.activities.forEach(activity => {
          if (activity.coordinates) {
            activitiesWithCoordinates++;
          } else {
            console.log(`警告: 第${day.day}天活动"${activity.title}"没有坐标`);
          }
        });
      }
      
      // 检查住宿坐标
      if (day.accommodation) {
        if (day.accommodation.coordinates) {
          console.log(`住宿"${day.accommodation.name}"有坐标: ${day.accommodation.coordinates[0]},${day.accommodation.coordinates[1]}`);
        } else {
          console.log(`警告: 住宿"${day.accommodation.name}"没有坐标`);
        }
      }
      
      // 检查餐厅坐标
      if (day.dining && day.dining.length > 0) {
        day.dining.forEach(dining => {
          if (dining.coordinates) {
            console.log(`餐厅"${dining.name}"有坐标: ${dining.coordinates[0]},${dining.coordinates[1]}`);
          } else {
            console.log(`警告: 餐厅"${dining.name}"没有坐标`);
          }
        });
      }
    });
    
    const coordinatesPercentage = (activitiesWithCoordinates / totalActivities * 100).toFixed(2);
    console.log(`\n活动坐标覆盖率: ${activitiesWithCoordinates}/${totalActivities} (${coordinatesPercentage}%)`);
    
    console.log('\n====== 测试完成 ======');
    console.log(`坐标覆盖率${coordinatesPercentage >= 90 ? '良好' : '不足'}`);
    
    return {
      success: true,
      coordinatesPercentage,
      tripPlan
    };
  } catch (error) {
    console.error('\n====== 测试失败 ======');
    console.error(`错误信息: ${error.message}`);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 执行测试
testTripGeneration()
  .then(result => {
    if (result.success) {
      console.log('测试成功，行程生成正常');
      // 在这里可以保存测试结果到文件
    } else {
      console.log('测试失败，请检查错误信息');
    }
  })
  .catch(error => {
    console.error('测试执行出错:', error);
  });

// 导出测试函数供其他模块使用
// module.exports = {
//   testTripGeneration
// }; 