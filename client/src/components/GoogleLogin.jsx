import { FcGoogle } from "react-icons/fc";

const API_URL = "http://localhost:5050/api/v1";

const GoogleLogin = ({ user }) => {
  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/login`;
  };

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
