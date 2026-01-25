const NavBar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="backdrop" onClick={onClose} />}

      <aside className={`navContainer ${isOpen ? "open" : ""}`}>
        <nav className="navBar">
          <a>Movies</a>
          <a>TV shows</a>
          <a>Music</a>
          <a>Podcasts</a>
          <a>Books</a>
        </nav>
      </aside>
    </>
  );
};

export default NavBar;
