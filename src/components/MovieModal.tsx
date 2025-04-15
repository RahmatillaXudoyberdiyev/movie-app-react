import { useRef, useEffect } from 'react'

interface Movie {
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  original_language: string
}

interface Props {
  movie: Movie
  onClose: () => void
}

function MovieModal({ movie, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-dark-100 text-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            className="w-full md:w-1/3 rounded-lg"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/no-movie.png'
            }
            alt={movie.title}
          />
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
            <p className="text-sm text-gray-400 mb-1">
              Language: {movie.original_language.toUpperCase()}
            </p>
            <p className="text-sm text-gray-400 mb-1">
              Release Date: {movie.release_date.replace(/-/g, '/')}
            </p>
            <p className="text-sm text-yellow-500 mb-4">
              Rating: ⭐ {movie.vote_average.toFixed(1)}
            </p>
            <p className="text-gray-300 text-sm">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal
