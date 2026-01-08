CREATE DATABASE KursyDev;
USE KursyDev;

-- ---------------
CREATE TABLE `RefreshTokens` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Token` TEXT,
  PRIMARY KEY (`ID`)
);

-- ---------------
CREATE TABLE `Categories` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255),
  PRIMARY KEY (`ID`)
);
INSERT INTO Categories (Name) VALUES
('Programowanie'),
('Design'),
('Marketing');

-- ---------------
CREATE TABLE `Subcategories` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255),
  PRIMARY KEY (`ID`)
);
INSERT INTO Subcategories (Name) VALUES
('Backend'),
('Frontend'),
('UI/UX'),
('SEO'),
('Social Media');

-- ---------------
CREATE TABLE `CategoriesSubcategories` (
  `CategoryID` INT NOT NULL,
  `SubcategoryID` INT NOT NULL,
  PRIMARY KEY (`CategoryID`, `SubcategoryID`),
  FOREIGN KEY (`CategoryID`)
      REFERENCES `Categories`(`ID`),
  FOREIGN KEY (`SubcategoryID`)
      REFERENCES `Subcategories`(`ID`)
);
INSERT INTO CategoriesSubcategories (CategoryID, SubcategoryID) VALUES
(1, 1), -- Programowanie / Backend
(1, 2), -- Programowanie / Frontend
(2, 3), -- Design / UI/UX
(3, 4), -- Marketing / SEO
(3, 5); -- Marketing / Social Media

-- ---------------
CREATE TABLE `Courses` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(255) NOT NULL,
  `Description` TEXT NOT NULL,
  `Image` TEXT NOT NULL,
  `Price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`ID`)
);
INSERT INTO Courses (Title, Description, Image, Price) VALUES
('Kurs PHP od podstaw', 'Backend w PHP i MySQL', 'php.jpg', 199.99),
('React dla początkujących', 'Frontend w React', 'react.jpg', 249.99),
('UI/UX Design', 'Projektowanie interfejsów', 'uiux.jpg', 179.99),
('SEO w praktyce', 'Pozycjonowanie stron', 'seo.jpg', 149.99),
('Social Media Marketing', 'Marketing na Facebook i Instagram', 'social.jpg', 129.99);

-- ---------------
CREATE TABLE `CoursesSubcategories` (
  `CourseID` INT NOT NULL,
  `CategoryID` INT NOT NULL,
  `SubcategoryID` INT NOT NULL,
  PRIMARY KEY (`CourseID`, `CategoryID`, `SubcategoryID`),
  FOREIGN KEY (`CourseID`)
      REFERENCES `Courses`(`ID`),
  FOREIGN KEY (`CategoryID`, `SubcategoryID`)
      REFERENCES `CategoriesSubcategories`(`CategoryID`, `SubcategoryID`)
);
INSERT INTO CoursesSubcategories (CourseID, CategoryID, SubcategoryID) VALUES
(1, 1, 1), -- PHP -> Programowanie / Backend
(2, 1, 2), -- React -> Programowanie / Frontend
(3, 2, 3), -- UI/UX -> Design / UI/UX
(4, 3, 4), -- SEO -> Marketing / SEO
(5, 3, 5); -- Social Media -> Marketing / Social Media

-- ---------------
CREATE TABLE `Users` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255) NOT NULL,
  `Surname` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`ID`)
);
INSERT INTO Users (Name, Surname, Password) VALUES
('Jan', 'Kowalski', 'pass123'),
('Anna', 'Nowak', 'pass123'),
('Piotr', 'Wiśniewski', 'pass123'),
('Katarzyna', 'Wójcik', 'pass123'),
('Tomasz', 'Kamiński', 'pass123'),
('Agnieszka', 'Lewandowska', 'pass123'),
('Michał', 'Dąbrowski', 'pass123'),
('Monika', 'Zielińska', 'pass123'),
('Paweł', 'Szymański', 'pass123'),
('Karolina', 'Woźniak', 'pass123');

-- ---------------
CREATE TABLE `Basket` (
  `UserID` INT NOT NULL,
  `CourseID` INT NOT NULL,
  PRIMARY KEY (`UserID`,`CourseID`),
  FOREIGN KEY (`UserID`)
      REFERENCES `Users`(`ID`),
  FOREIGN KEY (`CourseID`)
      REFERENCES `Courses`(`ID`)
);
INSERT INTO Basket (UserID, CourseID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 1),
(7, 2),
(8, 3),
(9, 4),
(10, 5);
