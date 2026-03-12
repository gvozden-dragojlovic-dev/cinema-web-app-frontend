import { useState, useEffect } from "react";

export default function History() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const adminId = localStorage.getItem("adminId");

    if (!adminId) {
      setError("You must be logged in to view history");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/cinema/history/${adminId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();
      setPurchases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-6xl w-full mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Purchase History
        </h2>
        <p className="text-gray-300 text-center">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-6xl w-full mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Purchase History
        </h2>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-6xl w-full mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Purchase History
      </h2>

      {purchases.length === 0 ? (
        <p className="text-gray-400 text-center">No purchases found</p>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-50 rounded-lg p-6 border border-gray-700"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Movie
                  </label>
                  <p className="text-white">{purchase.movieTitle || "-"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Hall
                  </label>
                  <p className="text-white">{purchase.hallName || "-"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Projection Type
                  </label>
                  <p className="text-white">{purchase.projectionType || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Price per Ticket
                  </label>
                  <p className="text-white">{purchase.price ? `${purchase.price} RSD` : "-"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Projection Date & Time
                  </label>
                  <p className="text-white">{formatDateTime(purchase.dateTime)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tickets ({purchase.tickets?.length || 0})
                </label>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="py-2 text-gray-400 font-medium">Viewer</th>
                      <th className="py-2 text-gray-400 font-medium">Email</th>
                      <th className="py-2 text-gray-400 font-medium">Seat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase.tickets?.map((ticket, ticketIndex) => (
                      <tr key={ticketIndex} className="border-b border-gray-700">
                        <td className="py-2 text-white">
                          {ticket.viewerFirstName} {ticket.viewerLastName}
                        </td>
                        <td className="py-2 text-white">{ticket.viewerEmail}</td>
                        <td className="py-2 text-white">{ticket.seat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <span className="text-gray-400 text-sm">
                  Total: {(purchase.price * (purchase.tickets?.length || 0)).toFixed(2)} RSD
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
