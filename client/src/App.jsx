import "./App.css";
import GoogleLogin from "./components/GoogleLogin";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import MoviesPage from "./pages/MoviesPage";
import TvShows from "./pages/TvShowsPage";
import MusicPage from "./pages/MusicPage";
import PodcastPage from "./pages/PodcastPage";
import AudioBooksPage from "./pages/AudioBooksPage";
import WatchList from "./pages/WatchList";
import HomePage from "./pages/HomePage";

const API_URL = "http://localhost:5050/api/v1";

function App() {
  const [user, setUser] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // flips isNavOpen to the opposite of what it is instead of setting that hard
  const toggleNav = () => setIsNavOpen((prev) => !prev);
  const closeNav = () => setIsNavOpen(false);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.log("Failed to logout", error);
    } finally {
      setUser(null);
      setIsNavOpen(false); // closes nav too
    }
  };

  // on page load run everytime user logic
  useEffect(() => {
    if (!user) setIsNavOpen(false);
  }, [user]);

  return (
    <div className="app">
      <Header user={user} onMenuClick={toggleNav} onLogout={handleLogout} />
      {user && <NavBar isOpen={isNavOpen} onClose={closeNav} />}

      <main className={`main ${isNavOpen ? "navOpen" : ""}`}>
        {!user ? (
          <>
            {/* <h1>main content</h1> */}
            <GoogleLogin user={user} setUser={setUser} />
          </>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/movies" element={<MoviesPage />}></Route>
            <Route path="/tv" element={<TvShows />}></Route>
            <Route path="/music" element={<MusicPage />}></Route>
            <Route path="/podcasts" element={<PodcastPage />}></Route>
            <Route path="/books" element={<AudioBooksPage />}></Route>
            <Route path="/watch-list" element={<WatchList />}></Route>
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
