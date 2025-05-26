import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminHeader = ({ adminName }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post('http://localhost:8080/logout', {}, {
            withCredentials: true
        });
        navigate('/login');
    };

    return (
        <header style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{adminName}{'(Администратор)'}</div>
            <button
                onClick={handleLogout}
                style={{
                    padding: '8px 15px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'background-color 0.3s',
                    ':hover': {
                        backgroundColor: '#c0392b'
                    }
                }}
            >
                Выйти
            </button>
        </header>
    );
};

export default AdminHeader;