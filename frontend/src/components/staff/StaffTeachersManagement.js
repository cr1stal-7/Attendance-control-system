import { useState, useEffect } from 'react';
import axios from 'axios';

const StaffTeachersManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [facultyInfo, setFacultyInfo] = useState(null);
    const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('all');

    const [employeeForm, setEmployeeForm] = useState({
        surname: '',
        name: '',
        secondName: '',
        birthDate: '',
        email: '',
        idDepartment: '',
        idPosition: '',
        idRole: '',
        password: ''
    });

    useEffect(() => {
        fetchFacultyInfo();
        fetchDepartments();
        fetchPositions();
        fetchRoles();
    }, []);

    useEffect(() => {
        if (facultyInfo) {
            fetchEmployees();
        }
    }, [facultyInfo]);

    useEffect(() => {
        applyDepartmentFilter();
    }, [employees, selectedDepartmentFilter]);

    const applyDepartmentFilter = () => {
        if (selectedDepartmentFilter === 'all') {
            setFilteredEmployees([...employees]);
        } else {
            const filtered = employees.filter(emp =>
                emp.idDepartment.toString() === selectedDepartmentFilter.toString()
            );
            setFilteredEmployees(filtered);
        }
    };

    const fetchFacultyInfo = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/faculty/info',
                { withCredentials: true }
            );
            setFacultyInfo(response.data);
        } catch (err) {
            console.error('Ошибка загрузки информации о факультете:', err);
            setError('Не удалось загрузить информацию о факультете');
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/teachers',
                { withCredentials: true }
            );

            const sortedEmployees = [...response.data].sort((a, b) => {
                const nameA = `${a.surname} ${a.name}`.toLowerCase();
                const nameB = `${b.surname} ${b.name}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });

            setEmployees(sortedEmployees);
        } catch (err) {
            console.error('Ошибка загрузки сотрудников:', err);
            setError('Не удалось загрузить список сотрудников');
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/teachers/departments',
                { withCredentials: true }
            );
            setDepartments(response.data);

            if (response.data.length > 0) {
                const faculty = response.data.find(d => d.parentDepartment === null);
                if (faculty) {
                    setEmployeeForm(prev => ({
                        ...prev,
                        idDepartment: faculty.idDepartment
                    }));
                }
            }
        } catch (err) {
            console.error('Ошибка загрузки подразделений:', err);
            setError('Не удалось загрузить список подразделений');
        }
    };

    const fetchPositions = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/teachers/positions',
                { withCredentials: true }
            );
            setPositions(response.data);

            if (response.data.length > 0) {
                setEmployeeForm(prev => ({
                    ...prev,
                    idPosition: response.data[0].idPosition
                }));
            }
        } catch (err) {
            console.error('Ошибка загрузки должностей:', err);
            setError('Не удалось загрузить список должностей');
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/teachers/roles',
                { withCredentials: true }
            );
            setRoles(response.data);

            if (response.data.length > 0) {
                setEmployeeForm(prev => ({
                    ...prev,
                    idRole: response.data[0].idRole
                }));
            }
        } catch (err) {
            console.error('Ошибка загрузки ролей:', err);
            setError('Не удалось загрузить список ролей');
        }
    };

    const handleFormChange = (e) => {
        setEmployeeForm({
            ...employeeForm,
            [e.target.name]: e.target.value
        });
    };

    const handleDepartmentFilterChange = (e) => {
        setSelectedDepartmentFilter(e.target.value);
    };

    const handleAddEmployee = () => {
        setCurrentEmployee(null);
        setEmployeeForm({
            surname: '',
            name: '',
            secondName: '',
            birthDate: '',
            email: '',
            idDepartment: departments.length > 0 ? departments[0].idDepartment : '',
            idPosition: positions.length > 0 ? positions[0].idPosition : '',
            idRole: roles.length > 0 ? roles[0].idRole : '',
            password: ''
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditEmployee = (employee) => {
        setCurrentEmployee(employee);
        setEmployeeForm({
            surname: employee.surname,
            name: employee.name,
            secondName: employee.secondName || '',
            birthDate: employee.birthDate,
            email: employee.email,
            idDepartment: employee.idDepartment,
            idPosition: employee.idPosition,
            idRole: employee.idRole,
            password: ''
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
            try {
                setProcessing(true);
                await axios.delete(
                    `http://localhost:8080/api/staff/teachers/${id}`,
                    { withCredentials: true }
                );
                await fetchEmployees();
            } catch (err) {
                console.error('Ошибка удаления сотрудника:', err);
                setError(`Не удалось удалить сотрудника: ${err.response?.data?.message || err.message}`);
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
        if (!employeeForm.surname) errors.surname = "Фамилия обязательна";
        if (!employeeForm.name) errors.name = "Имя обязательно";
        if (!employeeForm.birthDate) errors.birthDate = "Дата рождения обязательна";
        if (!employeeForm.email) {
            errors.email = 'Email обязателен';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(employeeForm.email)) {
            errors.email = 'Пожалуйста, введите корректный email';
        }
        if (!employeeForm.idDepartment) errors.idDepartment = "Подразделение обязателена";
        if (!employeeForm.idPosition) errors.position = "Должность обязательна";
        if (!employeeForm.idRole) errors.role = "Роль обязательна";

        if (!isEditMode && !employeeForm.password) {
            errors.password = "Пароль обязателен";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };

            if (isEditMode) {
                const dataToSend = employeeForm.password
                    ? employeeForm
                    : {
                        ...employeeForm,
                        password: undefined
                    };

                await axios.put(
                    `http://localhost:8080/api/staff/teachers/${currentEmployee.idEmployee}`,
                    dataToSend,
                    config
                );
            } else {
                await axios.post(
                    'http://localhost:8080/api/staff/teachers',
                    employeeForm,
                    config
                );
            }

            setShowModal(false);
            await fetchEmployees();
        } catch (err) {
            console.error('Ошибка сохранения сотрудника:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '950px', margin: '0 auto'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>Список сотрудников</h2>
                <button
                    onClick={handleAddEmployee}
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
                    Добавить сотрудника
                </button>
            </div>

            <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Фильтр по подразделению:</label>
                    <select
                        value={selectedDepartmentFilter}
                        onChange={handleDepartmentFilterChange}
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            borderRadius: '6px',
                            padding: '10px',
                            border: '1px solid #ced4da',
                            fontSize: '0.95rem',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="all">Все подразделения</option>
                        {departments.map(department => (
                            <option key={department.idDepartment} value={department.idDepartment}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredEmployees.length > 0 ? (
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
                            <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ФИО</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Дата рождения</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Подразделение</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Должность</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Роль</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr key={employee.idEmployee} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{index + 1}</td>
                                <td style={{ padding: '12px' }}>
                                    {`${employee.surname} ${employee.name} ${employee.secondName || ''}`}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {new Date(employee.birthDate).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '12px' }}>{employee.email}</td>
                                <td style={{ padding: '12px' }}>{employee.departmentName || '-'}</td>
                                <td style={{ padding: '12px' }}>{employee.positionName || '-'}</td>
                                <td style={{ padding: '12px' }}>{employee.roleName || '-'}</td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleEditEmployee(employee)}
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
                                        onClick={() => handleDeleteEmployee(employee.idEmployee)}
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
                <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>
                    {employees.length > 0 ? 'Нет сотрудников в выбранном подразделении' : 'Список сотрудников пуст'}
                </p>
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
                            {isEditMode ? 'Редактирование сотрудника' : 'Добавление нового сотрудника'}
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
                                        value={employeeForm.surname}
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
                                        value={employeeForm.name}
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
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e',
                                        fontSize: '0.95rem'
                                    }}>Отчество</label>
                                    <input
                                        type="text"
                                        name="secondName"
                                        maxLength={50}
                                        value={employeeForm.secondName}
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
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                        color: '#34495e',
                                        fontSize: '0.95rem'
                                    }}>Дата рождения *</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={employeeForm.birthDate}
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
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    maxLength={100}
                                    value={employeeForm.email}
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
                                    value={employeeForm.password}
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
                                    Подразделение *
                                </label>
                                <select
                                    name="idDepartment"
                                    value={employeeForm.idDepartment}
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
                                >
                                    {departments.map(department => (
                                        <option key={department.idDepartment} value={department.idDepartment}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
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
                                        Должность *
                                    </label>
                                    <select
                                        name="idPosition"
                                        value={employeeForm.idPosition}
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
                                        <option value="">Выберите должность</option>
                                        {positions.map(position => (
                                            <option key={position.idPosition} value={position.idPosition}>
                                                {position.name}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.position && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.position}
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
                                        Роль *
                                    </label>
                                    <select
                                        name="idRole"
                                        value={employeeForm.idRole}
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
                                        <option value="">Выберите роль</option>
                                        {roles.map(role => (
                                            <option key={role.idRole} value={role.idRole}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.role && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.role}
                                        </div>
                                    )}
                                </div>
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

export default StaffTeachersManagement;