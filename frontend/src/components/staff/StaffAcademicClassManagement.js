import { useState, useEffect } from 'react';
import axios from 'axios';

const StaffAcademicClassesManagement = () => {
    const [classes, setClasses] = useState([]);
    const [curricula, setCurricula] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const [employees, setEmployees] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [classTypes, setClassTypes] = useState([]);
    const [groups, setGroups] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);

    const [classForm, setClassForm] = useState({
        datetime: '',
        idCurriculumSubject: '',
        idClassType: '',
        idClassroom: '',
        idEmployee: '',
        groupIds: []
    });

    useEffect(() => {
        fetchCurricula();
        fetchEmployees();
        fetchClassrooms();
        fetchClassTypes();
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedCurriculum) {
            fetchSemestersByCurriculum();
            fetchSubjectsByCurriculum();
            fetchGroups();
            if (selectedSemester) {
                fetchAvailableSubjects(selectedSemester);
                fetchClasses();
            }
        } else {
            setSemesters([]);
            setSubjects([]);
            setClasses([]);
            setGroups([]);
        }
    }, [selectedCurriculum, selectedSemester, selectedSubject, selectedDate]);

    const fetchCurricula = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/staff/classes/curricula',
                { withCredentials: true }
            );
            const sortedCurricula = response.data.sort((a, b) => {
                if (a.academicYear !== b.academicYear) {
                    return b.academicYear.localeCompare(a.academicYear);
                }
                return a.name.localeCompare(b.name);
            });
            setCurricula(sortedCurricula);
        } catch (err) {
            console.error('Ошибка загрузки учебных планов:', err);
            setError('Не удалось загрузить список учебных планов');
        }
    };

    const fetchSemestersByCurriculum = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/admin/education/curriculum-subjects/semesters?curriculumId=${selectedCurriculum}`,
                { withCredentials: true }
            );
            const sortedSemesters = response.data.sort((a, b) =>
                b.academicYear.localeCompare(a.academicYear) ||
                a.type.localeCompare(b.type)
            );
            setSemesters(sortedSemesters);
        } catch (err) {
            console.error('Ошибка загрузки семестров:', err);
            setError('Не удалось загрузить список семестров');
        }
    };

    const fetchSubjectsByCurriculum = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/admin/education/curriculum-subjects/subjects?curriculumId=${selectedCurriculum}`,
                { withCredentials: true }
            );
            setSubjects(response.data);
        } catch (err) {
            console.error('Ошибка загрузки дисциплин:', err);
            setError('Не удалось загрузить список дисциплин');
        }
    };

    const fetchClasses = async () => {
        try {
            let url = `http://localhost:8080/api/staff/classes?curriculumId=${selectedCurriculum}&semesterId=${selectedSemester}`;

            if (selectedSubject) {
                url += `&subjectId=${selectedSubject}`;
            }
            if (selectedDate) {
                url += `&date=${selectedDate}`;
            }

            const response = await axios.get(url, { withCredentials: true });

            const sortedClasses = response.data.sort((a, b) => {
                return new Date(a.datetime) - new Date(b.datetime);
            });

            setClasses(sortedClasses);
        } catch (err) {
            console.error('Ошибка загрузки занятий:', err);
            setError('Не удалось загрузить список занятий');
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/admin/accounts/employees',
                { withCredentials: true }
            );
            const teachers = response.data.filter(employee =>
                employee.idRole === 3
            ).sort((a, b) => {
                const nameA = `${a.surname} ${a.name}`.toLowerCase();
                const nameB = `${b.surname} ${b.name}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });
            setEmployees(teachers);
        } catch (err) {
            console.error('Ошибка загрузки сотрудников:', err);
            setError('Не удалось загрузить список сотрудников');
        }
    };

    const fetchClassrooms = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/admin/structure/classrooms',
                { withCredentials: true }
            );
            const sortedClassrooms = response.data.sort((a, b) => {
                const numA = parseInt(a.number, 10);
                const numB = parseInt(b.number, 10);
                return numA - numB;
            });
            setClassrooms(sortedClassrooms);
        } catch (err) {
            console.error('Ошибка загрузки аудиторий:', err);
            setError('Не удалось загрузить список аудиторий');
        }
    };

    const fetchClassTypes = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/admin/schedule/class-types',
                { withCredentials: true }
            );
            setClassTypes(response.data);
        } catch (err) {
            console.error('Ошибка загрузки типов занятий:', err);
            setError('Не удалось загрузить список типов занятий');
        }
    };

    const fetchGroups = async () => {
        try {
            if (!selectedCurriculum) {
                setGroups([]);
                return;
            }
            const response = await axios.get(
                `http://localhost:8080/api/staff/classes/groups?curriculumId=${selectedCurriculum}`,
                { withCredentials: true }
            );
            const sortedGroups = response.data.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            setGroups(sortedGroups);
        } catch (err) {
            console.error('Ошибка загрузки групп:', err);
            setError('Не удалось загрузить список групп');
        }
    };

    const fetchAvailableSubjects = async (semesterId) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/admin/education/curriculum-subjects?curriculumId=${selectedCurriculum}`,
                { withCredentials: true }
            );
            const filteredSubjects = response.data.filter(subject =>
                subject.idSemester === semesterId
            );
            setAvailableSubjects(filteredSubjects);
        } catch (err) {
            console.error('Ошибка загрузки доступных дисциплин:', err);
            setError('Не удалось загрузить список доступных дисциплин');
        }
    };

    const handleFormChange = (e) => {
        setClassForm({
            ...classForm,
            [e.target.name]: e.target.value
        });
    };

    const handleGroupSelection = (groupId) => {
        setClassForm(prev => {
            const newGroupIds = [...prev.groupIds];
            const index = newGroupIds.indexOf(groupId);

            if (index === -1) {
                newGroupIds.push(groupId);
            } else {
                newGroupIds.splice(index, 1);
            }

            return {
                ...prev,
                groupIds: newGroupIds
            };
        });
    };

    const handleAddClass = () => {
        setCurrentClass(null);
        setClassForm({
            datetime: '',
            idCurriculumSubject: '',
            idClassType: '',
            idClassroom: '',
            idEmployee: '',
            groupIds: []
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditClass = (classItem) => {
        setCurrentClass(classItem);
        const date = new Date(classItem.datetime);
        const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);

        setClassForm({
            datetime: formattedDate,
            idCurriculumSubject: classItem.idCurriculumSubject,
            idClassType: classItem.idClassType,
            idClassroom: classItem.idClassroom,
            idEmployee: classItem.idEmployee,
            groupIds: classItem.groupIds || []
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteClass = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить это занятие?')) {
            try {
                setProcessing(true);
                await axios.delete(
                    `http://localhost:8080/api/staff/classes/${id}`,
                    { withCredentials: true }
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

    const handleSubmit = async () => {
        setProcessing(true);
        setError(null);
        setValidationErrors({});

        const errors = {};
        if (!classForm.datetime) errors.datetime = "Дата обязательна";
        if (!classForm.idCurriculumSubject) errors.subject = "Дисциплина обязательна";
        if (!classForm.idClassType) errors.classType = "Тип занятия обязателен";
        if (!classForm.idClassroom) errors.classroom = "Аудитория обязательна";
        if (!classForm.idEmployee) errors.employee = "Преподаватель обязателен";
        if (!classForm.groupIds || classForm.groupIds.length === 0) errors.groups = "Необходимо выбрать хотя бы одну группу";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };
            const data = {
                datetime: classForm.datetime+ ":00",
                idCurriculumSubject: classForm.idCurriculumSubject,
                idClassType: classForm.idClassType,
                idClassroom: classForm.idClassroom,
                idEmployee: classForm.idEmployee,
                groupIds: classForm.groupIds
            };

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/staff/classes/${currentClass.idClass}`,
                    data,
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/staff/classes',
                    data,
                    config
                );

            setShowModal(false);
            await fetchClasses();
        } catch (err) {
            console.error('Ошибка сохранения занятия:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{ maxWidth: '950px', margin: '0 auto' }}>
            <h1 style={{
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '1.8rem'
            }}>Управление занятиями</h1>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '15px'}}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                        Учебный план:
                    </label>
                    <select
                        value={selectedCurriculum || ''}
                        onChange={(e) => {
                            setSelectedCurriculum(e.target.value ? parseInt(e.target.value) : null);
                            setSelectedSemester(null);
                            setSelectedSubject(null);
                            setSelectedDate('');
                        }}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ced4da',
                            fontSize: '1rem',
                            minWidth: '450px',
                            maxWidth: '450px'
                        }}
                    >
                        <option value="">Выберите учебный план</option>
                        {curricula.map(curriculum => (
                            <option key={curriculum.idCurriculum} value={curriculum.idCurriculum}>
                                {curriculum.name} ({curriculum.academicYear})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCurriculum && (
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        marginBottom: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: 1, minWidth: '450px' }}>
                            <label style={{display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                                Семестр:
                            </label>
                            <select
                                value={selectedSemester || ''}
                                onChange={(e) => {
                                    const semesterId = e.target.value ? parseInt(e.target.value) : null;
                                    setSelectedSemester(semesterId);
                                    if (semesterId) {
                                        fetchAvailableSubjects(semesterId);
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ced4da',
                                    fontSize: '1rem',
                                    maxWidth: '450px'
                                }}
                            >
                                <option value="">Выберите семестр</option>
                                {semesters.map(semester => (
                                    <option key={semester.idSemester} value={semester.idSemester}>
                                        {semester.academicYear} ({semester.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ flex: 1, minWidth: '450px'}}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                                Дисциплина:
                            </label>
                            <select
                                value={selectedSubject || ''}
                                onChange={(e) => setSelectedSubject(e.target.value ? parseInt(e.target.value) : null)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ced4da',
                                    fontSize: '1rem',
                                    maxWidth: '450px'
                                }}
                            >
                                <option value="">Все дисциплины</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '20px',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ flex: 1, maxWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '1.1rem' }}>
                                    Фильтр по дате:
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        style={{
                                            padding: '0.5rem',
                                            fontSize: '1rem',
                                            borderRadius: '4px',
                                            border: '1px solid #ddd',
                                            flex: 1
                                        }}
                                    />
                                    <button
                                        onClick={() => setSelectedDate('')}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            fontSize: '1rem',
                                            backgroundColor: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s'
                                        }}
                                    >
                                        Сбросить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedCurriculum && selectedSemester && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>
                            Список занятий
                        </h3>
                        <button
                            onClick={handleAddClass}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            Добавить занятие
                        </button>
                    </div>

                    {classes.length > 0 ? (
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
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Дата</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Время</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Дисциплина</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Тип</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Аудитория</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Преподаватель</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Группы</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {classes.map((classItem, index) => (
                                    <tr key={classItem.idClass} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px' }}>{index + 1}</td>
                                        <td style={{ padding: '12px' }}>{formatDate(classItem.datetime)}</td>
                                        <td style={{ padding: '12px' }}>{formatTime(classItem.datetime)}</td>
                                        <td style={{ padding: '12px' }}>{classItem.subjectName}</td>
                                        <td style={{ padding: '12px' }}>{classItem.classTypeName}</td>
                                        <td style={{ padding: '12px' }}>{classItem.classroomNumber}</td>
                                        <td style={{ padding: '12px' }}>{classItem.employeeName}</td>
                                        <td style={{ padding: '12px' }}>{classItem.groupNames}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button
                                                onClick={() => handleEditClass(classItem)}
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
                                                onClick={() => handleDeleteClass(classItem.idClass)}
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
                            В выбранном учебном плане и семестре пока нет занятий
                        </p>
                    )}
                </>
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
                        maxWidth: '600px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}>
                        <h2 style={{
                            marginTop: 0,
                            marginBottom: '20px',
                            color: '#2c3e50',
                            fontSize: '1.3rem'
                        }}>
                            {isEditMode ? 'Редактирование занятия' : 'Добавление нового занятия'}
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
                                    Дата и время *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="datetime"
                                    value={classForm.datetime}
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
                                {validationErrors.datetime && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.datetime}
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
                                    Дисциплина *
                                </label>
                                <select
                                    name="idCurriculumSubject"
                                    value={classForm.idCurriculumSubject}
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
                                    <option value="">Выберите дисциплину</option>
                                    {availableSubjects.map(subject => (
                                        <option key={subject.idCurriculumSubject} value={subject.idCurriculumSubject}>
                                            {subject.subjectName}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.subject && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.subject}
                                    </div>
                                )}
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
                                        Тип занятия *
                                    </label>
                                    <select
                                        name="idClassType"
                                        value={classForm.idClassType}
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
                                        <option value="">Выберите тип занятия</option>
                                        {classTypes.map(type => (
                                            <option key={type.idClassType} value={type.idClassType}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.classType && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.classType}
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
                                        Аудитория *
                                    </label>
                                    <select
                                        name="idClassroom"
                                        value={classForm.idClassroom}
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
                                        <option value="">Выберите аудиторию</option>
                                        {classrooms.map(classroom => (
                                            <option key={classroom.idClassroom} value={classroom.idClassroom}>
                                                {classroom.number} ({classroom.buildingName})
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.classroom && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                            {validationErrors.classroom}
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
                                    Преподаватель *
                                </label>
                                <select
                                    name="idEmployee"
                                    value={classForm.idEmployee}
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
                                    <option value="">Выберите преподавателя</option>
                                    {employees.map(employee => (
                                        <option key={employee.idEmployee} value={employee.idEmployee}>
                                            {employee.surname} {employee.name.charAt(0)}.{employee.secondName ? ` ${employee.secondName.charAt(0)}.` : ''}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.employee && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.employee}
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
                                    Группы *
                                </label>
                                <div style={{
                                    border: '1px solid #ced4da',
                                    borderRadius: '6px',
                                    padding: '10px',
                                    maxHeight: '150px',
                                    overflowY: 'auto'
                                }}>
                                    {groups.map(group => (
                                        <div key={group.idGroup} style={{ marginBottom: '5px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={classForm.groupIds.includes(group.idGroup)}
                                                    onChange={() => handleGroupSelection(group.idGroup)}
                                                    style={{ marginRight: '8px' }}
                                                />
                                                {group.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {validationErrors.groups && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.groups}
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
                                gap: '10px',
                                marginTop: '20px'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
                                    onClick={handleSubmit}
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

export default StaffAcademicClassesManagement;