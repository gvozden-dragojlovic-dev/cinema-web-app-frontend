import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

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
    setRegEmail(value);
    validateEmail(value);
  };

  const isEmailValid =
    regEmail && !emailError && regEmail.includes("@gmail.com");

  const handleRegister = async () => {
    setServerError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/customers/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email: regEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error);
        return;
      }

      setGeneratedPassword(data.password);
      setSuccessMessage(data.message);
    } catch (err) {
      setServerError("Server error");
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    alert("Password copied to clipboard!");
  };

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto mx-auto">
      {successMessage ? (
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-white mb-8">Sign Up</h2>
          <p className="text-green-400 text-xl mb-6">{successMessage}</p>
          <div className="bg-gray-800 p-6 rounded-lg inline-block">
            <p className="text-gray-300 mb-2">Password:</p>
            <p className="text-white text-2xl font-mono font-bold mb-4">
              {generatedPassword}
            </p>
            <button
              onClick={copyPassword}
              className="bg-purple-600 px-6 py-2 rounded-lg text-white hover:bg-purple-700 cursor-pointer font-semibold"
            >
              Copy Password
            </button>
          </div>
          <div className="mt-8">
            <button
              onClick={() => navigate("/login")}
              className="text-purple-500 hover:text-purple-400 font-semibold cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-white mb-8">Sign Up</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
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
                className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={regEmail}
              onChange={handleEmailChange}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Enter your email"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-2">{emailError}</p>
            )}
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

          {serverError && (
            <p className="mb-4 text-base text-red-500">
              {serverError}
            </p>
          )}

          <button
            disabled={
              !firstName ||
              !lastName ||
              !isEmailValid ||
              !agreeTerms
            }
            onClick={handleRegister}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              firstName &&
              lastName &&
              isEmailValid &&
              agreeTerms
                ? "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Create Account
          </button>

          <div className="mt-6 text-center">
            <span className="text-gray-400">
              Already have an account?
            </span>{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-purple-500 hover:text-purple-400 font-semibold cursor-pointer"
            >
              Login
            </button>
          </div>
        </>
      )}
    </div>
  );
}