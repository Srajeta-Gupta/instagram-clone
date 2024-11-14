import express from "express";
import { createPost, deletePost, getPost, getTimelinePosts, getUsersPost, getPostsBySearch, likePost, updatePost, commentPost, savePost } from "../Controllers/PostController.js";
const router = express.Router()
import authMiddleWare from '../middleware/AuthMiddleware.js';

router.get('/search', getPostsBySearch);
router.post('/', createPost)
router.get('/:id', getPost)
router.get('/user/:userId', getUsersPost)
router.put('/:id', authMiddleWare, updatePost)
router.delete("/:id", authMiddleWare, deletePost)
router.put("/:id/like", authMiddleWare, likePost)
router.put("/:id/save", authMiddleWare, savePost)
router.get("/:id/timeline", authMiddleWare, getTimelinePosts)
router.post('/:id/commentPost', authMiddleWare, commentPost);
export default router;