import MangoLogoImage from './../assets/Mango Logo.svg'

export default function MangoLogo() {
  return (
    <div className='flex flex-row items-center gap-x-[1rem]'>
        <img src={MangoLogoImage} alt="Logo" />
        <p className='font-bold text-[0.8rem] lg:text-[1.2rem]'>Mango Chat</p>
    </div>
  )
}
