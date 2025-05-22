import { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet, useLocation } from 'react-router-dom';
import StaffMenu from './StaffMenu';
import StaffHeader from './StaffHeader';

const StaffLayout = () => {
    const [userName, setUserName] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/staff/settings', {
                    withCredentials: true
                });
                const user = response.data;
                const name = `${user.surname || ''} ${user.name || ''} ${user.secondName || ''}`.trim();
                setUserName(name !== '' ? name : 'Сотрудник деканата');
            } catch (err) {
                console.error('Ошибка при получении данных сотрудника:', err);
            }
        };
        fetchUserName();
    }, []);

    const getActiveItem = () => {
        if (location.pathname.includes('reports')) return 'reports';
        if (location.pathname.includes('add-users')) return 'add-users';
        if (location.pathname.includes('add-classes')) return 'add-classes';
        if (location.pathname.includes('settings')) return 'settings';
        if (location.pathname.includes('long-absence')) return 'long-absence';
        return 'reports';
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <StaffHeader userName={userName} />

            <div style={{ display: 'flex', flex: 1 }}>
                <StaffMenu activeItem={getActiveItem()} />

                <div style={{
                    flex: 1,
                    padding: '20px 100px 20px 20px',
                    marginLeft: '100px',
                    fontFamily: 'Arial, sans-serif',
                    maxWidth: 'calc(100% - 100px)'
                }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default StaffLayout;