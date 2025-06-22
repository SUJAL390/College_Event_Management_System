@echo off
echo Creating PostgreSQL database...
set PGPASSWORD="kabinshrestha"

psql -U postgres -c "CREATE DATABASE college_events;"
echo Database created successfully!
