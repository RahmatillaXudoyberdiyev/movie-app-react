import { useEffect, useState } from 'react'
import MovieCard from './components/MovieCard'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieModal from './components/MovieModal'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  original_language: string
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [movieList, setMovieList] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(handler)
  }, [searchTerm])

  const fetchMovies = async (query: string = '') => {
    if (query.trim().length < 3) {
      setMovieList([])
      setErrorMessage('Please enter at least 3 characters.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}`
      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) throw new Error('Network response was not ok')

      const data = await response.json()
      console.log('Fetched movies:', data)
      if (!data.results || data.results.length === 0) {
        setErrorMessage('No movies found.')
        setMovieList([])
        return
      }

      setMovieList(data.results)
    } catch (error) {
      console.error('Error fetching movies:', error)
      setErrorMessage('Failed to fetch movies. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchMovies(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>
            {isLoading ? (
              <p className="text-white ">
                <Spinner />
              </p>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  )
}

export default App
