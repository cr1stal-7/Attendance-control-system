import { useState } from 'react';
import axios from 'axios';

const ChangePasswordModal = ({ onClose }) => {
    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validateForm = () => {
        let isValid = true;
        
        if (!passwordForm.newPassword.trim()) {
            setNewPasswordError('Пожалуйста, введите новый пароль');
            isValid = false;
        } else {
            setNewPasswordError('');
        }
        
        if (!passwordForm.confirmPassword.trim()) {
            setConfirmPasswordError('Пожалуйста, подтвердите пароль');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }
        
        return isValid;
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Сбрасываем ошибку при изменении поля
        if (name === 'newPassword' && newPasswordError) {
            setNewPasswordError('');
        }
        if (name === 'confirmPassword' && confirmPasswordError) {
            setConfirmPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!validateForm()) {
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setError('Пароль должен содержать не менее 6 символов');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/student/settings/change-password', passwordForm, {
                withCredentials: true
            });
            setSuccess('Пароль успешно изменен');
            setPasswordForm({
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            console.error('Ошибка при изменении пароля:', err);
            setError('Произошла ошибка при изменении пароля');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '25px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
            }}>
                <h2 style={{
                    marginTop: 0,
                    marginBottom: '20px',
                    color: '#2c3e50'
                }}>Смена пароля</h2>
                
                {error && (
                    <div style={{
                        color: '#e74c3c',
                        backgroundColor: '#fadbd8',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}
                
                {success && (
                    <div style={{
                        color: '#27ae60',
                        backgroundColor: '#d5f5e3',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {success}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            marginBottom: '0.5rem'
                        }}>
                            <label style={{
                                color: '#34495e',
                                fontWeight: '500'
                            }}>
                                Новый пароль:
                            </label>
                            {newPasswordError && (
                                <span style={{
                                    color: '#e74c3c',
                                    fontSize: '0.75rem',
                                    fontWeight: '400'
                                }}>
                                    {newPasswordError}
                                </span>
                            )}
                        </div>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `1px solid ${newPasswordError ? '#e74c3c' : '#ddd'}`,
                                borderRadius: '6px',
                                fontSize: '1rem',
                                transition: 'border 0.3s',
                                boxSizing: 'border-box',
                                backgroundColor: newPasswordError ? '#fff6f6' : 'white'
                            }}
                            onFocus={(e) => e.target.style.borderColor = newPasswordError ? '#e74c3c' : '#3498db'}
                            onBlur={(e) => {
                                if (!passwordForm.newPassword.trim()) {
                                    e.target.style.borderColor = '#e74c3c';
                                } else {
                                    e.target.style.borderColor = '#ddd';
                                }
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            marginBottom: '0.5rem'
                        }}>
                            <label style={{
                                color: '#34495e',
                                fontWeight: '500'
                            }}>
                                Подтвердите пароль:
                            </label>
                            {confirmPasswordError && (
                                <span style={{
                                    color: '#e74c3c',
                                    fontSize: '0.75rem',
                                    fontWeight: '400'
                                }}>
                                    {confirmPasswordError}
                                </span>
                            )}
                        </div>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `1px solid ${confirmPasswordError ? '#e74c3c' : '#ddd'}`,
                                borderRadius: '6px',
                                fontSize: '1rem',
                                transition: 'border 0.3s',
                                boxSizing: 'border-box',
                                backgroundColor: confirmPasswordError ? '#fff6f6' : 'white'
                            }}
                            onFocus={(e) => e.target.style.borderColor = confirmPasswordError ? '#e74c3c' : '#3498db'}
                            onBlur={(e) => {
                                if (!passwordForm.confirmPassword.trim()) {
                                    e.target.style.borderColor = '#e74c3c';
                                } else {
                                    e.target.style.borderColor = '#ddd';
                                }
                            }}
                        />
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#e0e0e0',
                                color: '#333',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            disabled={loading}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
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
                            disabled={loading}
                        >
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;