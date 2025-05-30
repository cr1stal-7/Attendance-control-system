import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

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
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchGroupsByDepartment(selectedDepartment);
        } else {
            setGroups([]);
            setSelectedGroup(null);
        }
    }, [selectedDepartment]);

    useEffect(() => {
        fetchStudents(selectedDepartment, selectedGroup);
    }, [selectedDepartment, selectedGroup]);

    const fetchStudents = async (departmentId = null, groupId = null) => {
        try {
            let url = 'http://localhost:8080/api/admin/accounts/students?';

            if (groupId) {
                url += `groupId=${groupId}`;
            } else if (departmentId) {
                url += `departmentId=${departmentId}`;
            }

            const response = await axios.get(url, {
                withCredentials: true
            });

            const sortedStudents = [...response.data].sort((a, b) => {
                const nameA = `${a.surname} ${a.name}`.toLowerCase();
                const nameB = `${b.surname} ${b.name}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });

            setStudents(sortedStudents);
        } catch (err) {
            console.error('Ошибка загрузки студентов:', err);
            setError('Не удалось загрузить список студентов');
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/admin/accounts/students/departments',
                { withCredentials: true }
            );
            const faculties = response.data.filter(dept => dept.parentDepartment === null);
            setDepartments(faculties);
        } catch (err) {
            console.error('Ошибка загрузки факультетов:', err);
            setError('Не удалось загрузить список факультетов');
        }
    };

    const fetchGroupsByDepartment = async (departmentId) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/admin/accounts/students/groups?departmentId=${departmentId}`,
                { withCredentials: true }
            );
            setGroups(response.data);
        } catch (err) {
            console.error('Ошибка загрузки групп:', err);
            setError('Не удалось загрузить список групп');
        }
    };

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
                    `http://localhost:8080/api/admin/accounts/students/${id}`,
                    { withCredentials: true }
                );
                await fetchStudents(selectedDepartment, selectedGroup);
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
        if (!studentForm.email) errors.email = "Email обязателен";
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
                    `http://localhost:8080/api/admin/accounts/students/${currentStudent.idStudent}`,
                    formData,
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/admin/accounts/students',
                    formData,
                    config
                );

            setShowModal(false);
            await fetchStudents(selectedDepartment, selectedGroup);
        } catch (err) {
            console.error('Ошибка сохранения студента:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
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

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Фильтр по факультету:</label>
                    <select
                        value={selectedDepartment || ''}
                        onChange={(e) => setSelectedDepartment(e.target.value || null)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ced4da',
                            fontSize: '1rem',
                            width: '100%'
                        }}
                    >
                        <option value="">Все факультеты</option>
                        {departments.map(department => (
                            <option key={department.idDepartment} value={department.idDepartment}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ flex: 1 }}>
                    <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Фильтр по группе:</label>
                    <select
                        value={selectedGroup || ''}
                        onChange={(e) => setSelectedGroup(e.target.value || null)}
                        disabled={!selectedDepartment}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ced4da',
                            fontSize: '1rem',
                            width: '100%',
                            opacity: selectedDepartment ? 1 : 0.7
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

            {students.length > 0 ? (
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
                        minWidth: '1000px'
                    }}>
                        <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                            <th style={{ padding: '12px', textAlign: 'left'}}>№</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>ФИО</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Дата рождения</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Студ. билет</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Группа</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Факультет</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student, index) => (
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
                                <td style={{ padding: '12px'}}>{student.departmentName}</td>
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
                                        name="surname"
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
                                        name="name"
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
                                        name="secondName"
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
                                    value={studentForm.studentCardId}
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
                                    Факультет *
                                </label>
                                <select
                                    name="idDepartment"
                                    value={selectedDepartment || ''}
                                    onChange={(e) => {
                                        setSelectedDepartment(e.target.value || null);
                                        setStudentForm({
                                            ...studentForm,
                                            idGroup: ''
                                        });
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
                                >
                                    <option value="">Выберите факультет</option>
                                    {departments.map(department => (
                                        <option key={department.idDepartment} value={department.idDepartment}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.department && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.department}
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
                                    disabled={!selectedDepartment || processing}
                                    style={{
                                        width: '100%',
                                        borderRadius: '6px',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        fontSize: '0.95rem',
                                        boxSizing: 'border-box',
                                        opacity: selectedDepartment ? 1 : 0.7
                                    }}
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

export default StudentManagement;