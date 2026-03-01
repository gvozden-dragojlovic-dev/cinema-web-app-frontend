import { useState } from "react";
import ccLogo from "../assets/cc_logo.png";

export default function Header({
  view,
  setView,
  favorites,
  setPage,
  isLoggedIn,
  userEmail,
  onLogout,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
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
                view === "coming-soon"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => handleNavClick("coming-soon")}
            >
              Coming Soon
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
          {isLoggedIn ? (
            <div
              className="relative"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-700 transition cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full pt-2 w-48 z-50">
                  <div className="bg-gray-800 rounded-lg shadow-lg py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setView("account");
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition cursor-pointer"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setView("buy-ticket");
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition cursor-pointer"
                    >
                      Buy Ticket
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setView("history");
                      }}
                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition cursor-pointer"
                    >
                      History
                    </button>
                    <hr className="my-2 border-gray-600" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
