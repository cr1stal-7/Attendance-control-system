import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const StaffAddUsers = () => {
    const [userType, setUserType] = useState(null);
    const [groups, setGroups] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [loading, setLoading] = useState(false);
    const [facultyName, setFacultyName] = useState('');
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [studentForm, setStudentForm] = useState({
        surname: '',
        name: '',
        secondName: '',
        birthDate: '',
        password: '',
        email: '',
        studentCardId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const facultyResponse = await axios.get('http://localhost:8080/api/staff/users/faculty', {
                    withCredentials: true
                });
                setFacultyName(facultyResponse.data.name);

                const [groupsRes, deptsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/staff/users/groups', {
                        withCredentials: true
                    }),
                    axios.get('http://localhost:8080/api/staff/users/departments', {
                        withCredentials: true
                    })
                ]);
                setGroups(groupsRes.data);
                setDepartments(deptsRes.data);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (userType === 'student' && selectedGroup) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedGroup, userType]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/staff/users/students?groupId=${selectedGroup}`,
                { withCredentials: true }
            );
            setStudents(response.data);
        } catch (err) {
            console.error('Ошибка загрузки студентов:', err);
            setError('Не удалось загрузить список студентов');
        }
    };

    const handleStudentFormChange = (e) => {
        setStudentForm({
            ...studentForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddStudent = () => {
        setCurrentStudent(null);
        setStudentForm({
            surname: '',
            name: '',
            secondName: '',
            birthDate: '',
            password: '',
            email: '',
            studentCardId: ''
        });
        setIsEditMode(false);
        setShowStudentModal(true);
    };

    const handleEditStudent = (student) => {
        setCurrentStudent(student);
        setStudentForm({
            surname: student.surname,
            name: student.name,
            secondName: student.secondName || '',
            email: student.email || '',
            studentCardId: student.studentCardId || ''
        });
        setIsEditMode(true);
        setShowStudentModal(true);
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого студента?')) {
            try {
                setProcessing(true);
                await axios.delete(
                    `http://localhost:8080/api/staff/users/students/${id}`,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                await fetchStudents();
            } catch (err) {
                console.error('Ошибка удаления студента:', err);
                setError(`Не удалось удалить студента: ${err.response?.data?.message || err.message}`);
            } finally {
                setProcessing(false);
            }
        }
    }


    const handleSubmitStudent = async () => {
        try {
            setProcessing(true);
            setError(null);

            const config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/staff/users/students/${currentStudent.id}`,
                    { ...studentForm, groupId: selectedGroup },
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/staff/users/students',
                    { ...studentForm, groupId: selectedGroup },
                    config
                );

            if (response.status === 409) {
                setError('Студент с таким email или номером карты уже существует');
                return;
            }

            setShowStudentModal(false);
            await fetchStudents();
        } catch (err) {
            console.error('Ошибка сохранения студента:', err);
            setError(`Не удалось сохранить данные студента: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '1.8rem'
            }}>
                Добавление учетных записей
            </h1>

            {error && (
                <div style={{
                    color: '#e74c3c',
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: '#fde8e8',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '1.12rem' }}> {facultyName}</span>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <button
                    onClick={() => setUserType('student')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: userType === 'student' ? '#3498db' : '#e0e0e0',
                        color: userType === 'student' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    Студенты
                </button>
                <button
                    onClick={() => setUserType('teacher')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: userType === 'teacher' ? '#3498db' : '#e0e0e0',
                        color: userType === 'teacher' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                >
                    Преподаватели
                </button>
            </div>

            {loading ? (
                <p>Загрузка данных...</p>
            ) : (
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-end'
                }}>
                    {userType === 'student' && (
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                                Группа:
                            </label>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                style={{
                                    width: '100%',
                                    maxWidth: '200px',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                disabled={groups.length === 0}
                            >
                                <option value="">{groups.length > 0 ? "Выберите группу" : "Нет доступных групп"}</option>
                                {groups.map(group => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {userType === 'teacher' && (
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                                Кафедра:
                            </label>
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                disabled={departments.length === 0}
                            >
                                <option value="">{departments.length > 0 ? "Выберите кафедру" : "Нет доступных кафедр"}</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            {userType === 'student' && selectedGroup && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ color: '#2c3e50' }}>Студенты группы</h3>
                        <button
                            onClick={handleAddStudent}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                height: 'fit-content'
                            }}
                        >
                            Добавить студента
                        </button>
                    </div>

                    {students.length > 0 ? (
                        <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Фамилия</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Имя</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Отчество</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Номер карты</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Дата рождения</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px' }}>{student.surname}</td>
                                        <td style={{ padding: '12px' }}>{student.name}</td>
                                        <td style={{ padding: '12px' }}>{student.secondName || '-'}</td>
                                        <td style={{ padding: '12px' }}>{student.email}</td>
                                        <td style={{ padding: '12px' }}>{student.studentCardId}</td>
                                        <td style={{ padding: '12px' }}>{student.birthDate}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button
                                                onClick={() => handleEditStudent(student)}
                                                style={{
                                                    padding: '0.3rem 0.6rem',
                                                    marginRight: '8px',
                                                    backgroundColor: '#f39c12',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStudent(student.id)}
                                                style={{
                                                    padding: '0.3rem 0.6rem',
                                                    backgroundColor: '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>В этой группе пока нет студентов</p>
                    )}
                </div>
            )}

            {showStudentModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '25px',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}>
                        <h2 style={{
                            marginTop: 0,
                            marginBottom: '20px',
                            color: '#2c3e50'
                        }}>
                            {isEditMode ? 'Редактирование студента' : 'Добавление нового студента'}
                        </h2>

                        <form>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e'
                                    }}>
                                        Фамилия *
                                    </label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={studentForm.surname}
                                        onChange={handleStudentFormChange}
                                        required
                                        style={{
                                            width: '100%',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            border: '1px solid #ced4da',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box'
                                        }}
                                        disabled={processing}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e'
                                    }}>
                                        Имя *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={studentForm.name}
                                        onChange={handleStudentFormChange}
                                        required
                                        style={{
                                            width: '100%',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            border: '1px solid #ced4da',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box'
                                        }}
                                        disabled={processing}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e'
                                    }}>
                                        Отчество
                                    </label>
                                    <input
                                        type="text"
                                        name="secondName"
                                        value={studentForm.secondName}
                                        onChange={handleStudentFormChange}
                                        style={{
                                            width: '100%',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            border: '1px solid #ced4da',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box'
                                        }}
                                        disabled={processing}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e'
                                    }}>
                                        Номер студ. билета *
                                    </label>
                                    <input
                                        type="text"
                                        name="studentCardId"
                                        value={studentForm.studentCardId}
                                        onChange={handleStudentFormChange}
                                        style={{
                                            width: '100%',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            border: '1px solid #ced4da',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box'
                                        }}
                                        disabled={processing}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Дата рождения *
                                </label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={studentForm.birthDate}
                                    onChange={handleStudentFormChange}
                                    required
                                    style={{ width: '100%', borderRadius: '6px', padding: '10px', border: '1px solid #ced4da', fontSize: '1rem', boxSizing: 'border-box' }}
                                    disabled={processing}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#34495e'
                                }}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={studentForm.email}
                                    onChange={handleStudentFormChange}
                                    style={{
                                        width: '100%',
                                        borderRadius: '6px',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                    disabled={processing}
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Пароль *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={studentForm.password}
                                    onChange={handleStudentFormChange}
                                    required
                                    style={{ width: '100%', borderRadius: '6px', padding: '10px', border: '1px solid #ced4da', fontSize: '1rem', boxSizing: 'border-box' }}
                                    disabled={processing}
                                />
                            </div>

                            {error && (
                                <div style={{
                                    color: '#e74c3c',
                                    backgroundColor: '#fadbd8',
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '10px'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowStudentModal(false)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#e0e0e0',
                                        color: '#333',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s'
                                    }}
                                    disabled={processing}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmitStudent}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s'
                                    }}
                                    disabled={processing}
                                >
                                    {processing ? 'Сохранение...' : isEditMode ? 'Сохранить' : 'Добавить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffAddUsers;