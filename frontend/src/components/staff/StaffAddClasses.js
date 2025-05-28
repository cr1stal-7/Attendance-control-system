import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const StaffAddClasses = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [classes, setClasses] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showClassModal, setShowClassModal] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [classTypes, setClassTypes] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [employees, setEmployees] = useState([]);
    const [groups, setGroups] = useState([]);

    const [classForm, setClassForm] = useState({
        datetime: '',
        classTypeId: '',
        classroomId: '',
        groupId: '',
        employeeId: ''
    });

    useEffect(() => {
        fetchSemesters();
        fetchClassTypes();
        fetchClassrooms();
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedSemester) {
            fetchSubjects();
        } else {
            setSubjects([]);
            setSelectedSubject('');
        }
    }, [selectedSemester]);

    useEffect(() => {
        if (selectedSubject) {
            fetchGroups();
            fetchClasses();
        }
    }, [selectedSubject]);

    useEffect(() => {
        if (selectedSemester || selectedSubject) {
            fetchClasses();
        }
    }, [selectedSemester, selectedSubject, dateFilter]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/classes/employees',
                { withCredentials: true }
            );
            setEmployees(response.data);
        } catch (err) {
            console.error('Ошибка загрузки преподавателей:', err);
        }
    };

    const fetchSemesters = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/staff/classes/semesters',
                { withCredentials: true }
            );
            setSemesters(response.data);
        } catch (err) {
            console.error('Ошибка загрузки семестров:', err);
            setError('Не удалось загрузить список семестров');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/staff/classes/subjects',
                {
                    params: { semesterId: selectedSemester },
                    withCredentials: true
                }
            );
            setSubjects(response.data);
        } catch (err) {
            console.error('Ошибка загрузки дисциплин:', err);
            setError('Не удалось загрузить список дисциплин');
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'http://localhost:8080/api/staff/classes/groups',
                {
                    params: { curriculumSubjectId: selectedSubject },
                    withCredentials: true
                }
            );
            setGroups(response.data);
        } catch (err) {
            console.error('Ошибка загрузки групп:', err);
            setError('Не удалось загрузить список групп');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedSubject) params.curriculumSubjectId = selectedSubject;
            else if (selectedSemester) params.semesterId = selectedSemester;

            if (dateFilter) params.date = dateFilter;

            const response = await axios.get(
                'http://localhost:8080/api/staff/classes',
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
            console.error('Ошибка загрузки занятий:', err);
            setError('Не удалось загрузить список занятий');
        } finally {
            setLoading(false);
        }
    };

    const fetchClassTypes = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/class-types',
                { withCredentials: true }
            );
            setClassTypes(response.data);
        } catch (err) {
            console.error('Ошибка загрузки типов занятий:', err);
        }
    };

    const fetchClassrooms = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/classrooms',
                { withCredentials: true }
            );
            setClassrooms(response.data);
        } catch (err) {
            console.error('Ошибка загрузки аудиторий:', err);
        }
    };

    const handleAddClass = () => {
        setCurrentClass(null);
        setClassForm({
            datetime: '',
            classTypeId: '',
            classroomId: '',
            groupId: '',
            employeeId: ''
        });
        setIsEditMode(false);
        setShowClassModal(true);
    };

    const handleEditClass = (classItem) => {
        setCurrentClass(classItem);
        setClassForm({
            datetime: formatDateTimeForInput(classItem.date),
            classTypeId: classItem.classTypeId || '',
            classroomId: classItem.classroomId || '',
            groupId: classItem.groupId || '',
            employeeId: classItem.employeeId || ''
        });
        setIsEditMode(true);
        setShowClassModal(true);
    };

    const handleDeleteClass = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить это занятие?')) {
            try {
                setProcessing(true);
                await axios.delete(
                    `http://localhost:8080/api/staff/classes/${id}`,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                await fetchClasses();
            } catch (err) {
                console.error('Ошибка удаления занятия:', err);
                setError(`Не удалось удалить занятие: ${err.response?.data?.message || err.message}`);
            } finally {
                setProcessing(false);
            }
        }
    };

    const handleClassFormChange = (e) => {
        setClassForm({
            ...classForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitClass = async () => {
        setProcessing(true);
        setError(null);
        setValidationErrors({});

        const errors = {};
        if (!classForm.datetime) errors.datetime = "Дата и время обязательны";
        if (!isEditMode) {
            if (!classForm.groupId) errors.group = "Группа обязательна";
            if (!classForm.employeeId) errors.employee = "Преподаватель обязателен";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            };

            const formData = {
                ...classForm,
                curriculumSubjectId: selectedSubject
            };

            if (isEditMode) {
                if (!classForm.groupId) delete formData.groupId;
                if (!classForm.employeeId) delete formData.employeeId;
            }

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/staff/classes/${currentClass.id}`,
                    formData,
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/staff/classes',
                    formData,
                    config
                );

            setShowClassModal(false);
            await fetchClasses();
        } catch (err) {
            console.error('Ошибка сохранения занятия:', err);
            setError(`Не удалось сохранить занятие: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
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

    const formatEmployeeName = (surname, name, secondName) => {
        const nameInitial = name ? name.charAt(0) + '.' : '';
        const secondNameInitial = secondName ? secondName.charAt(0) + '.' : '';
        return `${surname} ${nameInitial}${secondNameInitial}`;
    };

    const formatDateTimeForInput = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (e) {
            return '';
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto'}}>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '20px',
                fontSize: '1.8rem'
            }}>
                Управление учебными занятиями
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

            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Семестр:
                    </label>
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            fontSize: '1rem'
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

                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Дисциплина:
                    </label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
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

            <div style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: 1, maxWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Фильтр по дате:
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            style={{
                                padding: '0.5rem',
                                fontSize: '1rem',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                flex: 1
                            }}
                            disabled={loading}
                        />
                        <button
                            onClick={() => setDateFilter('')}
                            style={{
                                padding: '0.5rem 1rem',
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
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#2c3e50' }}>
                    Список занятий
                </h2>
                <button
                    onClick={handleAddClass}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}
                    disabled={!selectedSubject || loading}
                >
                    Добавить занятие
                </button>
            </div>

            {loading ? (
                <p>Загрузка данных...</p>
            ) : classes.length > 0 ? (
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
                            <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Дата и время</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Дисциплина</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Группа</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Тип занятия</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Аудитория</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Преподаватель</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {classes.map((classItem, index) => (
                            <tr key={classItem.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{index + 1}</td>
                                <td style={{ padding: '12px' }}>{formatDateTime(classItem.date)}</td>
                                <td style={{ padding: '12px' }}>{classItem.subjectName}</td>
                                <td style={{ padding: '12px' }}>{classItem.groupName}</td>
                                <td style={{ padding: '12px' }}>{classItem.type || '-'}</td>
                                <td style={{ padding: '12px' }}>{classItem.classroomNumber || '-'}</td>
                                <td style={{ padding: '12px' }}>
                                    {formatEmployeeName(classItem.employeeSurname, classItem.employeeName, classItem.employeeSecondName)}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleEditClass(classItem)}
                                        style={{
                                            padding: '0.3rem 0.6rem',
                                            marginRight: '5px',
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
                                        onClick={() => handleDeleteClass(classItem.id)}
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
                <p>Нет занятий по выбранным критериям</p>
            )}

            {showClassModal && (
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
                            {isEditMode ? 'Редактирование занятия' : 'Добавление нового занятия'}
                        </h2>

                        <form>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Дата и время *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="datetime"
                                    value={classForm.datetime}
                                    onChange={handleClassFormChange}
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
                                {validationErrors.datetime && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.datetime}
                                    </div>
                                )}
                            </div>

                            {!isEditMode && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Группа *
                                </label>
                                <select
                                    name="groupId"
                                    value={classForm.groupId}
                                    onChange={handleClassFormChange}
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
                                    <option value="">Выберите группу</option>
                                    {groups.map(group => (
                                        <option key={group.id} value={group.id}>
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
                            )}

                            {!isEditMode && (
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Преподаватель *
                                </label>
                                <select
                                    name="employeeId"
                                    value={classForm.employeeId}
                                    onChange={handleClassFormChange}
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
                                    <option value="">Выберите преподавателя</option>
                                    {employees.map(employee => (
                                        <option key={employee.id} value={employee.id}>
                                            {formatEmployeeName(employee.surname, employee.name, employee.secondName)}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.employee && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.employee}
                                    </div>
                                )}
                            </div>
                            )}

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Тип занятия
                                </label>
                                <select
                                    name="classTypeId"
                                    value={classForm.classTypeId}
                                    onChange={handleClassFormChange}
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
                                    <option value="">Выберите тип занятия</option>
                                    {classTypes.map(type => (
                                        <option key={type.idClassType} value={type.idClassType}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#34495e' }}>
                                    Аудитория
                                </label>
                                <select
                                    name="classroomId"
                                    value={classForm.classroomId}
                                    onChange={handleClassFormChange}
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
                                    <option value="">Выберите аудиторию</option>
                                    {classrooms.map(room => (
                                        <option key={room.idClassroom} value={room.idClassroom}>
                                            {room.number} (этаж {room.floor})
                                        </option>
                                    ))}
                                </select>
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
                                    onClick={() => setShowClassModal(false)}
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
                                    onClick={handleSubmitClass}
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

export default StaffAddClasses;