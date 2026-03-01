import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("");
      return false;
    }
    if (!value.includes("@gmail.com")) {
      setEmailError("This is not a valid email address");
      return false;
    }
    const emailWithoutDomain = value.replace("@gmail.com", "");
    if (!emailWithoutDomain) {
      setEmailError("This is not a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const isEmailValid = email && !emailError && email.includes("@gmail.com");

  const handleLogin = async () => {
    if (!isEmailValid || !password) return;

    try {
      const response = await fetch("http://localhost:8080/api/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setServerMessage(errorText);
        return;
      }

      const data = await response.json();

      localStorage.setItem("adminId", data.id);
      localStorage.setItem("adminEmail", data.email);

      setServerMessage("Login successful");

      if (onLoginSuccess) {
        onLoginSuccess(data.email);
      }

    } catch (error) {
      setServerMessage("Server error");
    }
  };

  return (
    <div className="flex items-center justify-center w-full px-4">
      <div className="p-12 max-w-xl w-full">
        <h2
          className="text-5xl font-extrabold mb-8 text-white italic"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          <span className="text-purple-500">Ciderss</span>Cinema
        </h2>

        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-300 mb-3 text-left">
            Username/Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 border border-gray-400 rounded-lg focus:outline-none focus:border-purple-500 text-base"
            placeholder="Enter your email"
          />
          {emailError && (
            <p className="text-red-500 text-base mt-3">{emailError}</p>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-300 mb-3 text-left">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 border border-gray-400 rounded-lg focus:outline-none focus:border-purple-500 text-base"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-white"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {serverMessage && (
          <p className={`mb-4 text-base ${serverMessage === "Login successful" ? "text-green-500" : "text-red-500"}`}>
            {serverMessage}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={!isEmailValid || !password}
          className={`w-full py-3 rounded-lg font-semibold text-base transition ${
            isEmailValid && password
              ? "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Login
        </button>

        <div className="mt-8 text-center">
          <span className="text-gray-400 text-base">
            Not a member of CiderssCinema group? </span>
          <button
            onClick={() => navigate("/register")}
            className="text-purple-500 hover:text-purple-400 font-semibold text-base cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
