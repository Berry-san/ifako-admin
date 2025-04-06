// lib/uploadToCloudinary.ts
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'your_upload_preset') // Set in your Cloudinary account

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) throw new Error('Upload failed')

  const data = await response.json()
  return data.secure_url
}
