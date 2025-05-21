import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Пожалуйста, введите email');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password.trim()) {
      setPasswordError('Пожалуйста, введите пароль');
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
      
      // Проверяем успешный логин
      const userResponse = await axios.get('http://localhost:8080/api/auth/user', {
        withCredentials: true
      });
      
      navigate('/welcome');
    } catch (err) {
      try {
        // Пытаемся распарсить JSON ошибки
        if (err.response && err.response.data && typeof err.response.data === 'object') {
          setError(err.response.data.error || 'Неверный email или пароль');
        } else if (err.response && typeof err.response.data === 'string') {
          // Если сервер вернул plain text (старая версия)
          setError(err.response.data);
        } else {
          setError('Произошла ошибка при входе');
        }
      } catch (parseError) {
        setError('Неверный email или пароль');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '1.5rem',
          fontSize: '1.8rem'
        }}>
          Вход
        </h2>
        
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
                Email:
              </label>
              {emailError && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '0.75rem',
                  fontWeight: '400'
                }}>
                  {emailError}
                </span>
              )}
            </div>
            <input 
              type="text" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${emailError ? '#e74c3c' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '1rem',
                transition: 'border 0.3s',
                boxSizing: 'border-box',
                backgroundColor: emailError ? '#fff6f6' : 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = emailError ? '#e74c3c' : '#3498db'}
              onBlur={(e) => {
                if (!email.trim()) {
                  e.target.style.borderColor = '#e74c3c';
                } else {
                  e.target.style.borderColor = '#ddd';
                }
              }}
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
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
                Пароль:
              </label>
              {passwordError && (
                <span style={{
                  color: '#e74c3c',
                  fontSize: '0.75rem',
                  fontWeight: '400'
                }}>
                  {passwordError}
                </span>
              )}
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${passwordError ? '#e74c3c' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '1rem',
                transition: 'border 0.3s',
                boxSizing: 'border-box',
                backgroundColor: passwordError ? '#fff6f6' : 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = passwordError ? '#e74c3c' : '#3498db'}
              onBlur={(e) => {
                if (!password.trim()) {
                  e.target.style.borderColor = '#e74c3c';
                } else {
                  e.target.style.borderColor = '#ddd';
                }
              }}
            />
          </div>
          
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;