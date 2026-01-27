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
import { Toaster } from "react-hot-toast";

const API_URL = "http://localhost:5050/api/v1";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen((prev) => !prev);
  const closeNav = () => setIsNavOpen(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/session`, {
          withCredentials: true,
        });

        if (cancelled) return;

        if (response.data.loggedIn) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.log("Failed to logout", error);
    } finally {
      setUser(null);
      setIsNavOpen(false);
    }
  };

  useEffect(() => {
    if (!user) setIsNavOpen(false);
  }, [user]);

  // broken avtar image fallabck
  if (authLoading) {
    return (
      <div className="app">
        <main className="main authCenter">
          <p>Checking user credentials</p>
        </main>
        <Toaster position="bottom-center" />
      </div>
    );
  }

  return (
    <div className="app">
      <Header user={user} onMenuClick={toggleNav} onLogout={handleLogout} />
      {user && <NavBar isOpen={isNavOpen} onClose={closeNav} />}

      <main
        className={`main ${isNavOpen ? "navOpen" : ""} ${
          !user ? "authCenter" : ""
        }`}
      >
        {!user ? (
          <>
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

      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;
