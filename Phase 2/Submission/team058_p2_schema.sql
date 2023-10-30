CREATE USER IF NOT EXISTS 'team58'@'localhost' IDENTIFIED BY 'team58isthebest';
DROP DATABASE IF EXISTS `cs6400_fa23_team58`;
SET default_storage_engine=InnoDB;
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS cs6400_fa23_team58
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;
USE cs6400_fa23_team58;
GRANT SELECT, INSERT, UPDATE, DELETE, FILE ON *.* TO 'team58'@'localhost';
GRANT ALL PRIVILEGES ON `team58@localhost`.* TO 'team58'@'localhost';
GRANT ALL PRIVILEGES ON `cs6400_fa23_team58`.* TO 'team58'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE User(
username varchar(50) NOT NULL,
password varchar(50) NOT NULL,
firstName varchar(50) NOT NULL,
lastName varchar(50) NOT NULL,
PRIMARY KEY (username)
);

CREATE TABLE Owner(
username varchar(50) NOT NULL,
PRIMARY KEY (username),
FOREIGN KEY (username) REFERENCES User(username)
);

CREATE TABLE Manager(
username varchar(50) NOT NULL,
PRIMARY KEY (username),
FOREIGN KEY (username) REFERENCES User(username)
);

CREATE TABLE Salesperson(
username varchar(50) NOT NULL,
PRIMARY KEY (username),
FOREIGN KEY (username) REFERENCES User(username)
);

CREATE TABLE InventoryClerk(
username varchar(50) NOT NULL,
PRIMARY KEY (username),
FOREIGN KEY (username) REFERENCES User(username)
);

CREATE TABLE Vehicle(
vin varchar(50) NOT NULL,
modelYear int NOT NULL,
modelName varchar(50) NOT NULL,
fuelType ENUM('Gas', 'Diesel', 'Natural Gas', 'Hybrid', 'Plugin Hybrid', 'Battery','Fuel Cell') NOT NULL,
mileage int NOT NULL,
description varchar(1000) NULL,
carCondition ENUM('Excellent', 'Very Good', 'Good', 'Fair') NOT NULL,
PRIMARY KEY (vin)
);

CREATE TABLE VehicleColor(
color varchar(50) NOT NULL,
PRIMARY KEY (color)
);

CREATE TABLE VehicleType(
type varchar(50) NOT NULL,
PRIMARY KEY (type)
);

CREATE TABLE Manufacturer(
company varchar(50) NOT NULL,
PRIMARY KEY (company)
);

CREATE TABLE Customer (
customerID int unsigned NOT NULL AUTO_INCREMENT,
email varchar(50) NULL,
phoneNUmber varchar(50) NOT NULL,
street varchar(50) NOT NULL,
city varchar(50) NOT NULL,
state varchar(50) NOT NULL,
postalCode varchar(50) NOT NULL,
PRIMARY KEY (customerID)
);


CREATE TABLE Business(
taxID varchar(50) NOT NULL,
businessName  varchar(50) NOT NULL,
name varchar(50) NOT NULL,
title varchar(50) NOT NULL,
customerID int unsigned NOT NULL,
PRIMARY KEY (taxID),
FOREIGN KEY (customerID) REFERENCES Customer(customerID)
);

CREATE TABLE Individual(
driverLicense varchar(50) NOT NULL,
firstName varchar(50) NOT NULL,
lastName varchar(50) NOT NULL,
customerID int unsigned NOT NULL,
PRIMARY KEY(driverLicense),
FOREIGN KEY (customerID) REFERENCES Customer(customerID)
);

CREATE TABLE Vendor(
name varchar(50) NOT NULL,
phoneNumber varchar(15) NOT NULL,
street varchar(50) NOT NULL,
city varchar(50) NOT NULL,
state varchar(20) NOT NULL,
postalCode varchar(15) NOT NULL,
PRIMARY KEY (name)
);

CREATE TABLE PartOrder(
vin varchar(50) NOT NULL,
orderNumber varchar(50) NOT NULL,
username varchar(50) NOT NULL,
vendorName varchar(50) NOT NULL,
FOREIGN KEY (vendorName) REFERENCES Vendor (name),
FOREIGN KEY (vin) REFERENCES Vehicle (vin),
FOREIGN KEY (username) REFERENCES User(username),
PRIMARY KEY (vin, orderNumber)
);


CREATE TABLE Part(
partNumber varchar(50) NOT NULL,
vin varchar(50) NOT NULL,
orderNumber varchar(50) NOT NULL,
quantity int NOT NULL,
status ENUM('ordered', 'received', 'installed') NOT NULL,
description varchar(500) NOT NULL,
cost DECIMAL(10,2) NOT NULL,
PRIMARY KEY (vin, orderNumber, partNumber),
FOREIGN KEY (vin) REFERENCES Vehicle (vin),
FOREIGN KEY (vin, orderNumber) REFERENCES PartOrder(vin, orderNumber)
);

-- Customer Sells_To InventoryClerk
CREATE TABLE Sells_To(
customerID int unsigned NOT NULL,
username varchar(50) NOT NULL,
vin varchar(50) NOT NULL,
purchaseDate date NOT NULL,
purchasePrice Decimal(10,2) NOT NULL,
FOREIGN KEY (userName) REFERENCES InventoryClerk (username),
FOREIGN KEY (customerID) REFERENCES Customer (customerID),
FOREIGN KEY (vin) REFERENCES Vehicle (vin),
PRIMARY KEY(customerID,username,purchaseDate)
);

-- Customer Buys_From Salesperson
CREATE TABLE Buys_From(
customerID int unsigned NOT NULL,
username varchar(50) NOT NULL,
vin varchar(50) NOT NULL,
transactionDate date NOT NULL,
FOREIGN KEY (userName) REFERENCES Salesperson (username),
FOREIGN KEY (customerID) REFERENCES Customer (customerID),
FOREIGN KEY (vin) REFERENCES Vehicle (vin),
PRIMARY KEY(customerID,userName,transactionDate)
);

CREATE TABLE Of_Type(
vin varchar(50) NOT NULL,
type Varchar (50) NOT NULL,
FOREIGN KEY (vin) REFERENCES Vehicle (vin),
FOREIGN KEY (type) REFERENCES VehicleType (type),
PRIMARY KEY(vin)
);

CREATE TABLE Manufactured_By(
vin varchar(50) NOT NULL,
company varchar(50) NOT NULL,
FOREIGN KEY (vin) REFERENCES Vehicle (vin),
FOREIGN KEY (company) REFERENCES Manufacturer (company),
PRIMARY KEY(vin)
);

CREATE TABLE Of_Color(
vin varchar(50) NOT NULL,
color varchar(15) NOT NULL,
PRIMARY KEY (vin, color),
FOREIGN KEY (vin) REFERENCES Vehicle (vin),
FOREIGN KEY (color) REFERENCES VehicleColor(color)
);

INSERT INTO VehicleColor (color)
VALUES ('Aluminum'), ('Beige'), ('Black'), ('Blue'), ('Brown'), ('Bronze'), ('Claret'), ('Copper'), ('Cream'), ('Gold'), ('Gray'), ('Green'), ('Maroon'), ('Metallic'), ('Navy'), ('Orange'), ('Pink'), ('Purple'), ('Red'), ('Rose'), ('Rust'), ('Silver'), ('Tan'), ('Turquoise'), ('White'), ('Yellow');

INSERT INTO Manufacturer(company)
VALUES ('Acura'),('Alfa'), ('Romeo'), ('Aston'), ('Martin'), ('Audi'), ('Bentley'), ('BMW'), ('Buick'), ('Cadillac'), ('Chevrolet'), ('Chrysler'), ('Dodge'), ('Ferrari'), ('FIAT'), ('Ford'), ('Geeley'), ('Genesis'), ('GMC'), ('Honda'), ('Hyundai'), ('INFINITI'), ('Jaguar'), ('Jeep'), ('Karma'), ('Kia'), ('Lamborghini'), ('Land Rover'), ('Lexus'), ('Lincoln'), ('Lotus'), ('Maserati'), ('MAZDA'), ('McLaren'), ('Mercedes-Benz'), ('MINI'), ('Mitsubishi'), ('Nissan'), ('Nio'), ('Porsche'), ('Ram'), ('Rivian'), ('Rolls-Royce'), ('smart'), ('Subaru'), ('Tesla'), ('Toyota'), ('Volkswagen'), ('Volvo'), ('XPeng');

INSERT INTO VehicleType(type) 
VALUES ('Sedan'), ('Coupe'), ('Convertible'), ('Truck'), ('Van'), ('Minivan'), ('SUV'), ('Other');
