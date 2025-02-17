// ./Form/HourlyStatistics.js
import React, { useEffect, useState } from 'react';
import API from '@/utils/API';
import { FaClock } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const HourlyStatistics = () => {
  const [hourlyData, setHourlyData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await API.get('/sellers/statistics/hourly');
        setHourlyData(response.data.result.data);
      } catch (error) {
        console.error('Error fetching hourly statistics:', error);
      }
    }
    fetchData();
  }, []);

  const chartData = {
    labels: hourlyData.map((hour) => `${hour.hour}시`),
    datasets: [
      {
        label: '판매량',
        data: hourlyData.map((hour) => hour.salesCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '매출 (원)',
        data: hourlyData.map((hour) => hour.totalRevenue),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='bg-gray-50 p-6 rounded-xl border border-gray-300 shadow-md'>
      <div className='flex items-center gap-3 mb-4'>
        <FaClock className='text-4xl text-blue-500' />
        <h3 className='text-2xl font-semibold text-gray-800'>시간대별 판매 통계</h3>
      </div>
      <div className='bg-white p-4 rounded-lg border border-gray-200'>
        {hourlyData.length > 0 ? (
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        ) : (
          <p className='text-gray-500 text-center'>데이터 없음</p>
        )}
      </div>
    </div>
  );
};

export default HourlyStatistics;