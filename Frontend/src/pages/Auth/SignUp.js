import React, { useState, useEffect } from 'react'
import { useAlert } from 'react-alert'
import './Auth.css'
import FacebookIcon from '@mui/icons-material/Facebook';
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../actions/AuthAction";

const SignUp = () => {

  const loading = useSelector((state)=>state.authReducer.loading);

  const initialState = {
    fullname: "",
    username: "",
    password: "",
    emailMobile: ""
  };

  const [data, setData] = useState(initialState);
  const [confirmPass, setConfirmPass] = useState(true);
  const [disabled, setDisabled] = useState(true);

  const alert = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.username === "" || data.password === "" || data.fullname === "" || data.emailMobile === "") {
      setDisabled(true);
    }
    else {
      setDisabled(false);
    }
  }, [data])

  const resetForm = () => {
    setData(initialState);
    setConfirmPass(confirmPass);
  };

  // handle Change in input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = signUp(data);
    const res = await action(dispatch)
    const error = res.sucess
    error ? alert.success("Successfully Signed In")
    : alert.info("Please check Fields and try again") 
    resetForm();
  };

  return (
    <>
      <div className="form">
        <input
          type="text"
          placeholder="Mobile Number or Email"
          className="infoInput"
          name="emailMobile"
          onChange={handleChange}
          value={data.emailMobile}
          autoComplete="on"
        />

        <input
          type="text"
          placeholder="Full Name"
          className="infoInput"
          name="fullname"
          onChange={handleChange}
          value={data.fullname}
          autoComplete="on"
        />

        <input
          type="text"
          className="infoInput"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={data.username}
        />

        <input
          type="password"
          className="infoInput"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={data.password}
        />
      </div>

      <div className="signup_instructions">
        <span>
          People who use our service may have uploaded your contact information to Instagram. <span style={{ fontWeight: "600" }}>Learn More</span>
        </span>
        <span>
          By signing up, you agree to our <span style={{ fontWeight: "600" }}>Terms , Data Policy and Cookies Policy.</span>
        </span>
        <button className={`${!disabled ? "infoButton" : "disabled"}`} type="submit" onClick={handleSubmit} disabled={
          data.emailMobile === "" ||
          data.fullname === "" ||
          data.username === "" ||
          data.password === ""
        }
        >
          {loading ? "Loading" : "SignUp"}

        </button>
      </div>

      <div className="or">
        <div className="or_1"></div>
        <div className="or_2">OR</div>
        <div className="or_1"></div>
      </div>

      <div className="facebook_login">
        <div className="facebook_icon">
          <FacebookIcon />
          <span>Log In With Facebook</span>
        </div>
        <p>Forgot Password ?</p>
      </div>


    </>
  )
}

export default SignUp