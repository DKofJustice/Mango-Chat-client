import { Outlet } from 'react-router-dom'
import MangoLogo from './../components/MangoLogo'

export default function LoginHeader() {
  return (
    <>
        <div className='w-full py-[2rem] flex flex-row justify-center'>
            <MangoLogo />
        </div>

        <Outlet/>
    </>
  )
}
