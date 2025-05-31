import { useState, useEffect } from 'react';
import axios from 'axios';

const ControlPointManagement = () => {
    const [controlPoints, setControlPoints] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentControlPoint, setCurrentControlPoint] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const [controlPointForm, setControlPointForm] = useState({
        name: '',
        idBuilding: ''
    });

    useEffect(() => {
        fetchControlPoints();
        fetchBuildings();
    }, []);

    useEffect(() => {
        if (selectedBuilding) {
            fetchControlPoints(selectedBuilding);
        } else {
            fetchControlPoints();
        }
    }, [selectedBuilding]);

    const fetchControlPoints = async (buildingId = null) => {
        try {
            const url = buildingId
                ? `http://localhost:8080/api/admin/attendance/control-points?buildingId=${buildingId}`
                : 'http://localhost:8080/api/admin/attendance/control-points';

            const response = await axios.get(url, {
                withCredentials: true
            });
            setControlPoints(response.data);
        } catch (err) {
            console.error('Ошибка загрузки точек контроля:', err);
            setError('Не удалось загрузить список точек контроля');
        }
    };

    const fetchBuildings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/structure/buildings', {
                withCredentials: true
            });
            setBuildings(response.data);
        } catch (err) {
            console.error('Ошибка загрузки точек контроля:', err);
            setError('Не удалось загрузить список точек контроля');
        }
    };

    const handleFormChange = (e) => {
        setControlPointForm({
            ...controlPointForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddControlPoint = () => {
        setCurrentControlPoint(null);
        setControlPointForm({
            name: '',
            idBuilding: buildings.length > 0 ? buildings[0].idBuilding : ''
        });
        setIsEditMode(false);
        setShowModal(true);
    };

    const handleEditControlPoint = (controlPoint) => {
        setCurrentControlPoint(controlPoint);
        setControlPointForm({
            name: controlPoint.name,
            idBuilding: controlPoint.idBuilding
        });
        setIsEditMode(true);
        setShowModal(true);
    };

    const handleDeleteControlPoint = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту точку контроля?')) {
            try {
                setProcessing(true);
                await axios.delete(`http://localhost:8080/api/admin/attendance/control-points/${id}`, {
                    withCredentials: true
                });
                await fetchControlPoints(selectedBuilding);
            } catch (err) {
                console.error('Ошибка удаления точки контроля:', err);
                setError(`Не удалось удалить точку контроля: ${err.response?.data?.message || err.message}`);
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
        if (!controlPointForm.name) errors.name = "Название обязательно";
        if (!controlPointForm.idBuilding) errors.building = "Корпус обязателен";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setProcessing(false);
            return;
        }

        try {
            const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };

            const response = isEditMode
                ? await axios.put(
                    `http://localhost:8080/api/admin/attendance/control-points/${currentControlPoint.idControlPoint}`,
                    controlPointForm,
                    config
                )
                : await axios.post(
                    'http://localhost:8080/api/admin/attendance/control-points',
                    controlPointForm,
                    config
                );

            setShowModal(false);
            await fetchControlPoints(selectedBuilding);
        } catch (err) {
            console.error('Ошибка сохранения точки контроля:', err);
            setError(`Не удалось сохранить данные: ${err.response?.data?.message || err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ color: '#2c3e50', fontSize: '1.4rem', margin: 0 }}>Список точек контроля</h2>
                <button
                    onClick={handleAddControlPoint}
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
                    Добавить точку контроля
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginRight: '10px', fontSize: '1.1rem' }}>Фильтр по корпусу:</label>
                <select
                    value={selectedBuilding || ''}
                    onChange={(e) => setSelectedBuilding(e.target.value || null)}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ced4da',
                        fontSize: '1rem'
                    }}
                >
                    <option value="">Все корпуса</option>
                    {buildings.map(building => (
                        <option key={building.idBuilding} value={building.idBuilding}>
                            {building.name}
                        </option>
                    ))}
                </select>
            </div>

            {controlPoints.length > 0 ? (
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
                            <th style={{ padding: '12px', textAlign: 'left'}}>Корпус</th>
                            <th style={{ padding: '12px', textAlign: 'left'}}>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {controlPoints.map((controlPoint, index) => (
                            <tr key={controlPoint.idControlPoint} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px'}}>{index + 1}</td>
                                <td style={{ padding: '12px'}}>{controlPoint.name}</td>
                                <td style={{ padding: '12px'}}>{controlPoint.buildingName}</td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => handleEditControlPoint(controlPoint)}
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
                                        onClick={() => handleDeleteControlPoint(controlPoint.idControlPoint)}
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
                <p style={{ fontSize: '1rem', color: '#7f8c8d' }}>Список точек контроля пуст</p>
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
                            {isEditMode ? 'Редактирование точки контроля' : 'Добавление новой точки контроля'}
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
                                    maxLength={50}
                                    value={controlPointForm.name}
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
                                    Корпус *
                                </label>
                                <select
                                    name="idBuilding"
                                    value={controlPointForm.idBuilding}
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
                                    {buildings.map(building => (
                                        <option key={building.idBuilding} value={building.idBuilding}>
                                            {building.name}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.building && (
                                    <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {validationErrors.building}
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

export default ControlPointManagement;