import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = ({ userData }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post('http://localhost:8080/logout', {}, {
            withCredentials: true
        });
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Панель администратора</h1>
            <div style={{ margin: '20px 0' }}>
                <button>Управление пользователями</button>
                <button>Настройки системы</button>
            </div>
            <button 
                onClick={handleLogout}
                style={{ marginTop: '20px', padding: '10px 20px' }}
            >
                Выйти из системы
            </button>
        </div>
    );
};

export default AdminDashboard;