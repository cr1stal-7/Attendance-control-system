import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';

registerLocale('ru', ru);

const StaffReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());
    const [dateError, setDateError] = useState('');
    const [reportType, setReportType] = useState('byFaculty');
    const [facultyName, setFacultyName] = useState('');

    useEffect(() => {
        fetchFacultyData();
        fetchGroups();
    }, []);

    useEffect(() => {
        if ((reportType === 'byFaculty') ||
            (reportType === 'byGroup' && selectedGroup)) {
            fetchReports();
        }
    }, [reportType, selectedGroup, startDate, endDate]);

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

    const fetchGroups = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/groups',
                { withCredentials: true }
            );
            setGroups(response.data);
        } catch (err) {
            console.error('Ошибка при получении списка групп:', err);
        }
    };

    const fetchReports = async () => {
        if (dateError || (reportType === 'byGroup' && !selectedGroup)) return;

        try {
            setLoading(true);
            const endpoint = reportType === 'byFaculty'
                ? 'http://localhost:8080/api/staff/reports/by-faculty'
                : 'http://localhost:8080/api/staff/reports/by-group';

            const response = await axios.get(endpoint, {
                params: {
                    groupId: reportType === 'byGroup' ? selectedGroup : null,
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

    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
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

    const handleReportTypeChange = (type) => {
        setReportType(type);
        setReports([]);
    };

    const getAllSubjects = () => {
        const subjects = new Set();
        reports.forEach(report => {
            Object.keys(report).forEach(key => {
                if (key !== 'group' && key !== 'studentName' && key !== 'surname' &&
                    key !== 'name' && key !== 'secondName') {
                    subjects.add(key);
                }
            });
        });
        return Array.from(subjects);
    };

    const subjects = getAllSubjects();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '1.8rem'
            }}>
                Отчеты
            </h1>
            <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '1.12rem'}}>{facultyName}</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <button
                    onClick={() => handleReportTypeChange('byFaculty')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: reportType === 'byFaculty' ? '#3498db' : '#e0e0e0',
                        color: reportType === 'byFaculty' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    По факультету
                </button>
                <button
                    onClick={() => handleReportTypeChange('byGroup')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: reportType === 'byGroup' ? '#3498db' : '#e0e0e0',
                        color: reportType === 'byGroup' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    По группе
                </button>
            </div>

            {reportType === 'byGroup' && (
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Группа:
                    </label>
                    <select
                        value={selectedGroup}
                        onChange={handleGroupChange}
                        style={{
                            width: '100%',
                            maxWidth: '300px',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="">Выберите группу</option>
                        {groups.map(group => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                alignItems: 'center'
            }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Начальная дата:
                    </label>
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
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Конечная дата:
                    </label>
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
            ) : reports.length > 0 && reportType === 'byGroup' && selectedGroup ? (
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
                            {subjects.map((subject, index) => (
                                <th key={index} style={{ padding: '12px', textAlign: 'center' }}>
                                    {subject}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {reports.map((report, index) => (
                            <tr key={index} style={{
                                borderBottom: '1px solid #ddd',
                                ':hover': { backgroundColor: '#f5f5f5' }
                            }}>
                                <td style={{ padding: '12px' }}>{index + 1}</td>
                                <td style={{ padding: '12px' }}>{report.surname}</td>
                                <td style={{ padding: '12px' }}>{report.name}</td>
                                <td style={{ padding: '12px' }}>{report.secondName || '-'}</td>
                                {subjects.map((subject, idx) => {
                                    const value = report[subject];
                                    return (
                                        <td key={idx} style={{
                                            padding: '12px',
                                            textAlign: 'center',
                                            color: value === '-' || value === 'н/з' ? 'inherit' :
                                                parseInt(value) < 70 ? '#e74c3c' :
                                                parseInt(value) < 90 ? '#f39c12' : '#27ae60',
                                            fontWeight: 'bold'
                                        }}>
                                            {value === '-' ? '-' : value === 'н/з' ? 'н/з' : `${value}%`}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : reports.length > 0 && reportType === 'byFaculty' ? (
                <div style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Группа</th>
                            {subjects.map((subject, index) => (
                                <th key={index} style={{ padding: '12px', textAlign: 'center' }}>
                                    {subject}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {reports.map((report, index) => (
                            <tr key={index} style={{
                                borderBottom: '1px solid #ddd',
                                ':hover': { backgroundColor: '#f5f5f5' }
                            }}>
                                <td style={{ padding: '12px' }}>{index + 1}</td>
                                <td style={{ padding: '12px' }}>{report.group}</td>
                                {subjects.map((subject, idx) => {
                                    const value = report[subject];
                                    return (
                                        <td key={idx} style={{
                                            padding: '12px',
                                            textAlign: 'center',
                                            color: value === '-' || value === 'н/з' ? 'inherit' :
                                                parseInt(value) < 70 ? '#e74c3c' :
                                                    parseInt(value) < 90 ? '#f39c12' : '#27ae60',
                                            fontWeight: 'bold'
                                        }}>
                                            {value === '-' ? '-' : value === 'н/з' ? 'н/з' : `${value}%`}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </div>
    );
};

export default StaffReports;