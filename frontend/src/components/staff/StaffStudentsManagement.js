import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const StaffStudentsManagement = ({ groups, facultyName }) => {
    const [selectedGroup, setSelectedGroup] = useState('');
    const [students, setStudents] = useState([]);
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);

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
        if (selectedGroup) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedGroup]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/staff/students?groupId=${selectedGroup}`,
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
            birthDate: formatDateForInput(student.birthDate) || '',
            password: '',
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
                    `http://localhost:8080/api/staff/students/${id}`,
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
    };

    const handleSubmitStudent = async () => {
        setProcessing(true);
        setError(null);
        setValidationErrors({});

        const errors = {};
        if (!studentForm.surname) errors.surname = "Фамилия обязательна";
        if (!studentForm.name) errors.name = "Имя обязательно";
        if (!studentForm.email) errors.email = "Email обязателен";
        if (!studentForm.studentCardId) errors.studentCardId = "Номер студ. билета обязателен";
        if (!studentForm.birthDate) errors.birthDate = "Дата рождения обязательна";
        if (!isEditMode && !studentForm.password) errors.password = "Пароль обязателен";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };
            const formData = { ...studentForm, groupId: selectedGroup };

            const response = isEditMode
                ? await axios.put(`http://localhost:8080/api/staff/students/${currentStudent.id}`, formData, config)
                : await axios.post('http://localhost:8080/api/staff/students', formData, config);

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

    const getSortedStudents = () => {
        return [...students].sort((a, b) => {
            const surnameCompare = a.surname.localeCompare(b.surname);
            if (surnameCompare !== 0) return surnameCompare;
            return a.name.localeCompare(b.name);
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        } catch (e) {
            return dateString;
        }
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            return '';
        }
    };

    return (
        <div>
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

            {selectedGroup && (
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
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
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
                                {getSortedStudents().map((student, index) => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px' }}>{index + 1}</td>
                                        <td style={{ padding: '12px' }}>{student.surname}</td>
                                        <td style={{ padding: '12px' }}>{student.name}</td>
                                        <td style={{ padding: '12px' }}>{student.secondName || '-'}</td>
                                        <td style={{ padding: '12px' }}>{student.email}</td>
                                        <td style={{ padding: '12px' }}>{student.studentCardId}</td>
                                        <td style={{ padding: '12px' }}>{formatDate(student.birthDate)}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button
                                                onClick={() => handleEditStudent(student)}
                                                style={{
                                                    padding: '0.3rem 0.6rem',
                                                    marginBottom: '5px',
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
                                    {validationErrors.surname && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.surname}
                                        </div>)}
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
                                    {validationErrors.name && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.name}
                                        </div>)}
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
                                    {validationErrors.secondName && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.secondName}
                                        </div>)}
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
                                    {validationErrors.studentCardId && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.studentCardId}
                                        </div>)}
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
                                {validationErrors.birthDate && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.birthDate}
                                    </div>)}
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
                                {validationErrors.email && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.email}
                                    </div>)}
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Пароль {!isEditMode && '*'}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={studentForm.password}
                                    onChange={handleStudentFormChange}
                                    required={!isEditMode}
                                    placeholder={isEditMode ? "Оставьте пустым, чтобы не изменять" : ""}
                                    style={{ width: '100%', borderRadius: '6px', padding: '10px', border: '1px solid #ced4da', fontSize: '1rem', boxSizing: 'border-box' }}
                                    disabled={processing}
                                />
                                {isEditMode && (
                                    <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '4px' }}>
                                        Введите новый пароль только если хотите его изменить
                                    </div>
                                )}
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

export default StaffStudentsManagement;