import { useState, useEffect } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

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
  }, [setUser]);

  // const handleLogout = async () => {
  //   try {
  //     await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  //     setUser(null);
  //   } catch (error) {
  //     console.log("Failed to logout", error);
  //   }
  // };

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/login`;
  };

  if (loading) return <p>Checking user credentials</p>;
  if (user) return null;

  return (
    <div className="loginBox">
      <h2>Welcome</h2>
      <button onClick={handleLogin}>
        Login with Google <FcGoogle size={22} />
      </button>
    </div>
  );
};

export default GoogleLogin;
