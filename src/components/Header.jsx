import ccLogo from "../assets/cc_logo.png";

export default function Header({
  view,
  setView,
  favorites,
  setPage,
}) {
  const handleLogoClick = () => {
    if (view === "home") {
      window.location.reload();
    } else {
      setView("home");
      setPage(1);
      window.scrollTo(0, 0);
    }
  };

  const handleNavClick = (newView) => {
    setView(newView);
    setPage(1);
    window.scrollTo(0, 0);
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={ccLogo}
            alt="Cinema City Logo"
            className="w-16 h-16 rounded-full cursor-pointer object-cover"
            onClick={handleLogoClick}
          />
        </div>

        <div className="flex-1 flex justify-center">
          <div className="tabs gap-2">
            <a
              className={`tab font-semibold transition-colors rounded-lg px-4 py-2 ${
                view === "home"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavClick("home")}
            >
              Home
            </a>
            <a
              className={`tab font-semibold transition-colors rounded-lg px-4 py-2 ${
                view === "popular"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavClick("popular")}
            >
              Popular
            </a>
            <a
              className={`tab font-semibold transition-colors rounded-lg px-4 py-2 ${
                view === "favorites"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavClick("favorites")}
            >
              Favorites ({favorites.length})
            </a>
            <a
              className={`tab font-semibold transition-colors rounded-lg px-4 py-2 ${
                view === "trending"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavClick("trending")}
            >
              Trending
            </a>
            <a
              className={`tab font-semibold transition-colors rounded-lg px-4 py-2 ${
                view === "toprated"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavClick("toprated")}
            >
              Top Rated
            </a>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setView("login")}
            className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-gray-900"
          >
            Login
          </button>
          <button
            onClick={() => setView("register")}
            className="btn btn-sm bg-purple-500 hover:bg-purple-600 border-none text-white"
          >
            Registration
          </button>
        </div>
      </div>
    </header>
  );
}
