import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [favoriteCinema, setFavoriteCinema] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [country, setCountry] = useState("Serbia");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Sign Up</h2>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Required Information</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Favorite Cinema
            </label>
            <select
              value={favoriteCinema}
              onChange={(e) => setFavoriteCinema(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="">Select</option>
              <option value="belgrade">Belgrade</option>
              <option value="newyork">New York</option>
              <option value="london">London</option>
              <option value="paris">Paris</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showRegPassword ? "text" : "password"}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(!showRegPassword)}
                className="absolute right-3 top-3 text-white"
              >
                {showRegPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-white"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Optional Information</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
            placeholder="Enter your mobile number"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="Serbia">Serbia</option>
              <option value="Croatia">Croatia</option>
              <option value="Bosnia">Bosnia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Slovenia">Slovenia</option>
              <option value="North Macedonia">North Macedonia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Street address"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Postal code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="City"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm text-gray-300">
            Yes, I agree with the terms and conditions
          </span>
        </label>
      </div>

      <button
        disabled={!firstName || !lastName || !dateOfBirth || !gender || !favoriteCinema || !regEmail || !regPassword || !confirmPassword || !agreeTerms || regPassword !== confirmPassword}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          firstName && lastName && dateOfBirth && gender && favoriteCinema && regEmail && regPassword && confirmPassword && agreeTerms && regPassword === confirmPassword
            ? "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        Create Account
      </button>

      <div className="mt-6 text-center">
        <span className="text-gray-400">Already have an account? </span>
        <button
          onClick={() => navigate("/login")}
          className="text-purple-500 hover:text-purple-400 font-semibold cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
}
