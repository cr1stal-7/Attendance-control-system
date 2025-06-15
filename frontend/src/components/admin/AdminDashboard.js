import { motion } from 'framer-motion';
import { FaUserShield, FaChartLine, FaCog, FaUsers, FaBook, FaCalendarAlt } from 'react-icons/fa';

const AdminDashboard = () => {
    const features = [
        { icon: <FaUserShield size={40} />, title: 'Управление пользователями', description: 'Контроль учетных записей сотрудников и студентов' },
        { icon: <FaBook size={40} />, title: 'Учебный процесс', description: 'Настройка учебных планов и дисциплин' },
        { icon: <FaCalendarAlt size={40} />, title: 'Расписание', description: 'Управление занятиями и аудиториями' },
        { icon: <FaUsers size={40} />, title: 'Оргструктура', description: 'Управление подразделениями и должностями' },
        { icon: <FaChartLine size={40} />, title: 'Аналитика', description: 'Мониторинг посещаемости и успеваемости' },
        { icon: <FaCog size={40} />, title: 'Настройки системы', description: 'Конфигурация параметров и прав доступа' },
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
                    Добро пожаловать в панель администратора
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
                    <motion.div
                        key={index}
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
                ))}
            </div>
        </motion.div>
    );
};

export default AdminDashboard;