// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import GoogleLogin from "./components/GoogleLogin";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      <Header user={user} />
      {user && <NavBar />}
      <main className="main">
        <GoogleLogin user={user} setUser={setUser} />
      </main>
    </div>
  );
}

export default App;
