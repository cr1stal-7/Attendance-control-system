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
                
                // Перенаправляем по роли
                if (response.data.role) {
                    switch(response.data.role) {
                        case 'Администратор':
                            navigate('/admin/dashboard', { state: response.data });
                            break;
                        case 'Преподаватель':
                            navigate('/teacher/dashboard', { state: response.data });
                            break;
                        case 'Сотрудник':
                            navigate('/staff/reports', { state: response.data });
                            break;
                    }
                } else {
                    // Для студентов
                    navigate('/student/dashboard', { state: response.data });
                }
            } catch (err) {
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    return <div style={{ padding: '20px' }}>Перенаправление...</div>;
};

export default Welcome;