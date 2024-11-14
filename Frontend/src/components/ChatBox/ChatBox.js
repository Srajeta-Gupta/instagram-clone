import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import moment from 'moment';
import InputEmoji from 'react-input-emoji'
import noMessages from './images/noMessages.png'
import { UilTimes } from "@iconscout/react-unicons";
import { uploadImage } from "../../actions/UploadAction";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const ChatBox = ({ chat, currentUser, currentUserImage, setSendMessage, receivedMessage }) => {

    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [image, setImage] = useState(null);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    const dispatch = useDispatch();

    const handleChange = (newMessage) => {
        setNewMessage(newMessage)
    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage(img);
        }
    };

    // fetching data for header
    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUser);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);
                setUserData(data);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat !== null) getUserData();
    }, [chat, currentUser]);

    // fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await getMessages(chat._id);
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat !== null) fetchMessages();
    }, [chat]);


    // Always scroll to last Message
    useEffect(() => {
        setTimeout(() => document.getElementById("chats__")?.scrollBy({ top: 100000, left: 0, behavior: "smooth" }), 300)
    }, [messages])


    // Send Message
    const handleSend = async (e) => {
        e.preventDefault()

        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        }

        if (image) {
            const data = new FormData();
            const fileName = Date.now() + image.name;
            data.append("name", fileName);
            data.append("file", image);
            message.image = fileName;
            try {
                await dispatch(uploadImage(data));
            } catch (err) {
                console.log(err);
            }
        }

        const receiverId = chat.members.find((id) => id !== currentUser);
        // send message to socket server
        setSendMessage({ ...message, receiverId })
        // send message to database
        try {
            console.log(message);
            const { data } = await addMessage(message);
            console.log(data);
            setMessages([...messages, data]);
            setNewMessage("");
            setImage(null);
        }
        catch
        {
            console.log("error")
        }
    }

    const handleKeyDown = async (e) => {

        if (e.key === 'Enter') {
            e.preventDefault()

            const message = {
                senderId: currentUser,
                text: newMessage,
                chatId: chat._id,
            }

            if (image) {
                const data = new FormData();
                const fileName = Date.now() + image.name;
                data.append("name", fileName);
                data.append("file", image);
                message.image = fileName;
                try {
                    await dispatch(uploadImage(data));
                } catch (err) {
                    console.log(err);
                }
            }

            const receiverId = chat.members.find((id) => id !== currentUser);
            // send message to socket server
            setSendMessage({ ...message, receiverId })
            // send message to database
            try {
                console.log(message);
                const { data } = await addMessage(message);
                console.log(data);
                setMessages([...messages, data]);
                setNewMessage("");
                setImage(null);
            }
            catch
            {
                console.log("error")
            }
        }

    }

    // Receive Message from parent component
    useEffect(() => {
        console.log("Message Arrived: ", receivedMessage)
        if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
            setMessages([...messages, receivedMessage]);
        }
        // eslint-disable-next-line
    }, [receivedMessage])

    const scroll = useRef();
    const imageRef = useRef();

    // console.log(userData);

    return (
        <>
            <div className="ChatBox-container">
                {chat ? (
                    <>
                        {/* chat-header */}
                        <div className="chat-header">
                            <div className="follower">
                                <div className="suggested_users">
                                    <Link to={`/profile/${userData?._id}`} style={{ display: "flex" }}>

                                        <img className="suggested_users_image" src={
                                            userData?.profilePicture
                                                ? serverPublic + userData.profilePicture
                                                : serverPublic + "defaultProfile.png"
                                        } alt={userData?.fullname} />
                                    </Link>
                                    <div style={{ display: "flex", flexDirection: "column", margin: "auto 0px" }}>
                                        <span className="user_id">{userData?.fullname} <br /> {userData?.username} </span>
                                    </div>
                                </div>
                            </div>
                            <hr
                                style={{
                                    width: "95%",
                                    border: "0.1px solid #ececec",
                                    marginTop: "20px",
                                }}
                            />
                        </div>
                        {/* chat-body */}
                        <div className="chat-body" id="chats__" >
                            {messages.map((message, id) => (

                                <div
                                    key={id}
                                    ref={scroll}
                                    className={
                                        message.senderId === currentUser
                                            ? "message own"
                                            : "message"
                                    }
                                >
                                    <span style={{ fontSize: "large" }}>{message.text}</span>{" "}
                                    {message?.image &&
                                        <img className="chat_image" src={
                                            message?.image
                                                ? serverPublic + message.image
                                                : serverPublic + "defaultBackground.png"
                                        } alt={currentUser?.username} />

                                    }
                                    <span

                                        className={
                                            message.senderId === currentUser
                                                ? "timestamp_right"
                                                : "timestamp_left"
                                        }

                                        style={{ fontSize: "small" }}

                                    >{moment(message.createdAt).fromNow()}</span>

                                    {message.senderId === currentUser ?

                                        <div className="right_chatImage">
                                            <img className="innerChat_image" src={
                                                currentUserImage
                                                    ? serverPublic + currentUserImage
                                                    : serverPublic + "defaultProfile.png"
                                            } alt={userData?.fullname} />
                                        </div>

                                        :
                                        <div className="left_chatImage">
                                            <img className="innerChat_image" src={
                                                userData?.profilePicture
                                                    ? serverPublic + userData.profilePicture
                                                    : serverPublic + "defaultProfile.png"
                                            } alt={userData?.fullname} />
                                        </div>
                                    }

                                </div>
                            ))}
                        </div>
                        {/* chat-sender */}
                        <div className="chat-sender">
                            <div onClick={() => imageRef.current.click()}>+</div>
                            {image && (
                                <div className="Chat_previewImage">
                                    <UilTimes onClick={() => setImage(null)} />
                                    <img src={URL.createObjectURL(image)} alt="preview" />
                                </div>
                            )}
                            <InputEmoji
                                value={newMessage}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="send-button button" style={{ cursor: 'pointer', margin: "auto" }} onClick={handleSend} > <span>Send</span> </div>
                            <input
                                type="file"
                                name=""
                                id=""
                                style={{ display: "none" }}
                                ref={imageRef}
                                onChange={onImageChange}
                            />
                        </div>{" "}
                    </>
                ) : (
                    <>
                        <span className="chatbox-empty-message">
                            Tap on a chat to start conversation...
                        </span>
                        <img src={noMessages} alt="" style={{ margin: "auto", mixBlendMode: "multiply" }} />
                    </>
                )
                }

            </div >
        </>
    );
};

export default ChatBox;
