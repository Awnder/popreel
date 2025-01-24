
export default function VideoRenderComponent() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const fetchVideos = async () => {
      const { data, error } = await supabase.storage.from('videos').getPublicUrl(t)

      if (error) {
        console.error('fetch failed:', error.message)
      } else {
        setVideos(data)
      }
    }

    fetchVideos()
  }, [])

  return (
    <ul>
      {videos.map((video) => (
        <li>
          <video src={video.url} controls />
        </li>
      ))}
    </ul>
  )
}