import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaChartBar, FaCog } from 'react-icons/fa';

const StudentMenu = ({ activeItem }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '250px',
            backgroundColor: '#2c3e50',
            color: 'white',
            minHeight: '100vh',
            padding: '20px 0'
        }}>
            <Link
                to="/student/dashboard"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    color: activeItem === 'schedule' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'schedule' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'schedule' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem',
                    gap: '10px'
                }}
            >
                <FaCalendarAlt size={20} />
                Расписание
            </Link>

            <Link
                to="/student/attendance"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    color: activeItem === 'attendance' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'attendance' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'attendance' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem',
                    gap: '10px'
                }}
            >
                <FaChartBar size={20} />
                Посещаемость
            </Link>

            <Link
                to="/student/settings"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    color: activeItem === 'settings' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'settings' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'settings' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem',
                    gap: '10px'
                }}
            >
                <FaCog size={20} />
                Настройки
            </Link>
        </div>
    );
};

export default StudentMenu;