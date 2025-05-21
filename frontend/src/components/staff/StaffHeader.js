import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StaffHeader = ({ userName }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post('http://localhost:8080/logout', {}, {
            withCredentials: true
        });
        navigate('/login');
    };

    const displayName = userName && userName !== 'undefined undefined' ? userName : 'Сотрудник деканата';

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
            backgroundColor: '#2c3e50',
            color: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {displayName}
            </div>
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
                Выход
            </button>
        </div>
    );
};

export default StaffHeader;