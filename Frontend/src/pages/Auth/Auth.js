import React, { useState, useEffect } from 'react'
import './Auth.css'
import Footer from '../../components/Footer/Footer'

import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../actions/AuthAction";
import { logIn } from "../../actions/AuthAction";

import { useAlert } from 'react-alert'
import FacebookIcon from '@mui/icons-material/Facebook';

const images = [

  "https://www.instagram.com/static/images/homepage/screenshots/screenshot1.png/fdfe239b7c9f.png",
  "https://www.instagram.com/static/images/homepage/screenshots/screenshot2.png/4d62acb667fb.png",
  "https://www.instagram.com/static/images/homepage/screenshots/screenshot3.png/94edb770accf.png",
  "https://www.instagram.com/static/images/homepage/screenshots/screenshot4.png/a4fd825e3d49.png"

]

const Auth = () => {

  const loading = useSelector((state) => state.authReducer.loading);

  const initialState = {
    fullname: "",
    username: "",
    password: "",
    emailMobile: ""
  };

  const [data, setData] = useState(initialState);
  const [disabled, setDisabled] = useState(true);

  const alert = useAlert();

  const dispatch = useDispatch();


  const [isSignUp, setIsSignUp] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const lastIndex = images.length - 1;
    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index]);

  useEffect(() => {
    let slider = setInterval(() => {
      setIndex(index + 1)
    }, 5000)

    return () => {
      clearInterval(slider);
    }
  }, [index])

  useEffect(() => {

    if (data.username === "" || data.password === "") {
      setDisabled(true);
    }
    else {
      setDisabled(false);
    }
    //check this later
  }, [data.username, data.password])

  // Managing isSignUp state

  const handleClick = () => {
    setIsSignUp(state => !state);
  }

  // Reset Form
  const resetForm = () => {
    setData(initialState);
  };

  // handle Change in input
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // submitting

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      const action = signUp(data);
      const res = await action(dispatch)
      const error = res.sucess
      error ? alert.success("Successfully Signed In")
        : alert.info("Please check Fields and try again")
      resetForm();
    }

    else {
      const action = logIn(data);
      const res = await action(dispatch)
      const error = res.sucess

      error ? alert.success("Successfully Logged In")
        : alert.info("Please check credentials and try again")
    }

    resetForm();
  };


  const handleKeyDown = async (e) => {
    if (e.keyCode === '13' || e.key === 'Enter') {
      e.preventDefault();

      if (isSignUp) {
        const action = signUp(data);
        const res = await action(dispatch)
        const error = res.sucess
        error ? alert.success("Successfully Signed In")
          : alert.info("Please check Fields and try again")
        resetForm();
      }

      else {
        const action = logIn(data);
        const res = await action(dispatch)
        const error = res.sucess

        error ? alert.success("Successfully Logged In")
          : alert.info("Please check credentials and try again")
      }

      resetForm();
    }
  }

  return (
    <div className="mainAuth">
      <div className="auth">
        <div className="auth_left">
          <div className="auth_left_image">
            {images.map((image, i) => {
              let position = "nextSlide"
              if (i === index) {
                position = "activeSlide"
              }
              if (i === index - 1 || (index === 0 && i === images.length - 1)) {
                position = "lastSlide"
              }
              return (
                <article className={position} key={i}>
                  <img src={image} alt="banner_img" />
                </article>
              )
            })}
          </div>
        </div>
        <div className="auth_right">
          <div className="auth_forms">
            <img src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png" alt="" />

            <div className="form">

              {
                isSignUp && (
                  <>
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
                  </>
                )
              }


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
                onKeyDown={handleKeyDown}
              />

            </div>


            {isSignUp &&

              <div className="signup_instructions">

                <span>
                  People who use our service may have uploaded your contact information to Instagram. <span style={{ fontWeight: "600" }}>Learn More</span>
                </span>
                <span>
                  By signing up, you agree to our <span style={{ fontWeight: "600" }}>Terms , Data Policy and Cookies Policy.</span>
                </span>

              </div>

            }

            <button className={`${!disabled ? "infoButton" : "disabled"}`} type="submit" onClick={handleSubmit} onKeyDown={handleKeyDown} style={{ marginTop: "1rem" }} disabled={
              data.username === "" ||
              data.password === ""
            }
            >
              {loading ? "Loading" : isSignUp ? "SignUp" : "Login"}

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
          </div>

          <div className="authForm_options">

            {isSignUp ?

              <div className="switch_login"><span style={{ padding: "1rem" }}>Already have an account ? <button className="SignupLogin" onClick={handleClick}>Login</button></span></div> :

              <div className="switch_signup"><span style={{ padding: "1rem" }}>Don't have an account ? <button className="SignupLogin" onClick={handleClick}>Sign up</button></span></div>}

          </div>

          <div className="getAppContainer">
            <span>Get the app.</span>
            <div className="getApp">
              <img id="AppStore" src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" alt="" />
              <img id="GooglePlay" src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" alt="" />
            </div>
          </div>

        </div>
      </div >
      <Footer />

    </div>
  )
}

export default Auth