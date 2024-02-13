import ProfileImage from './../assets/Profile Image.png'
import PropTypes from 'prop-types';

export default function ChatUser({ chatUser, currentUser }) {
  return (
        <div className='w-10 flex flex-col justify-center items-center gap-y-[0.5rem]'>
            <div className="w-5 lg:w-10 h-5 lg:h-10 rounded-full overflow-hidden">
                <img src={ProfileImage} alt="" className='w-full h-full scale-[105%]' />
            </div>
            <p className='w-fit'>{chatUser.name}</p>
        </div>
  )
}

ChatUser.propTypes = {
    chatUser: PropTypes.object,
    currentUser: PropTypes.object
}