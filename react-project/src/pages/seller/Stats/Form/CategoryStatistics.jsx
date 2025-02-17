// ./Form/CategoryStatistics.js
import React, { useEffect, useState } from 'react';
import API from '@/utils/API';
import { FaClipboardList } from 'react-icons/fa';

const CategoryStatistics = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await API.get('/sellers/statistics/category');
        setCategories(response.data.result.data);
      } catch (error) {
        console.error('Error fetching category statistics:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='bg-white p-6 rounded-xl border-2 border-gray-300'>
      <FaClipboardList className='text-4xl mb-4' />
      <h3 className='text-xl font-semibold text-gray-800'>카테고리별 통계</h3>
      {categories.length > 0 ? (
        <ul className='mt-4 text-gray-600'>
          {categories.map((category) => (
            <li key={category.categoryNo} className='mb-2 border-b pb-2'>
              <strong>{category.categoryName}</strong> - 판매량: {category.totalSales}개, 매출: {category.totalRevenue.toLocaleString()}원, 평균 가격: {category.averagePrice.toLocaleString()}원
            </li>
          ))}
        </ul>
      ) : (
        <p>데이터 없음</p>
      )}
    </div>
  );
};

export default CategoryStatistics;