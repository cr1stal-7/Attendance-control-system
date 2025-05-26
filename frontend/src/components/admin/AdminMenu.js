import { Link } from 'react-router-dom';
import { useState } from 'react';

const AdminMenu = ({ activeItem }) => {
    const [expandedSections, setExpandedSections] = useState({
        accounts: activeItem.startsWith('accounts'),
        structure: activeItem.startsWith('structure'),
        education: activeItem.startsWith('education'),
        schedule: activeItem.startsWith('schedule'),
        attendance: activeItem.startsWith('attendance')
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const isActive = (item) => activeItem === item;

    return (
        <div style={{
            width: '250px',
            backgroundColor: '#34495e',
            color: 'white',
            minHeight: '100vh',
            padding: '10px 0',
            position: 'fixed',
            overflowY: 'auto'
        }}>
            {/* Учетные записи */}
            <div style={{ borderTop: '1px solid #2c3e50', margin: '10px 0' }}></div>
            <div
                onClick={() => toggleSection('accounts')}
                style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: expandedSections.accounts ? '#2c3e50' : 'transparent'
                }}
            >
                <span style={{ fontWeight: 'bold' }}>Учетные записи</span>
                <span>{expandedSections.accounts ? '▼' : '▶'}</span>
            </div>

            {expandedSections.accounts && (
                <div style={{ paddingLeft: '15px' }}>
                    <Link
                        to="accounts/staff"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('accounts-staff') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('accounts-staff') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('accounts-staff') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Сотрудники
                    </Link>
                    <Link
                        to="accounts/students"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('accounts-students') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('accounts-students') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('accounts-students') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Студенты
                    </Link>
                    <Link
                        to="accounts/roles"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('accounts-roles') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('accounts-roles') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('accounts-roles') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Роли
                    </Link>
                </div>
            )}

            {/* Организационная структура */}
            <div style={{ borderTop: '1px solid #2c3e50', margin: '10px 0' }}></div>
            <div
                onClick={() => toggleSection('structure')}
                style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: expandedSections.structure ? '#2c3e50' : 'transparent'
                }}
            >
                <span style={{ fontWeight: 'bold' }}>Организационная структура</span>
                <span>{expandedSections.structure ? '▼' : '▶'}</span>
            </div>

            {expandedSections.structure && (
                <div style={{ paddingLeft: '15px' }}>
                    <Link
                        to="structure/departments"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('structure-departments') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('structure-departments') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('structure-departments') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Подразделения
                    </Link>
                    <Link
                        to="structure/positions"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('structure-positions') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('structure-positions') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('structure-positions') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Должности
                    </Link>
                    <Link
                        to="structure/buildings"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('structure-buildings') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('structure-buildings') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('structure-buildings') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Корпусы
                    </Link>
                    <Link
                        to="structure/classrooms"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('structure-classrooms') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('structure-classrooms') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('structure-classrooms') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Аудитории
                    </Link>
                </div>
            )}

            {/* Учебный процесс */}
            <div style={{ borderTop: '1px solid #2c3e50', margin: '10px 0' }}></div>
            <div
                onClick={() => toggleSection('education')}
                style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: expandedSections.education ? '#2c3e50' : 'transparent'
                }}
            >
                <span style={{ fontWeight: 'bold' }}>Учебный процесс</span>
                <span>{expandedSections.education ? '▼' : '▶'}</span>
            </div>

            {expandedSections.education && (
                <div style={{ paddingLeft: '15px' }}>
                    <div style={{ padding: '8px 20px', fontWeight: 'bold', fontSize: '0.9rem' }}>Направления и группы</div>
                    <Link
                        to="education/specializations"
                        style={{
                            display: 'block',
                            padding: '8px 35px',
                            color: isActive('education-specializations') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-specializations') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-specializations') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        Направления
                    </Link>
                    <Link
                        to="education/study-forms"
                        style={{
                            display: 'block',
                            padding: '8px 35px',
                            color: isActive('education-study-forms') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-study-forms') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-study-forms') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        Формы обучения
                    </Link>
                    <Link
                        to="education/groups"
                        style={{
                            display: 'block',
                            padding: '8px 35px',
                            color: isActive('education-groups') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-groups') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-groups') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        Группы студентов
                    </Link>

                    <div style={{ padding: '8px 20px', fontWeight: 'bold', fontSize: '0.9rem' }}>Учебные планы и дисциплины</div>
                    <Link
                        to="education/study-plans"
                        style={{
                            display: 'block',
                            padding: '8px 35px',
                            color: isActive('education-study-plans') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-study-plans') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-study-plans') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        Учебные планы
                    </Link>
                    <Link
                        to="education/disciplines"
                        style={{
                            display: 'block',
                            padding: '8px 35px',
                            color: isActive('education-disciplines') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-disciplines') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-disciplines') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        Дисциплины
                    </Link>
                    <Link
                        to="education/plan-disciplines"
                        style={{
                            display: 'block',
                            padding: '8px 35px',
                            color: isActive('education-plan-disciplines') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-plan-disciplines') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-plan-disciplines') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        Дисциплины в учебном плане
                    </Link>
                    <Link
                        to="education/semesters"
                        style={{
                            display: 'block',
                            padding: '8px 35px',
                            color: isActive('education-semesters') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-semesters') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-semesters') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        Семестры
                    </Link>
                </div>
            )}

            {/* Расписание и занятия */}
            <div style={{ borderTop: '1px solid #2c3e50', margin: '10px 0' }}></div>
            <div
                onClick={() => toggleSection('schedule')}
                style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: expandedSections.schedule ? '#2c3e50' : 'transparent'
                }}
            >
                <span style={{ fontWeight: 'bold' }}>Расписание и занятия</span>
                <span>{expandedSections.schedule ? '▼' : '▶'}</span>
            </div>

            {expandedSections.schedule && (
                <div style={{ paddingLeft: '15px' }}>
                    <Link
                        to="schedule/classes"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('schedule-classes') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('schedule-classes') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('schedule-classes') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Занятия
                    </Link>
                    <Link
                        to="schedule/class-types"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('schedule-class-types') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('schedule-class-types') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('schedule-class-types') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Типы занятий
                    </Link>
                </div>
            )}

            {/* Посещаемость и контроль */}
            <div style={{ borderTop: '1px solid #2c3e50', margin: '10px 0' }}></div>
            <div
                onClick={() => toggleSection('attendance')}
                style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: expandedSections.attendance ? '#2c3e50' : 'transparent'
                }}
            >
                <span style={{ fontWeight: 'bold' }}>Посещаемость и контроль</span>
                <span>{expandedSections.attendance ? '▼' : '▶'}</span>
            </div>

            {expandedSections.attendance && (
                <div style={{ paddingLeft: '15px' }}>
                    <Link
                        to="attendance/statuses"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('attendance-statuses') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('attendance-statuses') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('attendance-statuses') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Статусы посещаемости
                    </Link>
                    <Link
                        to="attendance/control-points"
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: isActive('attendance-control-points') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('attendance-control-points') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('attendance-control-points') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        Точки контроля
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;