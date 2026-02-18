import eventContext from "./EventContext";
import { useState, useEffect } from "react";
const { host } = require("../env.js");

const EventState = (props) => {
  const eventsInitial = [];
  const [events, setEvents] = useState(eventsInitial);
  const [curruser, setcurruser] = useState({});
  const [meetings, setMeetings] = useState([]);

  const authtoken = localStorage.getItem("token");

  // 🔥 Load data when token changes
  useEffect(() => {
    if (authtoken) {
      getUserDetails();
      getEvents();
      fetchMeetings();
    } else {
      setEvents(eventsInitial);
      setcurruser({});
    }
    // eslint-disable-next-line
  }, [authtoken]);

  // 🔥 Get logged-in user details (contains role)
  const getUserDetails = async () => {
    const response = await fetch(`${host}/api/auth/getuser`, {
      method: "POST",
      headers: {
        "auth-token": authtoken,
      },
    });
    const json = await response.json();
    setcurruser(json);
  };

  // 🔥 Fetch meetings
  const fetchMeetings = async () => {
    const response = await fetch(`${host}/api/meet/getallmeetings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authtoken,
      },
    });
    const json = await response.json();
    setMeetings(json);
  };

  // 🔥 Fetch events (ROLE AWARE)
  const getEvents = async () => {
    let url = `${host}/api/event/events`;

    // Later backend can separate routes
    // if (curruser.role === "participant") {
    //   url = `${host}/api/event/publicevents`;
    // }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authtoken,
      },
    });

    const json = await response.json();
    setEvents(json);
  };

  // 🔥 Add Event (Only Organizer)
  const addEvent = async (
    title,
    description,
    tags,
    eventStartDate,
    eventEndDate,
    collaborators_array
  ) => {

    if (curruser.role !== "organizer") return;

    const collaborators = [];

    if (collaborators_array.length > 0) {
      for (let collaborator of collaborators_array) {
        collaborators.push({
          _id: collaborator._id,
          name: collaborator.name,
          email: collaborator.email,
          photo: collaborator.photo,
          username: collaborator.username,
        });
      }
    }

    const response = await fetch(`${host}/api/event/createevent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authtoken,
      },
      body: JSON.stringify({
        title,
        description,
        tags,
        eventStartDate,
        eventEndDate,
        collaborators,
      }),
    });

    const event = await response.json();

    // ✅ FIXED PUSH BUG
    setEvents([...events, event]);
  };

  // 🔥 Delete Event (Only Organizer)
  const deleteEvent = async (id) => {

    if (curruser.role !== "organizer") return;

    await fetch(`${host}/api/events/deletevent/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authtoken,
      },
    });

    const newEvents = events.filter((event) => event._id !== id);
    setEvents(newEvents);
  };

  // 🔥 Edit Event (Only Organizer)
  const editEvent = async (
    id,
    title,
    description,
    tags,
    eventStartDate,
    eventEndDate
  ) => {

    if (curruser.role !== "organizer") return;

    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": authtoken,
      },
      body: JSON.stringify({
        title,
        description,
        tags,
        eventStartDate,
        eventEndDate,
      }),
    });

    let newEvents = JSON.parse(JSON.stringify(events));

    for (let index = 0; index < newEvents.length; index++) {
      if (newEvents[index]._id === id) {
        newEvents[index].title = title;
        newEvents[index].description = description;
        newEvents[index].tags = tags;
        newEvents[index].eventStartDate = eventStartDate;
        newEvents[index].eventEndDate = eventEndDate;
        break;
      }
    }

    setEvents(newEvents);
  };

  return (
    <eventContext.Provider
      value={{
        events,
        curruser,
        meetings,
        fetchMeetings,
        getUserDetails,
        getEvents,
        addEvent,
        deleteEvent,
        editEvent,
      }}
    >
      {props.children}
    </eventContext.Provider>
  );
};

export default EventState;
