'use client'

import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { usePostData, useUpdateData } from '../../hooks/useApiHooks'
import InputField from '../atoms/InputField'
import TextAreaField from '../atoms/TextAreaField'

type NewsFormInputs = {
  header: string
  content: string
  date?: string
}

interface CreateNewsFormProps {
  onClose?: () => void
  isEdit?: boolean
  id?: string
  initialData?: Partial<NewsFormInputs & { imageUrl?: string }>
}

const CreateNewsForm: React.FC<CreateNewsFormProps> = ({
  onClose,
  isEdit = false,
  id,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormInputs>()

  const [file, setFile] = useState<File | null>(null)
  const [existingImage, setExistingImage] = useState<string>('')

  const { mutate: createNews, isPending } = usePostData(
    '/dashboard/create',
    'news-api'
  )
  const { mutate: updateNews, isPending: isPendingUpdate } = useUpdateData(
    '/dashboard/edit/news',
    'news-api'
  )

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key !== 'imageUrl') {
          setValue(key as keyof NewsFormInputs, value as string)
        } else {
          setExistingImage(value || '')
        }
      })
    }
  }, [initialData, setValue])

  // const header = watch('header')
  // const content = watch('content')
  // const date = watch('date')
  // const type = 'news'
  // const image =
  //
  // const dataToSubmit = {
  //   header,
  //   content,
  //   date,
  //   type,
  //   image,
  // }

  // if (file) formData.append('image', file)

  const onSubmit = (data: NewsFormInputs) => {
    if (!isEdit && !file) {
      toast.error('Please upload an image')
      return
    }

    const formData = new FormData()
    formData.append('header', data.header)
    formData.append('content', JSON.stringify(data.content))
    // formData.append('content', data.content)
    // formData.append('date', data.date)
    formData.append('type', 'news')
    if (file) formData.append('image', file)

    // const mutation = isEdit ? updateNews : createNews

    // mutation(
    //   { id: id || '', body: formData },
    //   {
    //     onSuccess: () => {
    //       toast.success(`News ${isEdit ? 'updated' : 'created'} successfully`)
    //       reset()
    //       setFile(null)
    //       setExistingImage('')
    //       onClose?.()
    //     },
    //     onError: () =>
    //       toast.error(`Failed to ${isEdit ? 'update' : 'create'} news`),
    //   }
    // )

    if (isEdit) {
      updateNews(
        { id: id || '', body: formData },
        {
          onSuccess: () => {
            toast.success('News updated successfully')
            reset()
            setFile(null)
            setExistingImage('')
            onClose?.()
          },
          onError: () => toast.error('Failed to update news'),
        }
      )
    } else {
      createNews(formData, {
        onSuccess: () => {
          toast.success('News created successfully')
          reset()
          setFile(null)
          setExistingImage('')
          onClose?.()
        },
        onError: () => toast.error('Failed to create news'),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Headline"
        {...register('header', { required: 'Headline is required' })}
        error={errors.header?.message}
      />
      {/* <InputField
        label="Date"
        type="date"
        {...register('date', { required: 'Date is required' })}
        error={errors.date?.message}
      /> */}
      <TextAreaField
        label="Content"
        rows={5}
        {...register('content', { required: 'Content is required' })}
        error={errors.content?.message}
      />

      <div>
        <label className="text-sm font-medium">Upload Image</label>
        {existingImage && !file && (
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
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm border mt-1 p-2"
        />
        {isEdit ? (
          <p className="text-xs text-gray-500">
            Leave blank to keep the current image
          </p>
        ) : (
          <p className="text-xs text-gray-500">Required</p>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-4 py-2 rounded cursor-pointer"
        >
          {isSubmitting || isPending || isPendingUpdate
            ? isEdit
              ? 'Updating...'
              : 'Creating...'
            : isEdit
            ? 'Update News'
            : 'Create News'}
        </button>
      </div>
    </form>
  )
}

export default CreateNewsForm
