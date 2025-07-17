# Система контроля посещаемости студентов

Разработано программное обеспечение, которое упрощает контроль посещаемости студентов, обеспечивает удобный учёт данных и их анализ

## Функционал

### Для студентов:
- Просмотр расписания
- Формирование отчетов по посещаемости 
- Настройки учетной записи

### Для преподавателей:
- Просмотр расписания
- Функционал учета посещаемости
- Формирование отчетов по посещаемости 
- Настройки учетной записи

### Для сотрудников деканата:
- Управление учетными записями и занятиями в рамках своего факультета
- Формирование отчетов по посещаемости
- Выявление студентов с длительными пропусками
- Настройки учетной записи

### Для администраторов:
- Полное управление учетными записями всех пользователей
- Настройка организационной структуры
- Контроль всего учебного процесса
- Управление расписанием и типами занятий
- Настройка системы учета посещаемости

## Stack
### Frontend
- **Язык**: JavaScript
- **Библиотека**: React

### Backend
- **Язык**: Java
- **Фреймворк**: Spring Boot

### Database
- PostgreSQL

## API Endpoints

### Аутентификация пользователей

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/auth/user` | Информация о текущем пользователе |

### Управление учебными занятиями

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/schedule/classes` | Cписок занятий по параметрам |
| POST | `/api/admin/schedule/classes` | Создание занятия |
| PUT | `/api/admin/schedule/classes/{classId}` | Обновление занятия |
| DELETE | `/api/admin/schedule/classes/{classId}` | Удаление занятия |

### Управление статусами посещаемости

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/attendance/statuses` | Cписок статусов посещаемости |
| POST | `/api/admin/attendance/statuses` | Создание статуса посещаемости |
| PUT | `/api/admin/attendance/statuses/{id}` | Обновление статуса |
| DELETE | `/api/admin/attendance/statuses/{id}` | Удаление статуса |

### Управление зданиями

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/structure/buildings` | Cписок зданий |
| POST | `/api/admin/structure/buildings` | Создание здания |
| PUT | `/api/admin/structure/buildings/{id}` | Обновление здания |
| DELETE | `/api/admin/structure/buildings/{id}` | Удаление здания |

### Информация об аудиториях

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/staff/classrooms` | Cписок аудиторий |

### Управление аудиториями

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/structure/classrooms` | Cписок аудиторий  |
| POST | `/api/admin/structure/classrooms` | Создание аудитории |
| PUT | `/api/admin/structure/classrooms/{id}` | Обновление аудитории |
| DELETE | `/api/admin/structure/classrooms/{id}` | Удаление аудитории |

### Типы занятий

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/staff/class-types` | Cписок типов занятий |

### Управление типами занятий

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/schedule/class-types` | Cписок типов занятия  |
| POST | `/api/admin/schedule/class-types` | Создание типа занятия |
| PUT | `/api/admin/schedule/class-types/{id}` | Обновление типа занятия |
| DELETE | `/api/admin/schedule/class-types/{id}` | Удаление типа занятия |

### Управление точками контроля

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/attendance/control-points` | Cписок контрольных точек |
| POST | `/api/admin/attendance/control-points` | Создание контрольной точки |
| PUT | `/api/admin/attendance/control-points/{id}` | Обновление контрольной точки |
| DELETE | `/api/admin/attendance/control-points/{id}` | Удаление контрольной точки |

### Управление учебными планами

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/education/curriculums` | Cписок учебных планов  |
| POST | `/api/admin/education/curriculums` | Создание учебного плана |
| PUT | `/api/admin/education/curriculums/{id}` | Обновление учебного плана |
| DELETE | `/api/admin/education/curriculums/{id}` | Удаление учебного плана |

### Управление предметами в учебных планах

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/education/curriculum-subjects` | Cписок предметов для указанного учебного плана |
| POST | `/api/admin/education/curriculum-subjects` | Добавление предмета в учебный план |
| PUT | `/api/admin/education/curriculum-subjects/{subjectId}` | Обновление предмета |
| DELETE | `/api/admin/education/curriculum-subjects/{subjectId}` | Удаление предмета из учебного плана |

### Управление кафедрами и факультетами

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/structure/departments` | Cписок подразделений |
| GET | `/api/admin/structure/departments/faculties` | Cписок факультетов |
| GET | `/api/admin/structure/departments/departments` | Cписок кафедр для указанного факультета |
| POST | `/api/admin/structure/departments` | Создание подразделения |
| PUT | `/api/admin/structure/departments/{id}` | Обновление подразделения |
| DELETE | `/api/admin/structure/departments/{id}` | Удаление подразделения |

### Управление формами обучения

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/education/study-forms` | Cписок форм обучения |
| POST | `/api/admin/education/study-forms` | Создание формы обучения |
| PUT | `/api/admin/education/study-forms/{id}` | Обновление формы обучения |
| DELETE | `/api/admin/education/study-forms/{id}` | Удаление формы обучения |

### Управление учетными записями сотрудников

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/accounts/employees` | Cписок сотрудников |
| GET | `/api/admin/accounts/employees/departments` | Cписок факультетов |
| GET | `/api/admin/accounts/employees/subdepartments` | Cписок кафедр для указанного факультета |
| GET | `/api/admin/accounts/employees/positions` | Cписок должностей |
| GET | `/api/admin/accounts/employees/roles` | Cписок ролей |
| POST | `/api/admin/accounts/employees` | Создание сотрудника |
| PUT | `/api/admin/accounts/employees/{id}` | Обновление данных сотрудника |
| DELETE | `/api/admin/accounts/employees/{id}` | Удаление сотрудника |

### Управление учебными группами

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/education/groups` | Cписок групп |
| POST | `/api/admin/education/groups` | Создание группы |
| PUT | `/api/admin/education/groups/{id}` | Обновление группы |
| DELETE | `/api/admin/education/groups/{id}` | Удаление группы |

### Управление должностями сотрудников

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/structure/positions` | Cписок должностей |
| POST | `/api/admin/structure/positions` | Создание должности |
| PUT | `/api/admin/structure/positions/{id}` | Обновление должности |
| DELETE | `/api/admin/structure/positions/{id}` | Удаление должности |

### Управление ролями пользователей

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/accounts/roles` | Cписок ролей |
| POST | `/api/admin/accounts/roles` | Создание роли |
| PUT | `/api/admin/accounts/roles/{id}` | Обновление роли |
| DELETE | `/api/admin/accounts/roles/{id}` | Удаление роли |

### Управление учебными семестрами

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/education/semesters` | Cписок семестров |
| POST | `/api/admin/education/semesters` | Создание семестра |
| PUT | `/api/admin/education/semesters/{id}` | Обновление семестра |
| DELETE | `/api/admin/education/semesters/{id}` | Удаление семестра |

### Управление специализациями

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/education/specializations` | Cписок специализаций |
| POST | `/api/admin/education/specializations` | Создание специализации |
| PUT | `/api/admin/education/specializations/{id}` | Обновление специализации |
| DELETE | `/api/admin/education/specializations/{id}` | Удаление специализации |

### Управление учебными занятиями (для сотрудников деканата)

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/staff/classes/curricula` | Cписок учебных планов для текущего сотрудника |
| GET | `/api/staff/classes/groups` | Cписок групп для указанного учебного плана |
| GET | `/api/staff/classes` | Cписок занятий |
| POST | `/api/staff/classes` | Создание занятия |
| PUT | `/api/staff/classes/{classId}` | Обновление занятия |
| DELETE | `/api/staff/classes/{classId}` | Удаление занятия |

### Информация о факультете сотрудника

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/staff/faculty/info` | Название факультета сотрудника |

### Отчеты о длительных отсутствиях студентов

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/staff/long-absence` | Список студентов, которые отсутствовали дольше указанного количества дней |

### Отчеты по посещаемости студентов

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/staff/faculty` | Название факультета сотрудника |
| GET | `/api/staff/groups` | Cписок групп факультета |
| GET | `/api/staff/semesters` | Cписок семестров |
| GET | `/api/staff/reports/by-group` | Отчет по посещаемости группы |
| GET | `/api/staff/reports/by-faculty` | Отчет по посещаемости факультета |

### Управление настройками профиля сотрудника

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/staff/settings` | Информация о сотруднике |
| POST | `/api/staff/settings/change-password` | Изменение пароля сотрудника |

### Управление студентами факультета (для сотрудников деканата)

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/staff/students` | Cписок студентов факультета |
| GET | `/api/staff/students/groups` | Cписок групп факультета |
| POST | `/api/staff/students` | Создание студента |
| PUT | `/api/staff/students/{id}` | Обновление данных студента |
| DELETE | `/api/staff/students/{id}` | Удаление студента |

### Управление преподавателями факультета (для сотрудников деканата)

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/staff/teachers` | Cписок преподавателей факультета |
| GET | `/api/staff/teachers/departments` | Cписок факультетов и кафедр |
| GET | `/api/staff/teachers/positions` | Cписок должностей |
| GET | `/api/staff/teachers/roles` | Cписок доступных ролей |
| POST | `/api/staff/teachers` | Создание преподавателя |
| PUT | `/api/staff/teachers/{id}` | Обновление данных преподавателя |
| DELETE | `/api/staff/teachers/{id}` | Удаление преподавателя |

### Информация о посещаемости студента

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/student/attendance/semesters` | Cписок семестров студента |
| GET | `/api/student/attendance/subjects` | Cписок предметов для указанного семестра |
| GET | `/api/student/attendance/general` | Общая статистика посещаемости |
| GET | `/api/student/attendance/details` | Детальная статистика посещаемости по предмету |

### Управление учетными записями студентов

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/accounts/students` | Cписок студентов |
| GET | `/api/admin/accounts/students/departments` | Cписок факультетов |
| GET | `/api/admin/accounts/students/groups` | Cписок групп для указанного факультета |
| POST | `/api/admin/accounts/students` | Создание студента |
| PUT | `/api/admin/accounts/students/{id}` | Обновление данных студента |
| DELETE | `/api/admin/accounts/students/{id}` | Удаление студента |

### Расписание студента

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/student/schedule/today` | Расписание на текущий день |

### Управление настройками профиля студента

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/student/settings` | Информация о студенте |
| POST | `/api/student/settings/change-password` | Изменение пароля студента |

### Управление дисциплинами

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/admin/education/subjects` | Cписок дисциплин |
| POST | `/api/admin/education/subjects` | Создание дисциплины |
| PUT | `/api/admin/education/subjects/{id}` | Обновление дисциплины |
| DELETE | `/api/admin/education/subjects/{id}` | Удаление дисциплины |

### Работа преподавателя с посещаемостью

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/teacher/semesters` | Cписок семестров преподавателя |
| GET | `/api/teacher/subjects` | Cписок предметов для указанного семестра |
| GET | `/api/teacher/groups` | Cписок групп |
| GET | `/api/teacher/statistics` | Статистика посещаемости |
| GET | `/api/teacher/classes` | Cписок занятий |
| GET | `/api/teacher/attendance/{classId}` | Данные о посещаемости для указанного занятия |
| POST | `/api/teacher/attendance` | Сохранение данных о посещаемости |

### Расписание преподавателя

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/teacher/schedule/today` | Расписание на текущий день |

### Управление настройками профиля преподавателя

| Метод | URL | Описание |
|-------|----------|----------|
| GET | `/api/teacher/settings` | Информация о преподавателе |
| POST | `/api/teacher/settings/change-password` | Изменение пароля преподавателя |
