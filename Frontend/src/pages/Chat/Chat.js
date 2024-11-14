import React, { useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Conversation/Conversation";
import "./Chat.css";
import { useEffect } from "react";
import { userChats } from "../../api/ChatRequests";
import { createChat } from "../../api/ChatRequests";
import { getAllUser } from "../../api/UserRequests";

import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useAlert } from 'react-alert'

const Chat = () => {
    // const dispatch = useDispatch();
    const socket = useRef();
    const { user } = useSelector((state) => state.authReducer.authData);
    const alert = useAlert();

    const [chats, setChats] = useState([]);
    const [persons, setPersons] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(null);
    const [userExists, setUserExists] = useState(false);

    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;


    useEffect(() => {
        const fetchPersons = async () => {
            const { data } = await getAllUser();
            setPersons(data);
        };
        fetchPersons();
    }, []);

    // Get the chat in chat section
    useEffect(() => {
        const getChats = async () => {
            try {
                const { data } = await userChats(user._id);
                setChats(data);
            } catch (error) {
                console.log(error);
            }
        };
        getChats();
    }, [user._id]);

    // Connect to Socket.io
    useEffect(() => {
        socket.current = io("ws://localhost:8800");
        socket.current.emit("new-user-add", user._id);
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users);
        });
    }, [user]);

    // Send Message to socket server
    useEffect(() => {
        if (sendMessage !== null) {
            socket.current.emit("send-message", sendMessage);
        }
    }, [sendMessage]);


    // Get the message from socket server
    useEffect(() => {
        socket.current.on("recieve-message", (data) => {
            console.log(data)
            setReceivedMessage(data);
        }

        );
    }, []);

    // check online status
    const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((member) => member !== user._id);
        const online = onlineUsers.find((user) => user.userId === chatMember);
        return online ? true : false;
    };

    const activeUsers = persons.filter((person) => person._id !== user._id);

    const userExist = chats.map(chat => chat.members.find(id => id !== user._id))


    const newChat = async (reciever) => {
        const foundUser = userExist.map((user) => user === reciever._id)
        const result = foundUser.every(value => value === false);
        // console.log(result);
        if (result) {
            // console.log("hello")
            await createChat({ senderId: user?._id, receiverId: reciever?._id })
            alert.info("Reloading to save changes")
            alert.success("Select Chat and Start Messaging")
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } else {
            alert.info("A chat with selected user already exists")
        }
    }

    console.log(chats);
    console.log(activeUsers);

    return (
        <div className="Chat">
            {/* Left Side */}
            <div className="Left-side-chat">
                <div className="Chat-container">
                    <h2>Accounts</h2>

                    <div className="Chat-list">
                        {/* creating chats with new users */}
                        <div className="OnlineUsers">
                            {activeUsers.map((person) =>
                                // <div className="userDetails" key={person._id}>

                                //     <div >
                                //         <p className="OnlineUser-id" key={person._id}>{person?.fullname}</p>
                                //     </div>
                                //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                                //         <p className="OnlineUser-id" key={person._id}>{person?.fullname}</p>

                                //         <button type="submit" className="CreateChat button ps-button" onClick={() => newChat(person)}>Chat</button>
                                //     </div>
                                // </div>
                                <div className="suggested_users" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>

                                        <img className="suggested_users_image" src={
                                            person?.profilePicture
                                                ? serverPublic + person.profilePicture
                                                : serverPublic + "defaultProfile.png"
                                        } alt={person?.fullname} />
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span className="user_id">{person?.fullname} <br /> {person?.username} </span>

                                        </div>
                                    </div>

                                    <button type="submit" className="CreateChat button ps-button" style={{
                                        width: "6rem",
                                        padding: "0px",
                                        height: "2.5rem"
                                    }} onClick={() => newChat(person)}>Chat</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="Left-side-chat">
                <div className="Chat-container">
                    <h2>Chats</h2>

                    <div className="Chat-list">

                        {/* displaying existing chats */}
                        {chats !== null ? chats?.map((chat, index) => (
                            <div
                                onClick={() => {
                                    setCurrentChat(chat);
                                }}

                                key={index}
                            >
                                <Conversation
                                    key={chat._id}
                                    data={chat}
                                    everyChat={chats}
                                    currentUser={user._id}
                                    online={checkOnlineStatus(chat)}
                                />
                            </div>
                        )) : console.log("no chats found")}
                    </div>
                </div>
            </div>

            {/* Right Side */}

            <div className="Right-side-chat">

                <ChatBox
                    chat={currentChat}
                    currentUser={user._id}
                    currentUserImage={user.profilePicture}
                    setSendMessage={setSendMessage}
                    receivedMessage={receivedMessage}
                />
            </div>
        </div>
    );
};

export default Chat;
