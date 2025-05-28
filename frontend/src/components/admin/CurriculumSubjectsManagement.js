import { useState, useEffect } from 'react';
import axios from 'axios';

const CurriculumSubjectsManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [curricula, setCurricula] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);

    const [subjectForm, setSubjectForm] = useState({
        idSubject: '',
        idSemester: '',
        hours: ''
    });

    useEffect(() => {
        fetchCurricula();
        fetchAllSubjects();
        fetchSemesters();
    }, []);

    useEffect(() => {
        if (selectedCurriculum) {
            fetchSubjects();
        } else {
            setSubjects([]);
        }
    }, [selectedCurriculum]);

    const fetchCurricula = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/admin/education/curriculums',
                { withCredentials: true }
            );
            setCurricula(response.data);
        } catch (err) {
            console.error('Ошибка загрузки учебных планов:', err);
            setError('Не удалось загрузить список учебных планов');
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/admin/education/curriculum-subjects?curriculumId=${selectedCurriculum}`,
                { withCredentials: true }
            );
            setSubjects(response.data);
        } catch (err) {
            console.error('Ошибка загрузки дисциплин:', err);
            setError('Не удалось загрузить список дисциплин');
        }
    };

    const fetchAllSubjects = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/admin/education/subjects',
                { withCredentials: true }
            );
            setAllSubjects(response.data);
        } catch (err) {
            console.error('Ошибка загрузки всех дисциплин:', err);
            setError('Не удалось загрузить список всех дисциплин');
        }
    };

    const fetchSemesters = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/admin/education/semesters',
                { withCredentials: true }
            );
            setSemesters(response.data);
        } catch (err) {
            console.error('Ошибка загрузки семестров:', err);
            setError('Не удалось загрузить список семестров');
        }
    };

    const handleFormChange = (e) => {
        setSubjectForm({
            ...subjectForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddSubject = () => {
        setCurrentSubject(null);
        setSubjectForm({
            idSubject: allSubjects.length > 0 ? allSubjects[0].id : '',
            idSemester: semesters.length > 0 ? semesters[0].idSemester : '',
            hours: ''
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditSubject = (subject) => {
        setCurrentSubject(subject);
        setSubjectForm({
            idSubject: subject.idSubject,
            idSemester: subject.idSemester,
            hours: subject.hours
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteSubject = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту дисциплину из учебного плана?')) {
            try {
                setProcessing(true);
                await axios.delete(
                    `http://localhost:8080/api/admin/education/curriculum-subjects/${id}?curriculumId=${selectedCurriculum}`,
                    { withCredentials: true }
                );
                await fetchSubjects();
            } catch (err) {
                console.error('Ошибка удаления дисциплины:', err);
                setError(`Не удалось удалить дисциплину: ${err.response?.data?.message || err.message}`);
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
        if (!subjectForm.idSubject) errors.subject = "Дисциплина обязательна";
        if (!subjectForm.idSemester) errors.semester = "Семестр обязателен";
        if (!subjectForm.hours) errors.hours = "Количество часов обязательно";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };
            const data = {
                idSubject: subjectForm.idSubject,
                idSemester: subjectForm.idSemester,
                hours: subjectForm.hours
            };

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/admin/education/curriculum-subjects/${currentSubject.idCurriculumSubject}?curriculumId=${selectedCurriculum}`,
                    data,
                    config
                )
                : await axios.post(
                    `http://localhost:8080/api/admin/education/curriculum-subjects?curriculumId=${selectedCurriculum}`,
                    data,
                    config
                );

            setShowModal(false);
            await fetchSubjects();
        } catch (err) {
            console.error('Ошибка сохранения дисциплины:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    const getCurriculumName = () => {
        if (!selectedCurriculum) return "";
        const curriculum = curricula.find(c => c.idCurriculum == selectedCurriculum);
        return curriculum ? `${curriculum.name} (${curriculum.academicYear})` : "";
    };

    return (
        <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>
                    Управление дисциплинами учебного плана
                </h2>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Выберите учебный план:</label>
                <select
                    value={selectedCurriculum || ''}
                    onChange={(e) => setSelectedCurriculum(e.target.value ? parseInt(e.target.value) : null)}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ced4da',
                        fontSize: '1rem',
                        minWidth: '300px'
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
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>Список дисциплин</h2>
                        <button
                            onClick={handleAddSubject}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                transition: 'background-color 0.3s',
                                ':hover': {
                                    backgroundColor: '#2980b9'
                                }
                            }}
                        >
                            Добавить дисциплину
                        </button>
                    </div>

                    {subjects.length > 0 ? (
                        <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>№</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Дисциплина</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Семестр</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Часы</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {subjects.map((subject, index) => (
                                    <tr key={subject.idCurriculumSubject} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '12px' }}>{index + 1}</td>
                                        <td style={{ padding: '12px' }}>{subject.subjectName}</td>
                                        <td style={{ padding: '12px' }}>{subject.semesterName} ({subject.semesterType})</td>
                                        <td style={{ padding: '12px' }}>{subject.hours}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button
                                                onClick={() => handleEditSubject(subject)}
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
                                                onClick={() => handleDeleteSubject(subject.idCurriculumSubject)}
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
                            В выбранном учебном плане пока нет дисциплин
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
                        maxWidth: '500px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}>
                        <h2 style={{
                            marginTop: 0,
                            marginBottom: '20px',
                            color: '#2c3e50',
                            fontSize: '1.3rem'
                        }}>
                            {isEditMode ? 'Редактирование дисциплины' : 'Добавление новой дисциплины'}
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
                                    Дисциплина *
                                </label>
                                <select
                                    name="idSubject"
                                    value={subjectForm.idSubject}
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
                                    {allSubjects.map(sub => (
                                        <option key={sub.id} value={sub.id}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.sub && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.sub}
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
                                    Семестр *
                                </label>
                                <select
                                    name="idSemester"
                                    value={subjectForm.idSemester}
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
                                    {semesters.map(semester => (
                                        <option key={semester.idSemester} value={semester.idSemester}>
                                            {semester.academicYear} ({semester.type})
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.semester && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.semester}
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
                                    Часы *
                                </label>
                                <input
                                    name="hours"
                                    pattern='[0-9]*'
                                    value={subjectForm.hours}
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
                                {validationErrors.hours && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.hours}
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

export default CurriculumSubjectsManagement;