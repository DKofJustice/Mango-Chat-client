import LoginImage from './../../assets/LoginImage.jpg'
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import { Link } from 'react-router-dom'
import { motion } from "framer-motion"
import { useForm } from 'react-hook-form' 
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'

export default function LoginPage() {

  const { setUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (errors.email && errors.email.message) {
        return toast.error(errors.email.message);
      } else if (errors.password && errors.password.message) {
        return toast.error(errors.password.message);
      }
  
      const response = await axios.post( "http://localhost:8081/login", {
        email: data.email,
        password: data.password,
      });

      toast.success('Login successful')
      reset();

      const token = response.data.accessToken;
      const email = response.data.email;
      const userID = response.data.userId; 
      const name = response.data.nameUser;

      setUser({ token, email, userID, name });

      localStorage.setItem('user', JSON.stringify({token, email, userID, name}));

      navigate('/chat')

    } catch(error) {
      console.log(error)
      toast.error('An internal error has occured: ' + error.response.data)
    }
  }

  return (
    <div className="w-full flex flex-row justify-center">
      <motion.div className='w-full max-w-[70rem] flex flex-row mt-[4rem]'
       initial={{ opacity: 0 }}
       whileInView={{ opacity: 1 }}
       viewport={{ once: true }}
       transition={{ duration: 0.4 }}
       >
        <div className='bg-dark-blue-200 w-full md:w-[50%] pb-[5rem] flex flex-row justify-center'>
          <div className='w-full max-w-[23rem] py-[5rem] px-[2rem] flex flex-col gap-y-[2rem]'>
            <h2 className='w-full text-center text-[1.2rem] font-bold'>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>

              <label htmlFor="email" className='mb-[0.8rem]'><PersonIcon/></label>
              <input 
              {...register('email', {
                required: 'Email is required',
              })}
              type="email" name="email" id="email" placeholder="Email"
              className='bg-dark-blue-300 rounded-[10px] px-[1.5rem] py-[0.5rem]' />

              <label htmlFor="password" className='mt-[1.5rem] mb-[0.8rem]'><PasswordIcon/></label>
              <input 
              {...register('password', {
                required: 'Password is required',
              })}
              type="password" name="password" id="password" placeholder="Password"
              className='bg-dark-blue-300 rounded-[10px] px-[1.5rem] py-[0.5rem]' />

              <button
              disabled={isSubmitting} 
              type="submit" 
              className={`bg-green-100 rounded-[10px] px-[1.5rem] 
              py-[0.5rem] text-black font-bold mt-[3rem] ${isSubmitting ? 'opacity-40' : 'opacity-100'}`}>
                Login
              </button>
            </form>

            <div className='mt-[3rem] flex flex-row'>
              <button>Forgot Password?</button>
              <button className='ml-auto'><Link to='/register'>Sign up</Link></button>
            </div>
          </div>
        </div>

        <div className='hidden md:block w-[50%] overflow-hidden'>
          <img src={LoginImage} alt="LoginImage" className='h-full scale-[105%]' />
        </div>
      </motion.div>
    </div>
  )
}
