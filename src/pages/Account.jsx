import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");

    if (!adminId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/customers/account/${adminId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError("Failed to load account information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  if (loading) {
    return (
      <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-lg w-full mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">My Account</h2>
        <p className="text-gray-300">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-lg w-full mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">My Account</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-lg w-full mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">My Account</h2>

      <div className="space-y-4 mb-8 text-left">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            First Name
          </label>
          <p className="text-white text-lg">{userData?.firstName || "-"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Last Name
          </label>
          <p className="text-white text-lg">{userData?.lastName || "-"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <p className="text-white text-lg">{userData?.email || "-"}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleChangePassword}
          className="px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-lg cursor-pointer"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
