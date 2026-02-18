import React, { useRef, useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import classNames from "classnames";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import mybg from "./logos/20285469_6187456.svg";
const { host } = require("../env.js");

const SignupComponent = (props) => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [c_password, setC_Password] = useState("");
  const [agreementChecked, setAgreementChecked] = useState(false);

  // 🔥 NEW ROLE STATE
  const [role, setRole] = useState("user");

  // const [googleSignInSuccess, setGoogleSignInSuccess] = useState(false);
  const submit_btn = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== c_password) {
      alert("Passwords do not match");
      return;
    }

    if (!agreementChecked) {
      alert("Please agree to the terms and conditions");
      return;
    }

    try {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: Name,
          email,
          username,
          password,
          role: role, // 🔥 SEND SELECTED ROLE
        }),
      });

      const json = await response.json();

      if (json.success) {

        localStorage.setItem("token", json.authtoken);
        localStorage.setItem("role", role);

        // 🔥 Redirect based on role
        if (role === "organizer") {
          navigate("/");
        } else {
          navigate("/UserDashboard");
        }

      } else {
        props.setMessage1("Signup Failed");
        props.setType1("danger");
        props.setShowAlert1(true);
        setTimeout(() => props.setShowAlert1(false), 3000);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   if (googleSignInSuccess) {
  //     submit_btn.current.click();
  //     setGoogleSignInSuccess(false);
  //   }
  // }, [googleSignInSuccess]);

  // const handleGoogleSuccess = async (credentialResponse) => {
  //   try {
  //     const response = await fetch(
  //       `https://oauth2.googleapis.com/tokeninfo?id_token=${credentialResponse.credential}`
  //     );
  //     const data = await response.json();

  //     const { name, email } = data;

  //     setName(name);
  //     setEmail(email);
  //     setUsername(email.split("@")[0]);
  //     setPassword("12345678");
  //     setC_Password("12345678");
  //     setAgreementChecked(true);
  //     setGoogleSignInSuccess(true);

  //   } catch (err) {
  //     console.error("Google decode failed", err);
  //   }
  // };

  // const handleGoogleError = () => {
  //   console.log("Google Login Failed");
  // };

  const containerClasses = classNames("signup-container");
  const formClasses = classNames("signup-form");
  const inputClasses = classNames("signup-input");
  const buttonClasses = classNames("signup-button");

  return (
    <div className="signupgrid">

      <div className="signupillustrator">
        <div className="typed-out" id="demo">
          <p style={{ fontSize: "50px", display: "inline-block", marginBottom: "-10px" }}>
            J
          </p>
          oin the Excitement! Create, manage, and discover unforgettable experiences.
        </div>

        <img
          src={mybg}
          alt="illustration"
          id="signupillustratorimg"
          className="signupillustratorimg"
        />
      </div>

      <div className="SU">
        <div className={containerClasses}>
          <h2>Welcome to Event Manager dashboard!</h2>
          <h5>
            Create an account or <Link to="/signin">log in</Link>
          </h5>
          <hr className="signupHR" />

          <form className={formClasses}>

            <div className="input_row">
              <label>Name</label>
              <input type="text" className={inputClasses}
                value={Name}
                onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="input_row">
              <label>Username</label>
              <input type="text" className={inputClasses}
                value={username}
                onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="input_row">
              <label>Email</label>
              <input type="email" className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="input_row">
              <label>Password</label>
              <input type="password" className={inputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="input_row">
              <label>Confirm Password</label>
              <input type="password" className={inputClasses}
                value={c_password}
                onChange={(e) => setC_Password(e.target.value)} required />
            </div>

            {/* 🔥 ROLE DROPDOWN */}
            <div className="input_row">
              <label>Register As</label>
              <select
                className={inputClasses}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="organiser">Organiser</option>
              </select>
            </div>

            <div className="input_row">
              <label>
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  required
                />
                I agree to the terms and conditions
              </label>
            </div>

            <button ref={submit_btn} onClick={handleSubmit} className={buttonClasses}>
              Sign Up
            </button>

          </form>
        </div>

        <div style={{ marginTop: "20px" }}>
          {/* <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          /> */}
        </div>

      </div>
    </div>
  );
};

export default SignupComponent;
