import axios from 'axios'


const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const getPostsBySearch = (searchQuery) => API.get(`/post/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const getTimelinePosts = (id) => API.get(`/post/${id}/timeline`);
export const likePost = (id, userId, value) => API.put(`/post/${id}/like`, { userId: userId, value })
export const savePost = (id, userId) => API.put(`/post/${id}/save`, { userId: userId })
export const getPost = (id) => API.get(`/post/${id}`);
export const getUsersPost = (userId) => API.get(`/post/user/${userId}`);
export const deletePost = (id, userId) => API.delete(`/post/${id}`, userId);
export const comment = (value, id) => API.post(`/post/${id}/commentPost`, { value });
