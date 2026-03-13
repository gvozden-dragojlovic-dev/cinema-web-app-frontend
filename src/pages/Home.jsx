import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
        );
        if (response.ok) {
          const data = await response.json();
          setTrendingMovies(data.results.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch trending movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [API_KEY]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % trendingMovies.length);
  }, [trendingMovies.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? trendingMovies.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (trendingMovies.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [trendingMovies.length, nextSlide]);

  const handleWatchTrailer = async (movieId) => {
    setLoadingTrailer(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        const trailer = data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
          setShowTrailer(true);
        } else {
          alert("No trailer available for this movie.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
    } finally {
      setLoadingTrailer(false);
    }
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setTrailerKey(null);
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }

  if (trendingMovies.length === 0) {
    return (
      <div className="w-full flex flex-col items-center px-4 pt-8">
        <h1
          className="text-4xl font-extrabold mb-6 drop-shadow-2xl text-white"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Find <span className="text-purple-500">Movies</span> You'll Enjoy
          Without The Hastle
        </h1>
      </div>
    );
  }

  const currentMovie = trendingMovies[currentSlide];
  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : null;

  return (
    <div className="w-full">
      <div className="relative w-full h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
            backgroundColor: backdropUrl ? "transparent" : "#1f2937",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-gray-900/80"></div>
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-8 md:px-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  #{currentSlide + 1} Trending Today
                </span>
              </div>

              <h1
                className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {currentMovie.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-semibold">
                    {currentMovie.vote_average?.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-300">
                  {currentMovie.release_date?.substring(0, 4)}
                </span>
              </div>

              <p className="text-gray-200 text-lg mb-6 line-clamp-3">
                {currentMovie.overview}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleWatchTrailer(currentMovie.id)}
                  disabled={loadingTrailer}
                  className="btn btn-primary btn-lg gap-2"
                >
                  {loadingTrailer ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {trendingMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-purple-500 w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {showTrailer && trailerKey && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-4xl bg-gray-900 p-0">
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 flex justify-end">
              <button onClick={closeTrailer} className="btn btn-ghost">
                Close
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/80" onClick={closeTrailer}></div>
        </div>
      )}
    </div>
  );
}
