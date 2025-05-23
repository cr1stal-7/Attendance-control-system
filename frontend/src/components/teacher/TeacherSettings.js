import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePasswordModal from '../ChangePasswordModal';

const TeacherSettings = () => {
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const fetchTeacherInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/teacher/settings', {
                    withCredentials: true
                });
                setTeacherInfo(response.data);
            } catch (err) {
                console.error('Ошибка при получении информации о преподавателе:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeacherInfo();
    }, []);

    const getFullName = () => {
        if (!teacherInfo) return '';
        return `${teacherInfo.surname} ${teacherInfo.name} ${teacherInfo.secondName || ''}`.trim();
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '1.8rem'
            }}>Настройки</h1>
            
            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '30px',
                backgroundColor: '#fff'
            }}>
                <h2 style={{
                    marginBottom: '15px',
                    fontSize: '1.4rem',
                    color: '#34495e'
                }}>Личная информация</h2>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '20px'
                }}>
                    <div>
                        <p style={{ margin: '5px 0', color: '#7f8c8d' }}>ФИО</p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{getFullName()}</p>
                    </div>
                    <div>
                        <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Email</p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{teacherInfo?.email || 'Не указано'}</p>
                    </div>
                    <div>
                        <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Должность</p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{teacherInfo?.position || 'Не указано'}</p>
                    </div>
                    <div>
                        <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Кафедра</p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{teacherInfo?.department || 'Не указано'}</p>
                    </div>
                </div>
                
                <button
                    onClick={() => setShowPasswordModal(true)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                >
                    Изменить пароль
                </button>
            </div>
            
            {showPasswordModal && (
                <ChangePasswordModal
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </>
    );
};

export default TeacherSettings;