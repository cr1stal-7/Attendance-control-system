import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Пожалуйста, введите email');
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setEmailError('Введите корректный email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Пожалуйста, введите пароль');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Пароль должен содержать минимум 6 символов');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
          'http://localhost:8080/login',
          new URLSearchParams({
            username: email,
            password: password
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
          }
      );

      const userResponse = await axios.get('http://localhost:8080/api/auth/user', {
        withCredentials: true
      });

      navigate('/welcome');
    } catch (err) {
      try {
        if (err.response && err.response.data && typeof err.response.data === 'object') {
          setError(err.response.data.error || 'Неверный email или пароль');
        } else if (err.response && typeof err.response.data === 'string') {
          setError(err.response.data);
        } else {
          setError('Произошла ошибка при входе');
        }
      } catch (parseError) {
        setError('Неверный email или пароль');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Inter', sans-serif",
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '450px',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(5px)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1
        }}>
          {/* Декоративные элементы */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(102, 126, 234, 0.1)',
            zIndex: -1
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(118, 75, 162, 0.1)',
            zIndex: -1
          }}></div>

          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              color: '#2c3e50',
              marginBottom: '0.5rem',
              fontSize: '2rem',
              fontWeight: '700'
            }}>
              Добро пожаловать
            </h2>
            <p style={{
              color: '#7f8c8d',
              fontSize: '0.95rem'
            }}>
              Введите свои данные для входа
            </p>
          </div>

          {error && (
              <div style={{
                color: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                textAlign: 'center',
                borderLeft: '4px solid #e74c3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{error}</span>
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                color: '#34495e',
                fontWeight: '500',
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                Email
              </label>
              <div style={{
                position: 'relative',
                borderRadius: '8px',
                border: `1px solid ${emailError ? '#e74c3c' : '#e0e0e0'}`,
                transition: 'all 0.3s ease',
                backgroundColor: emailError ? 'rgba(231, 76, 60, 0.05)' : 'white',
                '&:hover': {
                  borderColor: emailError ? '#e74c3c' : '#bdc3c7'
                }
              }}>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 42px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      backgroundColor: 'transparent',
                      outline: 'none',
                      color: '#2c3e50'
                    }}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: emailError ? '#e74c3c' : '#7f8c8d'
                }}>
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {emailError && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{emailError}</span>
                  </div>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                color: '#34495e',
                fontWeight: '500',
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
              }}>
                Пароль
              </label>
              <div style={{
                position: 'relative',
                borderRadius: '8px',
                border: `1px solid ${passwordError ? '#e74c3c' : '#e0e0e0'}`,
                transition: 'all 0.3s ease',
                backgroundColor: passwordError ? 'rgba(231, 76, 60, 0.05)' : 'white'
              }}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 42px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box',
                      backgroundColor: 'transparent',
                      outline: 'none',
                      color: '#2c3e50'
                    }}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: passwordError ? '#e74c3c' : '#7f8c8d'
                }}>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12C2 12 5 7 12 7C19 7 22 12 22 12C22 12 19 17 12 17C5 17 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {passwordError && (
                  <div style={{
                    color: '#e74c3c',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{passwordError}</span>
                  </div>
              )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isLoading ? 0.8 : 1
                }}
                onMouseOver={(e) => {
                  e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
            >
              {isLoading ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z" fill="white"/>
                      <path d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z" fill="white"/>
                    </svg>
                    <span>Вход...</span>
                  </>
              ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 16L15 12M15 12L11 8M15 12H3M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Войти</span>
                  </>
              )}
            </button>
          </form>
        </div>

        <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      </div>
  );
};

export default Login;