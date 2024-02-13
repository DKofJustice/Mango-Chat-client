import { createContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

    const socket = useRef();

    useEffect(() => {
        // Connects to Socket IO
        socket.current = io("http://localhost:8081");
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
}