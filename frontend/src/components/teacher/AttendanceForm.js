import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AttendanceForm = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [classInfo, setClassInfo] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/teacher/attendance/${classId}`, { withCredentials: true })
            .then(response => {
                setClassInfo(response.data.classInfo);
                const sortedStudents = [...response.data.students]
                    .sort((a, b) => {
                        const lastNameCompare = a.surname.localeCompare(b.surname);
                        if (lastNameCompare !== 0) return lastNameCompare;
                        return a.name.localeCompare(b.name);
                    });
                setStudents(sortedStudents);
            })
            .catch(error => console.error('Error fetching attendance data:', error));
    }, [classId]);

    const handleStatusChange = (studentId, newStatus) => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.studentId === studentId
                    ? { ...student, status: newStatus }
                    : student
            )
        );
    };

    const saveAttendance = () => {
        setIsSaving(true);
        const attendanceData = students.map(student => ({
            studentId: student.studentId,
            classId: parseInt(classId),
            status: student.status
        }));

        axios.post('http://localhost:8080/api/teacher/attendance', attendanceData, {
            withCredentials: true
        })
            .then(() => alert('Посещаемость сохранена!'))
            .catch(error => {
                console.error('Error saving attendance:', error);
                alert('Ошибка при сохранении посещаемости');
            })
            .finally(() => setIsSaving(false));
    };

    const handleBack = () => {
        navigate('/teacher/attendance');
    };

    if (!classInfo) {
        return <div>Загрузка...</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            return `${day}.${month}.${year}, ${hours}:${minutes}`;
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto'}}>
            <h1 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '1.8rem' }}>
                Учет посещаемости
            </h1>

            <div style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '1.12rem', margin: '0 0 10px 0' }}>
                    Дисциплина: {classInfo.subjectName}
                </p>
                <p style={{ fontSize: '1.12rem', margin: '0 0 10px 0' }}>
                    Дата: {formatDate(classInfo.date)}
                </p>
                <p style={{ fontSize: '1.12rem', margin: '0 0 15px 0' }}>
                    Группа: {classInfo.groupName}
                </p>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                        <th style={tableHeaderStyle}>№</th>
                        <th style={tableHeaderStyle}>Фамилия</th>
                        <th style={tableHeaderStyle}>Имя</th>
                        <th style={tableHeaderStyle}>Отчество</th>
                        <th style={tableHeaderStyle}>Статус посещаемости</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student, index) => (
                        <tr key={student.uid} style={tableRowStyle}>
                            <td style={tableCellStyle}>{index + 1}</td>
                            <td style={tableCellStyle}>{student.surname}</td>
                            <td style={tableCellStyle}>{student.name}</td>
                            <td style={tableCellStyle}>{student.secondName}</td>
                            <td style={tableCellStyle}>
                                <select
                                    value={student.status}
                                    onChange={(e) => handleStatusChange(student.studentId, e.target.value)}
                                    style={{
                                        padding: '0.4rem',
                                        fontSize: '1rem',
                                        width: '100%',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd'
                                    }}
                                >
                                    <option value="Присутствие">Присутствие</option>
                                    <option value="Отсутствие">Отсутствие</option>
                                    <option value="Уважительная причина">Уважительная причина</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '20px'
            }}>
                <button
                    onClick={saveAttendance}
                    disabled={isSaving}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    {isSaving ? 'Сохранение...' : 'Сохранить посещаемость'}
                </button>

                <button
                    onClick={handleBack}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        minWidth: '170px'
                    }}
                >
                    Назад
                </button>
            </div>
        </div>
    );
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

export default AttendanceForm;