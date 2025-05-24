import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const StaffTeachersManagement = ({ departments, positions, facultyName }) => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);

    const [teacherForm, setTeacherForm] = useState({
        surname: '',
        name: '',
        secondName: '',
        birthDate: '',
        password: '',
        email: '',
        positionId: '',
        roleId: 3
    });

    useEffect(() => {
        if (selectedDepartment) {
            fetchTeachers();
        } else {
            setTeachers([]);
        }
    }, [selectedDepartment]);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/staff/teachers?departmentId=${selectedDepartment}`,
                { withCredentials: true }
            );
            setTeachers(response.data);
        } catch (err) {
            console.error('Ошибка загрузки преподавателей:', err);
            setError('Не удалось загрузить список преподавателей');
        }
    };

    const handleTeacherFormChange = (e) => {
        setTeacherForm({
            ...teacherForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddTeacher = () => {
        setCurrentTeacher(null);
        setTeacherForm({
            surname: '',
            name: '',
            secondName: '',
            birthDate: '',
            password: '',
            email: '',
            positionId: ''
        });
        setIsEditMode(false);
        setShowTeacherModal(true);
    };

    const handleEditTeacher = (teacher) => {
        setCurrentTeacher(teacher);
        setTeacherForm({
            surname: teacher.surname,
            name: teacher.name,
            secondName: teacher.secondName || '',
            birthDate: formatDateForInput(teacher.birthDate) || '',
            password: '',
            email: teacher.email || '',
            positionId: teacher.positionId || '',
            roleId: teacher.roleId || 3
        });
        setIsEditMode(true);
        setShowTeacherModal(true);
    };

    const handleSubmitTeacher = async () => {
        setProcessing(true);
        setError(null);
        setValidationErrors({});

        const errors = {};
        if (!teacherForm.surname) errors.surname = "Фамилия обязательна";
        if (!teacherForm.name) errors.name = "Имя обязательно";
        if (!teacherForm.email) errors.email = "Email обязателен";
        if (!teacherForm.birthDate) errors.birthDate = "Дата рождения обязательна";
        if (!teacherForm.positionId) errors.positionId = "Должность обязательна";
        if (!isEditMode && !teacherForm.password) errors.password = "Пароль обязателен";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };
            const formData = { ...teacherForm, departmentId: selectedDepartment, birthDate: teacherForm.birthDate };

            const response = isEditMode
                ? await axios.put(`http://localhost:8080/api/staff/teachers/${currentTeacher.id}`, formData, config)
                : await axios.post('http://localhost:8080/api/staff/teachers', formData, config);

            if (response.status === 409) {
                setError('Преподаватель с таким email уже существует');
                return;
            }

            setShowTeacherModal(false);
            await fetchTeachers();
        } catch (err) {
            console.error('Ошибка сохранения преподавателя:', err);
            setError(`Не удалось сохранить данные преподавателя: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    const getSortedTeachers = () => {
        return [...teachers].sort((a, b) => {
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

            {selectedDepartment && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ color: '#2c3e50' }}>Преподаватели кафедры</h3>
                        <button
                            onClick={handleAddTeacher}
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
                            Добавить преподавателя
                        </button>
                    </div>

                    {teachers.length > 0 ? (
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Фамилия</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Имя</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Отчество</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Дата рождения</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Должность</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getSortedTeachers().map((teacher, index) => (
                                    <tr key={teacher.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px' }}>{index + 1}</td>
                                        <td style={{ padding: '12px' }}>{teacher.surname}</td>
                                        <td style={{ padding: '12px' }}>{teacher.name}</td>
                                        <td style={{ padding: '12px' }}>{teacher.secondName || '-'}</td>
                                        <td style={{ padding: '12px' }}>{teacher.email}</td>
                                        <td style={{ padding: '12px' }}>{formatDate(teacher.birthDate)}</td>
                                        <td style={{ padding: '12px' }}>
                                            {positions.find(p => p.id === teacher.positionId)?.name || '-'}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <button
                                                onClick={() => handleEditTeacher(teacher)}
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
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>На этой кафедре пока нет преподавателей</p>
                    )}
                </div>
            )}

            {showTeacherModal && (
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
                            {isEditMode ? 'Редактирование преподавателя' : 'Добавление нового преподавателя'}
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
                                        value={teacherForm.surname}
                                        onChange={handleTeacherFormChange}
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
                                        value={teacherForm.name}
                                        onChange={handleTeacherFormChange}
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

                            <div style={{ marginBottom: '15px' }}>
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
                                    value={teacherForm.secondName}
                                    onChange={handleTeacherFormChange}
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
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#34495e'
                                }}>
                                    Дата рождения *
                                </label>
                                <input
                                    type="date"  // Изменено с text на date
                                    name="birthDate"
                                    value={teacherForm.birthDate}
                                    onChange={handleTeacherFormChange}
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
                                {validationErrors.birthDate && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.birthDate}
                                    </div>
                                )}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#34495e'
                                }}>
                                    Должность *
                                </label>
                                <select
                                    name="positionId"
                                    value={teacherForm.positionId}
                                    onChange={handleTeacherFormChange}
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
                                >
                                    <option value="">Выберите должность</option>
                                    {positions.map(position => (
                                        <option key={position.id} value={position.id}>
                                            {position.name}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.positionId && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.positionId}
                                    </div>
                                )}
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
                                    value={teacherForm.email}
                                    onChange={handleTeacherFormChange}
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
                                    value={teacherForm.password}
                                    onChange={handleTeacherFormChange}
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
                                    onClick={() => setShowTeacherModal(false)}
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
                                    onClick={handleSubmitTeacher}
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

export default StaffTeachersManagement;