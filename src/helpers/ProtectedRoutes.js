import { Outlet, Navigate } from 'react-router-dom'
import { MediaContext } from './MediaContext';
import { useContext, useEffect } from 'react';

export default function ProtectedRoutes(){

    const { user } = useContext(MediaContext)

    useEffect(() => {
        if(!!user) localStorage.setItem('user', user)
    }, [user]);
    
    return user ? <Outlet/> : <Navigate to='/login'/>
}
