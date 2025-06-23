@echo off
echo Creating PostgreSQL database...
set PGPASSWORD=CLFA63827S

psql -U postgres -c "CREATE DATABASE college_events;"
echo Database created successfully!
