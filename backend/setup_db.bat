@echo off
echo Creating PostgreSQL database...
set PGPASSWORD=your_password
psql -U postgres -c "DROP DATABASE IF EXISTS college_events;"
psql -U postgres -c "CREATE DATABASE college_events;"
echo Database created successfully!
