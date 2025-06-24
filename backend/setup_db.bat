@echo off
echo Creating PostgreSQL database...
set PGPASSWORD="your_pg_password"

psql -U postgres -c "CREATE DATABASE college_events;"
echo Database created successfully!
