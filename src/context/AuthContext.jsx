import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const storedUser = localStorage.getItem('user');
    const [user, setUser] = useState(JSON.parse(storedUser));

    useEffect(() => {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }, [storedUser]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}