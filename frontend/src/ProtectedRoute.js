import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const [authStatus, setAuthStatus] = useState({ loading: true, isAuthorized: false });
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/user', {
                    withCredentials: true
                });

                const userRole = response.data.role || (response.data.type === 'student' ? 'Студент' : null);

                if (userRole && allowedRoles.includes(userRole)) {
                    setAuthStatus({ loading: false, isAuthorized: true });
                } else {
                    setAuthStatus({ loading: false, isAuthorized: false });
                }
            } catch (err) {
                setAuthStatus({ loading: false, isAuthorized: false });
            }
        };

        checkAuth();
    }, [allowedRoles]);

    if (authStatus.loading) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>Проверка доступа...</div>;
    }

    return authStatus.isAuthorized ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;