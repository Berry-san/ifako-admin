import { User2, TextSearchIcon, LayoutDashboard, AlbumIcon } from 'lucide-react'
import paths from '../routes/paths'

export const UserSidebarLinks = [
  {
    label: 'Dashboard',
    href: paths.dashboard,
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['superadmin', 'admin', 'user'],
  },
  {
    href: paths.news,
    icon: <TextSearchIcon className="w-5 h-5" />,
    label: 'News',
    roles: ['superadmin', 'admin', 'user'],
  },
  {
    href: paths.members,
    icon: <User2 className="w-5 h-5" />,
    label: 'Members',
    roles: ['superadmin', 'admin', 'user'],
  },
  {
    href: paths.report,
    icon: <AlbumIcon className="w-5 h-5" />,
    label: 'Report',
    roles: ['superadmin', 'admin'],
  },
]
