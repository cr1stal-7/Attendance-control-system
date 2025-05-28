import { useState, useEffect } from 'react';
import axios from 'axios';

const GroupManagement = () => {
    const [groups, setGroups] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [curriculums, setCurriculums] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);

    const [groupForm, setGroupForm] = useState({
        name: '',
        course: '',
        idDepartment: '',
        idCurriculum: ''
    });

    useEffect(() => {
        fetchGroups();
        fetchDepartments();
        fetchCurriculums();
    }, []);

    useEffect(() => {
        fetchGroups(selectedDepartment, selectedCurriculum);
    }, [selectedDepartment, selectedCurriculum]);

    const fetchGroups = async (departmentId = null, curriculumId = null) => {
        try {
            let url = 'http://localhost:8080/api/admin/education/groups?';

            if (departmentId) {
                url += `departmentId=${departmentId}&`;
            }
            if (curriculumId) {
                url += `curriculumId=${curriculumId}`;
            }

            // Удаляем последний символ '&' если он есть
            url = url.endsWith('&') ? url.slice(0, -1) : url;
            url = url.endsWith('?') ? url.slice(0, -1) : url;

            const response = await axios.get(url, {
                withCredentials: true
            });
            setGroups(response.data);
        } catch (err) {
            console.error('Ошибка загрузки групп:', err);
            setError('Не удалось загрузить список групп');
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/admin/structure/departments/faculties',
                { withCredentials: true }
            );
            setDepartments(response.data);
        } catch (err) {
            console.error('Ошибка загрузки факультетов:', err);
            setError('Не удалось загрузить список факультетов');
        }
    };

    const fetchCurriculums = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/admin/education/curriculums',
                { withCredentials: true }
            );
            setCurriculums(response.data);
        } catch (err) {
            console.error('Ошибка загрузки учебных планов:', err);
            setError('Не удалось загрузить список учебных планов');
        }
    };

    const handleFormChange = (e) => {
        setGroupForm({
            ...groupForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddGroup = () => {
        setCurrentGroup(null);
        setGroupForm({
            name: '',
            course: '',
            idDepartment: departments.length > 0 ? departments[0].idDepartment : '',
            idCurriculum: curriculums.length > 0 ? curriculums[0].idCurriculum : ''
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditGroup = (group) => {
        setCurrentGroup(group);
        setGroupForm({
            name: group.name,
            course: group.course,
            idDepartment: group.idDepartment,
            idCurriculum: group.idCurriculum
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteGroup = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
            try {
                setProcessing(true);
                await axios.delete(
                    `http://localhost:8080/api/admin/education/groups/${id}`,
                    { withCredentials: true }
                );
                await fetchGroups(selectedDepartment, selectedCurriculum);
            } catch (err) {
                console.error('Ошибка удаления группы:', err);
                setError(`Не удалось удалить группу: ${err.response?.data?.message || err.message}`);
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
        if (!groupForm.name) errors.name = "Название группы обязательно";
        if (!groupForm.course) errors.course = "Курс обязателен";
        if (!groupForm.idDepartment) errors.department = "Факультет обязателен";
        if (!groupForm.idCurriculum) errors.curriculum = "Учебный план обязателен";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/admin/education/groups/${currentGroup.idGroup}`,
                    groupForm,
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/admin/education/groups',
                    groupForm,
                    config
                );

            setShowModal(false);
            await fetchGroups(selectedDepartment, selectedCurriculum);
        } catch (err) {
            console.error('Ошибка сохранения группы:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>Список групп</h2>
                <button
                    onClick={handleAddGroup}
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
                    Добавить группу
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
                    <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Фильтр по учебному плану:</label>
                    <select
                        value={selectedCurriculum || ''}
                        onChange={(e) => setSelectedCurriculum(e.target.value || null)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ced4da',
                            fontSize: '1rem',
                            width: '100%'
                        }}
                    >
                        <option value="">Все учебные планы</option>
                        {curriculums.map(curriculum => (
                            <option key={curriculum.idCurriculum} value={curriculum.idCurriculum}>
                                {curriculum.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {groups.length > 0 ? (
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                            <th style={{ padding: '12px', textAlign: 'left'}}>№</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Название</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Курс</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Факультет</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Учебный план</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {groups.map((group, index) => (
                            <tr key={group.idGroup} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px'}}>{index + 1}</td>
                                <td style={{ padding: '12px'}}>{group.name}</td>
                                <td style={{ padding: '12px'}}>{group.course}</td>
                                <td style={{ padding: '12px'}}>{group.departmentName}</td>
                                <td style={{ padding: '12px'}}>{group.curriculumName}</td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleEditGroup(group)}
                                        style={{
                                            padding: '0.3rem 0.6rem',
                                            marginRight: '5px',
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
                                        onClick={() => handleDeleteGroup(group.idGroup)}
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
                <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>Список групп пуст</p>
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
                            {isEditMode ? 'Редактирование группы' : 'Добавление новой группы'}
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
                                    Название группы *
                                </label>
                                <input
                                    name="name"
                                    value={groupForm.name}
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
                                    Курс *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="6"
                                    name="course"
                                    value={groupForm.course}
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
                                {validationErrors.course && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.course}
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
                                    value={groupForm.idDepartment}
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
                                    Учебный план *
                                </label>
                                <select
                                    name="idCurriculum"
                                    value={groupForm.idCurriculum}
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
                                    {curriculums.map(curriculum => (
                                        <option key={curriculum.idCurriculum} value={curriculum.idCurriculum}>
                                            {curriculum.name}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.curriculum && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.curriculum}
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

export default GroupManagement;