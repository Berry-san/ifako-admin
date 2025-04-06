'use client'

import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import DeleteConfirmModal from '../components/atoms/DeleteConfirmModal'
import Modal from '../components/atoms/Modal'
import CreateMemberForm from '../components/molecules/CreateMemberForm'
import SearchSortBar from '../components/molecules/SearchSortBar'
import SectionHeader from '../components/molecules/SectionHeader'
import { Pencil, Trash } from 'lucide-react'
import { useFetchData, useDeleteData } from '../hooks/useApiHooks'

const Members: React.FC = () => {
  const { data: members = [], isLoading } = useFetchData('/main/all/member')
  const { mutate: deleteMember } = useDeleteData(
    '/main/delete/member',
    '/main/all/member'
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [sortAsc, setSortAsc] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)

  const groupedAndFiltered = useMemo(() => {
    const search = searchTerm.toLowerCase()
    const sorted = [...members].sort((a, b) =>
      sortAsc ? a.rank - b.rank : b.rank - a.rank
    )
    const filtered = sorted.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.position.toLowerCase().includes(search) ||
        item.office.toLowerCase().includes(search)
    )

    const grouped: Record<string, typeof filtered> = {}
    filtered.forEach((member) => {
      if (!grouped[member.office]) grouped[member.office] = []
      grouped[member.office].push(member)
    })

    return grouped
  }, [members, searchTerm, sortAsc])

  const handleDelete = (id: string) => {
    setMemberToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!memberToDelete) return

    deleteMember(memberToDelete, {
      onSuccess: () => {
        toast.success('Member deleted')
        setShowDeleteModal(false)
        setMemberToDelete(null)
      },
      onError: () => {
        toast.error('Failed to delete member')
      },
    })
  }

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <SectionHeader
        title="Members Management"
        actionLabel="Add Member"
        onAction={() => setShowCreateModal(true)}
      />
      <SearchSortBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortAsc={sortAsc}
        onToggleSort={() => setSortAsc(!sortAsc)}
        sortLabel="Sort by Rank"
      />

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : Object.keys(groupedAndFiltered).length === 0 ? (
        <div className="text-center text-gray-500">No members found.</div>
      ) : (
        Object.entries(groupedAndFiltered).map(([office, group]) => (
          <div key={office} className="space-y-4">
            <h3 className="text-lg font-semibold mt-8 text-gray-700">
              {office}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.map((member) => (
                <div
                  key={member.id}
                  className="bg-white shadow border rounded overflow-hidden"
                >
                  {member.imageUrl && (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-76 object-cover object-top"
                    />
                  )}
                  <div className="p-4 space-x-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {member.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {member.position}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rank: {member.rank}
                        </p>
                      </div>

                      <div className="space-x-3 flex">
                        <button
                          onClick={() => {
                            setEditData(member)
                            setShowEditModal(true)
                          }}
                          className=" text-blue-500 hover:text-blue-700 cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <Modal
        title="Add Member"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <CreateMemberForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditData(null)
        }}
        title="Edit Member"
      >
        <CreateMemberForm
          isEdit
          id={editData?.id}
          initialData={editData}
          onClose={() => {
            setShowEditModal(false)
            setEditData(null)
          }}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        itemName="this member"
      />
    </div>
  )
}

export default Members
