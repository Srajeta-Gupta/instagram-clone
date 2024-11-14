import * as AuthApi from '../api/AuthRequests'


export const logIn = (formData) => async (dispatch) => {

  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    return {
      sucess: true
    };
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
    return {
      sucess: false
    };
  }
}

export const signUp = (formData) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.signUp(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    return {
      sucess: true
    };
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
    return {
      sucess: false
    };
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: "LOG_OUT" })
}
