import { Link } from 'react-router-dom';

const TeacherMenu = ({ activeItem }) => {
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
                to="/teacher/dashboard"
                style={{
                    padding: '15px 20px',
                    color: activeItem === 'schedule' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'schedule' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'schedule' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem'
                }}
            >
                Расписание
            </Link>
            
            <Link
                to="/teacher/attendance"
                style={{
                    padding: '15px 20px',
                    color: activeItem === 'attendance' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'attendance' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'attendance' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem'
                }}
            >
                Учет посещаемости
            </Link>
            
            <Link
                to="/teacher/statistics"
                style={{
                    padding: '15px 20px',
                    color: activeItem === 'statistics' ? '#3498db' : 'white',
                    textDecoration: 'none',
                    backgroundColor: activeItem === 'statistics' ? '#34495e' : 'transparent',
                    fontWeight: activeItem === 'statistics' ? 'bold' : 'normal',
                    transition: 'all 0.3s',
                    fontSize: '1.2rem'
                }}
            >
                Статистика
            </Link>
            
            <Link
                to="/teacher/settings"
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

export default TeacherMenu;