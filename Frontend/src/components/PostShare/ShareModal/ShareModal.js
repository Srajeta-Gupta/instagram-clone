import { Modal, useMantineTheme } from "@mantine/core";
import PostShare from "../PostShare";
import '../PostShare.css'
import ImageSvg from "./ImageSvg.png"

function ShareModal({ modalOpened, setModalOpened, userId }) {
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
            size="40rem"
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
        >
            <div className="PostShare_modal_content">
                <img src={ImageSvg} alt="" />
                Upload photos and videos here
            </div>
            <PostShare userId={userId} />
        </Modal>
    );
}

export default ShareModal;
