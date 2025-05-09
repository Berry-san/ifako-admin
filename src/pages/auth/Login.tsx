'use client'

import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import InputField from '../../components/atoms/InputField'
import { usePostData } from '../../hooks/useApiHooks'
import useAuthStore from '../../store/authStore'

type LoginFormInputs = {
  username: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()

  const { mutate: loginAdmin, isPending } = usePostData('/admin/login')

  const onSubmit = (data: LoginFormInputs) => {
    loginAdmin(
      {
        username: data.username,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          login(response.admin, response.token) // if response has both
          toast.success('Login successful')
          // Optionally save token or user here
          navigate('/dashboard/members')
        },
        onError: (error: unknown) => {
          const message =
            error && typeof error === 'object' && 'message' in error
              ? (error as { message: string }).message
              : 'Login failed'
          toast.error(message)
        },
      }
    )
  }

  return (
    <div className="flex items-center justify-center h-screen bg-dull_white">
      <div className="bg-white border border-dull_white max-w-md mx-auto rounded-md w-full">
        <div className=" px-10 py-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img src="ifako.svg" alt="Ifako Logo" className="w-16 h-16" />
            <h4 className="text-lg font-semibold text-center ">Admin Login</h4>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputField
              label="Username"
              placeholder=""
              type="text"
              {...register('username', {
                required: 'username is required',
              })}
              error={errors.username?.message}
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              type="password"
              showToggle
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 3,
                  message: 'Password must be at least 3 characters',
                },
              })}
              error={errors.password?.message}
            />

            <div className="flex flex-col items-center w-full">
              <button
                className="w-full px-4 py-3 text-xs font-semibold text-white rounded bg-black"
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
