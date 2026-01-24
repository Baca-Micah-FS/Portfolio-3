const NavBar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop only visible when open */}
      {isOpen && <div className="backdrop" onClick={onClose} />}

      <aside className={`navContainer ${isOpen ? "open" : ""}`}>
        <nav className="navBar">
          <p>Movies</p>
          <p>TV shows</p>
          <p>Music</p>
          <p>Podcasts</p>
          <p>Books</p>
        </nav>
      </aside>
    </>
  );
};

export default NavBar;
