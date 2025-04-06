import React, { useRef, useEffect, useState, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import LogoutButton from '../atoms/LogoutButton'
import { UserSidebarLinks } from '../../constants/navigation'
import RoleBasedAccess from '../atoms/RoleBasedAccess'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface LinkWithHref {
  href: string
  icon?: ReactNode
  label: string
  roles?: string[]
}

type Link = LinkWithHref

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const trigger = useRef<HTMLButtonElement>(null)
  const sidebar = useRef<HTMLElement>(null)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  )

  const [overlayActive, setOverlayActive] = useState<boolean>(false)

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return
      setSidebarOpen(false)
    }

    const resizeHandler = () => {
      if (window.innerWidth >= 1279) {
        setSidebarOpen(false)
        setOverlayActive(false)
        setSidebarExpanded(false)
      }
    }
    document.addEventListener('click', clickHandler)
    window.addEventListener('resize', resizeHandler)
    return () => {
      document.removeEventListener('click', clickHandler)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [sidebarOpen, setSidebarOpen])

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }

    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [sidebarOpen, setSidebarOpen])

  useEffect(() => {
    sessionStorage.setItem('sidebar-expanded', sidebarExpanded.toString())
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded')
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded')
    }
    setOverlayActive(sidebarOpen)
  }, [sidebarExpanded, sidebarOpen])

  return (
    <div className="relative rounded-full rounded-tr-3xl rounded-br-3xl scrollbar">
      {overlayActive && window.innerWidth <= 1024 && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black opacity-40"
        ></div>
      )}
      <aside
        ref={sidebar}
        className={`fixed left-0 top-0 inset-0 z-40 flex h-screen w-80 lg:w-72 flex-col border-r overflow-y-hidden bg-white px-7 duration-300 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-end gap-2 pt-5 lg:hidden">
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            {/* <img src={back} alt="" className="flex w-5 h-5" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* SIDEBAR HEADER */}

        <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear">
          {/* Sidebar Menu */}
          <nav className="py-8">
            {/* Menu Group */}
            <div>
              <ul className="flex flex-col gap-2">
                {/* Menu Item Dashboard */}

                {UserSidebarLinks.map((link, index) => (
                  <SidebarLinks
                    key={index}
                    link={link}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </ul>
              <div className="py-4 mt-4">
                <LogoutButton />
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  )
}

interface SidebarLinksProps {
  link: Link
  onClick: () => void
}

const SidebarLinks: React.FC<SidebarLinksProps> = ({ link, onClick }) => {
  return (
    <li>
      <RoleBasedAccess allowedRoles={link.roles || []}>
        <NavLink
          to={link.href}
          end
          onClick={onClick}
          className={({ isActive }) =>
            isActive
              ? 'group relative flex items-center gap-5 font-semibold rounded-sm py-2 px-4 bg-black text-white duration-300 ease-in-out'
              : 'group relative flex items-center gap-5 font-semibold px-4 py-2 text-black duration-300 ease-in-out'
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      </RoleBasedAccess>
    </li>
  )
}

export default Sidebar
