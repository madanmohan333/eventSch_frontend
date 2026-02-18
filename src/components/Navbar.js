import React from "react";
import dark_mode from "./logos/brightness-and-contrast.png";
import searchlogo from "./logos/search.png";
import "../App.css";
import { useState, useRef } from "react";
const { host } = require("../env.js");

const Navbar = (props) => {

  // ✅ Get Role
  const role = localStorage.getItem("role");

  const togglenavbar = (event) => {
    const clickedItem = event.currentTarget;
    const listItems = document.querySelectorAll(".list_items");

    listItems.forEach((item) => {
      if (item === clickedItem) {
        if (!item.classList.contains("activated")) {
          item.classList.add("activated");
        }
      } else {
        if (item.classList.contains("activated")) {
          item.classList.remove("activated");
        }
      }
    });
  };

  const handleDarkMode = (e) => {
    if (props.darkTheme === "") {
      props.setDarkTheme1("DarkTheme");
      e.target.style = "filter: invert(100%)";
    } else {
      props.setDarkTheme1("");
      e.target.style = "filter: invert(0%)";
    }
  };

  const [showsearchpromt, setshowsearchpromt] = useState(false);
  const [searchedEvents, setsearchedEvents] = useState([]);

  const handlesearch = async (e) => {

    // ✅ Prevent participants from searching organizer events
    if (role === "participant") {
      return;
    }

    if (e.target.value === "") {
      setsearchedEvents([]);
      setshowsearchpromt(false);
    } else {
      const response = await fetch(
        `${host}/api/event/searchevent/${e.target.value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setsearchedEvents(data);
      if (data.length > 0) {
        setshowsearchpromt(true);
      } else {
        setshowsearchpromt(false);
      }
    }
  };

  const search_input = useRef(null);

  return (
    <nav className="navbar">
      <span className="dark_light">
        <img
          src={dark_mode}
          onClick={handleDarkMode}
          className="dark_mode"
          alt="dark_mode"
          width="80px"
        />
      </span>

      <ul className="nav_items">
        <li
          className="list_items activated"
          onClick={(e) => {

            // ✅ Only organizer can use overview
            if (role === "organizer") {
              togglenavbar(e);
              props.handleChangeBetweenNavItems("OverView");
            }

          }}
        >
          Overview
        </li>

        <li
          className="list_items"
          onClick={(e) => {

            // ✅ About allowed for both
            togglenavbar(e);
            props.handleChangeBetweenNavItems("about");

          }}
        >
          About
        </li>
      </ul>

      {/* ✅ Hide search for participant (optional but clean) */}
      {role === "organizer" && (
        <div className="search">
          <input
            type="text"
            ref={search_input}
            className="my_search"
            placeholder="Search Events"
            style={
              props.darkTheme === "DarkTheme"
                ? {
                    backgroundColor: "#313131",
                    color: "white",
                    boxShadow: "0px 0px 10px 0px #313131",
                  }
                : { backgroundColor: "white", color: "black" }
            }
            onChange={handlesearch}
          />
          <img
            className="search_icon"
            src={searchlogo}
            alt="search"
            width="40px"
            style={
              props.darkTheme === "DarkTheme"
                ? { filter: "invert(100%)" }
                : {}
            }
          />
        </div>
      )}

      {showsearchpromt && role === "organizer" && (
        <div
          className="search_prompt"
          style={
            props.darkTheme === "DarkTheme"
              ? { backgroundColor: "#363636", color: "white" }
              : {}
          }
        >
          {searchedEvents.map((event) => {
            return (
              <div
                key={event._id}
                className={`searched_event ${
                  props.darkTheme === "DarkTheme"
                    ? "searched_event_dark"
                    : ""
                }`}
                onClick={() => {
                  search_input.current.value = "";
                  props.handleEventsClick(event);
                  setshowsearchpromt(false);
                }}
              >
                {event.title}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
