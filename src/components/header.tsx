import { Link } from "react-router-dom";
import {
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
  FaShoppingCart,
  FaHome
} from "react-icons/fa";
import { useState } from "react";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { IoSearchSharp } from "react-icons/io5";
interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log("user Avatar:",user?.Avatar || "avatar nhi hai")
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Sign Out Fail");
    }
  };

  return (
    <nav className="header">
      <div className="logo-container">
        <div className="bag-icon">
          <div className="handle"></div>
        </div>
        <h1 className="logo-text">shop<span>Ease</span></h1>
      </div>
     
    <div className="nav-links">
        <Link onClick={() => setIsOpen(false)} to={"/"}>
        <FaHome  size={26}/>
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <IoSearchSharp size={26} />
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/cart"}>
        <FaShoppingCart  size={25}/>
      </Link>
      
    </div>

      {user?._id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>            
            {user?(<img src={user?.Avatar} className="avatar" />):
            (<FaUser style={{ color: "white" }} />)}
          </button>
          <dialog open={isOpen} >
            <div>
              {user.role === "admin" && (
                <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                  Admin
                </Link>
              )}

              <Link onClick={() => setIsOpen(false)} to="/orders">
                Orders
              </Link>
              <button onClick={logoutHandler}>
                <FaSignOutAlt style={{ color: "white" }} /><span>{" "}Logout</span>
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
