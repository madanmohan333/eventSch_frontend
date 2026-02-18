import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faUsers,
  faTags,
  faComment,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "../App.css";
const About = (props) => {
  return (
    <div className="About-page">
      <p className="about-text">
        This is a full stack MERN application for managing events.
      </p>
      <div className="features">
        <div className={props.darkTheme !== "DarkTheme" ? "feature":"featureDark"}>
          <FontAwesomeIcon icon={faCode} className="icon" />
          <p>Create Events</p>
          <p>
            In this Web App, you can create events with all the necessary
            details.
          </p>
        </div>
        <div className={props.darkTheme !== "DarkTheme" ? "feature":"featureDark"}>
          <FontAwesomeIcon icon={faUsers} className="icon" />
          <p>Add Collaborators</p>
          <p>Add collaborators for easy team management and communication.</p>
        </div>
        <div className={props.darkTheme !== "DarkTheme" ? "feature":"featureDark"}>
          <FontAwesomeIcon icon={faTags} className="icon" />
          <p>Add Tags</p>
          <p>Categorize your events with tags for easy organization.</p>
        </div>
        <div className={props.darkTheme !== "DarkTheme" ? "feature":"featureDark"}>
          <FontAwesomeIcon icon={faComment} className="icon" />
          <p>Chat Feature</p>
          <p>Communicate with team members using the built-in chat feature.</p>
        </div>
        <div className={props.darkTheme !== "DarkTheme" ? "feature":"featureDark"}>
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <p>Event Meets</p>
          <p>Add event meets to manage your events effectively.</p>
        </div>
      </div>
      <p className="about-text">
        Hope you like it.
        <br />
        
        <div style={{marginTop:"4px"}}>
         
        </div>
      </p>
    </div>
  );
};

export default About;
