import { motion } from 'framer-motion';
import { FaChartBar, FaUserPlus, FaChalkboardTeacher, FaCog, FaUserClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
    const features = [
        {
            icon: <FaChartBar size={40} />,
            title: 'Отчеты',
            description: 'Просмотр и анализ данных по посещаемости и успеваемости',
            path: '/staff/reports'
        },
        {
            icon: <FaUserPlus size={40} />,
            title: 'Учетные записи',
            description: 'Управление учетными записями студентов и сотрудников',
            path: '/staff/add-users'
        },
        {
            icon: <FaChalkboardTeacher size={40} />,
            title: 'Учебные занятия',
            description: 'Управление расписанием и учебными занятиями',
            path: '/staff/add-classes'
        },
        {
            icon: <FaCog size={40} />,
            title: 'Настройки',
            description: 'Изменение параметров системы и личных данных',
            path: '/staff/settings'
        },
        {
            icon: <FaUserClock size={40} />,
            title: 'Длительное отсутствие',
            description: 'Записи о длительном отсутствии студентов',
            path: '/staff/long-absence'
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                maxWidth: '1000px',
                margin: '0 auto',
            }}
        >
            <div style={{
                textAlign: 'center',
                marginBottom: '40px',
            }}>
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        color: '#2c3e50',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '20px',
                        background: 'linear-gradient(90deg, #2c3e50, #3498db)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Добро пожаловать в панель сотрудника
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{
                        fontSize: '1.2rem',
                        color: '#7f8c8d',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: '1.6',
                    }}
                >
                    Используйте меню слева для доступа ко всем функциям системы управления образовательным процессом
                </motion.p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '25px',
                marginTop: '40px',
            }}>
                {features.map((feature, index) => (
                    <Link
                        key={index}
                        to={feature.path}
                        style={{ textDecoration: 'none' }} // Убираем подчеркивание у ссылки
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '25px',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                                textAlign: 'center',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'pointer', // Добавляем курсор-указатель
                            }}
                        >
                            <div style={{
                                color: '#3498db',
                                marginBottom: '15px',
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                color: '#2c3e50',
                                marginBottom: '10px',
                            }}>{feature.title}</h3>
                            <p style={{
                                color: '#7f8c8d',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                            }}>{feature.description}</p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
};

export default StaffDashboard;