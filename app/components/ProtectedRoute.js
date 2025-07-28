'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const localUser = window.localStorage.getItem('user')
    const userData = JSON.parse(localUser)
    if (!userData) {
      router.replace('/signin');
    } else if (allowedRoles.length && !allowedRoles.includes(userData.role)) {
      router.replace('/products');
        alert('Unauthorized access')
    } else {
      setCheckingAuth(false);
    }
  }, [isAuthenticated, user]);

  if (checkingAuth) {
    return <div className="text-center mt-10">🔐 Checking access...</div>;
  }

  return children;
};

export default ProtectedRoute;
