// import Logout from 'Pages/Auth/Logout'
// import halalLogo from '../../assets/images/halalLogo.png'
import { Menu } from 'lucide-react'
import { UserCircle2 } from 'lucide-react'
import ifakoLogo from '/assets/images/ifako-ijaiye-logo.png'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  // const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  // useEffect(() => {
  //   document.documentElement.classList.remove('light', 'dark')
  //   document.documentElement.classList.add(theme)
  //   localStorage.setItem('theme', theme) // Persist theme in localStorage
  // }, [theme])

  return (
    <header className="sticky top-0 z-30 flex w-full text-black border-b bg-white drop-shadow-2">
      <div className="flex items-center justify-between flex-grow px-3 md:px-6 py-2.5 lg:h-16 shadow-2 2xl:px-11">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="items-center hidden lg:flex">
            <img src={ifakoLogo} className="w-12 h-12" alt="" />
            <p className="font-bold">Ifako Admin</p>
          </div>

          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation()
              setSidebarOpen(!sidebarOpen)
            }}
            className="z-40 block p-1.5 lg:hidden"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
        <div className="flex items-center justify-center mr-10 lg:hidden">
          {/* <img src={halalLogo} className="w-12 h-12" alt="" /> */}
        </div>
        <div className="flex items-center justify-center lg:hidden">
          {/* <img src={halalLogo} className="w-12 h-12" alt="" /> */}
        </div>
        <div className="items-center justify-center hidden lg:flex">
          <span className="flex items-center justify-center mr-2 rounded-full">
            <UserCircle2 className="w-8 h-8" />
          </span>
          <span className="">
            <span className="block text-sm font-medium">Admin</span>
            {/* <span className="block text-xs uppercase">
                {merchant?.merchant_business_name}
              </span> */}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
