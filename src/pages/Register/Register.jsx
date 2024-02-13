import LoginImage from './../../assets/LoginImage.jpg'
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import { Link } from 'react-router-dom'
import WestIcon from '@mui/icons-material/West';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';


export default function Register() {

  //Items from React Hook Form
  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  //Mail Validation Format
  const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  //React Router useNavigate function
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      //Displaying various error message for each input field
      if (errors.name && errors.name.message) {
        return toast.error(errors.name.message);
      } else if (errors.email && errors.email.message) {
        return toast.error(errors.email.message);
      } else if (errors.password && errors.password.message) {
        return toast.error(errors.password.message);
      }

      //Submitting the data to the database
      await axios.post( "http://localhost:8081/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success('Registration successful');
      navigate('/login');

      //Reset the input fields to empty
      reset();

    } catch(error) {
      console.log(error);
      toast.error('An internal error has occured: ' + error);
    }
  }

  return (
    <div className="w-full flex flex-row justify-center">
      <div className='w-full max-w-[70rem] flex flex-row mt-[4rem]'>
        <div className='bg-dark-blue-200 w-full md:w-[50%] pb-[5rem] flex flex-row justify-center'>
          <div className='w-full max-w-[23rem] py-[5rem] px-[2rem] flex flex-col gap-y-[2rem]'>
            <h2 className='w-full text-center text-[1.2rem] font-bold'>
              Sign up
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
              <label htmlFor="name" className='mb-[0.8rem]'><PersonIcon/></label>
              <input 
              {...register('name', {
                required: 'Name is required',
              })}
              type="text" name="name" id="name" placeholder="Enter your name"
              className='bg-dark-blue-300 rounded-[10px] px-[1.5rem] py-[0.5rem]' />

              <label htmlFor="email" className='my-[0.8rem]'><PersonIcon/></label>
              <input 
              {...register('email', {
                required: 'Email is required',
                validate: (value) => 
                  value.match(mailformat) || 'Please enter a valid email'
              })}
              type="email" name="email" id="email" placeholder="Email"
              className='bg-dark-blue-300 rounded-[10px] px-[1.5rem] py-[0.5rem]' />

              <label htmlFor="password" className='mt-[1.5rem] mb-[0.8rem]'><PasswordIcon/></label>
              <input 
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              })}
              type="password" name="password" id="password" placeholder="Create a password"
              className='bg-dark-blue-300 rounded-[10px] px-[1.5rem] py-[0.5rem]' />

              <button 
              disabled={isSubmitting}
              type="submit" 
              className={`bg-green-100 rounded-[10px] px-[1.5rem] 
              py-[0.5rem] text-black font-bold mt-[3rem] ${isSubmitting ? 'opacity-40' : 'opacity-100'}`}>
                Sign up
              </button>
            </form>

            <div className='mt-[3rem] flex flex-row'>
              <Link to='/login'>
                <button className='flex flex-row items-center gap-[0.5rem]'>
                  <WestIcon sx={{ fontSize: 20 }} />
                  <span>Back to Login</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className='hidden md:block w-[50%] overflow-hidden'>
          <img src={LoginImage} alt="LoginImage" className='h-full scale-[105%]' />
        </div>
      </div>
    </div>
  )
}
