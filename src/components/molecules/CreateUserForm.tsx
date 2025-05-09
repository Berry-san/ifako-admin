import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { usePostData } from '../../hooks/useApiHooks'
import InputField from '../atoms/InputField'
import SelectField from '../atoms/SelectField'

type UserFormInputs = {
  username: string
  password: string
  role: string
}

interface CreateUserFormProps {
  onClose?: () => void
  isEdit?: boolean
  id?: string
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  onClose,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormInputs>()

  const { mutate: createUser, isPending } = usePostData(
    '/admin/signup',
    '/admin/get'
  )

  const onSubmit = (data: UserFormInputs) => {
    const payload = {
      username: data.username,
      password: data.password,
      role: data.role,
    }

    createUser(payload, {
      onSuccess: () => {
        toast.success(`User ${isEdit ? 'updated' : 'created'} successfully`)
        reset()
        onClose?.()
      },
      onError: () =>
        toast.error(`Failed to ${isEdit ? 'update' : 'create'} user`),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Full Name"
        {...register('username', { required: 'Username is required' })}
        error={errors.username?.message}
      />
      <InputField
        label="Password"
        type="password"
        {...register('password', { required: 'Password is required' })}
        error={errors.password?.message}
      />
      <SelectField
        options={[
          { label: 'User', value: 'user' },
          { label: 'Admin', value: 'admin' },
          // { label: 'Legislative Arm', value: 'Legislative' },
        ]}
        label="User Role"
        {...register('role', { required: 'User role is required' })}
        error={errors.role?.message}
      />

      <div className="text-right">
        <button
          type="submit"
          disabled={isPending || isSubmitting}
          className="bg-black text-white px-4 py-2 rounded cursor-pointer"
        >
          {isPending || isSubmitting ? 'Saving...' : 'Create User'}
        </button>
      </div>
    </form>
  )
}

export default CreateUserForm
