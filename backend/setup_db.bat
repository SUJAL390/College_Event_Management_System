@echo off
echo Creating PostgreSQL database for College Event Management System...

set PGPASSWORD=password
createdb -U postgres college_events

echo Database created successfully!
pause
