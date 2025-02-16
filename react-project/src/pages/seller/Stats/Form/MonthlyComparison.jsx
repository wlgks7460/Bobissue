// ./Form/MonthlyComparison.js
import React, { useEffect, useState } from 'react';
import API from '@/utils/API';
import { FaRedoAlt } from 'react-icons/fa';

const MonthlyComparison = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await API.get('/sellers/statistics/monthly-comparison');
        setData(response.data.result.data);
      } catch (error) {
        console.error('Error fetching monthly comparison:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='bg-gray-50 p-6 rounded-xl border border-gray-300 shadow-md'>
      <div className='flex items-center gap-3 mb-4'>
        <FaRedoAlt className='text-4xl' />
        <h3 className='text-2xl font-semibold text-gray-800'>전월 대비 실적</h3>
      </div>
      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white p-4'>
        {data ? (
          <ul className='space-y-3 text-gray-700'>
            <li className='flex justify-between border-b pb-2'><span>이번 달 판매량:</span> <span className='font-semibold'>{data.currentMonthSales}개</span></li>
            <li className='flex justify-between border-b pb-2'><span>지난 달 판매량:</span> <span className='font-semibold'>{data.previousMonthSales}개</span></li>
            <li className='flex justify-between border-b pb-2'><span>판매 성장률:</span> <span className='font-semibold'>{data.salesGrowthRate}%</span></li>
            <li className='flex justify-between border-b pb-2'><span>이번 달 매출:</span> <span className='font-semibold'>{data.currentMonthRevenue.toLocaleString()}원</span></li>
            <li className='flex justify-between'><span>지난 달 매출:</span> <span className='font-semibold'>{data.previousMonthRevenue.toLocaleString()}원</span></li>
            <li className='flex justify-between'><span>매출 성장률:</span> <span className='font-semibold'>{data.revenueGrowthRate}%</span></li>
          </ul>
        ) : (
          <p className='text-gray-500 text-center'>데이터 없음</p>
        )}
      </div>
    </div>
  );
};

export default MonthlyComparison;
