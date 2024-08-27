import React from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";
// import Navbar from "../Navbar/Navbar";
export default function CreatePost() {
  const reader = new FileReader();
  const navigate = useNavigate();

  const [file, setFile] = React.useState(null);

  const handleFileChange = (e) => {
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setFile(reader.result);
    };
    // setFile();
  };
  const submitHandle = async (e) => {
    const formData = new FormData();
    e.preventDefault();
    console.log(e.target[0].value);
    console.log(e.target[1].value);
    console.log(e.target[2].files[0]);

    const title = e.target[0].value;
    const content = e.target[1].value;
    const imageFile = e.target[2].files[0];

    // Append data to the FormData object
    formData.append("token", window.localStorage.getItem("token"));
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageFile);

    try {
      await fetch("http://localhost:4000/create-post", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          navigate("/home");
          console.log(data, data.data);
          const imgurl = data.data.replace(/\\/g, "/");
          setFile("http://localhost:4000/" + imgurl);
        });
    } catch (error) {
      console.log(error);
    }

    // reader.readAsDataURL(e.target[2].files[0]);
    // await fetch("http://localhost:4000/create-post", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Headers": "*",
    //   },
    //   body: JSON.stringify({
    //     token: window.localStorage.getItem("token"),
    //     title: e.target[0].value,
    //     content: e.target[1].value,
    //     image: file,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log(data));
    // reader.onloadend = async () => {
    //   console.log(reader.result);
    //   setFile(reader.result);
    // };
  };

  return (
    <>
      <div className="home">
        <div
          className="content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ margin: "1rem", fontSize: "3.5rem" }}>Create Post</h1>
          <div
            style={{
              width: "auto",
            }}
          >
            <div className="create-post">
              {/* <span className="heading">Contact Us</span>  */}
              <form onSubmit={submitHandle}>
                <label htmlFor="name">Title</label>
                <input
                  type="text"
                  required=""
                  placeholder="What's the hot topic?"
                />
                {/* <label htmlFor="email">Email:</label>
                <input type="e" id="email" name="email" required="" /> */}
                <label htmlFor="message">Content</label>
                <textarea
                  id="message"
                  name="message"
                  required=""
                  placeholder="Explain more!"
                ></textarea>
                <div
                  style={{
                    display: "flex",
                    // flexDirection: "column",
                    alignItems: "center",
                    // justifyContent: "center",
                  }}
                >
                  <div className="image-container">
                    <label htmlFor="arquivo">Have an image? Post it!</label>
                    <input
                      accept=".jpg, .jpeg, .png, .gif"
                      className="inpdddut"
                      name="arquivo"
                      id="images"
                      type="file"
                      // value={file}
                      onChange={handleFileChange}
                    />
                  </div>
                  <div
                    className="preview"
                    style={{
                      position: "relative",
                      height: "100px",
                      width: "100px",
                      margin: "0 45px ",
                      // top: "250px",
                      // left: "50",
                    }}
                  >
                    {file && (
                      <img
                        src={file}
                        alt=""
                        style={{
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    )}
                    {/* hi{" "} */}
                  </div>
                </div>
                <button type="submit">Post</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
