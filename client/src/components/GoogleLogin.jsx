import { useEffect, useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";

const API_URL = "http://localhost:5050/api/v1";

const GoogleLogin = ({ user }) => {
  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/login`;
  };

  if (user) return null;

  // =========================
  // HERO BACKDROP ROTATION
  // =========================

  const [heroItems, setHeroItems] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  // Fetch trending movies + TV once
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const [tvRes, movieRes] = await Promise.all([
          fetch(`${API_URL}/tv/trending`, { credentials: "include" }),
          fetch(`${API_URL}/movies/trending`, { credentials: "include" }),
        ]);

        const tvData = await tvRes.json();
        const movieData = await movieRes.json();

        const combined = [
          ...(movieData?.results || []),
          ...(tvData?.results || []),
        ];

        // Only keep ones with big backdrop images
        const withBackdrop = combined.filter((i) => i?.backdrop_path);

        setHeroItems(withBackdrop);
        setHeroIndex(0);
      } catch (err) {
        console.error("Login hero fetch failed:", err);
        setHeroItems([]);
      }
    };

    fetchHero();
  }, []);

  // Rotate hero image every 8 seconds
  useEffect(() => {
    if (!heroItems.length) return;

    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroItems.length);
    }, 8000);

    return () => clearInterval(id);
  }, [heroItems]);

  // Build background URL for current hero item
  const heroBgUrl = useMemo(() => {
    const current = heroItems[heroIndex];
    if (!current?.backdrop_path) return "";
    return `https://image.tmdb.org/t/p/original${current.backdrop_path}`;
  }, [heroItems, heroIndex]);

  const heroStyle = heroBgUrl
    ? { backgroundImage: `url(${heroBgUrl})` }
    : undefined;

  // =========================
  // RENDER
  // =========================

  return (
    <section className="loginHero" style={heroStyle}>
      <div className="loginHero__content">
        <h1 className="loginHero__title">Your Media Hub</h1>

        <p className="loginHero__subtitle">
          Movies, TV, music, podcasts, and audiobooks - all in one place.
        </p>

        <ul className="loginHero__list">
          <li>Search and browse trending picks</li>
          <li>Save favorites to your watchlist</li>
          <li>Keep everything private and synced with Google login</li>
        </ul>
      </div>

      <div className="loginHero__panel">
        <div className="loginBox">
          <h2 style={{ color: "#1b1b1b" }}>Welcome</h2>

          <button onClick={handleLogin}>
            Login with Google <FcGoogle size={22} />
          </button>

          <p style={{ color: "#1b1b1b" }} className="loginHero__note">
            Save Media to Your Watchlist For Everyday Use
          </p>
        </div>
      </div>
    </section>
  );
};

export default GoogleLogin;
