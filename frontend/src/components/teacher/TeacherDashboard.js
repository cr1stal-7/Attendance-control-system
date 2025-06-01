import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherDashboard = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/teacher/schedule/today', {
                    withCredentials: true
                });
                setSchedule(response.data);
            } catch (err) {
                console.error('Ошибка при получении расписания:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    const formatTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = () => {
        const today = new Date();
        const options = { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' };
        return today.toLocaleDateString('ru-RU', options).replace(',', '').replace(' г.', '');
    };

    const getClassTypeAbbreviation = (type) => {
        switch(type) {
            case 'Лекция': return 'лек.';
            case 'Практическое занятие': return 'пр.';
            case 'Лабораторная работа': return 'л.р.';
            default: return type;
        }
    };

    return (
        <>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '1.8rem'
            }}>Расписание на сегодня</h1>
            
            {loading ? (
                <p>Загрузка расписания...</p>
            ) : (
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '20px',
                    backgroundColor: '#fff'
                }}>
                    <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                        paddingBottom: '10px',
                        borderBottom: '1px solid #eee'
                    }}>
                        {formatDate()}
                    </div>
                    
                    {schedule.length > 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            {schedule.map((item, index) => {
                                const startTime = formatTime(item.datetime);
                                const startDate = new Date(item.datetime);
                                const endDate = new Date(startDate.getTime() + 90 * 60 * 1000); // +1 час 30 минут
                                const endTime = formatTime(endDate);

                                return (
                                    <div key={index} style={{
                                        padding: '12px',
                                        border: '1px solid #eee',
                                        borderRadius: '6px',
                                        backgroundColor: '#f9f9f9'
                                    }}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            marginBottom: '5px',
                                            fontSize: '1rem'
                                        }}>
                                            <strong>{startTime}-{endTime} {item.subjectName} ({getClassTypeAbbreviation(item.classType)})</strong>
                                        </div>
                                        <div style={{
                                            color: '#555',
                                            fontSize: '0.95rem'
                                        }}>
                                            {item.classroom} - {item.group}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p style={{
                            padding: '12px',
                            border: '1px solid #eee',
                            borderRadius: '6px',
                            backgroundColor: '#f9f9f9'
                        }}>На сегодня занятий нет</p>
                    )}
                </div>
            )}
        </>
    );
};

export default TeacherDashboard;