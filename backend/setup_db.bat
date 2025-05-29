REM filepath: c:\Users\97798\Desktop\Esewa\college_event_management_system\college_event_management_system\backend\setup_db.bat
@echo off
echo Creating PostgreSQL database for College Event Management System...

REM Password should be set via environment variable before running this script
REM Example: set PGPASSWORD=your_password
createdb -U postgres college_events

echo Database created successfully!
pause
