import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherAttendance = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [classes, setClasses] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            fetchClasses();
        }
    }, [selectedSemester, selectedSubject, dateFilter]);

    const fetchTeacherSemesters = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/teacher/semesters',
                { withCredentials: true }
            );
            setSemesters(response.data);
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

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const params = {
                subjectId: selectedSubject,
                semesterId: selectedSemester
            };
            if (dateFilter) params.date = dateFilter;

            const response = await axios.get(
                'http://localhost:8080/api/teacher/classes',
                {
                    params,
                    withCredentials: true
                }
            );
            const sortedClasses = response.data.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });

            setClasses(sortedClasses);
        } catch (err) {
            console.error('Ошибка при получении списка занятий:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClassClick = (classId) => {
        navigate(`/teacher/attendance/${classId}`);
    };

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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '1.8rem' }}>
                Учет посещаемости
            </h1>

            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px'
            }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem', fontWeight: '500' }}>
                        Семестр:
                    </label>
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        style={{
                            ...selectStyle,
                            width: '100%',
                            padding: '0.5rem',
                            fontSize: '1rem',
                        }}
                        disabled={loading}
                    >
                        <option value="">Выберите семестр</option>
                        {semesters.map(semester => (
                            <option key={semester.idSemester} value={semester.idSemester}>
                                {semester.academicYear} ({semester.type})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem', fontWeight: '500' }}>
                        Дисциплина:
                    </label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={{
                            ...selectStyle,
                            width: '100%',
                            padding: '0.5rem',
                            fontSize: '1rem',
                            backgroundColor: !selectedSemester ? '#f5f5f5' : 'white'
                        }}
                        disabled={!selectedSemester || loading}
                    >
                        <option value="">{selectedSemester ? 'Выберите дисциплину' : 'Сначала выберите семестр'}</option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedSubject && (
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Фильтр по дате:
                    </label>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        disabled={loading}
                    />
                    <button
                        onClick={() => setDateFilter('')}
                        style={{
                            marginLeft: '15px',
                            padding: '0.5rem',
                            fontSize: '1rem',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        disabled={loading}
                    >
                        Сбросить
                    </button>
                </div>
            )}

            {loading ? (
                <p>Загрузка данных...</p>
            ) : classes.length > 0 ? (
                <div>
                    <h2 style={{
                        fontSize: '1.3rem',
                        marginBottom: '15px',
                        fontWeight: 'normal'
                    }}>
                        Занятия:
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 250px))',
                        gap: '15px'
                    }}>
                        {classes.map(cls => (
                            <div
                                key={cls.idClass}
                                onClick={() => handleClassClick(cls.idClass)}
                                style={{
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    ':hover': {
                                        backgroundColor: '#e9ecef',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <h3 style={{
                                    marginTop: '0',
                                    color: '#2c3e50',
                                    fontSize: '1.1rem',
                                    marginBottom: '10px'
                                }}>
                                    {cls.subjectName}
                                </h3>
                                <p style={{ margin: '5px 0' }}>
                                    <span style={{ fontWeight: '500' }}>Дата:</span> {formatDate(cls.date)}
                                </p>
                                {cls.topic && (
                                    <p style={{ margin: '5px 0' }}>
                                        <span style={{ fontWeight: '500' }}>Тип:</span> {cls.topic}
                                    </p>
                                )}
                                <p style={{ margin: '5px 0 0' }}>
                                    <span style={{ fontWeight: '500' }}>Группа:</span> {cls.groupName}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : selectedSubject ? (
                <p>Нет занятий по выбранным критериям</p>
            ) : null}
        </div>
    );
};

const selectStyle = {
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
    ':hover': {
        borderColor: '#aaa'
    },
    ':focus': {
        borderColor: '#4285f4',
        boxShadow: '0 0 0 2px rgba(66, 133, 244, 0.2)',
        outline: 'none'
    }
};

export default TeacherAttendance;