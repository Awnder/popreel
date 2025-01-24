export default function VideoUploadComponent() {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    const { data, error } = await supabase.storage.from('videos').upload(`${Date.now()}-${file.name}`, file)

    if (error) {
      console.error('upload failed:', error.message)
    } else {
      console.log('upload successful:', data)
    }
  }
}