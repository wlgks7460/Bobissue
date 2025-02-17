import { useEffect, useState } from 'react'
import API from '@/utils/API'

const Demographics = () => {
  const [Data, setData] = useState(null)

  useEffect(() => {
    async function fetchDemographic() {
      try {
        const response = await API.get('api/sellers/statistics/demographic')
        console.log('ehll')
        //console.log(response)
        setData(response.data.result.data)
      } catch (err) {
        setData({
          ageStats: {
            '20대 미만': {
              ageGroup: '20대 미만',
              totalOrders: 16,
              totalRevenue: 71177,
              averageOrderAmount: 4448.5625,
              topCategories: [
                {
                  categoryNo: 2,
                  categoryName: '친환경',
                  orderCount: 13,
                  totalRevenue: 34808,
                },
                {
                  categoryNo: 3,
                  categoryName: '고구마,감자,당근',
                  orderCount: 3,
                  totalRevenue: 36369,
                },
              ],
            },
          },
          genderStats: {
            M: {
              gender: 'M',
              totalOrders: 16,
              totalRevenue: 71177,
              averageOrderAmount: 4448.5625,
              topCategories: [
                {
                  categoryNo: 2,
                  categoryName: '친환경',
                  orderCount: 13,
                  totalRevenue: 34808,
                },
                {
                  categoryNo: 3,
                  categoryName: '고구마,감자,당근',
                  orderCount: 3,
                  totalRevenue: 36369,
                },
              ],
            },
          },
          combinedStats: {
            '20대 미만': {
              M: {
                totalOrders: 16,
                totalRevenue: 71177,
                averageOrderAmount: 4448.5625,
                topCategories: [
                  {
                    categoryNo: 2,
                    categoryName: '친환경',
                    orderCount: 13,
                    totalRevenue: 34808,
                  },
                  {
                    categoryNo: 3,
                    categoryName: '고구마,감자,당근',
                    orderCount: 3,
                    totalRevenue: 36369,
                  },
                ],
              },
            },
          },
        })
        console.log(err)
      }
    }
    fetchDemographic()
  }, [])

  console.log(Data)
  return
  ;<div>{Data}</div>
}

export default Demographics
