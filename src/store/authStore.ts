// store/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  user: Record<string, any> | null
  role: string | null
  token: string | null
  isAuthenticated: boolean
  login: (user: Record<string, any>, token: string) => void
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({
          user,
          token,
          role: user.role,
          isAuthenticated: true,
        }),
      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        })
        sessionStorage.removeItem('auth-storage')
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default useAuthStore
