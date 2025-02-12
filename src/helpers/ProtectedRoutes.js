import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from './userContext';
import { useContext, useEffect } from 'react';

export default function ProtectedRoutes() {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!!user) localStorage.setItem('user', user);
  }, [user]);

  return user ? <Outlet /> : <Navigate to="/login" />;
}
