import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';

registerLocale('ru', ru);

const StaffReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [faculties, setFaculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());
    const [dateError, setDateError] = useState('');

    useEffect(() => {
        fetchFaculties();
    }, []);

    useEffect(() => {
        if (selectedFaculty) {
            fetchReports();
        }
    }, [selectedFaculty, startDate, endDate]);

    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/staff/faculties', {
                withCredentials: true
            });
            setFaculties(response.data);
        } catch (err) {
            console.error('Ошибка при получении списка факультетов:', err);
        }
    };

    const fetchReports = async () => {
        if (dateError || !selectedFaculty) return;

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/staff/reports', {
                params: {
                    facultyId: selectedFaculty,
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                },
                withCredentials: true
            });
            setReports(response.data);
        } catch (err) {
            console.error('Ошибка при получении отчетов:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFacultyChange = (e) => {
        setSelectedFaculty(e.target.value);
    };

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

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '20px',
                fontSize: '1.8rem'
            }}>Отчеты по факультетам</h1>

            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px'
            }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>Факультет:</label>
                    <select
                        value={selectedFaculty}
                        onChange={handleFacultyChange}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="">Выберите факультет</option>
                        {faculties.map(faculty => (
                            <option key={faculty.id} value={faculty.id}>
                                {faculty.name}
                            </option>
                        ))}
                    </select>
                </div>
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
                        customInput={<input style={{ fontSize: '1rem', width: '130px' }} />}
                        dateFormat="dd.MM.yyyy"
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
                        customInput={<input style={{ fontSize: '1rem', width: '130px' }} />}
                        dateFormat="dd.MM.yyyy"
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

            {loading ? (
                <p>Загрузка данных...</p>
            ) : (
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Кафедра</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Кол-во дисциплин</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Средний % посещаемости</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Группы риска</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reports.map((report, index) => (
                            <tr key={index} style={{
                                borderBottom: '1px solid #ddd',
                                ':hover': { backgroundColor: '#f5f5f5' }
                            }}>
                                <td style={{ padding: '12px' }}>{report.department}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{report.subjectsCount}</td>
                                <td style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    color: report.avgAttendance < 70 ? '#e74c3c' :
                                        report.avgAttendance < 90 ? '#f39c12' : '#27ae60',
                                    fontWeight: 'bold'
                                }}>
                                    {report.avgAttendance}%
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{report.riskGroups.join(', ')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StaffReports;