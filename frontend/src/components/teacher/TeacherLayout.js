import { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet, useLocation } from 'react-router-dom';
import TeacherMenu from './TeacherMenu';
import TeacherHeader from './TeacherHeader';

const TeacherLayout = () => {
    const [teacherName, setTeacherName] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchTeacherName = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/teacher/settings', {
                    withCredentials: true
                });
                const teacher = response.data;
                const name = `${teacher.surname || ''} ${teacher.name || ''} ${teacher.secondName || ''}`.trim();
                setTeacherName(name !== '' ? name : 'Преподаватель');
            } catch (err) {
                console.error('Ошибка при получении данных преподавателя:', err);
            }
        };
        fetchTeacherName();
    }, []);

    const getActiveItem = () => {
        if (location.pathname.includes('attendance')) return 'attendance';
        if (location.pathname.includes('statistics')) return 'statistics';
        if (location.pathname.includes('settings')) return 'settings';
        return 'schedule';
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <TeacherHeader teacherName={teacherName} />
            
            <div style={{ display: 'flex', flex: 1 }}>
                <TeacherMenu activeItem={getActiveItem()} />
                
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

export default TeacherLayout;