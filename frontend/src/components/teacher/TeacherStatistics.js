import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';

registerLocale('ru', ru);

const TeacherStatistics = () => {
    const [statistics, setStatistics] = useState({ students: [] });
    const [loading, setLoading] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());
    const [subjects, setSubjects] = useState([]);
    const [groups, setGroups] = useState([]);
    const [dateError, setDateError] = useState('');

    useEffect(() => {
        fetchTeacherSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject && selectedGroup) {
            fetchStatistics();
        }
    }, [selectedSubject, selectedGroup, startDate, endDate]);

    const fetchTeacherSubjects = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/teacher/subjects', {
                withCredentials: true
            });
            setSubjects(response.data);
        } catch (err) {
            console.error('Ошибка при получении списка дисциплин:', err);
        }
    };

    const fetchGroupsForSubject = async (subjectId) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/teacher/subjects/${subjectId}/groups`,
                { withCredentials: true }
            );
            setGroups(response.data);
            setSelectedGroup('');
        } catch (err) {
            console.error('Ошибка при получении списка групп:', err);
        }
    };

    const fetchStatistics = async () => {
        if (dateError || !selectedGroup || !selectedSubject) return;

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/teacher/statistics', {
                params: {
                    groupId: selectedGroup,
                    subjectId: selectedSubject,
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                },
                withCredentials: true
            });
            setStatistics(response.data);
        } catch (err) {
            console.error('Ошибка при получении статистики:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectChange = (e) => {
        const value = e.target.value;
        setSelectedSubject(value);
        setSelectedGroup('');
        if (value) {
            fetchGroupsForSubject(value);
        } else {
            setGroups([]);
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

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '1.8rem' }}>
                Статистика посещаемости
            </h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Дисциплина:
                    </label>
                    <select
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        style={selectStyle}
                    >
                        <option value="">Выберите дисциплину</option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Группа:
                    </label>
                    <select
                        value={selectedGroup}
                        onChange={handleGroupChange}
                        disabled={!selectedSubject}
                        style={{ ...selectStyle, backgroundColor: !selectedSubject ? '#f5f5f5' : 'white' }}
                    >
                        <option value="">{groups.length ? 'Выберите группу' : 'Сначала выберите дисциплину'}</option>
                        {groups.map(group => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
                <DateFilter
                    label="Начальная дата"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    maxDate={endDate}
                />
                <DateFilter
                    label="Конечная дата"
                    selected={endDate}
                    onChange={handleEndDateChange}
                    minDate={startDate}
                />
            </div>

            {dateError && <ErrorMessage message={dateError} />}

            {loading ? (
                <p>Загрузка данных...</p>
            ) : selectedGroup ? (
                <AttendanceTable students={statistics.students} />
            ) : null}
        </div>
    );
};

const selectStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem'
};

const DateFilter = ({ label, selected, onChange, minDate, maxDate }) => (
    <div>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
            {label}:
        </label>
        <DatePicker
            selected={selected}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            locale="ru"
            customInput={<input style={{ fontSize: '1rem', width: '130px' }} />}
            dateFormat="dd.MM.yyyy"
        />
    </div>
);

const ErrorMessage = ({ message }) => (
    <div style={{
        color: '#e74c3c',
        marginBottom: '15px',
        padding: '10px',
        backgroundColor: '#fadbd8',
        borderRadius: '4px',
    }}>
        {message}
    </div>
);

const AttendanceTable = ({ students }) => (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                <th style={tableHeaderStyle}>№</th>
                <th style={tableHeaderStyle}>Фамилия</th>
                <th style={tableHeaderStyle}>Имя</th>
                <th style={tableHeaderStyle}>Отчество</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Кол-во занятий</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Кол-во пропусков</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Процент посещаемости</th>
            </tr>
            </thead>
            <tbody>
            {students.map((student, index) => (
                <tr key={student.studentId} style={tableRowStyle}>
                    <td style={tableCellStyle}>{index + 1}</td>
                    <td style={tableCellStyle}>{student.lastName}</td>
                    <td style={tableCellStyle}>{student.firstName}</td>
                    <td style={tableCellStyle}>{student.middleName}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>{student.totalClasses}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>{student.missedClasses}</td>
                    <td style={{
                        ...tableCellStyle,
                        textAlign: 'center',
                        color: student.percentage !== null ? getPercentageColor(student.percentage) : 'inherit',
                        fontWeight: 'bold'
                    }}>
                        {student.percentage !== null ? `${student.percentage}%` : '-'}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left'
};

const tableRowStyle = {
    borderBottom: '1px solid #ddd',
    ':hover': { backgroundColor: '#f5f5f5' }
};

const tableCellStyle = {
    padding: '12px'
};

const getPercentageColor = (percentage) => {
    if (percentage < 70) return '#e74c3c';
    if (percentage < 90) return '#f39c12';
    return '#27ae60';
};

export default TeacherStatistics;