import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/customers/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminId: adminId,
            currentPassword: currentPassword,
            newPassword: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to change password");
      }

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/account");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-lg w-full mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Change Password
      </h2>

      <div className="space-y-4 mb-8 text-left">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-2.5 text-white cursor-pointer"
            >
              {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-2.5 text-white cursor-pointer"
            >
              {showNewPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-white cursor-pointer"
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          loading
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
        }`}
      >
        {loading ? "Saving..." : "Save"}
      </button>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/account")}
          className="text-purple-500 hover:text-purple-400 font-semibold cursor-pointer"
        >
          Back to My Account
        </button>
      </div>
    </div>
  );
}
