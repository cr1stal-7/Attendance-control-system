import { Link } from 'react-router-dom';
import { FaChartBar, FaUserPlus, FaChalkboardTeacher, FaCog, FaUserClock } from 'react-icons/fa';

const StaffMenu = ({ activeItem }) => {
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
                to="/staff/reports"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    color: activeItem === 'reports' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'reports' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'reports' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem',
                    gap: '10px'
                }}
            >
                <FaChartBar size={20} />
                Отчеты
            </Link>

            <Link
                to="/staff/add-users"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    color: activeItem === 'add-users' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'add-users' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'add-users' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem',
                    gap: '10px'
                }}
            >
                <FaUserPlus size={20} />
                Учетные записи
            </Link>

            <Link
                to="/staff/add-classes"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    color: activeItem === 'add-classes' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'add-classes' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'add-classes' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem',
                    gap: '10px'
                }}
            >
                <FaChalkboardTeacher size={20} />
                Учебные занятия
            </Link>

            <Link
                to="/staff/settings"
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

            <Link
                to="/staff/long-absence"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 20px',
                    color: activeItem === 'long-absence' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'long-absence' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'long-absence' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem',
                    gap: '10px'
                }}
            >
                <FaUserClock size={20} />
                Длительное отсутствие
            </Link>
        </div>
    );
};

export default StaffMenu;