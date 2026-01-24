import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050/api/v1";

const GoogleLogin = ({ user, setUser }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/current-user`, {
          withCredentials: true,
        });
        if (!cancelled) setUser(response.data.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
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
      setUser(null);
    } catch (error) {
      console.log("Failed to logout", error);
    }
  };

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/login`;
  };

  if (loading) return <p>Checking user credentials</p>;

  return (
    <div>
      {user ? (
        <div>
          <img
            referrerPolicy="no-referrer"
            src={user.picture}
            alt="Profile"
            style={{ borderRadius: "50%", width: "100px", height: "100px" }}
          />
          <p>{user.displayName}</p>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <div>
          <h2>Welcome</h2>
          <button onClick={handleLogin}>Login with Google</button>
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
