import Modal from '../components/atoms/Modal'
import CreateUserForm from '../components/molecules/CreateUserForm'
import SearchSortBar from '../components/molecules/SearchSortBar'
import SectionHeader from '../components/molecules/SectionHeader'
import { useFetchData, useUpdateData } from '../hooks/useApiHooks'
import { useState, useMemo } from 'react'
import { toast } from 'react-toastify'

interface User {
  id: string
  username: string
  role: string
  password: string
  restricted: boolean
}

const Users = () => {
  const { data: userList = [], isLoading: isLoadingUser } =
    useFetchData('/admin/get')

  const { mutate: toggleRestrict } = useUpdateData(
    '/admin/restrict',
    '/admin/get'
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [sortAsc, setSortAsc] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredNews = useMemo(() => {
    const search = searchTerm.toLowerCase()
    const sorted = [...userList].sort((a, b) => {
      return sortAsc
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username)
    })

    return sorted.filter((user) => user.username.toLowerCase().includes(search))
  }, [userList, searchTerm, sortAsc])

  const handleToggle = (user: User) => {
    toggleRestrict(
      {
        id: user.id,
        body: { restrict: !user.restricted },
      },
      {
        onSuccess: () => {
          toast(
            `${user.username} has been ${
              user.restricted ? 'unrestricted' : 'restricted'
            }`,
            { type: 'success' }
          )
        },
        onError: () => {
          toast.error('Action failed. Please try again.')
        },
      }
    )
  }

  return (
    <div className="p-6 space-y-6">
      <SectionHeader
        title="User Management"
        onAction={() => setShowCreateModal(true)}
        actionLabel="Add User"
      />
      <SearchSortBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortAsc={sortAsc}
        onToggleSort={() => setSortAsc(!sortAsc)}
        sortLabel="Sort by Date"
      />

      {isLoadingUser ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center text-gray-500">No user found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm rounded-md">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user: User) => {
                const isRestricted = user.restricted
                return (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border">{user.username}</td>
                    <td className="p-2 border capitalize">{user.role}</td>
                    <td className="p-2 border">
                      {isRestricted ? 'Restricted' : 'Active'}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleToggle(user)}
                        disabled={isLoadingUser}
                        className={`px-3 py-1 rounded text-white ${
                          isRestricted ? 'bg-green-600' : 'bg-red-600'
                        } hover:opacity-90 transition`}
                      >
                        {isRestricted ? 'Unrestrict' : 'Restrict'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        title="Create News"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <CreateUserForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  )
}

export default Users
