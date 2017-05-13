CREATE DATABASE users;

CREATE TABLE users (
    ID int NOT NULL,
    userName varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (ID)
);

USE users;

SELECT *
FROM users;