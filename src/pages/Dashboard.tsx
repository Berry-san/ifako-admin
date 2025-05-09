'use client'

import { useState } from 'react'
import { useFetchData } from '../hooks/useApiHooks'

type ReportItem = {
  reportCategory: string
  count: number
}

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState<
    'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  >('daily')
  const [selectedDate, setSelectedDate] = useState(new Date())

  const formatDate = (date: Date): string => date.toISOString().split('T')[0] // 'YYYY-MM-DD'

  const { data: reportData = [], isLoading } = useFetchData(
    `report/summary?timeframe=${timeframe}&date=${formatDate(selectedDate)}`
  )
  const { data: newsData = [] } = useFetchData(
    `dashboard/news-summary?timeframe=${timeframe}&date=${formatDate(
      selectedDate
    )}`
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">
          Welcome to Ifako Ijaiye Admin Dashboard
        </h2>

        <div className="flex gap-3 items-center">
          <select
            value={timeframe}
            onChange={(e) =>
              setTimeframe(
                e.target.value as
                  | 'daily'
                  | 'weekly'
                  | 'monthly'
                  | 'quarterly'
                  | 'annual'
              )
            }
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="annual">This Year</option>
          </select>

          <input
            type="date"
            value={formatDate(selectedDate)}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {isLoading && reportData.length > 0 ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reportData.map((item: ReportItem) => (
            <div
              key={item.reportCategory}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow"
            >
              <p className="text-lg font-semibold capitalize">
                {item.reportCategory}
              </p>
              <p className="text-2xl font-bold">{item.count}</p>
            </div>
          ))}
          {reportData && (
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
              <p className="text-lg font-semibold capitalize">News Count </p>
              <p className="text-2xl font-bold">{newsData.count}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
