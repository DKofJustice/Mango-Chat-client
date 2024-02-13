import ChatContact from './../components/ChatContact'
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'
import SmsIcon from '@mui/icons-material/Sms';
import axios from 'axios';
import PropTypes from 'prop-types';
import ChatUser from './ChatUser'
import useWindowResize from './../hooks/useWindowResize'

export default function Conversations({ currentChat, setCurrentChat, setIsNewConversationOpen,
   conversations, setConversations, setIsMessagesWindowOpen, isMessagesWindowOpen }) {

    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [selectedChatButton, setSelectedChatButton] = useState(null);


    const windowWidth = useWindowResize();

    // Fetch all existing conersations from the database and display them to the user
    useEffect(() => {
        if (user && user.userID) {
          const getConversations = async () => {
            try {
              const res = await axios.get('http://localhost:8081/get-conversations/' + user.userID);
              console.log(res.data.conversations)
              setConversations(res.data.conversations);
            } catch (err) {
              console.log(err);
            }
          };
          getConversations();
        }
    }, [user, user.userID, setConversations]);

    // Fetch all other users from the database
    useEffect(() => {
        if (user && user.userID) {
            const getUsers = async () => {
              try {
                const res = await axios.get('http://localhost:8081/all_users/' + user.userID);
                setUsers(res.data.users);
              } catch (err) {
                console.log(err);
              }
            };
            getUsers();
        }
    }, [user]);

  return (
    <div className={`${windowWidth <= 768 ? 'w-full' : 'w-[27rem]'} ${isMessagesWindowOpen === true && windowWidth <= 768 ? 'hidden' : 'block'}
    border-r border-r-white/10 border-t border-t-white/10 
    gap-y-[1rem] p-[1rem]`}>

        <div className='w-full py-[1rem] flex flex-row justify-end'>
          <SmsIcon 
            className='cursor-pointer'
            onClick={() => setIsNewConversationOpen(true)}
          />
        </div>

        <div className='w-full mb-[1.5rem] pb-[1rem] flex flex-row gap-x-[1rem] border-b border-b-white/10'>
            {users.map(u => {
                return <ChatUser 
                  key={u.id} 
                  chatUser={u} 
                  currentUser={user} 
                />
            })}
        </div>

        {conversations ? conversations.map((c, index) => (
            <div 
              key={index} 
              onClick={() => {
              setCurrentChat(c);
              setSelectedChatButton(index);
              setIsMessagesWindowOpen(true)
            }}
              className={`${selectedChatButton === index && (c && currentChat && c.senderId === currentChat.senderId) ? 'bg-blue-100/20': 'bg-none'} rounded-[15px] cursor-pointer`}
            >
                <ChatContact 
                  conversation={c} 
                  currentUser={user}
                  currentChat={currentChat}
                />
            </div>
        )) : <div className='text-white/50'>
                Start a new conversation
            </div>
            }
      </div>
  )
}

Conversations.propTypes = {
    currentChat: PropTypes.object,
    setCurrentChat: PropTypes.func,
    setIsNewConversationOpen: PropTypes.func,
    conversations: PropTypes.array,
    setConversations: PropTypes.func,
    setIsMessagesWindowOpen: PropTypes.func,
    isMessagesWindowOpen: PropTypes.func,
}