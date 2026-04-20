import { useState, useEffect } from "react";

export default function BuyTicket() {

  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [viewers, setViewers] = useState([]);

  const [screenings, setScreenings] = useState([]);
  const [selectedScreening, setSelectedScreening] = useState("");

  const [tickets, setTickets] = useState([]);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(null);

  const [message, setMessage] = useState({ text: "", type: "" });
  const [ticketMessage, setTicketMessage] = useState({ text: "", type: "" });
  const [screeningError, setScreeningError] = useState("");

  const [selectedViewer, setSelectedViewer] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");

  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const [formData, setFormData] = useState({
    movieId: "",
    hallId: ""
  });

  useEffect(() => {
    fetchMovies();
    fetchHalls();
    fetchViewers();
  }, []);

  useEffect(() => {
    if (formData.movieId && formData.hallId) {
      fetchScreenings();
    } else {
      setScreenings([]);
      setSelectedScreening("");
    }
  }, [formData.movieId, formData.hallId]);

  useEffect(() => {
    if (selectedScreening) {
      fetchOccupiedSeats();
    } else {
      setOccupiedSeats([]);
    }
  }, [selectedScreening]);

  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/cinema/movies");
      const data = await res.json();
      setMovies(Array.isArray(data) ? data : []);
    } catch {
      console.error("Movies loading failed");
    }
  };

  const fetchHalls = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/cinema/halls");
      const data = await res.json();
      setHalls(Array.isArray(data) ? data : []);
    } catch {
      console.error("Halls loading failed");
    }
  };

  const fetchViewers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/cinema/viewers");
      const data = await res.json();
      setViewers(Array.isArray(data) ? data : []);
    } catch {
      console.error("Viewers loading failed");
    }
  };

  const fetchScreenings = async () => {
    try {
      const adminId = localStorage.getItem("adminId");

      const res = await fetch(
        `http://localhost:8080/api/cinema/screenings?movieId=${formData.movieId}&hallId=${formData.hallId}&adminId=${adminId}`
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        setScreenings([]);
        setScreeningError("No projections for selected movie and hall");
        return;
      }

      setScreenings(data);
      setScreeningError("");

    } catch (err) {
      console.error(err);
      setScreeningError("Failed to load projections");
    }
  };

  const fetchOccupiedSeats = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/cinema/occupied-seats/${selectedScreening}`
      );

      const data = await res.json();
      setOccupiedSeats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load occupied seats");
    }
  };

  const handleAddTicket = () => {
    setTicketMessage({ text: "", type: "" });

    if (!selectedViewer || !selectedSeat) return;

    const viewerId = Number(selectedViewer);

    if (tickets.some(t => t.seat === selectedSeat)) {
      setTicketMessage({ text: "Seat already selected", type: "error" });
      return;
    }

    const viewer = viewers.find(v => v.id === viewerId);
    if (!viewer) return;

    setTickets([
      ...tickets,
      {
        viewerId: viewer.id,
        viewerName: viewer.firstName + " " + viewer.lastName,
        email: viewer.email,
        seat: selectedSeat
      }
    ]);

    setSelectedViewer("");
    setSelectedSeat("");
  };

  const handleDeleteTicket = () => {
    if (selectedTicketIndex === null) return;

    setTickets(tickets.filter((_, i) => i !== selectedTicketIndex));
    setSelectedTicketIndex(null);
  };

  const handleBuyTickets = async () => {
    setMessage({ text: "", type: "" });

    if (!selectedScreening) {
      setMessage({ text: "Select projection", type: "error" });
      return;
    }

    if (tickets.length === 0) {
      setMessage({ text: "Add at least one ticket", type: "error" });
      return;
    }

    const adminId = localStorage.getItem("adminId");

    if (!adminId) {
      setMessage({ text: "You must be logged in", type: "error" });
      return;
    }

    try {
      const payload = {
        adminId: Number(adminId),
        screeningId: Number(selectedScreening),
        tickets: tickets.map(t => ({
          viewerId: t.viewerId,
          seat: t.seat
        }))
      };

      const res = await fetch("http://localhost:8080/api/cinema/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();

      const msg = await res.text();

      setMessage({ text: msg || "Purchase successful!", type: "success" });

      setTickets([]);
      setSelectedScreening("");
      setSelectedTicketIndex(null);
      setOccupiedSeats([]);

    } catch (err) {
      console.error(err);
      setMessage({ text: "Ticket purchase failed", type: "error" });
    }
  };

  const seats = [];
  for (let r of ["A", "B", "C", "D", "E", "F", "G"]) {
    for (let c = 1; c <= 7; c++) {
      seats.push(r + c);
    }
  }

  const availableSeats = seats.filter(
    s => !occupiedSeats.includes(s) && !tickets.some(t => t.seat === s)
  );

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-4xl w-full mx-auto">

      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Buy Ticket
      </h2>

      <div className="mb-6">
        <h3 className="text-xl text-white mb-3">Projection</h3>

        <div className="grid grid-cols-2 gap-4">

          <select
            value={formData.movieId}
            onChange={e => setFormData({ ...formData, movieId: e.target.value })}
            className="p-2 bg-gray-800 text-white rounded"
          >
            <option value="">Select movie</option>
            {movies.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          <select
            value={formData.hallId}
            onChange={e => setFormData({ ...formData, hallId: e.target.value })}
            className="p-2 bg-gray-800 text-white rounded"
          >
            <option value="">Select hall</option>
            {halls.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

        </div>

        {screeningError && (
          <p className="text-red-500 mt-2">{screeningError}</p>
        )}

        {selectedScreening && availableSeats.length === 0 && (
          <p className="text-red-500 mt-2">
            All seats are occupied for this projection
          </p>
        )}

        {screenings.length > 0 && (
          <select
            value={selectedScreening}
            onChange={e => setSelectedScreening(e.target.value)}
            className="w-full mt-3 p-2 bg-gray-800 text-white rounded"
          >
            <option value="">Select projection</option>
            {screenings.map(s => (
              <option key={s.id} value={s.id}>
                {new Date(s.dateTime).toLocaleString()} | {s.projectionType} | {s.ticketPrice}$
              </option>
            ))}
          </select>
        )}
      </div>

      <div>

        <h3 className="text-xl text-white mb-3">Tickets</h3>

        <div className="grid grid-cols-2 gap-4">

          <select
            value={selectedViewer}
            onChange={e => setSelectedViewer(e.target.value)}
            className="p-2 bg-gray-800 text-white rounded"
          >
            <option value="">Viewer</option>
            {viewers.map(v => (
              <option key={v.id} value={v.id}>
                {v.firstName} {v.lastName}
              </option>
            ))}
          </select>

          <select
            value={selectedSeat}
            onChange={e => setSelectedSeat(e.target.value)}
            className="p-2 bg-gray-800 text-white rounded"
          >
            <option value="">Seat</option>
            {availableSeats.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

        </div>

        {ticketMessage.text && (
          <p className="text-red-500 mt-2">{ticketMessage.text}</p>
        )}

        <div className="flex gap-3 mt-3">
          <button
            onClick={handleAddTicket}
            className="bg-blue-600 px-4 py-2 text-white rounded cursor-pointer"
          >
            Add
          </button>

          <button
            onClick={handleDeleteTicket}
            disabled={selectedTicketIndex === null}
            className={`bg-red-600 px-4 py-2 text-white rounded cursor-pointer ${
              selectedTicketIndex === null ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Delete
          </button>
        </div>

        <table className="w-full mt-4 text-white">
          <thead>
            <tr className="border-b border-gray-600">
              <th>Viewer</th>
              <th>Email</th>
              <th>Seat</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr
                key={i}
                onClick={() => setSelectedTicketIndex(i)}
                className={`cursor-pointer ${selectedTicketIndex === i ? "bg-gray-700" : ""}`}
              >
                <td>{t.viewerName}</td>
                <td>{t.email}</td>
                <td>{t.seat}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {message.text && (
        <p className={`mt-4 text-center ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
          {message.text}
        </p>
      )}

      <button
        onClick={handleBuyTickets}
        className="w-full mt-4 bg-purple-600 text-white py-3 rounded cursor-pointer"
      >
        Buy Ticket/s
      </button>

    </div>
  );
}