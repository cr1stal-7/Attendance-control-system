import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';

registerLocale('ru', ru);

const TeacherStatistics = () => {
    const [statistics, setStatistics] = useState([]);
    const [loading, setLoading] = useState(true);
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
                {
                    withCredentials: true
                }
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

    const selectedStats = statistics.find(s => s.subjectId === parseInt(selectedSubject));

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '20px',
                fontSize: '1.8rem'
            }}>Статистика посещаемости</h1>
            
            {/* Фильтры дисциплины и группы */}
            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px'
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
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>Группа:</label>
                    <select
                        value={selectedGroup}
                        onChange={handleGroupChange}
                        disabled={!selectedSubject}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                            backgroundColor: !selectedSubject ? '#f5f5f5' : 'white'
                        }}
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

            {/* Фильтры дат */}
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
                                <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Фамилия</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Имя</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Отчество</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Кол-во занятий</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Кол-во пропусков</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Процент посещаемости</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedStats?.students?.map((student, index) => (
                                <tr key={student.studentId} style={{
                                    borderBottom: '1px solid #ddd',
                                    ':hover': { backgroundColor: '#f5f5f5' }
                                }}>
                                    <td style={{ padding: '12px' }}>{index + 1}</td>
                                    <td style={{ padding: '12px' }}>{student.lastName}</td>
                                    <td style={{ padding: '12px' }}>{student.firstName}</td>
                                    <td style={{ padding: '12px' }}>{student.middleName}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{student.totalClasses}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{student.missedClasses}</td>
                                    <td style={{ 
                                        padding: '12px',
                                        textAlign: 'center',
                                        color: student.percentage < 70 ? '#e74c3c' : 
                                               student.percentage < 90 ? '#f39c12' : '#27ae60',
                                        fontWeight: 'bold'
                                    }}>
                                        {student.percentage}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeacherStatistics;