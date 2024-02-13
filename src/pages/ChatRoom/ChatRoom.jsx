import { useEffect, useState, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'
import Conversations from './../../components/Conversations'
import axios from 'axios';
import NewConversationPopup from './../../components/NewConversationPopup'
import SendMessage from './../../components/SendMessage'
import DOMPurify from 'dompurify';
import Linkify from 'react-linkify';
import { SocketContext } from '../../context/SocketContext';
import useWindowResize from './../../hooks/useWindowResize'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function ChatRoom() {

  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef();
  const [currentChat, setCurrentChat] = useState(null);
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [friendDetails, setFriendDetails] = useState({});
  const [conversations, setConversations] = useState([]);
  const [isMessagesWindowOpen, setIsMessagesWindowOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const windowWidth = useWindowResize();

  // Scrolls the messages window, down to the last message when a new one appears
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", top: "start" });
    }
  }, [messages])

  // Socket IO functions for messaging

  useEffect(() => {
    // Receive messages in the client from a sender
    const socketRef = socket.current;

    if (socketRef) {
      const handleMessage = data => {
        console.log(data)
        setMessages(prev => [...prev, {
          senderId: data.senderId,
          message: data.message,
          createdAt: data.createdAt,
          conversationId: data.conversationId
        }]);
      };
  
      socketRef.on('receive-message', handleMessage);

      return () => {
        socketRef.off('receive-message', handleMessage);
      }
    }
  }, [socket]);

  useEffect(() => {
    if (socket.current) {
      // Connects and creates a socket ID
      socket.current.on('connect', () => {
        console.log(`You connected with ID: ${socket.current.id}`);
      });

      // Disconnects the user
      socket.current.on('disconnect', () => {
        console.log('Disconnected from the server');
      });

      // Adds user in the socket server when they login
      socket.current.emit('addUser', user.userID);

      socket.current.on('getUsers', users => {
        console.log(users);
      });
    }
  }, [socket, user, user.userID])

  // Fetch all messages from the database based on the selected clicked conversation
  useEffect(() => {
      const getMessages = async () => {
        try {
          const res = await axios.get('http://localhost:8081/get_messages/' + currentChat.id);
          setMessages(res.data.messages);
        } catch (err) {
          console.log(err);
        }
      }
      getMessages();
      console.log(currentChat)
  }, [currentChat]);

  // Start a new conversation when clicking the New Conversation button
  useEffect(() => {
    if (user && user.userID && friendDetails) {
      try {
        const details = {
          userId: user.userID,
          friendId: friendDetails.id
        };
  
        const newConversation = async () => {
          const res = await axios.post('http://localhost:8081/new_conversation', details);
          setCurrentChat(res.data.conversations[0]);
          console.log(res.data.conversations)
        };
        newConversation();
      } catch (err) {
        console.log(err);
      }
    }
  }, [user, friendDetails, conversations]);

  // Handle uploading multiple files before sending the message
  const handleFileChange = (e) => {
    setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  }

  // Send message function
  const handleKeyDown = (e) => {
    // Check if the Enter key is pressed
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior
      sendMessage(); // Call your sendMessage function
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    sendMessage(); // Call your sendMessage function
  };

  const sendMessage = async () => {
    // If function checks whether the message field is empty or not. 
    // Does not send message if the field is empty
    if ((inputValue.trim() !== '' || selectedFiles.length > 0) && socket) {

      // DOM Purify package clears the message of any XSS attacks
      const cleanedMessage = DOMPurify.sanitize(inputValue);

      // Message properties to send to the Send Message route
      const message = {
        sender: user.userID,
        text: cleanedMessage,
        conversationId: currentChat.id
      };

      // Checks for the receiver ID to be added
      let receiver = currentChat.receiverId !== user.userID ? currentChat.receiverId : currentChat.senderId;

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      
      try {
        const resSendMessage = await axios.post('http://localhost:8081/send_messages', message, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(resSendMessage.data.results[1][0])

        // Sends the message to the socket server
        socket.current.emit('chat-message', {
          userId: user.userID,
          receiverId: receiver,
          message: cleanedMessage,
          createdAt: resSendMessage.data.results[1][0].creation_datetime,
          conversationId: currentChat.id
        });

        // Textarea is emptied after the message is sent
        setInputValue('');
      } catch (err) {
        console.log(err)
      }
    } else return;
  };

  return (
    <div className='w-full fixed'>
      <NewConversationPopup 
        isNewConversationOpen={isNewConversationOpen} 
        setIsNewConversationOpen={setIsNewConversationOpen}
        setFriendDetails={setFriendDetails}
      />

      <div className="w-full h-screen flex flex-row pt-[5rem]">
        <Conversations 
          currentChat={currentChat} 
          setCurrentChat={setCurrentChat}
          setIsNewConversationOpen={setIsNewConversationOpen}
          messages={messages}
          conversations={conversations}
          setConversations={setConversations}
          setIsMessagesWindowOpen={setIsMessagesWindowOpen}
          isMessagesWindowOpen={isMessagesWindowOpen}
        />

        <div className={`${windowWidth <= 768 && isMessagesWindowOpen === false ? 'hidden' : 'block'} w-full border-t border-t-white/10`}>
          <div className={`${windowWidth <= 768 ? 'block' : 'hidden'} sticky border-b border-b-white/10 py-[1rem] px-[1.5rem]`}>
              <div>
                <ArrowBackIosIcon 
                onClick={() => {
                  setCurrentChat(null);
                  setIsMessagesWindowOpen(false)
                }}
                />
              </div>
          </div>
          <div className='h-[calc(100%-173px)] md:h-[calc(100%-115px)] overflow-y-auto'>
            <ul className='flex flex-col gap-y-[1rem] py-[5rem]'>
              {currentChat ? messages.map((message, index) => {
                return (
                  <li
                    ref={scrollRef}
                    key={index} 
                    className={`w-full px-[2rem] md:px-[6rem] flex flex-row ${message.senderId === user.userID ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className='flex flex-col items-end gap-y-[0.5rem] '>
                      <div className={`${message.senderId === user.userID ? 'bg-blue-100/20' : 'bg-blue' } w-fit max-w-[35rem]
                      px-[1rem] py-[0.8rem] rounded-[15px] break-words`}>
                        <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                          <a target="blank" href={decoratedHref} key={key} style={{ textDecoration: 'underline', color: 'white' }}>
                              {decoratedText}
                          </a>
                          )}
                        >
                          <p>{message.message}</p>
                        </Linkify>
                      </div>

                      {/* Display images */}
                      {message.images && message.images.map((image, imageIndex) => (
                        <div key={imageIndex}>
                          <img src={`data:${image.mimetype};base64,${image.data}`} alt="Message Image" />
                        </div>
                      ))}

                      <p className='text-white/50 pr-[0.3rem]'>{message.createdAt.substring(11, 16)}</p>
                    </div>
                  </li>
                )
                }) : (
                  <div className='w-full px-[6rem]'>
                    <p className='text-[1.2rem] text-white/50'>Start a new chat or select a 
                    contact from the right panel</p>
                  </div>
                )
              }
            </ul>
          </div>

          <SendMessage 
            handleSubmit={handleSubmit}
            handleKeyDown={handleKeyDown}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleFileChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  )
}

