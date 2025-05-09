'use client'

import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import DeleteConfirmModal from '../components/atoms/DeleteConfirmModal'
import Modal from '../components/atoms/Modal'
import CreateNewsForm from '../components/molecules/CreateNewsForm'
import SearchSortBar from '../components/molecules/SearchSortBar'
import SectionHeader from '../components/molecules/SectionHeader'
import { Pencil, Trash } from 'lucide-react'
import {
  useFetchData,
  useDeleteData,
  useUpdateData,
} from '../hooks/useApiHooks'
import RoleBasedAccess from '../components/atoms/RoleBasedAccess'

const News: React.FC = () => {
  const { data: newsList = [], isLoading } = useFetchData(
    '/dashboard/all/news',
    'news-api'
  )
  const { mutate: deleteNews } = useDeleteData(
    '/dashboard/delete/news',
    'news-api'
  )
  const { mutate: approveNews } = useUpdateData(
    '/dashboard/edit/news',
    'news-api'
  ) // ID passed later

  const [searchTerm, setSearchTerm] = useState('')
  const [sortAsc, setSortAsc] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const filteredNews = useMemo(() => {
    const search = searchTerm.toLowerCase()
    const sorted = [...newsList].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortAsc ? dateA - dateB : dateB - dateA
    })

    return sorted.filter(
      (item) =>
        item.header?.toLowerCase().includes(search) ||
        item.content?.toLowerCase().includes(search)
    )
  }, [newsList, searchTerm, sortAsc])

  const handleDelete = (id: string) => {
    setItemToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return
    deleteNews(itemToDelete, {
      onSuccess: () => toast.success('News deleted'),
      onError: () => toast.error('Failed to delete'),
    })
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const handleApprove = (id: string) => {
    approveNews(
      { id, body: { approved: true } }, // ✅ proper shape now
      {
        onSuccess: () => toast.success('News approved successfully'),
        onError: () => toast.error('Failed to approve news'),
      }
    )
  }

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <SectionHeader
        title="News Management"
        onAction={() => setShowCreateModal(true)}
        actionLabel="Add News"
      />
      <SearchSortBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortAsc={sortAsc}
        onToggleSort={() => setSortAsc(!sortAsc)}
        sortLabel="Sort by Date"
      />

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center text-gray-500">No news found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news: any) => (
            <div
              key={news.id}
              className="border rounded bg-white overflow-hidden shadow"
            >
              {news.image && (
                <img
                  src={news.image}
                  alt={news.header}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 space-y-2">
                <div className="flex flex-col justify-between items-start space-x-4">
                  <RoleBasedAccess allowedRoles={['superadmin', 'admin']}>
                    <div className="flex items-center justify-between space-x-4 mb-4">
                      {news.hidden && (
                        <button
                          onClick={() => handleApprove(news.id)}
                          className="text-green-600 hover:text-green-800 text-sm border border-green-600 rounded px-2 py-1"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(news.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditData(news)
                          setShowEditModal(true)
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </RoleBasedAccess>

                  <h3 className="font-semibold">{news.header}</h3>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(news.date).toLocaleDateString()}
                </p>
                {/* <p className="text-sm text-gray-700 line-clamp-4">
                  {news.content}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Create News"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <CreateNewsForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setEditData(null)
          setShowEditModal(false)
        }}
        title="Edit News"
      >
        <CreateNewsForm
          isEdit
          id={editData?.id}
          initialData={editData}
          onClose={() => {
            setEditData(null)
            setShowEditModal(false)
          }}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName="this news item"
      />
    </div>
  )
}

export default News
