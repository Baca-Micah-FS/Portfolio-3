import { MdVideoLibrary } from "react-icons/md";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = ({ isLoggedIn }) => {
  return (
    <footer className={`footer ${isLoggedIn ? "footerLoggedIn" : ""}`}>
      <div className="leftFooter">
        <form>
          <h3>Stay in the Loop</h3>
          <p>Sign up for our newsletter to see whats new</p>
          <input type="email" placeholder="Enter your email" />
          <button type="button">Sign up</button>
        </form>
      </div>

      <div className="rightFooter">
        <div className="footerLogoRow">
          <MdVideoLibrary size={20} style={{ marginRight: "10px" }} />
          <h3>Media-Flux</h3>
        </div>
        <p>Your Personal hub for all things media</p>

        <div className="socialRow">
          <FaInstagram size={30} />
          <FaFacebook size={30} />
          <FaXTwitter size={30} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
