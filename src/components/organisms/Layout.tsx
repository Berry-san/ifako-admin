import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
// import useAuthStore from '../../store/authStore'

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  // const navigate = useNavigate()

  // const { user } = useAuthStore()

  // const authChecker = user?.isAuthenticated

  // useEffect(() => {
  //   if (!authChecker) navigate('/login')
  // }, [authChecker, navigate])

  return (
    <div className="w-full flex flex-col h-screen overflow-hidden bg-[#f4f5f9]">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex w-full">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 h-screen overflow-x-hidden overflow-y-auto ">
          <div className="px-4 pt-5 pb-24 mx-auto max-w-screen-2xl shadow-2 md:px-6 2xl:px-11 lg:pt-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
