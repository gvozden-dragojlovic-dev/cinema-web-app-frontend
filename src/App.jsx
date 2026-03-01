import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import ErrorMessage from "./components/ErrorMessage";
import MovieCard from "./components/MovieCard";
import MovieDetailsModal from "./components/MovieDetailsModal";
import Pagination from "./components/Pagination";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import ChangePassword from "./components/ChangePassword";
import backgroundMain from "./assets/background-main.png";
import cinemaLogin from "./assets/cinema_login_3.webp";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("userEmail") || "";
  });
  const [view, setView] = useState(() => {
    const pathView = location.pathname.replace("/", "") || "home";
    return ["home", "popular", "coming-soon", "toprated", "favorites", "login", "register", "account", "change-password"].includes(pathView) ? pathView : "home";
  });

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const itemsPerPage = 20;
  const filteredFavorites = favorites.filter((movie) =>
    searchTerm ? movie.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );
  const totalFavoritesPages = Math.ceil(filteredFavorites.length / itemsPerPage);
  const paginatedFavorites = filteredFavorites.slice(
    (favoritesPage - 1) * itemsPerPage,
    favoritesPage * itemsPerPage
  );

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
    const path = location.pathname;
    if (path === "/") {
      navigate("/home", { replace: true });
      return;
    }
    const pathView = path.replace("/", "");
    if (["home", "popular", "coming-soon", "toprated", "favorites", "login", "register", "account", "change-password"].includes(pathView)) {
      setView(pathView);
    }
  }, [location.pathname, navigate]);

  const handleViewChange = (newView) => {
    setView(newView);
    setSearchTerm("");
    setPage(1);
    navigate(`/${newView}`);
  };

  useEffect(() => {
    if (view === "favorites") {
      setFavoritesPage(1);
    }
  }, [view]);

  useEffect(() => {
    if (view === "favorites" && favoritesPage > totalFavoritesPages && totalFavoritesPages > 0) {
      setFavoritesPage(totalFavoritesPages);
    }
  }, [favorites, view, favoritesPage, totalFavoritesPages, searchTerm]);

  useEffect(() => {
    if (view === "favorites" || view === "home" || view === "login" || view === "register") {
      setMovies([]);
      setError(null);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      setMovies([]);

      try {
        let url;
        if (searchTerm) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            searchTerm
          )}&page=${page}`;
        } else if (view === "popular") {
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
        } else if (view === "coming-soon") {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_date.gte=${tomorrowStr}&sort_by=primary_release_date.asc&page=${page}`;
        } else if (view === "toprated") {
          url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`;
        }
        const response = await fetch(url, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error("Failed to fetch movies.");
        }
        const data = await response.json();
        if (isMounted) {
          console.log(data);
          setMovies(data.results);
          setTotalPages(Math.min(data.total_pages || 0, 500));
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          setError("Failed to fetch movies.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [searchTerm, page, view, API_KEY]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
    setFavoritesPage(1);
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

  const displayMovies = view === "favorites" ? paginatedFavorites : movies;

  const handleLoginSuccess = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    setView("home");
    navigate("/home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setView("home");
    navigate("/home");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        view={view}
        setView={handleViewChange}
        favorites={favorites}
        page={page}
        setPage={setPage}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      <main
        className="grow w-full flex flex-col items-center text-center"
        style={{
          backgroundImage:
            view === "login" || view === "register" || view === "account" || view === "change-password"
              ? `url(${cinemaLogin})`
              : `url(${backgroundMain})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {view === "login" && (
          <div className="w-full flex items-center justify-center px-4">
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        )}

        {view === "register" && (
          <div className="w-full flex items-center justify-center px-4 py-8">
            <Register />
          </div>
        )}

        {view === "account" && (
          <div className="w-full flex items-center justify-center px-4 py-8">
            <Account userEmail={userEmail} />
          </div>
        )}

        {view === "change-password" && (
          <div className="w-full flex items-center justify-center px-4 py-8">
            <ChangePassword />
          </div>
        )}

        {view === "home" && (
          <h1 className="text-4xl font-extrabold mb-6 drop-shadow-2xl mt-8 text-white" style={{ fontFamily: "'Space Mono', monospace" }}>
            Find <span className="text-purple-500">Movies</span> You'll Enjoy
            Without The Hastle
          </h1>
        )}
        {view !== "login" && view !== "register" && view !== "home" && view !== "account" && view !== "change-password" && (
          <div className="w-full px-4 pt-8">
            <div className="w-full max-w-md mb-6 mx-auto">
              <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
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
              <div className="mt-6 px-8 pb-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {view === "favorites" && totalFavoritesPages > 1 && displayMovies.length > 0 && (
              <div className="mt-6 px-8 pb-8">
                <Pagination
                  currentPage={favoritesPage}
                  totalPages={totalFavoritesPages}
                  onPageChange={setFavoritesPage}
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/home" element={<AppContent />} />
        <Route path="/popular" element={<AppContent />} />
        <Route path="/coming-soon" element={<AppContent />} />
        <Route path="/toprated" element={<AppContent />} />
        <Route path="/favorites" element={<AppContent />} />
        <Route path="/login" element={<AppContent />} />
        <Route path="/register" element={<AppContent />} />
        <Route path="/account" element={<AppContent />} />
        <Route path="/change-password" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}