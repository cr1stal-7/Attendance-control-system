import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';

registerLocale('ru', ru);

const StudentAttendance = () => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('general');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());
    const [subjectDetails, setSubjectDetails] = useState(null);
    const [dateError, setDateError] = useState('');

    useEffect(() => {
        if (viewMode === 'general') {
            fetchGeneralAttendance();
        }
    }, [startDate, endDate]);

    const handleStartDateChange = (date) => {
        if (date > endDate) {
            setDateError('Дата начала не может быть позже даты окончания');
        } else {
            setDateError('');
            setStartDate(date);
        }
    };

    const handleEndDateChange = (date) => {
        if (date < startDate) {
            setDateError('Дата окончания не может быть раньше даты начала');
        } else {
            setDateError('');
            setEndDate(date);
        }
    };

    const fetchGeneralAttendance = async () => {
        if (dateError) return;
        
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/student/attendance/general', {
                params: { 
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                },
                withCredentials: true
            });
            setAttendanceData(response.data);
        } catch (err) {
            console.error('Ошибка при получении данных о посещаемости:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjectDetails = async () => {
        if (!selectedSubject || dateError) return;
        
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/student/attendance/details', {
                params: { 
                    subject: selectedSubject,
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                },
                withCredentials: true
            });
            setSubjectDetails(response.data);
        } catch (err) {
            console.error('Ошибка при получении деталей посещаемости:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleViewDetails = () => {
        if (selectedSubject && !dateError) {
            fetchSubjectDetails();
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    };

    if (loading && viewMode === 'general') {
        return <p>Загрузка данных о посещаемости...</p>;
    }

    return (
        <>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '20px',
                fontSize: '1.8rem'
            }}>Посещаемость</h1>

            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px'
            }}>
                <button
                    onClick={() => setViewMode('general')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: viewMode === 'general' ? '#3498db' : '#e0e0e0',
                        color: viewMode === 'general' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    Общая
                </button>
                <button
                    onClick={() => setViewMode('bySubject')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: viewMode === 'bySubject' ? '#3498db' : '#e0e0e0',
                        color: viewMode === 'bySubject' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    По дисциплине
                </button>
            </div>

            <div style={{ 
                display: 'flex', 
                gap: '20px', 
                marginBottom: '20px',
                alignItems: 'center'
            }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>Начальная дата:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        maxDate={endDate}
                        locale="ru"
                        customInput={<input style={{ fontSize: '1rem',  width: '130px'}} />}
                        dateFormat="dd.MM.yyyy"
                        className="date-picker-input"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>Конечная дата:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        locale="ru"
                        customInput={<input style={{ fontSize: '1rem',  width: '130px'}} />}
                        dateFormat="dd.MM.yyyy"
                        className="date-picker-input"
                    />
                </div>
            </div>

            {dateError && (
                <div style={{
                    color: '#e74c3c',
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#fadbd8',
                    borderRadius: '4px',
                }}>
                    {dateError}
                </div>
            )}

            {viewMode === 'general' ? (
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#2c3e50',
                                color: 'white'
                            }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Дисциплина</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Кол-во занятий</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Кол-во пропусков</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Процент посещаемости</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData?.map((item, index) => (
                                <tr key={index} style={{
                                    borderBottom: '1px solid #ddd',
                                    ':hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}>
                                    <td style={{ padding: '12px' }}>{index + 1}</td>
                                    <td style={{ padding: '12px' }}>{item.subject}</td>
                                    <td style={{ padding: '12px' }}>{item.totalClasses}</td>
                                    <td style={{ padding: '12px' }}>{item.missedClasses}</td>
                                    <td style={{ 
                                        padding: '12px',
                                        color: item.attendancePercentage < 70 ? '#e74c3c' : 
                                               item.attendancePercentage < 90 ? '#f39c12' : '#27ae60'
                                    }}>
                                        {item.attendancePercentage}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <>
                    <div style={{ 
                        display: 'flex', 
                        gap: '20px', 
                        marginBottom: '20px',
                        alignItems: 'flex-end'
                    }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>Дисциплина:</label>
                            <select 
                                value={selectedSubject}
                                onChange={handleSubjectChange}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="">Выберите дисциплину</option>
                                {attendanceData?.map((item, index) => (
                                    <option key={index} value={item.subject}>{item.subject}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleViewDetails}
                            disabled={!selectedSubject || dateError}
                            style={{
                                padding: '9px 20px',
                                backgroundColor: selectedSubject && !dateError ? '#3498db' : '#95a5a6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1.1rem',
                                cursor: selectedSubject && !dateError ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Показать
                        </button>
                    </div>

                    {loading && viewMode === 'bySubject' ? (
                        <p>Загрузка деталей посещаемости...</p>
                    ) : subjectDetails && (
                        <div style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            overflow: 'auto'
                        }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                minWidth: '600px'
                            }}>
                                <thead>
                                    <tr style={{
                                        backgroundColor: '#2c3e50',
                                        color: 'white'
                                    }}>
                                        <th style={{ 
                                            padding: '12px', 
                                            textAlign: 'left',
                                            position: 'sticky',
                                            left: 0,
                                            backgroundColor: '#2c3e50'
                                        }}>ФИО</th>
                                        {subjectDetails.dates.map((date, index) => (
                                            <th key={index} style={{ 
                                                padding: '12px', 
                                                textAlign: 'center',
                                                minWidth: '80px'
                                            }}>
                                                {formatDate(date)}
                                            </th>
                                        ))}
                                        <th style={{ 
                                            padding: '12px', 
                                            textAlign: 'center',
                                            minWidth: '100px'
                                        }}>
                                            Посещаемость
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{
                                        borderBottom: '1px solid #ddd'
                                    }}>
                                        <td style={{ 
                                            padding: '12px',
                                            position: 'sticky',
                                            left: 0,
                                            backgroundColor: '#f8f9fa'
                                        }}>{subjectDetails.studentName}</td>
                                        {subjectDetails.attendances.map((att, index) => (
                                            <td key={index} style={{ 
                                                padding: '12px',
                                                textAlign: 'center',
                                                color: att.status === 'Отсутствовал' ? '#e74c3c' : 
                                                       att.status === 'Уважительная причина' ? '#f39c12' : 'inherit'
                                            }}>
                                                {att.status === 'Отсутствовал' ? 'ОТ' : 
                                                 att.status === 'Уважительная причина' ? 'УП' : ''}
                                            </td>
                                        ))}
                                        <td style={{ 
                                            padding: '12px',
                                            textAlign: 'center',
                                            color: subjectDetails.attendancePercentage < 70 ? '#e74c3c' : 
                                                   subjectDetails.attendancePercentage < 90 ? '#f39c12' : '#27ae60',
                                            fontWeight: 'bold'
                                        }}>
                                            {subjectDetails.attendancePercentage}%
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default StudentAttendance;