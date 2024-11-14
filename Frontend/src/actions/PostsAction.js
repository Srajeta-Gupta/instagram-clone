import * as PostsApi from "../api/PostsRequests";

export const getTimelinePosts = (id) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });
  try {
    const { data } = await PostsApi.getTimelinePosts(id);
    dispatch({ type: "RETREIVING_SUCCESS", data: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: "RETREIVING_FAIL" });
  }
};

export const commentPost = (value, id) => async (dispatch)=>{
  try {
    const {data} = await PostsApi.comment(value,id);
    dispatch({type: "COMMENT_POST", payload: data});
    return data.comments;
  } catch (error) {
    console.log(error.message);
  }
}

export const deletePost = (id) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });
  try {
    await PostsApi.deletePost(id);
    dispatch({ type: "DELETE_POST", payload: id });
  } catch (error) {
    console.log(error.message);
    dispatch({ type: "RETREIVING_FAIL" });
  }
};
