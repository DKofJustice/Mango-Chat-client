import PropTypes from 'prop-types';
import { useEffect, useState, useRef, useContext } from 'react'
import { motion } from "framer-motion"
import SearchIcon from '@mui/icons-material/Search';
import { AuthContext } from '../context/AuthContext'
import ProfileImage from './../assets/Profile Image.png'
import axios from 'axios';

export default function NewConversationPopup({ isNewConversationOpen, setIsNewConversationOpen, setFriendDetails }) {

    const { user } = useContext(AuthContext);
    const modalRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [users, setUsers] = useState([]);

    // Handling the click outside the modal, closing it 
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsNewConversationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsNewConversationOpen]);

  // Framer motion animation styles
  const backgroundVar = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  const modalVar = {
    hidden: { opacity: 0, translateY: 350, scale: 0.1 },
    visible: { opacity: 1, translateY: 0, scale: 1 }
  };

  // Search and fetch first 10 users
  const searchUser = async (e) => {
    if (inputValue.trim() !== '' && e.key === 'Enter') {

      const userInfo = {
        sender: user.userID,
        friendName: inputValue,
      };

      try {
        const res = await axios.post('http://localhost:8081/new_conv_users', userInfo);
        setUsers(res.data.users);
      } catch (err) {
        console.log(err)
      }
    } else return;
  };

  return (
    <motion.div 
        className={`w-full h-full bg-black/50 absolute z-[1000] ${isNewConversationOpen ? 'block' : 'hidden'}`}
        animate={ isNewConversationOpen ? 'visible' : 'hidden' }
        variants={backgroundVar}
    >
        <motion.div 
            ref={modalRef}
            className='relative w-full max-w-[30rem] h-[30rem] bg-dark-blue-200 mx-auto 
            top-[10rem] rounded-[15px] p-[2rem] shadow-xl shadow-dark-blue-100/60'
            animate={ isNewConversationOpen ? 'visible' : 'hidden' }
            variants={modalVar}
        >
            <div className='w-full mb-[2rem]'>
                <p className='text-center text-[1.2rem] font-semibold'>Search for someone to start a conversation</p>
            </div>

            <div className='relative w-full mb-[2rem] flex flex-row justify-center'>
                <SearchIcon 
                    className='absolute left-[2.5rem] top-[0.7rem]'
                    sx={{ fontColor: 'white', opacity: 0.3 }}
                />
                <input 
                    type="text"
                    className='w-full max-w-[23rem] rounded-lg pl-[3rem] py-[0.7rem] bg-dark-blue-300'
                    placeholder='Search someone...'
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={searchUser}
                />
            </div>

            <div className='w-full'>
                <ul className='mb-[2rem] h-[15rem] overflow-auto rounded-lg'>
                    {users && users.map(singleUser => {
                        return (<li
                            onClick={() => {
                                setFriendDetails(singleUser);
                                setIsNewConversationOpen(false);
                            }}
                            key={singleUser.id}
                            className='flex flex-row items-center gap-x-[1rem] 
                            border-b border-white/10 py-[0.7rem] px-[1rem] cursor-pointer hover:bg-blue-100/20'>
                            <div className="w-5 lg:w-10 h-5 lg:h-10 rounded-full overflow-hidden">
                                <img 
                                    src={ProfileImage} 
                                    alt="" 
                                    className='w-full h-full scale-[105%]' 
                                />
                            </div>
                            <p>{singleUser.name}</p>
                        </li>
                        )}
                    )}
                    <p className='text-center text-white/50 font-light py-[1rem]'>Only the first 10 results will be shown for peformance reasons</p>
                </ul>
            </div>
        </motion.div>
    </motion.div>
  )
}

NewConversationPopup.propTypes = {
    isNewConversationOpen: PropTypes.bool.isRequired,
    setIsNewConversationOpen: PropTypes.func.isRequired,
    setFriendDetails: PropTypes.func
}