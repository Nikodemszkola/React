CREATE DATABASE KursyDev;
USE KursyDev;

CREATE TABLE `AccessTokens` (
  `Token` TEXT NOT NULL,
  PRIMARY KEY (`Token`(255))
);

CREATE TABLE `Categories` (
  `Name` TEXT NOT NULL,
  PRIMARY KEY (`Name`(255))
);

CREATE TABLE `Subcategories` (
  `Name` TEXT NOT NULL,
  PRIMARY KEY (`Name`(255))
);

CREATE TABLE `CategoriesSubcategories` (
  `CategoryName` VARCHAR(255) NOT NULL,
  `SubcategoryName` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`CategoryName`, `SubcategoryName`),
  FOREIGN KEY (`CategoryName`)
      REFERENCES `Categories`(`Name`),
  FOREIGN KEY (`SubcategoryName`)
      REFERENCES `Subcategories`(`Name`)
);

CREATE TABLE `Courses` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(255) NOT NULL,
  `Description` TEXT NOT NULL,
  `Image` VARCHAR(255) NOT NULL,
  `Price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`ID`)
);

CREATE TABLE `CoursesSubcategories` (
  `CourseID` INT NOT NULL,
  `CategoryName` TINYTEXT NOT NULL,
  `SubcategoryName` TINYTEXT NOT NULL,
  PRIMARY KEY (`CourseID`, `CategoryName`(255), `SubcategoryName`(255)),
  FOREIGN KEY (`CourseID`)
      REFERENCES `Courses`(`ID`),
  FOREIGN KEY (`CategoryName`, `SubcategoryName`)
      REFERENCES `CategoriesSubcategories`(`CategoryName`, `SubcategoryName`)
);

CREATE TABLE `Users` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` TINYTEXT NOT NULL,
  `Surname` TINYTEXT NOT NULL,
  `Password` TEXT NOT NULL,
  PRIMARY KEY (`ID`)
);

CREATE TABLE `Basket` (
  `UserID` INT NOT NULL,
  `CourseID` INT NOT NULL,
  PRIMARY KEY (`UserID`),
  FOREIGN KEY (`UserID`)
      REFERENCES `Users`(`ID`),
  FOREIGN KEY (`CourseID`)
      REFERENCES `Courses`(`ID`)
);

