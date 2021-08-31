CREATE USER expenses_admin WITH PASSWORD 'ExPMan';
CREATE DATABASE expenses_app;
GRANT ALL ON database expenses_app to expenses_admin;