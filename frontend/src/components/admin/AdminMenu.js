import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
    FaUsers, FaUserTie, FaUserGraduate, FaUserShield,
    FaSitemap, FaBriefcase, FaBuilding, FaChalkboard,
    FaBook, FaGraduationCap, FaUsersCog, FaClipboardList,
    FaCalendarAlt, FaChalkboardTeacher, FaClipboardCheck,
    FaListAlt, FaCheckCircle, FaRegCalendarCheck
} from 'react-icons/fa';

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
            padding: '10px 0'
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaUsers size={16} />
                    <span style={{ fontWeight: 'bold' }}>Учетные записи</span>
                </div>
                <span>{expandedSections.accounts ? '▼' : '▶'}</span>
            </div>

            {expandedSections.accounts && (
                <div style={{ paddingLeft: '15px' }}>
                    <Link
                        to="accounts/employees"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('accounts-employees') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('accounts-employees') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('accounts-employees') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaUserTie size={14} />
                        Сотрудники
                    </Link>
                    <Link
                        to="accounts/students"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('accounts-students') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('accounts-students') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('accounts-students') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaUserGraduate size={14} />
                        Студенты
                    </Link>
                    <Link
                        to="accounts/roles"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('accounts-roles') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('accounts-roles') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('accounts-roles') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaUserShield size={14} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaSitemap size={16} />
                    <span style={{ fontWeight: 'bold' }}>Организационная структура</span>
                </div>
                <span>{expandedSections.structure ? '▼' : '▶'}</span>
            </div>

            {expandedSections.structure && (
                <div style={{ paddingLeft: '15px' }}>
                    <Link
                        to="structure/departments"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('structure-departments') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('structure-departments') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('structure-departments') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaBuilding size={14} />
                        Подразделения
                    </Link>
                    <Link
                        to="structure/positions"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('structure-positions') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('structure-positions') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('structure-positions') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaBriefcase size={14} />
                        Должности
                    </Link>
                    <Link
                        to="structure/buildings"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('structure-buildings') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('structure-buildings') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('structure-buildings') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaBuilding size={14} />
                        Корпуса
                    </Link>
                    <Link
                        to="structure/classrooms"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('structure-classrooms') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('structure-classrooms') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('structure-classrooms') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaChalkboard size={14} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaBook size={16} />
                    <span style={{ fontWeight: 'bold' }}>Учебный процесс</span>
                </div>
                <span>{expandedSections.education ? '▼' : '▶'}</span>
            </div>

            {expandedSections.education && (
                <div style={{ paddingLeft: '15px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 20px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}>
                        <FaUsersCog size={14} />
                        Направления и группы
                    </div>
                    <Link
                        to="education/specializations"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 35px',
                            color: isActive('education-specializations') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-specializations') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-specializations') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        <FaGraduationCap size={14} />
                        Направления
                    </Link>
                    <Link
                        to="education/study-forms"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 35px',
                            color: isActive('education-study-forms') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-study-forms') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-study-forms') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        <FaClipboardList size={14} />
                        Формы обучения
                    </Link>
                    <Link
                        to="education/groups"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 35px',
                            color: isActive('education-groups') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-groups') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-groups') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        <FaUsers size={14} />
                        Группы студентов
                    </Link>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 20px',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}>
                        <FaBook size={14} />
                        Учебные планы и дисциплины
                    </div>
                    <Link
                        to="education/curriculums"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 35px',
                            color: isActive('education-curriculums') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-curriculums') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-curriculums') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        <FaListAlt size={14} />
                        Учебные планы
                    </Link>
                    <Link
                        to="education/curriculum-subjects"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 35px',
                            color: isActive('education-curriculum-subjects') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-curriculum-subjects') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-curriculum-subjects') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        <FaCheckCircle size={14} />
                        Дисциплины в учебном плане
                    </Link>
                    <Link
                        to="education/subjects"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 35px',
                            color: isActive('education-subject') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-subject') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-subject') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        <FaBook size={14} />
                        Дисциплины
                    </Link>
                    <Link
                        to="education/semesters"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 35px',
                            color: isActive('education-semesters') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('education-semesters') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('education-semesters') ? 'bold' : 'normal',
                            fontSize: '0.9rem'
                        }}
                    >
                        <FaRegCalendarCheck size={14} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaCalendarAlt size={16} />
                    <span style={{ fontWeight: 'bold' }}>Расписание и занятия</span>
                </div>
                <span>{expandedSections.schedule ? '▼' : '▶'}</span>
            </div>

            {expandedSections.schedule && (
                <div style={{ paddingLeft: '15px' }}>
                    <Link
                        to="schedule/classes"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('schedule-classes') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('schedule-classes') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('schedule-classes') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaChalkboardTeacher size={14} />
                        Занятия
                    </Link>
                    <Link
                        to="schedule/class-types"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('schedule-class-types') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('schedule-class-types') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('schedule-class-types') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaListAlt size={14} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaClipboardCheck size={16} />
                    <span style={{ fontWeight: 'bold' }}>Посещаемость и контроль</span>
                </div>
                <span>{expandedSections.attendance ? '▼' : '▶'}</span>
            </div>

            {expandedSections.attendance && (
                <div style={{ paddingLeft: '15px' }}>
                    <Link
                        to="attendance/statuses"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('attendance-statuses') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('attendance-statuses') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('attendance-statuses') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaCheckCircle size={14} />
                        Статусы посещаемости
                    </Link>
                    <Link
                        to="attendance/control-points"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 20px',
                            color: isActive('attendance-control-points') ? '#3498db' : 'white',
                            textDecoration: 'none',
                            backgroundColor: isActive('attendance-control-points') ? '#2c3e50' : 'transparent',
                            fontWeight: isActive('attendance-control-points') ? 'bold' : 'normal',
                            fontSize: '0.95rem'
                        }}
                    >
                        <FaClipboardCheck size={14} />
                        Точки контроля
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminMenu;