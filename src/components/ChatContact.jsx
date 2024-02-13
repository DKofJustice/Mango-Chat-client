import PropTypes from 'prop-types';
import ProfileImage from './../assets/Profile Image.png'
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext'

export default function ChatContact({ conversation, currentUser }) {
  const [friendId, setFriendId] = useState(null);
  const [friendDetails, setFriendDetails] = useState({});

  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (conversation.receiverId !== currentUser.userID) {
      setFriendId(conversation.receiverId);
    } else if (conversation.senderId !== currentUser.userID) {
      setFriendId(conversation.senderId);
    }

    // Fetch and display conversation details
    const getUser = async () => {
      try {
        const res = await axios.get('http://localhost:8081/users?friendId=' + friendId + '&conversationId=' + conversation.id);
        setFriendDetails(res.data)
        console.log(res.data)
      } catch (err) {
        console.log(err);
      }
    };

    if (friendId !== null) {
      getUser();
    }
  }, [friendId, conversation, currentUser.userID]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('receive-message', data => {
        setFriendDetails(prevState => ({
          ...prevState,
          conversationData: prevState.conversationData.map(conversation => ({
            ...conversation,
            message: data.message,
            senderId: data.senderId
          }))
        }));
      });
    }
  }, [socket]);



  return (
    <div className='flex flex-row items-center rounded-[15px] p-[1.5rem]'>
          <div className="w-6 lg:w-11 h-6 lg:h-11 rounded-full overflow-hidden">
            <img src={ProfileImage} alt="Profile Image" className='w-full h-full scale-[105%]' />
          </div>

          <div className='mx-[1.4rem]'>
            <p>{ friendDetails.userData ? friendDetails.userData[0].name : 'User does not exist' }</p>
            <p className='text-white/50'>
              <span>
                {friendDetails.conversationData && friendDetails.conversationData.length > 0 && friendDetails.conversationData[0].senderId === user.userID
                ? 'You: ' : ''
                }
              </span>
              <span>
                {friendDetails.conversationData && friendDetails.conversationData.length > 0
                ? friendDetails.conversationData[0].message : ''
                }
              </span>
            </p>
          </div>
    </div>
  )
}

ChatContact.propTypes = {
  conversation: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
}
