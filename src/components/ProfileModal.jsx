import { useEffect, useRef, useContext } from 'react'
import PropTypes from 'prop-types';
import { AuthContext } from './../context/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function ProfileModal({ displayProfileModal, setDisplayProfileModal }) {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // The modal closes when clicked outside of it
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setDisplayProfileModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setDisplayProfileModal]);

  // When clicked, logs the user out and redirects them to the login page
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login')
  };

    return (
      <div 
      ref={modalRef} 
      className={`bg-dark-blue-300 absolute z-[1000] right-0 top-[5rem] mr-[3rem] lg:mr-[9rem] 
      rounded-[15px] ${ displayProfileModal ? 'block' : 'hidden' }`}>
          <ul className="p-[1rem] flex flex-col justify-center items-start gap-y-[0.5rem]">
              <li className='p-[1rem]'>Hello, { user.name }</li>
              <li 
                onClick={handleLogout}
                className='w-full cursor-pointer p-[1rem] rounded-lg hover:bg-blue-100/20'
              >Logout</li>
          </ul>
      </div>
    )
  }

ProfileModal.propTypes = {
  displayProfileModal: PropTypes.bool.isRequired,
  setDisplayProfileModal: PropTypes.func.isRequired,
}