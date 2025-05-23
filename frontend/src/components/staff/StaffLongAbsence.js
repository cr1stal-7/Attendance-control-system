import { useState, useEffect } from 'react';
import axios from 'axios';

const LongAbsenceReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [daysThreshold, setDaysThreshold] = useState(14);
    const [facultyName, setFacultyName] = useState('');

    useEffect(() => {
        fetchFacultyData();
        fetchReportData();
    }, [daysThreshold]);

    const fetchFacultyData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/staff/faculty', {
                withCredentials: true
            });
            setFacultyName(response.data.name);
        } catch (err) {
            console.error('Ошибка при получении данных факультета:', err);
        }
    };

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/staff/long-absence', {
                params: { daysThreshold },
                withCredentials: true
            });
            setReportData(response.data);
        } catch (err) {
            console.error('Ошибка при получении отчета:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '1.8rem'
            }}>
                Отчет по длительным отсутствиям
            </h1>

            <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '1.12rem' }}>{facultyName}</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <button
                    onClick={() => setDaysThreshold(14)}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: daysThreshold === 14 ? '#3498db' : '#e0e0e0',
                        color: daysThreshold === 14 ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    2 недели
                </button>
                <button
                    onClick={() => setDaysThreshold(30)}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: daysThreshold === 30 ? '#3498db' : '#e0e0e0',
                        color: daysThreshold === 30 ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    1 месяц
                </button>
            </div>

            {loading ? (
                <p>Загрузка данных...</p>
            ) : reportData.length > 0 ? (
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Фамилия</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Имя</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Отчество</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Группа</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Последнее занятие</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Последний вход</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reportData.map((item, index) => (
                            <tr key={index} style={{
                                borderBottom: '1px solid #ddd',
                                ':hover': { backgroundColor: '#f5f5f5' }
                            }}>
                                <td style={{ padding: '12px' }}>{index + 1}</td>
                                <td style={{ padding: '12px' }}>{item.surname}</td>
                                <td style={{ padding: '12px' }}>{item.name}</td>
                                <td style={{ padding: '12px' }}>{item.secondName || '-'}</td>
                                <td style={{ padding: '12px' }}>{item.groupName}</td>
                                <td style={{
                                    padding: '12px',
                                    color: 'inherit',
                                    textAlign: 'center',
                                    fontWeight: item.lastClassDate ? 'normal' : 'bold'
                                }}>
                                    {formatDateTime(item.lastClassDate)}
                                </td>
                                <td style={{
                                    padding: '12px',
                                    color: 'inherit',
                                    textAlign: 'center',
                                    fontWeight: item.lastDate ? 'normal' : 'bold'
                                }}>
                                    {formatDateTime(item.lastDate)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Нет данных для отображения</p>
            )}
        </div>
    );
};

export default LongAbsenceReport;