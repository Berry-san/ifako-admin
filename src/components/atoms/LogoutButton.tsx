'use client'

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { toast } from 'react-toastify'

const LogoutButton: React.FC = () => {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-3 py-2 w-full rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
    >
      <LogOut size={16} className="mr-2" />
      Logout
    </button>
  )
}

export default LogoutButton
