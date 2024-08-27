import React from "react";
import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Logo from "../../images/Logo.jpg";
import Posts from "../Postview/Posts";
import "./Home.css";

export default function Navbar() {
  const [userDetails, setUserDetails] = useState("Username");

  const handleDetails = async () => {
    await fetch("http://localhost:4000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setUserDetails(data.data);
      });
  };

  const [quick, setQuick] = useState("");
  const quickhandle = async () => {
    console.log(quick);
    await fetch("http://localhost:4000/quick-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
        content: quick,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, data.data);
        // const imgurl = data.data.replace(/\\/g, "/");
        // setFile("http://localhost:4000/" + imgurl);
      });
  };

  useEffect(() => {
    handleDetails();
  }, []);

  return (
    <>
      <div className="home">
        <div className="content">
          <div className="blog-container">
            <div className="home-input" style={{ padding: "2px" }}>
              <div className="blog-header">
                <div className="blog-author--no-cover">
                  <h3>{userDetails.username}</h3>
                </div>
              </div>
              <div className="blog-body">
                <div className="blog-title" style={{ padding: "15px 0" }}>
                  <h1>
                    <a href="#$" style={{ borderBottom: "1px solid black" }}>
                      <textarea
                        type="text"
                        required=""
                        placeholder="Post is already"
                        value={quick}
                        onChange={(e) => setQuick(e.target.value)}
                      />
                    </a>
                  </h1>
                </div>
              </div>
              <div className="blog-footer">
                <ul style={{ padding: "15px" }}>
                  <li className="published-date">Post</li>
                  <button type="submit" onClick={quickhandle}>
                    Post
                  </button>
                </ul>
              </div>
            </div>
          </div>
          <Posts />
        </div>
      </div>
    </>
  );
}
