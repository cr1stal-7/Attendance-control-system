import { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet, useLocation } from 'react-router-dom';
import StudentMenu from './StudentMenu';
import StudentHeader from './StudentHeader';

const StudentLayout = () => {
    const [studentName, setStudentName] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchStudentName = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/student/settings', {
                    withCredentials: true
                });
                const student = response.data;
                const name = `${student.surname || ''} ${student.name || ''} ${student.secondName || ''}`.trim();
                setStudentName(name !== '' ? name : 'Студент');
            } catch (err) {
                console.error('Ошибка при получении данных студента:', err);
            }
        };
        fetchStudentName();
    }, []);

    // Определяем активный пункт меню на основе текущего пути
    const getActiveItem = () => {
        if (location.pathname.includes('attendance')) return 'attendance';
        if (location.pathname.includes('settings')) return 'settings';
        return 'schedule';
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <StudentHeader studentName={studentName} />
            
            <div style={{ display: 'flex', flex: 1 }}>
                <StudentMenu activeItem={getActiveItem()} />
                
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

export default StudentLayout;