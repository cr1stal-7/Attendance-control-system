import { useState, useEffect } from 'react';
import axios from 'axios';
import StaffStudentsManagement from './StaffStudentsManagement';
import StaffTeachersManagement from './StaffTeachersManagement';

const StaffAddUsers = () => {
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [facultyName, setFacultyName] = useState('');
    const [error, setError] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [groups, setGroups] = useState([]);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [facultyRes, groupsRes, deptsRes, positionsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/staff/faculty/info', { withCredentials: true }),
                    axios.get('http://localhost:8080/api/staff/faculty/groups', { withCredentials: true }),
                    axios.get('http://localhost:8080/api/staff/faculty/departments', { withCredentials: true }),
                    axios.get('http://localhost:8080/api/staff/teachers/positions', { withCredentials: true })
                ]);

                setFacultyName(facultyRes.data.name);
                setGroups(groupsRes.data);
                setDepartments(deptsRes.data);
                setPositions(positionsRes.data);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                        <StaffStudentsManagement
                            groups={groups}
                            facultyName={facultyName}
                        />
                    )}
                    {userType === 'teacher' && (
                        <StaffTeachersManagement
                            departments={departments}
                            positions={positions}
                            facultyName={facultyName}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default StaffAddUsers;