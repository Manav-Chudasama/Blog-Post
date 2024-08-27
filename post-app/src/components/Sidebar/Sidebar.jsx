import React, { useEffect, useState } from "react";
import Hero from "../../images/hero-img.png";
import { FcHome } from "react-icons/fc";
import { BsCardHeading, BsCardChecklist } from "react-icons/bs";
import { BiCommentDetail, BiLogOut } from "react-icons/bi";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const reader = new FileReader();
  const [file, setFile] = useState("");
  const [activeItem, setActiveItem] = useState("home");
  const [userDetails, setUserDetails] = useState("Username");
  const [side, setSide] = useState(window.innerWidth >= 768 ? "" : "close");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [pfp, setPfp] = useState("");

  const location = useLocation();

  const setActiveLink = (pathname) => {
    const componentName = location.pathname.split("/")[1];
    console.log(componentName);

    if (location.pathname === pathname) {
      setActiveItem(pathname.substring(1));
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
      setSide(window.innerWidth >= 768 ? "" : "close");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSidebar = () => {
    // const toggle = document.getElementsByClassName("sidebar")[0];

    setSide(side === "" ? "close" : "");

    // if (toggle.classList.contains("close")) {
    //   setSide("");
    // } else {
    //   setSide("close");
    // }
  };

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

  useEffect(() => {
    handleDetails();
  }, []);

  useEffect(() => {
    setActiveLink("/home");
    setActiveLink("/create-post");
    setActiveLink("/my-posts");
    setActiveLink("/notifications");
  }, [location.pathname]);

  const HandleLogout = async () => {
    try {
      window.localStorage.clear().then(() => {
        navigate("/register");
      });
      // useNavigate("/register");
      // window.location.href = "/register";
      console.log("logging out");

      console.log("out!");
    } catch (error) {
      console.log(error);
    }
  };

  const handlepfp = (e) => {
    console.log(e);
    reader.readAsDataURL(e.target.files[0]);
    console.log("hi");
    reader.onloadend = () => {
      setFile(reader.result);
    };
  };

  return (
    <>
      <nav className={`sidebar ${side} ${isSidebarOpen ? "" : side}`}>
        <header>
          <div className="image-text">
            <span className="image">
              {
                pfp ? (
                  <>
                    <>
                      <input type="file" id="pfp" style={{ display: "none" }} />
                      <label htmlFor="pfp" style={{ cursor: "pointer" }}>
                        <img src={Hero} alt="" />
                      </label>
                    </>
                  </>
                ) : (
                  <img src={Hero} alt="" onChange={handlepfp} />
                )
                /* <img src={Hero} alt="" />  */
              }
            </span>
            <div className="text logo-text">
              <span className="name">{userDetails.username || ""}</span>
            </div>
          </div>
          <i className="bx bx-chevron-right toggle" onClick={handleSidebar}>
            <RiMenuUnfoldLine />
          </i>
        </header>
        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li
                className={`nav-link ${activeItem === "home" ? "active" : ""}`}
                onClick={() => setActiveItem("home")}
              >
                <Link to="/home">
                  <i
                    className={`bx bx-home-alt icon ${
                      activeItem === "home" ? "active" : ""
                    }`}
                  >
                    <FcHome />
                  </i>
                  <span
                    className={`text nav-text ${
                      activeItem === "home" ? "active" : ""
                    }`}
                  >
                    Home
                  </span>
                </Link>
              </li>
              <li
                className={`nav-link ${
                  activeItem === "create-post" ? "active" : ""
                }`}
                onClick={() => setActiveItem("create-post")}
              >
                <Link to="/create-post">
                  <i
                    className={`bx bx-bar-chart-alt-2 icon ${
                      activeItem === "create-post" ? "active" : ""
                    }`}
                  >
                    <BsCardHeading />
                  </i>
                  <span
                    className={`text nav-text ${
                      activeItem === "create-post" ? "active" : ""
                    }`}
                  >
                    Create Post
                  </span>
                </Link>
              </li>
              <li
                className={`nav-link ${
                  activeItem === "my-posts" ? "active" : ""
                }`}
                onClick={() => setActiveItem("myPosts")}
              >
                <Link to="/my-posts">
                  <i
                    className={`bx bx-bell icon ${
                      activeItem === "my-posts" ? "active" : ""
                    }`}
                  >
                    <BsCardChecklist />
                  </i>
                  <span
                    className={`text nav-text ${
                      activeItem === "my-posts" ? "active" : ""
                    }`}
                  >
                    My Posts
                  </span>
                </Link>
              </li>
              <li
                className={`nav-link ${
                  activeItem === "notifications" ? "active" : ""
                }`}
                onClick={() => setActiveItem("notifications")}
              >
                <Link to="/home">
                  <i
                    className={`bx bx-pie-chart-alt icon ${
                      activeItem === "notifications" ? "active" : ""
                    }`}
                  >
                    <BiCommentDetail />
                  </i>
                  <span
                    className={`text nav-text ${
                      activeItem === "notifications" ? "active" : ""
                    }`}
                  >
                    Notifications
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="bottom-content">
            <li className="">
              <a
                className=""
                href="/login"
                // style={{
                //   height: "50px",

                //   display: "flex",
                //   alignItems: "center",
                //   marginTop: "10px",
                // }}
              >
                <i className="bx bx-log-out icon">
                  <BiLogOut />
                </i>
                <span className="text nav-text" onClick={HandleLogout}>
                  Logout
                </span>
              </a>
            </li>

            <li className="mode">
              <span
                className="mode-text text"
                style={{
                  position: "relative",
                  right: "40px",
                }}
              >
                Dark mode
              </span>

              <label
                className="switch-container"
                style={{
                  position: "relative",
                  right: "10px",
                }}
              >
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </li>
          </div>
        </div>
      </nav>
    </>
  );
}
