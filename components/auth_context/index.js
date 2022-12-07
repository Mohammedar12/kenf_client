import React, { useState, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(sessionStorage.getItem('token') ? true : false);
    const [mobileTopbar, setMobileTopbar] = useState(false);

    return (
        <AuthContext.Provider value={{isAuth, setIsAuth, mobileTopbar, setMobileTopbar}}>
            {children}
        </AuthContext.Provider>
    )
}