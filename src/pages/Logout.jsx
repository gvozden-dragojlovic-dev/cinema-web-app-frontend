import { useState } from "react";

export default function Logout({
  setView,
  onLogoutSuccess,
}) {
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    try {
      const adminId = localStorage.getItem("adminId");

      const response = await fetch(
        `http://localhost:8080/api/customers/logout/${adminId}`,
        {
          method: "POST",
        }
      );

      const text = await response.text();

      if (!response.ok) {
        setMessage(text);
        return;
      }

      localStorage.removeItem("adminId");
      localStorage.removeItem("adminEmail");

      setMessage("Logout successful");

      if (onLogoutSuccess) {
        onLogoutSuccess();
      }

      setTimeout(() => {
        setView("home");
      }, 1000);

    } catch (error) {
      setMessage("Failed to logout");
    }
  };

  return (
    <div className="flex items-center justify-center w-full px-4">
      <div className="p-12 max-w-xl w-full text-center">

        <h2
          className="text-5xl font-extrabold mb-8 text-white italic"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          <span className="text-purple-500">Ciderss</span>Cinema
        </h2>

        <p className="text-gray-300 mb-8 text-lg">
          Are you sure you want to logout?
        </p>

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-lg font-semibold text-base transition bg-red-600 text-white hover:bg-red-700 cursor-pointer"
        >
          Logout
        </button>

        {message && (
          <p
            className={`mt-4 text-base ${
              message === "Logout successful"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}