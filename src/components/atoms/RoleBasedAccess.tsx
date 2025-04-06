import useAuthStore from '../../store/authStore'

type Props = {
  allowedRoles: string[]
  children: React.ReactNode
}

const RoleBasedAccess = ({ allowedRoles, children }: Props) => {
  const userRole = useAuthStore((s) => s.role)

  if (!allowedRoles.includes(userRole || '')) return null

  return <>{children}</>
}

export default RoleBasedAccess
