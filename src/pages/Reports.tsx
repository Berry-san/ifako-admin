// pages/Reports.tsx
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import DeleteConfirmModal from '../components/atoms/DeleteConfirmModal'
import { useFetchData, useDeleteData } from '../hooks/useApiHooks'
import { Trash } from 'lucide-react'
import RoleBasedAccess from '../components/atoms/RoleBasedAccess'

const ReportsPage: React.FC = () => {
  const [category, setCategory] = useState('')
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const {
    data: reports = [],
    isLoading,
    refetch,
  } = useFetchData(`/report/get?category=${category}`)

  const { mutate: deleteReport } = useDeleteData(
    '/report',
    selectedReportId || ''
  )

  const handleDelete = (id: string) => {
    setSelectedReportId(id)
    setShowModal(true)
  }

  const confirmDelete = () => {
    if (!selectedReportId) return
    deleteReport(selectedReportId, {
      onSuccess: () => {
        toast.success('Report deleted')
        setShowModal(false)
        refetch()
      },
      onError: () => toast.error('Failed to delete'),
    })
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Select Category</option>
        <option value="criminal">Criminal</option>
        <option value="vandalism">Vandalism</option>
        <option value="security">Security</option>
        <option value="other">Other</option>
      </select>

      {isLoading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500">No reports found.</p>
      ) : (
        <div className="grid gap-4">
          {reports.map((report: any) => (
            <div
              key={report.id}
              className="bg-white p-4 rounded shadow relative"
            >
              <h3 className="font-semibold text-lg capitalize">
                {report.reportCategory}
              </h3>
              <p className="text-gray-700 mt-1">{report.reportBody}</p>
              <p className="text-sm text-gray-500 mt-1">{report.phoneNumber}</p>
              <p className="text-xs text-gray-400 mt-1">{report.address}</p>

              <RoleBasedAccess allowedRoles={['superadmin', 'admin']}>
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(report.id)}
                >
                  <Trash size={18} />
                </button>
              </RoleBasedAccess>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
        itemName="report"
      />
    </div>
  )
}

export default ReportsPage
