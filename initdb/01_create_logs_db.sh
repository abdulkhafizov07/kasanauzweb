#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE logs_db;
    CREATE USER logs_user WITH PASSWORD 'logs_password';
    GRANT ALL PRIVILEGES ON DATABASE logs_db TO logs_user;
EOSQL
