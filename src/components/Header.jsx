import MangoLogo from './../components/MangoLogo'
import { Outlet } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications';
import ProfileImage from './../assets/Profile Image.png'
import ProfileModal from './../components/ProfileModal'
import { useState } from 'react';

export default function Header() {

  const [displayProfileModal, setDisplayProfileModal] = useState(false);

  return (
    <>
      <div className='fixed z-[200] w-full py-[1.3rem] px-[2rem] lg:px-[8rem] flex flex-row items-center'>
        <MangoLogo/>

        <div className='mr-[1rem] lg:mr-[2rem] ml-auto flex flex-row justify-center items-center'>
          <NotificationsIcon sx={{ fontSize: 30, opacity: 0.2 }} />
        </div>

        <div className='w-6 lg:w-11 h-6 lg:h-11 rounded-full overflow-hidden cursor-pointer'>
          <img src={ProfileImage} alt="Profile-image" className='w-full h-full scale-[105%]'
          onClick={() => setDisplayProfileModal(true)}
          />
        </div>

        <ProfileModal displayProfileModal={displayProfileModal} setDisplayProfileModal={setDisplayProfileModal} />
      </div>

      <Outlet />
    </>
  )
}
