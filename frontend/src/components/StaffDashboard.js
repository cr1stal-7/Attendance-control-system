import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StaffDashboard = ({ userData }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post('http://localhost:8080/logout', {}, {
            withCredentials: true
        });
        navigate('/login');
    };

    return (
        <div style={{ 
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
                Панель сотрудника деканата
            </h1>
            
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                margin: '30px 0'
            }}>
                <button className="dashboard-button">
                    Управление группами
                </button>
                <button className="dashboard-button">
                    Формирование отчетов
                </button>
                <button className="dashboard-button">
                    Расписание занятий
                </button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                    onClick={handleLogout}
                    className="logout-button"
                >
                    <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
                    Выйти из системы
                </button>
            </div>
        </div>
    );
};

export default StaffDashboard;