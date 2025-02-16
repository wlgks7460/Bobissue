// ./Form/SalesPrediction.js
import React, { useEffect, useState } from 'react';
import API from '@/utils/API';
import { FaChartLine } from 'react-icons/fa';

const SalesPrediction = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await API.get('/sellers/statistics/sales-prediction');
        setData(response.data.result.data);
      } catch (error) {
        console.error('Error fetching sales prediction:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='bg-white p-6 rounded-xl border-2 border-gray-300'>
      <FaChartLine className='text-4xl mb-4' />
      <h3 className='text-xl font-semibold text-gray-800'>판매량 예측</h3>
      {data ? (
        <ul className='mt-4 text-gray-600'>
          <li>예상 판매량: {data.predictedSales}개</li>
          <li>신뢰도: {data.confidenceRate}%</li>
          <li>지난주 판매량: {data.previousWeekSales}개</li>
          <li>2주 전 판매량: {data.twoWeeksAgoSales}개</li>
          <li>3주 전 판매량: {data.threeWeeksAgoSales}개</li>
        </ul>
      ) : (
        <p>데이터 없음</p>
      )}
    </div>
  );
};

export default SalesPrediction;