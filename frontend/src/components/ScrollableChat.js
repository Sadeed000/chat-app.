import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { CheckIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const messageTime = new Date(m.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Shows AM/PM format
          });

          return (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
              <div className="flex-col">{m.content}</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "gray",
                    marginTop: "2px",
                    display: "flex",
                    alignItems: "center", // Aligns icon & time
                    justifyContent: "flex-end", // Aligns to right
                    gap: "4px",
                  }}
                >
                  {console.log(m?.readBy)}
{messageTime}
{m.sender._id === user._id && (
  <div style={{ display: "flex", alignItems: "center", flexDirection: "column", lineHeight: "1", height: "10px" }}>
    <CheckIcon boxSize={2} color={m.readBy?.length > 0 ? "blue.500" : "gray.500"} />
    <CheckIcon boxSize={2} color={m.readBy?.length > 0 ? "blue.500" : "gray.500"} style={{ marginTop: "-3px" }} />
  </div>
)}


                </div>
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
