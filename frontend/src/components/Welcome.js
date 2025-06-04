import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/auth/user', {
                    withCredentials: true
                });

                if (response.data.role === 'Администратор') {
                    navigate('/admin/dashboard', { state: response.data });
                } else if (response.data.role === 'Преподаватель') {
                    navigate('/teacher/dashboard', { state: response.data });
                } else if (response.data.role === 'Сотрудник') {
                    navigate('/staff/dashboard', { state: response.data });
                } else if (response.data.type === 'student') {
                    navigate('/student/dashboard', { state: response.data });
                } else {
                    navigate('/login');
                }
            } catch (err) {
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    return <div style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
    }}>Перенаправление...</div>;
};

export default Welcome;