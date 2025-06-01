import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendance = () => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('general');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [subjectDetails, setSubjectDetails] = useState(null);

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        if (selectedSemester) {
            fetchSubjects(selectedSemester);
        } else {
            setSubjects([]);
        }
    }, [selectedSemester]);

    useEffect(() => {
        if (viewMode === 'general' && selectedSemester) {
            fetchGeneralAttendance();
        }
    }, [selectedSemester, viewMode]);

    const fetchSemesters = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/student/attendance/semesters',
                { withCredentials: true }
            );
            const sortedSemesters = response.data.sort((a, b) =>
                b.academicYear.localeCompare(a.academicYear)
            );
            setSemesters(sortedSemesters);
            if (response.data.length > 0) {
                setSelectedSemester(response.data[0].idSemester);
            }
        } catch (err) {
            console.error('Ошибка при получении списка семестров:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async (semesterId) => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/student/attendance/subjects',
                {
                    params: { semesterId },
                    withCredentials: true
                }
            );
            setSubjects(response.data);
        } catch (err) {
            console.error('Ошибка при получении списка предметов:', err);
        }
    };

    const fetchGeneralAttendance = async () => {
        if (!selectedSemester) return;

        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/student/attendance/general',
                {
                    params: { semesterId: selectedSemester },
                    withCredentials: true
                }
            );
            setAttendanceData(response.data);
        } catch (err) {
            console.error('Ошибка при получении данных о посещаемости:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjectDetails = async () => {
        if (!selectedSubject || !selectedSemester) return;

        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/student/attendance/details',
                {
                    params: {
                        subject: selectedSubject,
                        semesterId: selectedSemester
                    },
                    withCredentials: true
                }
            );
            setSubjectDetails(response.data);
        } catch (err) {
            console.error('Ошибка при получении деталей посещаемости:', err);
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

    const handleViewDetails = () => {
        if (selectedSubject && selectedSemester) {
            fetchSubjectDetails();
        }
    };

    const formatSemesterName = (semester) => {
        return `${semester.academicYear} (${semester.type})`;
    };

    if (loading && viewMode === 'general' && !attendanceData) {
        return <p>Загрузка данных о посещаемости...</p>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
        });
    };

    return (
        <>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '1.8rem'
            }}>
                Посещаемость
            </h1>

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
                alignItems: 'flex-end'
            }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Семестр:
                    </label>
                    <select
                        value={selectedSemester}
                        onChange={handleSemesterChange}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '1rem',
                            minWidth: '250px'
                        }}
                    >
                        {semesters.map((semester) => (
                            <option key={semester.idSemester} value={semester.idSemester}>
                                {formatSemesterName(semester)}
                            </option>
                        ))}
                    </select>
                </div>

                {viewMode === 'bySubject' && (
                    <>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                                Дисциплина:
                            </label>
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
                                {subjects.map((subject) => (
                                    <option key={subject.idSubject} value={subject.name}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleViewDetails}
                            disabled={!selectedSubject}
                            style={{
                                padding: '9px 20px',
                                backgroundColor: selectedSubject ? '#3498db' : '#95a5a6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1.1rem',
                                cursor: selectedSubject ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Показать
                        </button>
                    </>
                )}
            </div>

            {viewMode === 'general' ? (
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
                        <tr style={{
                            backgroundColor: '#2c3e50',
                            color: 'white'
                        }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Дисциплина</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Кол-во занятий</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Кол-во пропусков</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Процент посещаемости</th>
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
                                <td style={{ padding: '12px', textAlign: 'center' }}>{item.totalClasses}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>{item.missedClasses}</td>
                                <td style={{
                                    padding: '12px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
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
                    {loading && viewMode === 'bySubject' ? (
                        <p>Загрузка деталей посещаемости...</p>
                    ) : subjectDetails && (
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
                                        <td
                                            key={index}
                                            style={{
                                                padding: '12px',
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