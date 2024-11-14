import React from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import User from '../User/User'
import { useSelector } from "react-redux";
import '../Suggestions.css'

const FollowersModal = ({ persons, followersModalOpened, setFollowersModalOpened }) => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const theme = useMantineTheme();
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
            size="28%"
            opened={followersModalOpened}
            onClose={() => setFollowersModalOpened(false)}
            // eslint-disable-next-line
            onClose={() => window.location.reload()}
        >
            {persons.length === 1 && <h4 style={{ margin: "auto" }}>No Users Found</h4>}
            {persons.map((person, id) => (
                person._id !== user._id && <User person={person} key={id} />
            ))}
        </Modal>
    );
};

export default FollowersModal;