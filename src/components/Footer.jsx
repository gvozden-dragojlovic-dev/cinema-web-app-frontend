export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CiderssCinema</h3>
            <p className="text-sm mb-4">
              Discover everything you need for an amazing movie experience. Watch your favorite films and explore timeless classics.
            </p>
            <div className="flex gap-4">
              <a href="#twitter">Twitter</a>
              <a href="#instagram">Instagram</a>
              <a href="#facebook">Facebook</a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home">Home</a></li>
              <li><a href="#popular">Popular</a></li>
              <li><a href="#trending">Trending</a></li>
              <li><a href="#toprated">Top Rated</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#help">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Cinemas</h4>
            <ul className="space-y-2 text-sm">
              <li>Belgrade</li>
              <li>New York</li>
              <li>London</li>
              <li>Paris</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span>© 2026 CiderssCinema. All rights reserved.</span>
              <span>•</span>
              <span>
                Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-purple-500">TMDB API</a>
              </span>
            </div>
            <div className="flex gap-6">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
