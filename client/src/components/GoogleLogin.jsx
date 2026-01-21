import { useState, useEffect } from "react";
import axios from "axios";

const GoogleLogin = () => {
  const API_URL = "http://localhost:5050/api/v1";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/current-user`);
      console.log(response.data);
      setUser(response.data.user);
    } catch (error) {
      console.log(error, "not authenticated");
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      setUser(null);
    } catch (error) {
      console.log(error, "Failes to logout user");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/login`;
  };
  return (
    <div>
      {user ? (
        <div>
          <p>{user.name}</p>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div>
          <h2>Welcom log in</h2>
          <button onClick={handleLogin}>Login with Google</button>
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
