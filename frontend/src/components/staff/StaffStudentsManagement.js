import { useState, useEffect } from 'react';
import axios from 'axios';

const StaffStudentsManagement = ({ facultyName }) => {
    const [students, setStudents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedGroupFilter, setSelectedGroupFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [studentForm, setStudentForm] = useState({
        surname: '',
        name: '',
        secondName: '',
        birthDate: '',
        email: '',
        studentCardId: '',
        idGroup: '',
        password: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [groupsRes, studentsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/staff/students/groups', { withCredentials: true }),
                    axios.get('http://localhost:8080/api/staff/students', { withCredentials: true })
                ]);

                setGroups(groupsRes.data);
                const sortedStudents = [...studentsRes.data].sort((a, b) => {
                    const nameA = `${a.surname} ${a.name}`.toLowerCase();
                    const nameB = `${b.surname} ${b.name}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                setStudents(sortedStudents);
                setFilteredStudents(sortedStudents);

                if (groupsRes.data.length > 0) {
                    setStudentForm(prev => ({
                        ...prev,
                        idGroup: groupsRes.data[0].idGroup
                    }));
                }
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedGroupFilter) {
            setFilteredStudents(students.filter(student =>
                student.idGroup.toString() === selectedGroupFilter
            ));
        } else {
            setFilteredStudents(students);
        }
    }, [selectedGroupFilter, students]);

    const handleFormChange = (e) => {
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
            email: '',
            studentCardId: '',
            idGroup: groups.length > 0 ? groups[0].idGroup : '',
            password: ''
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditStudent = (student) => {
        setCurrentStudent(student);
        setStudentForm({
            surname: student.surname,
            name: student.name,
            secondName: student.secondName || '',
            birthDate: student.birthDate,
            email: student.email,
            studentCardId: student.studentCardId,
            idGroup: student.idGroup,
            password: ''
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого студента?')) {
            try {
                setProcessing(true);
                await axios.delete(
                    `http://localhost:8080/api/staff/students/${id}`,
                    { withCredentials: true }
                );

                const response = await axios.get(
                    'http://localhost:8080/api/staff/students',
                    { withCredentials: true }
                );
                const sortedStudents = [...response.data].sort((a, b) => {
                    const nameA = `${a.surname} ${a.name}`.toLowerCase();
                    const nameB = `${b.surname} ${b.name}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                setStudents(sortedStudents);
                setFilteredStudents(sortedStudents);
            } catch (err) {
                console.error('Ошибка удаления студента:', err);
                setError(`Не удалось удалить студента: ${err.response?.data?.message || err.message}`);
            } finally {
                setProcessing(false);
            }
        }
    };

    const handleSubmit = async () => {
        setProcessing(true);
        setError(null);
        setValidationErrors({});

        const errors = {};
        if (!studentForm.surname) errors.surname = "Фамилия обязательна";
        if (!studentForm.name) errors.name = "Имя обязательно";
        if (!studentForm.birthDate) errors.birthDate = "Дата рождения обязательна";
        if (!studentForm.email) {
            errors.email = 'Email обязателен';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(studentForm.email)) {
            errors.email = 'Пожалуйста, введите корректный email';
        }
        if (!studentForm.studentCardId) errors.studentCardId = "Номер студенческого билета обязателен";
        if (!studentForm.idGroup) errors.group = "Группа обязательна";

        if (!isEditMode && !studentForm.password) {
            errors.password = "Пароль обязателен";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };

            const formData = isEditMode
                ? studentForm.password
                    ? studentForm
                    : (({ password, ...rest }) => rest)(studentForm)
                : studentForm;

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/staff/students/${currentStudent.idStudent}`,
                    formData,
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/staff/students',
                    formData,
                    config
                );

            setShowModal(false);

            const studentsRes = await axios.get(
                'http://localhost:8080/api/staff/students',
                { withCredentials: true }
            );
            const sortedStudents = [...studentsRes.data].sort((a, b) => {
                const nameA = `${a.surname} ${a.name}`.toLowerCase();
                const nameB = `${b.surname} ${b.name}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });
            setStudents(sortedStudents);
            setFilteredStudents(sortedStudents);
        } catch (err) {
            console.error('Ошибка сохранения студента:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <div style={{ maxWidth: '950px', margin: '0 auto' }}>Загрузка данных...</div>;
    }

    return (
        <div style={{ maxWidth: '950px', margin: '0 auto'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>Список студентов</h2>
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
                        height: 'fit-content',
                        transition: 'background-color 0.3s',
                        ':hover': {
                            backgroundColor: '#2980b9'
                        }
                    }}
                >
                    Добавить студента
                </button>
            </div>

            <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Фильтр по группе:</label>
                    <select
                        value={selectedGroupFilter}
                        onChange={(e) => setSelectedGroupFilter(e.target.value)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ced4da',
                            fontSize: '1rem',
                            width: '100%',
                            maxWidth: '200px'
                        }}
                    >
                        <option value="">Все группы</option>
                        {groups.map(group => (
                            <option key={group.idGroup} value={group.idGroup}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredStudents.length > 0 ? (
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
                            <th style={{ padding: '12px', textAlign: 'left'}}>№</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>ФИО</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Дата рождения</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Студ. билет</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Группа</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredStudents.map((student, index) => (
                            <tr key={student.idStudent} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px'}}>{index + 1}</td>
                                <td style={{ padding: '12px'}}>
                                    {`${student.surname} ${student.name} ${student.secondName || ''}`}
                                </td>
                                <td style={{ padding: '12px'}}>
                                    {new Date(student.birthDate).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '12px'}}>{student.email}</td>
                                <td style={{ padding: '12px'}}>{student.studentCardId}</td>
                                <td style={{ padding: '12px'}}>{student.groupName}</td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleEditStudent(student)}
                                        style={{
                                            padding: '0.3rem 0.6rem',
                                            marginRight: '5px',
                                            marginBlock: '5px',
                                            backgroundColor: '#f39c12',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s'
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        onClick={() => handleDeleteStudent(student.idStudent)}
                                        style={{
                                            padding: '0.3rem 0.6rem',
                                            backgroundColor: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s'
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
                <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>Список студентов пуст</p>
            )}

            {showModal && (
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
                            color: '#2c3e50',
                            fontSize: '1.3rem'
                        }}>
                            {isEditMode ? 'Редактирование студента' : 'Добавление нового студента'}
                        </h2>

                        <form>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e',
                                        fontSize: '0.95rem'
                                    }}>
                                        Фамилия *
                                    </label>
                                    <input
                                        type="text"
                                        name="surname"
                                        maxLength={50}
                                        value={studentForm.surname}
                                        onChange={handleFormChange}
                                        required
                                        style={{
                                            width: '100%',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            border: '1px solid #ced4da',
                                            fontSize: '0.95rem',
                                            boxSizing: 'border-box'
                                        }}
                                        disabled={processing}
                                    />
                                    {validationErrors.surname && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.surname}
                                        </div>
                                    )}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e',
                                        fontSize: '0.95rem'
                                    }}>
                                        Имя *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        maxLength={50}
                                        value={studentForm.name}
                                        onChange={handleFormChange}
                                        required
                                        style={{
                                            width: '100%',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            border: '1px solid #ced4da',
                                            fontSize: '0.95rem',
                                            boxSizing: 'border-box'
                                        }}
                                        disabled={processing}
                                    />
                                    {validationErrors.name && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e',
                                        fontSize: '0.95rem'
                                    }}>
                                        Отчество
                                    </label>
                                    <input
                                        type="text"
                                        name="secondName"
                                        maxLength={50}
                                        value={studentForm.secondName}
                                        onChange={handleFormChange}
                                        style={{
                                            width: '100%',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            border: '1px solid #ced4da',
                                            fontSize: '0.95rem',
                                            boxSizing: 'border-box'
                                        }}
                                        disabled={processing}
                                    />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e',
                                        fontSize: '0.95rem'
                                    }}>
                                        Дата рождения *
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={studentForm.birthDate}
                                        onChange={handleFormChange}
                                        required
                                        style={{
                                            width: '100%',
                                            borderRadius: '6px',
                                            padding: '10px',
                                            border: '1px solid #ced4da',
                                            fontSize: '0.95rem',
                                            boxSizing: 'border-box'
                                        }}
                                        disabled={processing}
                                    />
                                    {validationErrors.birthDate && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.birthDate}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#34495e',
                                    fontSize: '0.95rem'
                                }}>
                                    Номер студ. билета *
                                </label>
                                <input
                                    type="number"
                                    name="studentCardId"
                                    min='1'
                                    max='999999999999'
                                    value={studentForm.studentCardId}
                                    onChange={handleFormChange}
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault();
                                        }
                                    }}
                                    required
                                    style={{
                                        width: '100%',
                                        borderRadius: '6px',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        fontSize: '0.95rem',
                                        boxSizing: 'border-box'
                                    }}
                                    disabled={processing}
                                />
                                {validationErrors.studentCardId && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.studentCardId}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#34495e',
                                    fontSize: '0.95rem'
                                }}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    maxLength={100}
                                    value={studentForm.email}
                                    onChange={handleFormChange}
                                    required
                                    style={{
                                        width: '100%',
                                        borderRadius: '6px',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        fontSize: '0.95rem',
                                        boxSizing: 'border-box'
                                    }}
                                    disabled={processing}
                                />
                                {validationErrors.email && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.email}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#34495e',
                                    fontSize: '0.95rem'
                                }}>
                                    Пароль {!isEditMode && '*'}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    maxLength={100}
                                    value={studentForm.password}
                                    onChange={handleFormChange}
                                    required={!isEditMode}
                                    placeholder={isEditMode ? "Оставьте пустым, чтобы не изменять" : ""}
                                    style={{
                                        width: '100%',
                                        borderRadius: '6px',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        fontSize: '0.95rem',
                                        boxSizing: 'border-box'
                                    }}
                                    disabled={processing}
                                />
                                {isEditMode && (
                                    <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '4px' }}>
                                        Введите новый пароль только если хотите его изменить
                                    </div>
                                )}
                                {validationErrors.password && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.password}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#34495e',
                                    fontSize: '0.95rem'
                                }}>
                                    Группа *
                                </label>
                                <select
                                    name="idGroup"
                                    value={studentForm.idGroup}
                                    onChange={handleFormChange}
                                    required
                                    style={{
                                        width: '100%',
                                        borderRadius: '6px',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        fontSize: '0.95rem',
                                        boxSizing: 'border-box'
                                    }}
                                    disabled={processing}
                                >
                                    <option value="">Выберите группу</option>
                                    {groups.map(group => (
                                        <option key={group.idGroup} value={group.idGroup}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.group && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.group}
                                    </div>
                                )}
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '10px',
                                marginTop: '20px'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#e0e0e0',
                                        color: '#333',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s'
                                    }}
                                    disabled={processing}
                                >
                                    Отмена
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
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

export default StaffStudentsManagement;