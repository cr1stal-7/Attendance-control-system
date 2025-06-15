import { useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [parentDepartments, setParentDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [selectedParent, setSelectedParent] = useState(null);
    const [departmentType, setDepartmentType] = useState('faculty');
    const [filterParent, setFilterParent] = useState(null);

    const [departmentForm, setDepartmentForm] = useState({
        name: '',
        shortName: '',
        parentId: null
    });

    useEffect(() => {
        fetchDepartments();
        if (departmentType === 'department') {
            fetchParentDepartments();
        }
    }, [departmentType, filterParent]);

    const fetchDepartments = async () => {
        try {
            let url = 'http://localhost:8080/api/admin/structure/departments';
            const params = {};

            if (departmentType === 'faculty') {
                params.isFaculty = true;
            } else {
                params.isFaculty = false;
                if (filterParent) {
                    params.parentId = filterParent;
                }
            }

            const response = await axios.get(url, {
                params,
                withCredentials: true
            });
            setDepartments(response.data);
        } catch (err) {
            console.error('Ошибка загрузки подразделений:', err);
            setError('Не удалось загрузить список подразделений');
        }
    };

    const fetchParentDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/structure/departments', {
                params: { isFaculty: true },
                withCredentials: true
            });
            setParentDepartments(response.data);
        } catch (err) {
            console.error('Ошибка загрузки факультетов:', err);
            setError('Не удалось загрузить список факультетов');
        }
    };

    const handleFormChange = (e) => {
        setDepartmentForm({
            ...departmentForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddDepartment = () => {
        setCurrentDepartment(null);
        setDepartmentForm({
            name: '',
            shortName: '',
            parentId: departmentType === 'department' && parentDepartments.length > 0
                ? parentDepartments[0].idDepartment
                : null
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditDepartment = (department) => {
        setCurrentDepartment(department);
        setDepartmentForm({
            name: department.name,
            shortName: department.shortName,
            parentId: department.parentId || null
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteDepartment = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить это подразделение?')) {
            try {
                setProcessing(true);
                await axios.delete(`http://localhost:8080/api/admin/structure/departments/${id}`, {
                    withCredentials: true
                });
                await fetchDepartments();
            } catch (err) {
                console.error('Ошибка удаления подразделения:', err);
                setError(`Не удалось удалить подразделение: ${err.response?.data?.message || err.message}`);
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
        if (!departmentForm.name) errors.name = "Название обязательно";
        if (!departmentForm.shortName) errors.shortName = "Короткое название обязательно";
        if (departmentType === 'department' && !departmentForm.parentId) errors.parent = "Факультет обязателен";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };
            const data = {
                name: departmentForm.name,
                shortName: departmentForm.shortName,
                parentId: departmentType === 'department' ? departmentForm.parentId : null
            };

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/admin/structure/departments/${currentDepartment.idDepartment}`,
                    data,
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/admin/structure/departments',
                    data,
                    config
                );

            setShowModal(false);
            await fetchDepartments();
        } catch (err) {
            console.error('Ошибка сохранения подразделения:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>Список подразделений</h2>
                <button
                    onClick={handleAddDepartment}
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
                    Добавить {departmentType === 'faculty' ? 'факультет' : 'кафедру'}
                </button>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '40px' }}>
                <div>
                    <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Тип:</label>
                    <select
                        value={departmentType}
                        onChange={(e) => {
                            setDepartmentType(e.target.value);
                            setFilterParent(null);
                        }}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ced4da',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="faculty">Факультеты</option>
                        <option value="department">Кафедры</option>
                    </select>
                </div>

                {departmentType === 'department' && (
                    <div>
                        <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Фильтр по факультету:</label>
                        <select
                            value={filterParent || ''}
                            onChange={(e) => setFilterParent(e.target.value || null)}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ced4da',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="">Все факультеты</option>
                            {parentDepartments.map(dep => (
                                <option key={dep.idDepartment} value={dep.idDepartment}>
                                    {dep.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {departments.length > 0 ? (
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
                            <th style={{ padding: '12px', textAlign: 'left'}}>Название</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Короткое название</th>
                            {departmentType === 'department' && (
                                <th style={{ padding: '12px', textAlign: 'left'}}>Факультет</th>
                            )}
                            <th style={{ padding: '12px', textAlign: 'left'}}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {departments.map((department, index) => (
                            <tr key={department.idDepartment} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px'}}>{index + 1}</td>
                                <td style={{ padding: '12px'}}>{department.name}</td>
                                <td style={{ padding: '12px'}}>{department.shortName}</td>
                                {departmentType === 'department' && (
                                    <td style={{ padding: '12px'}}>{department.parentName || '-'}</td>
                                )}
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleEditDepartment(department)}
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
                                        onClick={() => handleDeleteDepartment(department.idDepartment)}
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
                <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>Список подразделений пуст</p>
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
                            {isEditMode
                                ? `Редактирование ${departmentType === 'faculty' ? 'факультета' : 'кафедры'}`
                                : `Добавление новой ${departmentType === 'faculty' ? 'факультета' : 'кафедры'}`}
                        </h2>

                        <form>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#34495e',
                                    fontSize: '0.95rem'
                                }}>
                                    Название *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    maxLength={100}
                                    value={departmentForm.name}
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

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    color: '#34495e',
                                    fontSize: '0.95rem'
                                }}>
                                    Короткое название *
                                </label>
                                <input
                                    type="text"
                                    name="shortName"
                                    maxLength={20}
                                    value={departmentForm.shortName}
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
                                {validationErrors.shortName && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.shortName}
                                    </div>
                                )}
                            </div>

                            {departmentType === 'department' && (
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
                                        name="parentId"
                                        value={departmentForm.parentId || ''}
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
                                        <option value="">Выберите факультет</option>
                                        {parentDepartments.map(dep => (
                                            <option key={dep.idDepartment} value={dep.idDepartment}>
                                                {dep.name}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.parent && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.parent}
                                        </div>
                                    )}
                                </div>
                            )}

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

export default DepartmentManagement;