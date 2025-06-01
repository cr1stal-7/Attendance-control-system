import { useState, useEffect } from 'react';
import axios from 'axios';

const CurriculumManagement = () => {
    const [curricula, setCurricula] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [educationForms, setEducationForms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCurriculum, setCurrentCurriculum] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [selectedSpecialization, setSelectedSpecialization] = useState(null);
    const [selectedEducationForm, setSelectedEducationForm] = useState(null);

    const [curriculumForm, setCurriculumForm] = useState({
        name: '',
        academicYear: '',
        duration: '',
        idSpecialization: '',
        idEducationForm: ''
    });

    useEffect(() => {
        fetchCurricula();
        fetchSpecializations();
        fetchEducationForms();
    }, []);

    useEffect(() => {
        fetchCurricula();
    }, [selectedSpecialization, selectedEducationForm]);

    const fetchCurricula = async () => {
        try {
            const params = {};
            if (selectedSpecialization) params.specializationId = selectedSpecialization;
            if (selectedEducationForm) params.educationFormId = selectedEducationForm;

            const response = await axios.get('http://localhost:8080/api/admin/education/curriculums', {
                params,
                withCredentials: true
            });
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

    const fetchSpecializations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/education/specializations', {
                withCredentials: true
            });
            setSpecializations(response.data);
        } catch (err) {
            console.error('Ошибка загрузки направлений:', err);
            setError('Не удалось загрузить список направлений');
        }
    };

    const fetchEducationForms = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/education/study-forms', {
                withCredentials: true
            });
            setEducationForms(response.data);
        } catch (err) {
            console.error('Ошибка загрузки форм обучения:', err);
            setError('Не удалось загрузить список форм обучения');
        }
    };

    const handleFormChange = (e) => {
        setCurriculumForm({
            ...curriculumForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddCurriculum = () => {
        setCurrentCurriculum(null);
        setCurriculumForm({
            name: '',
            academicYear: '',
            duration: '',
            idSpecialization: specializations.length > 0 ? specializations[0].idSpecialization : '',
            idEducationForm: educationForms.length > 0 ? educationForms[0].idEducationForm : ''
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditCurriculum = (curriculum) => {
        setCurrentCurriculum(curriculum);
        setCurriculumForm({
            name: curriculum.name,
            academicYear: curriculum.academicYear,
            duration: curriculum.duration,
            idSpecialization: curriculum.idSpecialization,
            idEducationForm: curriculum.idEducationForm
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteCurriculum = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот учебный план?')) {
            try {
                setProcessing(true);
                await axios.delete(`http://localhost:8080/api/admin/education/curriculums/${id}`, {
                    withCredentials: true
                });
                await fetchCurricula();
            } catch (err) {
                console.error('Ошибка удаления учебного плана:', err);
                setError(`Не удалось удалить учебный план: ${err.response?.data?.message || err.message}`);
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
        if (!curriculumForm.name) errors.name = "Название обязательно";
        if (!curriculumForm.academicYear) errors.academicYear = "Учебный год обязателен";
        if (!curriculumForm.duration) errors.duration = "Срок обучения обязателен";
        if (!curriculumForm.idSpecialization) errors.specialization = "Направление обязательно";
        if (!curriculumForm.idEducationForm) errors.educationForm = "Форма обучения обязательна";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };
            const data = {
                name: curriculumForm.name,
                academicYear: curriculumForm.academicYear,
                duration: curriculumForm.duration,
                idSpecialization: curriculumForm.idSpecialization,
                idEducationForm: curriculumForm.idEducationForm
            };

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/admin/education/curriculums/${currentCurriculum.idCurriculum}`,
                    data,
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/admin/education/curriculums',
                    data,
                    config
                );

            setShowModal(false);
            await fetchCurricula();
        } catch (err) {
            console.error('Ошибка сохранения учебного плана:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>Список учебных планов</h2>
                <button
                    onClick={handleAddCurriculum}
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
                    Добавить учебный план
                </button>
            </div>

            <div style={{marginBottom: '20px', display: 'flex', gap: '50px'}}>
                <div>
                    <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Фильтр по направлению:</label>
                    <select
                        value={selectedSpecialization || ''}
                        onChange={(e) => setSelectedSpecialization(e.target.value || null)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ced4da',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="">Все направления</option>
                        {specializations.map(spec => (
                            <option key={spec.idSpecialization} value={spec.idSpecialization}>
                                {spec.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Фильтр по форме обучения:</label>
                    <select
                        value={selectedEducationForm || ''}
                        onChange={(e) => setSelectedEducationForm(e.target.value || null)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ced4da',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="">Все формы</option>
                        {educationForms.map(form => (
                            <option key={form.idEducationForm} value={form.idEducationForm}>
                                {form.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {curricula.length > 0 ? (
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
                            <th style={{ padding: '12px', textAlign: 'left'}}>Учебный год</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Срок обучения</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Направление</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Форма обучения</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {curricula.map((curriculum, index) => (
                            <tr key={curriculum.idCurriculum} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px'}}>{index + 1}</td>
                                <td style={{ padding: '12px'}}>{curriculum.name}</td>
                                <td style={{ padding: '12px'}}>{curriculum.academicYear}</td>
                                <td style={{ padding: '12px'}}>{curriculum.duration}</td>
                                <td style={{ padding: '12px'}}>{curriculum.specializationName}</td>
                                <td style={{ padding: '12px'}}>{curriculum.educationFormName}</td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleEditCurriculum(curriculum)}
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
                                        onClick={() => handleDeleteCurriculum(curriculum.idCurriculum)}
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
                <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>Список учебных планов пуст</p>
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
                            {isEditMode ? 'Редактирование учебного плана' : 'Добавление нового учебного плана'}
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
                                    value={curriculumForm.name}
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
                                    Учебный год *
                                </label>
                                <input
                                    type="text"
                                    name="academicYear"
                                    maxLength={10}
                                    value={curriculumForm.academicYear}
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
                                {validationErrors.academicYear && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.academicYear}
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
                                    Срок обучения *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="6"
                                    name="duration"
                                    value={curriculumForm.duration}
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
                                {validationErrors.duration && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.duration}
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
                                    Направление *
                                </label>
                                <select
                                    name="idSpecialization"
                                    value={curriculumForm.idSpecialization}
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
                                    {specializations.map(spec => (
                                        <option key={spec.idSpecialization} value={spec.idSpecialization}>
                                            {spec.name}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.specialization && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.specialization}
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
                                    Форма обучения *
                                </label>
                                <select
                                    name="idEducationForm"
                                    value={curriculumForm.idEducationForm}
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
                                    {educationForms.map(form => (
                                        <option key={form.idEducationForm} value={form.idEducationForm}>
                                            {form.name}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.educationForm && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.educationForm}
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

export default CurriculumManagement;