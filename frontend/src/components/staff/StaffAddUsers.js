import { useState, useEffect } from 'react';
import axios from 'axios';
import StaffStudentsManagement from './StaffStudentsManagement';
import StaffTeachersManagement from './StaffTeachersManagement';

const StaffAddUsers = () => {
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [facultyName, setFacultyName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFacultyInfo = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/staff/faculty/info',
                    { withCredentials: true }
                );
                setFacultyName(response.data.name);
            } catch (err) {
                console.error('Ошибка загрузки данных факультета:', err);
                setError('Не удалось загрузить данные факультета. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        fetchFacultyInfo();
    }, []);

    return (
        <div style={{ maxWidth: '950px', margin: '0 auto' }}>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '1.8rem'
            }}>
                Добавление учетных записей
            </h1>

            {error && (
                <div style={{
                    color: '#e74c3c',
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: '#fde8e8',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '1.12rem' }}> {facultyName}</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <button
                    onClick={() => setUserType('student')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: userType === 'student' ? '#3498db' : '#e0e0e0',
                        color: userType === 'student' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    Студенты
                </button>
                <button
                    onClick={() => setUserType('teacher')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: userType === 'teacher' ? '#3498db' : '#e0e0e0',
                        color: userType === 'teacher' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    Преподаватели
                </button>
            </div>

            {loading ? (
                <p>Загрузка данных...</p>
            ) : (
                <>
                    {userType === 'student' && (
                        <StaffStudentsManagement facultyName={facultyName} />
                    )}
                    {userType === 'teacher' && (
                        <StaffTeachersManagement facultyName={facultyName} />
                    )}
                </>
            )}
        </div>
    );
};

export default StaffAddUsers;