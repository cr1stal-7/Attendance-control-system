import { Link } from 'react-router-dom';

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
                    padding: '15px 20px',
                    color: activeItem === 'reports' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'reports' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'reports' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem'
                }}
            >
                Отчеты
            </Link>

            <Link
                to="/staff/add-users"
                style={{
                    padding: '15px 20px',
                    color: activeItem === 'add-users' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'add-users' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'add-users' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem'
                }}
            >
                Учетные записи
            </Link>

            <Link
                to="/staff/add-classes"
                style={{
                    padding: '15px 20px',
                    color: activeItem === 'add-classes' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'add-classes' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'add-classes' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem'
                }}
            >
                Учебные занятия
            </Link>

            <Link
                to="/staff/settings"
                style={{
                    padding: '15px 20px',
                    color: activeItem === 'settings' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'settings' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'settings' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem'
                }}
            >
                Настройки
            </Link>
        </div>
    );
};

export default StaffMenu;