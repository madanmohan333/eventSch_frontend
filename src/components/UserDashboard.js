import { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get("/api/event/myevents");
    setEvents(res.data);
  };

  const register = async (id) => {
    const token = localStorage.getItem("token");

    await axios.post(
      `/api/event/register/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Registered successfully");
    fetchEvents();
  };

  return (
    <div>
      <h2>User Dashboard</h2>

      {events.map((event) => (
        <div key={event._id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Registrations: {event.totalRegistrations}</p>

          <button onClick={() => register(event._id)}>
            Register
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;