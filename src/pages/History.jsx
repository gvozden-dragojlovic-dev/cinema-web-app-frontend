import { useState, useEffect } from "react";

export default function History() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

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

      const filteredData = Array.isArray(data)
        ? data.filter(
            (purchase) =>
              Array.isArray(purchase.tickets) &&
              purchase.tickets.length > 0
          )
        : [];

      setPurchases(filteredData);
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
      minute: "2-digit",
    });
  };

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
        <div className="space-y-4">
          {purchases.map((purchase, index) => {
            const ticketCount = Array.isArray(purchase.tickets)
              ? purchase.tickets.length
              : 0;

            const total = purchase.price * ticketCount;

            return (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-60 rounded-lg border border-gray-700 overflow-hidden"
              >
                <div
                  onClick={() => toggleOpen(index)}
                  className="cursor-pointer p-4 flex justify-between items-center hover:bg-gray-700 transition"
                >
                  <div>
                    <p className="text-white font-semibold">
                      {purchase.movieTitle}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatDateTime(purchase.dateTime)} | {purchase.hallName}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-purple-400 font-semibold">
                      {total.toFixed(2)} RSD
                    </p>
                    <p className="text-gray-400 text-sm">
                      {ticketCount} ticket(s)
                    </p>
                  </div>
                </div>

                {openIndex === index && (
                  <div className="p-6 border-t border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-gray-400 text-sm">
                          Projection Type
                        </label>
                        <p className="text-white">
                          {purchase.projectionType || "-"}
                        </p>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm">
                          Price per Ticket
                        </label>
                        <p className="text-white">
                          {purchase.price
                            ? `${purchase.price} RSD`
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm">Total</label>
                        <p className="text-purple-400 font-semibold">
                          {total.toFixed(2)} RSD
                        </p>
                      </div>
                    </div>

                    <table className="w-full text-left mt-4">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="py-2 text-gray-400">#</th>
                          <th className="py-2 text-gray-400">Viewer</th>
                          <th className="py-2 text-gray-400">Email</th>
                          <th className="py-2 text-gray-400">Seat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchase.tickets.map((ticket, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-700"
                          >
                            <td className="py-2 text-gray-300">
                              {i + 1}
                            </td>
                            <td className="py-2 text-white">
                              {ticket.viewerFirstName}{" "}
                              {ticket.viewerLastName}
                            </td>
                            <td className="py-2 text-white">
                              {ticket.viewerEmail}
                            </td>
                            <td className="py-2 text-white">
                              {ticket.seat}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}