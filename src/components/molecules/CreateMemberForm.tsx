import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { usePostData, useUpdateData } from '../../hooks/useApiHooks'
import InputField from '../atoms/InputField'
import SelectField from '../atoms/SelectField'

type MemberFormInputs = {
  name: string
  position: string
  office: string
  rank: number
  image: FileList
}

interface CreateMemberFormProps {
  onClose?: () => void
  isEdit?: boolean
  id?: string
  initialData?: any
}

const CreateMemberForm: React.FC<CreateMemberFormProps> = ({
  onClose,
  isEdit = false,
  id,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormInputs>()

  const { mutate: createMember, isPending } = usePostData(
    '/main/create',
    '/main/all/member'
  )
  const { mutate: updateMember, isPending: isPendingUpdate } = useUpdateData(
    '/main/edit/member',
    id || '',
    '/main/all/member'
  )

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name || '')
      setValue('position', initialData.position || '')
      setValue('office', initialData.office || '')
      setValue('rank', initialData.rank || 0)
    }
  }, [initialData, setValue])

  const onSubmit = (data: MemberFormInputs) => {
    const formData = new FormData()
    formData.append('type', 'member')
    formData.append('name', data.name)
    formData.append('position', data.position)
    formData.append('office', data.office)
    formData.append('rank', String(20))
    if (data.image?.[0]) {
      formData.append('image', data.image[0])
    }

    const mutationFn = isEdit ? updateMember : createMember

    mutationFn(formData, {
      onSuccess: () => {
        toast.success(`Member ${isEdit ? 'updated' : 'created'} successfully`)
        reset()
        onClose?.()
      },
      onError: () =>
        toast.error(`Failed to ${isEdit ? 'update' : 'create'} member`),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Full Name"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message}
      />
      <InputField
        label="Position"
        {...register('position', { required: 'Position is required' })}
        error={errors.position?.message}
      />
      <SelectField
        options={[
          { label: 'Council Excos', value: 'Council' },
          { label: 'Management Team', value: 'Management' },
          { label: 'Legislative Arm', value: 'Legislative' },
        ]}
        label="Office"
        {...register('office', { required: 'Office is required' })}
        error={errors.office?.message}
      />
      {/* <InputField
        label="Rank"
        type="number"
        {...register('rank', {
          required: 'Rank is required',
          valueAsNumber: true,
        })}
        error={errors.rank?.message}
      /> */}

      <div>
        <label className="text-sm font-medium">Image File</label>
        <input
          type="file"
          accept="image/*"
          {...register('image', {
            required: isEdit ? false : 'Image is required',
          })}
          className="w-full border border-gray-300 rounded p-2 mt-1"
        />
        <p className="text-sm text-gray-500">Max Size: 2MB</p>
        {errors.image && (
          <p className="text-xs text-red-500">{errors.image.message}</p>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={isPending || isSubmitting}
          className="bg-black text-white px-4 py-2 rounded cursor-pointer"
        >
          {isPending || isSubmitting || isPendingUpdate
            ? 'Saving...'
            : isEdit
            ? 'Update Member'
            : 'Create Member'}
        </button>
      </div>
    </form>
  )
}

export default CreateMemberForm
