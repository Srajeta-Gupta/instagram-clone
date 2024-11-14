import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        title: String,
        desc: String,
        tags: [String],
        likes: [],
        likedBy: [],
        savedBy: [],
        comments: {
            type: [String],
            timestamps: true,
            default: [],
        },
        image: String,
        story: String,
    },
    {
        timestamps: true,
    }
);

var PostModel = mongoose.model("Posts", postSchema);
export default PostModel;