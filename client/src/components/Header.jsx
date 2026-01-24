import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdVideoLibrary } from "react-icons/md";

const Header = ({ user, onMenuClick, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // swapping opposite state
  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  const handleLogoutClick = async () => {
    // Optional: close the dropdown immediately for snappy UI
    setIsProfileOpen(false);
    await onLogout();
  };

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

      <MdVideoLibrary size={30} color="green" />
      <h1 className="headerTitle">Playground Media</h1>

      {/* Right side */}
      {user && (
        <div className="headerRight">
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
      )}
    </header>
  );
};

export default Header;
