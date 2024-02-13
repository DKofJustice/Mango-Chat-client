import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { blue } from '@mui/material/colors';
import PropTypes from 'prop-types';

export default function SendMessage({ handleSubmit, handleKeyDown, inputValue, setInputValue, handleFileChange }) {
  return (
    <div className='w-full flex flex-row justify-center py-[2rem] border-t border-white/10'>
        <form 
        className='w-full flex flex-row justify-center items-center gap-x-[1rem] px-[1rem]'
        onSubmit={handleSubmit}
        >
            <label>
                <AttachFileIcon sx={{ fontSize: 30, color: 'white', opacity: 0.2 }} />
                <input type="file" className='hidden' disabled multiple onChange={handleFileChange} />
            </label>

            <div className='w-full max-w-[35rem]'>
                <textarea
                rows="1"
                maxLength="5000"
                className='w-full resize-none bg-dark-blue-300 rounded-[20px] px-[1rem] py-[0.8rem]'
                placeholder='Type a message...'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                />
            </div>

            <button onClick={handleSubmit}>
                <SendIcon sx={{ color: blue[900], fontSize: 30 }} />
            </button>
        </form>
    </div>
  )
}

SendMessage.propTypes = {
    handleSubmit: PropTypes.func,
    inputValue: PropTypes.string,
    setInputValue: PropTypes.func,
    handleKeyDown: PropTypes.func,
    handleFileChange: PropTypes.func,
}