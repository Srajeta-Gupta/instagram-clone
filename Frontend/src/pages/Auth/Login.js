import React, { useState, useEffect } from 'react'
import { useAlert } from 'react-alert'
import './Auth.css'
import FacebookIcon from '@mui/icons-material/Facebook';
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../../actions/AuthAction";

const Login = () => {

  const loading = useSelector((state) => state.authReducer.loading);

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

    if (data.username === "" || data.password === "") {
      setDisabled(true);
    }
    else {
      setDisabled(false);
    }
    //check this later
  }, [data.username, data.password])


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


    const action = logIn(data);
    const res = await action(dispatch)
    const error = res.sucess

    error ? alert.success("Successfully Logged In")
      : alert.info("Please check credentials and try again")


    resetForm();
  };

  return (
    <>
      <div className="form">

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
          autoComplete="off"
        />

      </div>

      <button className={`${!disabled ? "infoButton" : "disabled"}`} type="submit" onClick={handleSubmit} style={{ marginTop: "1rem" }} disabled={
        data.username === "" ||
        data.password === ""
      }
      >
        {loading ? "Loading" : "Login"}
      </button>

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

export default Login