import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import mybg from "./logos/20285469_6187456.svg";
import "../App.css";
const { host } = require("../env.js");

const SigninComponent = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [googleSignInSuccess, setGoogleSignInSuccess] = useState(false);

  const navigate = useNavigate();
  const submit_btn = useRef(null);

  // 🔥 LOGIN FUNCTION
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const json = await response.json();

    if (json.success) {
      // ✅ Store token
      localStorage.setItem("token", json.authtoken);

      // ✅ Store role (NO fallback)
      localStorage.setItem("role", json.role);

      props.setMessage1("Logged In successfully");
      props.setType1("success");
      props.setShowAlert1(true);

      setTimeout(() => {
        props.setShowAlert1(false);
      }, 2000);

      // ✅ Role-based redirect
      if (json.role === "organizer") {
        navigate("/"); // organizer dashboard
      } else if (json.role === "user") {
        navigate("/participant-dashboard"); // user dashboard
      } else {
        navigate("/login"); // fallback safety
      }
    } else {
      props.setMessage1("Invalid credentials");
      props.setType1("danger");
      props.setShowAlert1(true);

      setTimeout(() => {
        props.setShowAlert1(false);
      }, 3000);
    }
  } catch (error) {
    console.error("Login Error:", error);
  }
};
  // 🔥 SIGNUP FUNCTION (auto create if login fails)
  const handleSignUp = async () => {
    try {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          username: username,
          password: password,
          role: "participant", // Default new users as participant
        }),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);

        const role = json.user?.role || "participant";
        localStorage.setItem("role", role);

        props.setMessage1("Account created successfully");
        props.setType1("success");
        props.setShowAlert1(true);

        setTimeout(() => {
          props.setShowAlert1(false);
        }, 3000);

        if (role === "organizer") {
          navigate("/");
        } else {
          navigate("/participant-dashboard");
        }
      } else {
        props.setMessage1("Login Failed");
        props.setType1("danger");
        props.setShowAlert1(true);

        setTimeout(() => {
          props.setShowAlert1(false);
        }, 3000);

        setGoogleSignInSuccess(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setName("");
      }
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  // 🔥 Google Auto Submit Logic
  useEffect(() => {
    const typedOutElement = document.getElementById("demo");
    const illustratedimg = document.getElementById("signupillustratorimg");

    if (typedOutElement) typedOutElement.classList.add("fade-in");
    if (illustratedimg) illustratedimg.classList.add("fade-in");

    if (googleSignInSuccess) {
      submit_btn.current.click();
      setGoogleSignInSuccess(false);
    }
  }, [googleSignInSuccess]);

  const responseGoogleSuccess = (response) => {
    const { profileObj } = response;
    const { email, name } = profileObj;

    setUsername(email.split("@")[0]);
    setPassword("12345678");
    setEmail(email);
    setName(name);
    setGoogleSignInSuccess(true);
  };

  const responseGoogleFailure = (error) => {
    console.log("Google Sign-In Failed:", error);
  };

  return (
    <div className="signupgrid">
      <div className="signupillustrator">
        <div className="typed-out" id="demo">
          <p
            style={{
              fontSize: "50px",
              display: "inline-block",
              marginBottom: "-10px",
            }}
          >
            J
          </p>
          oin the Excitement! Create, manage, and discover unforgettable
          experiences. Let's make every moment count together!
        </div>

        <img
          src={mybg}
          alt="illustration"
          id="signupillustratorimg"
          className="signupillustratorimg"
        />
      </div>

      <div className="SU">
        <div className="signup-container">
          <h2>Welcome to Event Manager dashboard!</h2>
          <h5>
            <Link to="/signup">Create an account</Link> or log in
          </h5>
          <hr className="signupHR" />

          <form className="signup-form">
            <div className="input_row">
              <label className="my_label" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="signup-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input_row">
              <label className="my_label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="signup-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              ref={submit_btn}
              onClick={handleSubmit}
              className="signup-button"
            >
              Login
            </button>
          </form>
        </div>

        <GoogleLogin
          clientId="154737886462-ef9cneipqh5p0j4pe561h1ofhmt1lpps.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
          cookiePolicy={"single_host_origin"}
          render={(props) => (
            <button
              className="google-signin-button"
              onClick={props.onClick}
              disabled={props.disabled}
            >
              Sign in with Google
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default SigninComponent;
