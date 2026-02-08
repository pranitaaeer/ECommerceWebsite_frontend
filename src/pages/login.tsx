import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { getUser, useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import illustration from "../assets/images/3Dimage.png"
const Login = () => {
  const dispatch = useDispatch();
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
     
     console.log("user from auth:",user)
      const res = await login({
        username: user.displayName!,
        email: user.email!,
        Avatar: user.photoURL!,
        gender,
        role: "user",
        dob: date,
        _id: user.uid,
      });
      if ("data" in res) {
        toast.success(res.data.message);
        const data = await getUser(res.data.user._id);
        dispatch(userExist(data?.user!));
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error("Sign In Fail");
    }
  };

  return (
    <div className="auth">
      <div className="auth__left">
        <h1>Simplify management With Our dashboard.</h1>
        <p>
          Simplify your e-commerce management with our user-friendly admin
          dashboard.
        </p>

        <img src={illustration}alt="illustration" />
      </div>

      <div className="auth__right">
       <div className="brand">
          {/* <img src={logo} alt="logo" className="logo" />
          <h1>ShopEase</h1> */}
          <div className="logo-container">
        <div className="bag-icon">
          <div className="handle"></div>
        </div>
        <h1 className="logo-text">shop<span>Ease</span></h1>
      </div>
      </div>

        <h2>Welcome Back</h2>
        <span className="title">Please login to your account</span>

        <div className="field">
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="field">
          <label>Date of Birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button className="google-btn" onClick={loginHandler}>
          <FcGoogle />
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
};


export default Login;
