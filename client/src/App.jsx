// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import GoogleLogin from "./components/GoogleLogin";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import axios from "axios";

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
      <main className="main">
        <GoogleLogin user={user} setUser={setUser} />
      </main>
    </div>
  );
}

export default App;
