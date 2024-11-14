import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import StoriesNotFound from "../../../pages/NotFound/StoriesNotFound";
import { getUser } from "../../../api/UserRequests";
import { getUsersPost } from "../../../api/PostsRequests";
import Stories from 'react-insta-stories';
import Footer from "../../Footer/Footer";

const StoriesGallery = () => {

    const profileId = useParams()
    const [person, setPerson] = useState([]);
    const [post, setPost] = useState([]);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    const finalPostsImage = []
    const finalPosts = []

    useEffect(() => {
        const fetchPerson = async () => {
            const { data } = await getUser(profileId.id);
            setPerson(data);
        };
        fetchPerson();

        const fetchUserPosts = async () => {
            const { data } = await getUsersPost(profileId.id);
            setPost(data);
        };
        fetchUserPosts();
        // eslint-disable-next-line
    }, []);

    post.map((currentPost) => (
        currentPost !== null &&
        finalPostsImage.push(currentPost.image) && finalPosts.push(currentPost)
    ))

    if (finalPosts.length === 0) return <StoriesNotFound />

    return (
        <>
            {/* <Gallery image={finalPostsImage ? finalPostsImage.map((currentPost) => serverPublic + currentPost?.image) : null} /> */}

            <div style={{ margin: "auto", marginTop: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Stories
                    stories={finalPostsImage ? finalPostsImage.map((currentPost) => serverPublic + currentPost) : null}
                    defaultInterval={5000}
                    width={350}
                    height={500} />

                <div style={{ marginTop: "1rem" }}>
                    <Link to={`/profile/${profileId.id}`} style={{ display: "flex" }}>
                        <img className="user_image" src={
                            person.profilePicture
                                ? serverPublic + person.profilePicture
                                : serverPublic + "defaultProfile.png"
                        } alt={person.fullname} />
                        <div>
                            <p className="user_name">{person.username}</p>
                            <span style={{ marginLeft: "0.5rem", color: "black" }}>{person.fullname}</span>
                        </div>
                    </Link>
                </div>
                <Footer />
            </div>
        </>


    );

};

export default StoriesGallery;