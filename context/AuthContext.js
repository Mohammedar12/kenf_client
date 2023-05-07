import React, { useState, createContext } from 'react';

export const AuthContext = createContext();

const getLoginObject = () => {
    if(typeof window === 'undefined'){
        return false
    }
    const expirationDuration = 1000 * 60 * 60 * 24; // 12 hours
    let user = localStorage.getItem("user");
    if(user == undefined || user == null){
        return false;
    }
    try{
        user = JSON.parse(user);
    }
    catch(e){
        return false;
    }
    if(!user.sessionCreatedAt){
        return false;
    }
    const currentTime = new Date().getTime();
    if(currentTime - user.sessionCreatedAt > expirationDuration){
        return false;
    }
    return user;
};

export const AuthProvider = ({ children }) => {
    
    const [isAuth, setIsAuth] = useState(getLoginObject());
    const [visibleLoginModal, showLoginModal] = useState(false);

    return (
        <AuthContext.Provider value={{isAuth, setIsAuth, visibleLoginModal, showLoginModal}}>
            {children}
        </AuthContext.Provider>
    )
}