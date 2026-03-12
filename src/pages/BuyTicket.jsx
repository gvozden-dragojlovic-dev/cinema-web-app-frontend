import { useState, useEffect } from "react";

export default function BuyTicket() {

  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [viewers, setViewers] = useState([]);

  const [tickets, setTickets] = useState([]);

  const [selectedViewer, setSelectedViewer] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");

  const [formData, setFormData] = useState({
    movieId: "",
    hallId: "",
    price: "",
    projectionType: "2D",
    dateTime: ""
  });

  useEffect(() => {
    fetchMovies();
    fetchHalls();
    fetchViewers();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/cinema/movies");

      if (!res.ok) throw new Error();

      const data = await res.json();

      setMovies(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Movies loading failed");
    }
  };

  const fetchHalls = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/cinema/halls");

      if (!res.ok) throw new Error();

      const data = await res.json();

      setHalls(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Halls loading failed");
    }
  };

  const fetchViewers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/cinema/viewers");

      if (!res.ok) throw new Error();

      const data = await res.json();

      setViewers(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Viewers loading failed");
    }
  };

  const handleAddTicket = () => {

    if (!selectedViewer || !selectedSeat) return;

    const viewerId = Number(selectedViewer);

    const viewerExists = tickets.some(t => t.viewerId === viewerId);

    const seatExists = tickets.some(t => t.seat === selectedSeat);

    if (viewerExists) {
      alert("Viewer already has a ticket");
      return;
    }

    if (seatExists) {
      alert("Seat already selected");
      return;
    }

    const viewer = viewers.find(v => v.id === viewerId);

    if (!viewer) return;

    const newTicket = {
      viewerId: viewer.id,
      viewerName: viewer.firstName + " " + viewer.lastName,
      email: viewer.email,
      seat: selectedSeat
    };

    setTickets([...tickets, newTicket]);

    setSelectedViewer("");
    setSelectedSeat("");
  };

  const handleDeleteTicket = () => {
    setTickets(tickets.slice(0, -1));
  };

  const handleBuyTickets = async () => {

    if (!formData.movieId || !formData.hallId || !formData.price || !formData.dateTime) {
      alert("Fill projection information");
      return;
    }

    if (tickets.length === 0) {
      alert("Add at least one ticket");
      return;
    }

    const adminId = localStorage.getItem("adminId");

    if (!adminId) {
      alert("You must be logged in to buy tickets");
      return;
    }

    try {

      const payload = {
        adminId: Number(adminId),
        movieId: Number(formData.movieId),
        hallId: Number(formData.hallId),
        projectionType: formData.projectionType,
        price: Number(formData.price),
        dateTime: formData.dateTime,
        tickets: tickets.map(t => ({
          viewerId: t.viewerId,
          seat: t.seat
        }))
      };

      const response = await fetch(
        "http://localhost:8080/api/cinema/buy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const message = await response.text();

      alert(message);

      setTickets([]);

      setFormData({
        movieId: "",
        hallId: "",
        price: "",
        projectionType: "2D",
        dateTime: ""
      });

    } catch (error) {

      console.error(error);
      alert("Ticket purchase failed");

    }

  };

  const seats = [];

  for (let row of ["A","B","C","D","E","F","G"]) {
    for (let col = 1; col <= 7; col++) {
      seats.push(row + col);
    }
  }

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-8 max-w-4xl w-full mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Buy Ticket
      </h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">
          Projection
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Movie
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              value={formData.movieId}
              onChange={e =>
                setFormData({ ...formData, movieId: e.target.value })
              }
            >
              <option value="">Select movie</option>
              {movies.map(m => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Hall
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              value={formData.hallId}
              onChange={e =>
                setFormData({ ...formData, hallId: e.target.value })
              }
            >
              <option value="">Select hall</option>
              {halls.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Ticket Price
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Enter price"
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              value={formData.price}
              onChange={e =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Projection Type
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              value={formData.projectionType}
              onChange={e =>
                setFormData({ ...formData, projectionType: e.target.value })
              }
            >
              <option>2D</option>
              <option>3D</option>
              <option>IMAX</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              value={formData.dateTime}
              onChange={e =>
                setFormData({ ...formData, dateTime: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">
          Tickets
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Viewer
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              value={selectedViewer}
              onChange={e => setSelectedViewer(e.target.value)}
            >
              <option value="">Select viewer</option>
              {viewers.map(v => (
                <option key={v.id} value={v.id}>
                  {v.firstName} {v.lastName} - {v.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Seat
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800 bg-opacity-50 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
              value={selectedSeat}
              onChange={e => setSelectedSeat(e.target.value)}
            >
              <option value="">Select seat</option>
              {seats.map(seat => (
                <option key={seat} value={seat}>
                  {seat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleAddTicket}
            className="btn btn-primary"
          >
            Add Ticket
          </button>

          <button
            onClick={handleDeleteTicket}
            className="btn bg-red-700 hover:bg-red-800 text-white border-none"
          >
            Delete Ticket
          </button>
        </div>

        <table className="w-full mt-6 text-left">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-2 text-gray-400 font-medium">Viewer</th>
              <th className="py-2 text-gray-400 font-medium">Email</th>
              <th className="py-2 text-gray-400 font-medium">Seat</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={i} className="border-b border-gray-700">
                <td className="py-2 text-white">{t.viewerName}</td>
                <td className="py-2 text-white">{t.email}</td>
                <td className="py-2 text-white">{t.seat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleBuyTickets}
        className="w-full mt-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 cursor-pointer text-lg"
      >
        Buy Ticket/s
      </button>
    </div>
  );
}