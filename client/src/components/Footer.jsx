import { MdVideoLibrary } from "react-icons/md";
import { FaInstagram, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="leftFooter">
        <form>
          <h3>Stay in the Loop</h3>
          <p>Sign up for our newsletter and see whats new</p>
          <input type="email" placeholder="Enter your email" />
          <button type="button">Sign up</button>
        </form>
      </div>

      <div className="rightFooter">
        <MdVideoLibrary />
        <h3>Media Flux</h3>
        <p>Your Personal hub for all things media</p>
        <div className="socialRow">
          <FaInstagram />
          <FaFacebook />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
