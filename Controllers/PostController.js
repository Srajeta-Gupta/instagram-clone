import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

// Create new Post

export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
  console.log(newPost);
};

// Get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);

    res.status(200).json(post);

  } catch (error) {
    res.status(500).json(error);
  }
};

// Get posts of specific user

export const getUsersPost = async (req, res) => {
  const userId = req.params.userId;
  try {
    let posts = await PostModel.find();
    posts = posts.map((post) => {
      if (post.userId === userId) {
        return posts = post
      }
    })

    res.status(200).json(posts);
    // console.log(posts);

  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  try {
    const post = await PostModel.findById(id);
    // console.log(_id);
    if (post.userId === _id) {
      await post.deleteOne();
      res.status(200).json("Post deleted successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  const { value } = req.body;
  // console.log(userId);
  try {
    const post = await PostModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      await post.updateOne({ $push: { likedBy: value } });
      res.status(200).json(post.likedBy);
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      await post.updateOne({ $pull: { likedBy: value } });
      res.status(200).json("Post Unliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// save or unsave a post
export const savePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  // console.log(userId);
  try {
    const post = await PostModel.findById(id);
    if (!post.savedBy.includes(userId)) {
      await post.updateOne({ $push: { savedBy: userId } });
      res.status(200).json(post.savedBy);
    } else {
      await post.updateOne({ $pull: { savedBy: userId } });
      res.status(200).json("Post Unsaved");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Timeline Posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res
      .status(200)
      .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return b.createdAt - a.createdAt;
        })
      );
  } catch (error) {
    res.status(500).json(error);
  }
};

// comment post

export const commentPost = async (req, res) => {

  const { id } = req.params;
  const { userId } = req.body;
  const post = await PostModel.findById(id);

  // if (post.userId !== userId) return res.json({ message: "Unauthenticated" })

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const { value } = req.body;

  post.comments.push(value)

  const updatedPost = await PostModel.findByIdAndUpdate(id, post, { new: true });

  res.json(updatedPost);
  // console.log(updatedPost);
}

// get posts by search

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query

  try {
    const postTitle = new RegExp(searchQuery, 'i');
    // if( !mongoose.Types.ObjectId.isValid(id) ) return false;
    // const posts = await PostModel.find({ 'title':postTitle });
    const posts = await PostModel.find({ $or: [{ 'title': postTitle }, { tags: { $in: tags.split(',') } }] });
    res.status(200).json(posts)
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


