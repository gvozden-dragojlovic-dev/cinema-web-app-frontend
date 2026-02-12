import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import ErrorMessage from "./components/ErrorMessage";
import MovieCard from "./components/MovieCard";
import MovieDetailsModal from "./components/MovieDetailsModal";
import Pagination from "./components/Pagination";
import Header from "./components/Header";
import Footer from "./components/Footer";
import backgroundMain from "./assets/background-main.png";

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [view, setView] = useState("home");

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, initialized]);

  useEffect(() => {
    if (view === "favorites" || view === "home") {
      setMovies([]);
      return;
    }
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        let url;
        if (searchTerm) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            searchTerm
          )}&page=${page}`;
        } else if (view === "popular") {
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
        } else if (view === "trending") {
          url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${page}`;
        } else if (view === "toprated") {
          url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch movies.");
        }
        const data = await response.json();
        console.log(data);
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages || 0, 500));
      } catch {
        setError("Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [searchTerm, page, view]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const openModal = async (movieId) => {
    setError(null);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movie details.");
      }
      const data = await response.json();
      setSelectedMovie(data);
    } catch {
      setError("Failed to fetch movie details.");
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const toggleFavorite = (movie) => {
    const exists = favorites.some((fav) => fav.id === movie.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== movie.id));
    } else {
      const favMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        overview: movie.overview,
        vote_average: movie.vote_average,
      };
      setFavorites([...favorites, favMovie]);
    }
  };

  const isFavorite = (movieId) => favorites.some((fav) => fav.id === movieId);

  const displayMovies = view === "favorites" ? favorites : movies;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        view={view}
        setView={setView}
        favorites={favorites}
        page={page}
        setPage={setPage}
      />
      <main
        className="grow w-full flex flex-col items-center text-center pb-8"
        style={{
          backgroundImage: `url(${backgroundMain})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {view === "home" && (
          <h1 className="text-4xl font-extrabold mb-6 drop-shadow-2xl mt-8 text-white" style={{ fontFamily: "'Space Mono', monospace" }}>
            Find <span className="text-purple-500">Movies</span> You'll Enjoy
            Without The Hastle
          </h1>
        )}
        {view !== "home" && (
          <div className="w-full px-4 pt-8">
            <div className="w-full max-w-md mb-6 mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
            {loading && <Spinner />}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && displayMovies.length === 0 && (
              <div className="text-white text-lg">
                No movies found.{" "}
                {view === "favorites"
                  ? "Add some to your favorites!"
                  : "Try a different search term."}
              </div>
            )}
            {!loading && !error && displayMovies.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {displayMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite(movie.id)}
                    onViewDetails={openModal}
                  />
                ))}
              </div>
            )}

            {view !== "favorites" && totalPages > 1 && !loading && !error && (
              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}

        {selectedMovie && (
          <MovieDetailsModal
            movie={selectedMovie}
            onClose={closeModal}
            isFavorite={isFavorite(selectedMovie.id)}
            onToggleFavorite={() => toggleFavorite(selectedMovie)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;