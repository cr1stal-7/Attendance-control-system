import { useState, useEffect } from 'react';
import axios from 'axios';

const ClassTypeManagement = () => {
    const [classTypes, setClassTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentClassType, setCurrentClassType] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);

    const [classTypeForm, setClassTypeForm] = useState({
        name: ''
    });

    useEffect(() => {
        fetchClassTypes();
    }, []);

    const fetchClassTypes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/schedule/class-types', {
                withCredentials: true
            });
            setClassTypes(response.data);
        } catch (err) {
            console.error('Ошибка загрузки типов занятия:', err);
            setError('Не удалось загрузить типы занятия');
        }
    };

    const handleFormChange = (e) => {
        setClassTypeForm({
            ...classTypeForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddClassType = () => {
        setCurrentClassType(null);
        setClassTypeForm({
            name: ''
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditClassType = (classType) => {
        setCurrentClassType(classType);
        setClassTypeForm({
            name: classType.name
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteClassType = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тип занятия?')) {
            try {
                setProcessing(true);
                await axios.delete(`http://localhost:8080/api/admin/schedule/class-types/${id}`, {
                    withCredentials: true
                });
                await fetchClassTypes();
            } catch (err) {
                console.error('Ошибка удаления типа занятия:', err);
                setError(`Не удалось удалить тип занятия: ${err.response?.data?.message || err.message}`);
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
        if (!classTypeForm.name) errors.name = "Название обязательно";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/admin/schedule/class-types/${currentClassType.idClassType}`,
                    classTypeForm,
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/admin/schedule/class-types',
                    classTypeForm,
                    config
                );

            setShowModal(false);
            await fetchClassTypes();
        } catch (err) {
            console.error('Ошибка сохранения типа занятия:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>Типы занятия</h2>
                <button
                    onClick={handleAddClassType}
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
                    Добавить тип занятия
                </button>
            </div>

            {classTypes.length > 0 ? (
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
                            <th style={{ padding: '12px', textAlign: 'left'}}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {classTypes.map((classType, index) => (
                            <tr key={classType.idClassType} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px'}}>{index + 1}</td>
                                <td style={{ padding: '12px'}}>{classType.name}</td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleEditClassType(classType)}
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
                                        onClick={() => handleDeleteClassType(classType.idClassType)}
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
                <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>Нет типов занятия</p>
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
                            {isEditMode ? 'Редактирование типа занятия' : 'Добавление нового типа занятия'}
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
                                    value={classTypeForm.name}
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

export default ClassTypeManagement;