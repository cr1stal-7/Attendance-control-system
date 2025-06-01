import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePasswordModal from '../ChangePasswordModal';

const StudentSettings = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/student/settings', {
                    withCredentials: true
                });
                setStudentInfo(response.data);
            } catch (err) {
                console.error('Ошибка при получении информации о студенте:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudentInfo();
    }, []);

    const getFullName = () => {
        if (!studentInfo) return '';
        return `${studentInfo.surname} ${studentInfo.name} ${studentInfo.secondName || ''}`.trim();
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
                                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{studentInfo?.email || 'Не указано'}</p>
                            </div>
                            <div>
                                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Номер студенческого</p>
                                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{studentInfo?.studentCardId || 'Не указано'}</p>
                            </div>
                            <div>
                                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Группа</p>
                                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{studentInfo?.group || 'Не указано'}</p>
                            </div>
                            <div>
                                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Курс</p>
                                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{studentInfo?.course ? `${studentInfo.course} курс` : 'Не указано'}</p>
                            </div>
                            <div>
                                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Факультет</p>
                                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{studentInfo?.department || 'Не указано'}</p>
                            </div>
                            <div>
                                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Направление</p>
                                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{studentInfo?.specialization || 'Не указано'}</p>
                            </div>
                            <div>
                                <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Форма обучения</p>
                                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{studentInfo?.educationForm || 'Не указано'}</p>
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
                    userType="student"
                />
            )}
        </>
    );
};

export default StudentSettings;
