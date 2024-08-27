import './App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import CreatePost from './components/CreatePost/CreatePost';
import Posts from './components/Postview/Posts';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/Homepage/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MyPosts from './components/MyPosts/MyPosts';

function App() {

  const token = window.localStorage.getItem('token');
  const isLoggedIn = window.localStorage.getItem('isLoggedIn');
  console.log(isLoggedIn)

  return (
    <>
      <Router>
        {isLoggedIn ? (
          <>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/Posts" element={<Posts />} />
              <Route path="/my-posts" element={<MyPosts />} />
            </Routes>
          </>

        )
          :
          <>
            {/* <Register /> */}
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

            </Routes>
          </>
        }
        {/* <Sidebar /> */}
      </Router>

    </>
  );
}

export default App;
