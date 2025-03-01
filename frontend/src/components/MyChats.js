import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { Avatar } from "@chakra-ui/react";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
  display="flex"
  flexDirection="column"
  p={3}
  bg="#F8F8F8"
  w="100%"
  h="100%"
  borderRadius="lg"
  overflowY="hidden"
>
{chats ? (
  <Stack overflowY="scroll">
    {chats?.map((chat) => {
      const isSelected = selectedChat === chat;
      const isUnread = chat?.unreadMessages > 0; // Example unread logic

      // Get the correct user (excluding loggedUser)
      const chatUser = !chat?.isGroupChat
        ? chat?.users?.find((user) => user?._id !== loggedUser?._id)
        : null;

      return (
        <Box
          key={chat._id}
          onClick={() => setSelectedChat(chat)}
          cursor="pointer"
          bg={isSelected ? "#38B2AC" : "#E8E8E8"}
          color={isSelected ? "white" : "black"}
          px={3}
          py={2}
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Avatar
            size="sm"
            name={chatUser?.name || chat.chatName} // Show name for fallback
            src={chatUser?.pic} // Correctly extract the user's profile picture
            mr={2}
          />

          <Box flex="1">
            {/* Chat Name */}
            <Text fontWeight="bold">
              {!chat.isGroupChat ? chatUser?.name : chat.chatName}
            </Text>

            {/* Latest Message */}
            {chat.latestMessage && (
              <Text fontSize="xs" color="gray.600" isTruncated>
                <b>{chat?.latestMessage?.sender?.name}: </b>
                {chat.latestMessage?.content?.length > 50
                  ? chat?.latestMessage?.content?.substring(0, 50) + "..."
                  : chat?.latestMessage?.content}
              </Text>
            )}
          </Box>

          {/* Unread Indicator */}
          {isUnread && <Box w={2} h={2} bg="blue.500" borderRadius="full" />}
        </Box>
      );
    })}
  </Stack>
) : (
  <ChatLoading />
)}

</Box>

    </Box>
  );
};

export default MyChats;
