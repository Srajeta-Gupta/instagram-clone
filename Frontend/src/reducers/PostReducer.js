const postReducer = (
  state = { posts: [], loading: false, error: false, uploading: false },
  action
) => {
  switch (action.type) {
    // belongs to PostShare.js
    case "UPLOAD_START":
      return { ...state, error: false, uploading: true };
    case "UPLOAD_SUCCESS":
      return { ...state, posts: [action.data, ...state.posts], uploading: false, error: false };
    case "UPLOAD_FAIL":
      return { ...state, uploading: false, error: true };
    // belongs to Posts.js
    case "RETREIVING_START":
      return { ...state, loading: true, error: false };
    case "RETREIVING_SUCCESS":
      return { ...state, posts: action.data, loading: false, error: false };
    case "RETREIVING_FAIL":
      return { ...state, loading: false, error: true };
    case "DELETE_POST":
      return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
    case "COMMENT_POST":
      return {
        ...state, posts: state.posts.map((post) => {
          if (post._id === action.payload._id) return action.payload

          return post;
        }),
      };
    default:
      return state;
  }
};

export default postReducer;