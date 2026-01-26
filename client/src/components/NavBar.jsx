import { NavLink } from "react-router-dom";

const NavBar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="backdrop" onClick={onClose} />}

      <aside className={`navContainer ${isOpen ? "open" : ""}`}>
        <nav className="navBar">
          <NavLink
            onClick={onClose}
            to="/"
            end
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            Trending
          </NavLink>

          <NavLink
            onClick={onClose}
            to="/movies"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            Movies
          </NavLink>

          <NavLink
            onClick={onClose}
            to="/tv"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            TV Shows
          </NavLink>

          <NavLink
            onClick={onClose}
            to="/music"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            Music
          </NavLink>

          <NavLink
            onClick={onClose}
            to="/podcasts"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            Podcasts
          </NavLink>

          <NavLink
            onClick={onClose}
            to="/books"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            Audio Books
          </NavLink>

          {/* <NavLink
            onClick={onClose}
            to="/watched"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            Watched
          </NavLink> */}
        </nav>
      </aside>
    </>
  );
};

export default NavBar;
