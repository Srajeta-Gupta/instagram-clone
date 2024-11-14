import React from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import '../../Profile/Profile.scss'
import '../../Post/Post.css'
import User from "../User";

const UsersOverview = ({ data, query, usersOverviewModalOpened, setUsersOverviewModalOpened }) => {

    const theme = useMantineTheme();

    // console.log(data);
    // console.log(postComments);

    return (

        <Modal
            overlayColor={
                theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[2]
            }
            overlayOpacity={0.55}
            overlayBlur={3}
            overflow="inside"
            size="25%"
            // overflow="inside"
            opened={usersOverviewModalOpened}
            onClose={() => (setUsersOverviewModalOpened(false))}
            style={{ height: "100vh" }}
        >
            <>
                <div className="other_users">
                    {data.map((person, id) => (
                        // query === (person.username).toLowerCase() ?
                        //     <User person={person} key={id} />
                        //     : (query === (person.fullname).toLowerCase()) &&
                        //     <User person={person} key={id} />
                        person.username.toLowerCase().includes(query.toLowerCase()) ?
                            <User person={person} key={id} /> : person.fullname.toLowerCase().includes(query.toLowerCase()) && <User person={person} key={id} />
                    ))}
                </div>
            </>
        </Modal >

    );
};

export default UsersOverview;