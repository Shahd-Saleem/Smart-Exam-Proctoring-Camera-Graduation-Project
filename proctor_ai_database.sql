CREATE DATABASE proctor_ai;
USE proctor_ai;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(10) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE alerts (
    id BIGINT PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    confidence INT NOT NULL,
    time VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    detail VARCHAR(255) NOT NULL,
    snapshot LONGTEXT NOT NULL,
    resolution VARCHAR(20) DEFAULT 'pending'
);

select * from users;
ALTER TABLE alerts ADD COLUMN proctor_name VARCHAR(100) DEFAULT 'Unknown';
select * from alerts;
