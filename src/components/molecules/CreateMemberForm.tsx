import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
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
  initialData?: Partial<MemberFormInputs & { imageUrl?: string }>
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
    '/dashboard/create',
    'member-api'
  )
  const { mutate: updateMember, isPending: isPendingUpdate } = useUpdateData(
    '/dashboard/edit/member',
    'member-api'
  )

  const [existingImage, setExistingImage] = useState<string>('')

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key !== 'imageUrl') {
          setValue(key as keyof MemberFormInputs, value as string)
        } else {
          setExistingImage(typeof value === 'string' ? value : '')
        }
      })
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

    // const mutationFn = isEdit ? updateMember : createMember

    if (isEdit) {
      updateMember(
        { id: id || '', body: formData },
        {
          onSuccess: () => {
            toast.success('News updated successfully')
            reset()
            setExistingImage('')
            onClose?.()
          },
          onError: () => toast.error('Failed to update news'),
        }
      )
    } else {
      createMember(formData, {
        onSuccess: () => {
          toast.success('News created successfully')
          reset()
          setExistingImage('')
          onClose?.()
        },
        onError: () => toast.error('Failed to create news'),
      })
    }

    // mutationFn(
    //   { id: id || '', body: formData },
    //   {
    //     onSuccess: () => {
    //       toast.success(`Member ${isEdit ? 'updated' : 'created'} successfully`)
    //       reset()
    //       onClose?.()
    //     },
    //     onError: () =>
    //       toast.error(`Failed to ${isEdit ? 'update' : 'create'} member`),
    //   }
    // )
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
        {existingImage && (
          <div className="mb-2">
            <img
              src={existingImage}
              alt="Preview"
              className="h-32 w-full object-cover rounded border"
            />
          </div>
        )}
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
