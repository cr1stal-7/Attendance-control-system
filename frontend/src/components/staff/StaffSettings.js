import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePasswordModal from '../ChangePasswordModal';

const StaffSettings = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/staff/settings', {
                    withCredentials: true
                });
                setUserInfo(response.data);
            } catch (err) {
                console.error('Ошибка при получении информации о сотруднике:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    const getFullName = () => {
        if (!userInfo) return '';
        return `${userInfo.surname} ${userInfo.name} ${userInfo.secondName || ''}`.trim();
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div style={{ maxWidth: '950px', margin: '0 auto' }}>
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
                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{userInfo?.email || 'Не указано'}</p>
                    </div>
                    <div>
                        <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Должность</p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{userInfo?.position || 'Не указано'}</p>
                    </div>
                    <div>
                        <p style={{ margin: '5px 0', color: '#7f8c8d' }}>Факультет</p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{userInfo?.department || 'Не указано'}</p>
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
        </div>
    );
};

export default StaffSettings;