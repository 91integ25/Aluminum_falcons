CREATE DATABASE stocks;

CREATE TABLE stocks (
    ID int NOT NULL,
    userName varchar(255) NOT NULL,
    ticker varchar(255) NOT NULL,
    purchase boolean NOT NULL Default false,
    PRIMARY KEY (ID)
);

USE stocks;

