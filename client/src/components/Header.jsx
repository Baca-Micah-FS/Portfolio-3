import { RxHamburgerMenu } from "react-icons/rx";
import { ImHeadphones } from "react-icons/im";
const Header = ({ user }) => {
  return (
    <header className="header">
      {user && (
        <button className="hamburger">
          <RxHamburgerMenu size={30} />
        </button>
      )}

      <ImHeadphones size={30} color="green" />
      <h1 className="headerTitle">Header</h1>
    </header>
  );
};

export default Header;
