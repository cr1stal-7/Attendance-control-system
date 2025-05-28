import { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
    const [adminName, setAdminName] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                // const response = await axios.get('http://localhost:8080/api/admin', {
                //     withCredentials: true
                // });
                // const admin = response.data;
                // const name = `${admin.surname || ''} ${admin.name || ''} ${admin.secondName || ''}`.trim();
                setAdminName('');
            } catch (err) {
                console.error('Ошибка при получении данных администратора:', err);
            }
        };
        fetchAdminName();
    }, []);

    const getActiveItem = () => {
        const path = location.pathname;
        // Учетные записи
        if (path.includes('accounts/employees')) return 'accounts-employees';
        if (path.includes('accounts/students')) return 'accounts-students';
        if (path.includes('accounts/roles')) return 'accounts-roles';
        // Организационная структура
        if (path.includes('structure/departments')) return 'structure-departments';
        if (path.includes('structure/positions')) return 'structure-positions';
        if (path.includes('structure/buildings')) return 'structure-buildings';
        if (path.includes('structure/classrooms')) return 'structure-classrooms';
        // Учебный процесс
        if (path.includes('education/specializations')) return 'education-specializations';
        if (path.includes('education/study-forms')) return 'education-study-forms';
        if (path.includes('education/groups')) return 'education-groups';
        if (path.includes('education/curriculums')) return 'education-curriculums';
        if (path.includes('education/subjects')) return 'education-subject';
        if (path.includes('education/curriculum-subjects')) return 'education-curriculum-subjects';
        if (path.includes('education/semesters')) return 'education-semesters';
        // Расписание и занятия
        if (path.includes('schedule/classes')) return 'schedule-classes';
        if (path.includes('schedule/class-types')) return 'schedule-class-types';
        // Посещаемость и контроль
        if (path.includes('attendance/statuses')) return 'attendance-statuses';
        if (path.includes('attendance/control-points')) return 'attendance-control-points';
        return 'dashboard';
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        }}>
            <AdminHeader adminName={adminName} />

            <div style={{ display: 'flex', flex: 1 }}>
                <AdminMenu activeItem={getActiveItem()} />

                <div style={{
                    flex: 1,
                    padding: '20px',
                    marginLeft: '250px',
                    fontFamily: 'Arial, sans-serif',
                    maxWidth: 'calc(100% - 250px)'
                }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;