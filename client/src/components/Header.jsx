import { useState, useRef, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdVideoLibrary } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { BsBookmarkHeartFill } from "react-icons/bs";

const Header = ({ user, onMenuClick, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  const handleLogoutClick = async () => {
    setIsProfileOpen(false);
    await onLogout();
  };

  //  click outside to make logout button disappear
  useEffect(() => {
    if (!isProfileOpen) return;

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="header">
      {user && (
        <button
          onClick={onMenuClick}
          aria-label="Open Menu"
          className="hamburger"
        >
          <RxHamburgerMenu size={30} />
        </button>
      )}

      <MdVideoLibrary size={30} color="#595f39" />
      <h1 className="headerTitle">Media-Hub</h1>

      {user && (
        <>
          <div className="headerRight" ref={profileRef}>
            <NavLink to="/watch-list" className="watchLink watch-list">
              <BsBookmarkHeartFill size={23} />
              <span>Watchlist</span>
            </NavLink>

            <button
              className="avatarBtn"
              onClick={toggleProfile}
              aria-label="Open profile menu"
            >
              <img className="avatarImg" src={user.picture} alt="Profile" />
            </button>

            {isProfileOpen && (
              <div className="profileMenu" role="menu">
                <button onClick={handleLogoutClick}>Log out</button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
