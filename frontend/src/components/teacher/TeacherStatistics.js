import { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherStatistics = () => {
    const [statistics, setStatistics] = useState({ students: [] });
    const [loading, setLoading] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchTeacherSemesters();
    }, []);

    useEffect(() => {
        if (selectedSemester) {
            fetchSubjectsForSemester(selectedSemester);
        } else {
            setSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedSemester]);

    useEffect(() => {
        if (selectedSemester && selectedSubject) {
            fetchGroupsForSubjectAndSemester(selectedSubject, selectedSemester);
        } else {
            setGroups([]);
            setSelectedGroup('');
        }
    }, [selectedSemester, selectedSubject]);

    useEffect(() => {
        if (selectedSemester && selectedSubject && selectedGroup) {
            fetchStatistics();
        }
    }, [selectedSemester, selectedSubject, selectedGroup]);

    const fetchTeacherSemesters = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/teacher/semesters',
                { withCredentials: true }
            );
            const sortedSemesters = response.data.sort((a, b) =>
                b.academicYear.localeCompare(a.academicYear) ||
                a.type.localeCompare(b.type)
            );
            setSemesters(sortedSemesters);
        } catch (err) {
            console.error('Ошибка при получении списка семестров:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjectsForSemester = async (semesterId) => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/teacher/subjects',
                {
                    params: { semesterId },
                    withCredentials: true
                }
            );
            setSubjects(response.data);
        } catch (err) {
            console.error('Ошибка при получении списка дисциплин:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupsForSubjectAndSemester = async (subjectId, semesterId) => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/teacher/groups',
                {
                    params: { subjectId, semesterId },
                    withCredentials: true
                }
            );
            const sortedGroups = response.data.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setGroups(sortedGroups);
        } catch (err) {
            console.error('Ошибка при получении списка групп:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/teacher/statistics',
                {
                    params: {
                        groupId: selectedGroup,
                        subjectId: selectedSubject,
                        semesterId: selectedSemester
                    },
                    withCredentials: true
                }
            );
            setStatistics(response.data);
        } catch (err) {
            console.error('Ошибка при получении статистики:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSemesterChange = (e) => {
        setSelectedSemester(e.target.value);
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
    };

    const sortStudentsAlphabetically = (students) => {
        return [...students].sort((a, b) => {

            const lastNameCompare = a.lastName.localeCompare(b.lastName);
            if (lastNameCompare !== 0) return lastNameCompare;

            return a.firstName.localeCompare(b.firstName);
        });
    };

    return (
        <div style={{ maxWidth: '950px', margin: '0 auto' }}>
            <h1 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '1.8rem' }}>
                Статистика посещаемости
            </h1>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                    Семестр:
                </label>
                <select
                    value={selectedSemester}
                    onChange={handleSemesterChange}
                    style={{ ...selectStyle, maxWidth: '250px' }}
                >
                    <option value="">Выберите семестр</option>
                    {semesters.map(semester => (
                        <option key={semester.idSemester} value={semester.idSemester}>
                            {semester.academicYear} ({semester.type})
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Дисциплина:
                    </label>
                    <select
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        disabled={!selectedSemester}
                        style={{
                            ...selectStyle,
                            backgroundColor: !selectedSemester ? '#f5f5f5' : 'white',
                            width: '100%'
                        }}
                    >
                        <option value="">{selectedSemester ? 'Выберите дисциплину' : 'Сначала выберите семестр'}</option>
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
                        style={{
                            ...selectStyle,
                            backgroundColor: !selectedSubject ? '#f5f5f5' : 'white',
                            width: '100%'
                        }}
                    >
                        <option value="">{selectedSubject ? 'Выберите группу' : 'Сначала выберите дисциплину'}</option>
                        {groups.map(group => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Загрузка данных...</p>
            ) : selectedGroup ? (
                statistics?.students?.length > 0 ? (
                    <AttendanceTable
                        students={sortStudentsAlphabetically(statistics.students)}
                    />
                ) : (
                    <p style={{ color: '#666', textAlign: 'left', marginTop: '20px' }}>
                        Нет данных о студентах для выбранной группы
                    </p>
                )
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

const AttendanceTable = ({ students = [] }) => {
    if (!students || students.length === 0) {
        return (
            <p style={{ color: '#666', textAlign: 'left', marginTop: '20px' }}>
                Нет данных о посещаемости
            </p>
        );
    }
    const dates = students[0]?.attendanceByDate?.map(item => item.date) || [];

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflowX: 'auto',
            marginBottom: '20px',
            width: '100%'
        }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '950px'
            }}>
                <thead>
                <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                    <th style={tableHeaderStyle}>№</th>
                    <th style={tableHeaderStyle}>Фамилия</th>
                    <th style={tableHeaderStyle}>Имя</th>
                    <th style={tableHeaderStyle}>Отчество</th>

                    {dates.map((date, index) => (
                        <th key={index} style={{ ...tableHeaderStyle, textAlign: 'center', minWidth: '60px' }}>
                            {formatDate(date)}
                        </th>
                    ))}

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
                        <td style={tableCellStyle}>{student.middleName || '-'}</td>

                        {student.attendanceByDate?.map((att, idx) => (
                            <td
                                key={idx}
                                style={{
                                    ...tableCellStyle,
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {att.status.split(', ').map((status, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            color: status === 'ОТ' ? '#e74c3c' :
                                                status === 'УП' ? '#f39c12' : '#27ae60',
                                            display: 'inline-block',
                                            margin: '0 2px'
                                        }}
                                    >
                                    {status}
                                        {i < att.status.split(', ').length - 1 ? ',' : ''}
                                    </span>
                                ))}
                            </td>
                        ))}

                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>{student.totalClasses}</td>
                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>{student.missedClasses}</td>
                        <td style={{
                            ...tableCellStyle,
                            textAlign: 'center',
                            color: getPercentageColor(student.attendancePercentage),
                            fontWeight: 'bold'
                        }}>
                            {student.attendancePercentage}%
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit'
    });
};

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