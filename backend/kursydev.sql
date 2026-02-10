-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 11, 2026 at 12:30 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kursydev`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `basket`
--

CREATE TABLE `basket` (
  `UserID` int(11) NOT NULL,
  `CourseID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `basket`
--

INSERT INTO `basket` (`UserID`, `CourseID`) VALUES
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 1),
(7, 2),
(8, 3),
(9, 4),
(10, 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `categories`
--

CREATE TABLE `categories` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`ID`, `Name`) VALUES
(1, 'Programowanie'),
(2, 'Design'),
(3, 'Marketing');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `categoriessubcategories`
--

CREATE TABLE `categoriessubcategories` (
  `CategoryID` int(11) NOT NULL,
  `SubcategoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categoriessubcategories`
--

INSERT INTO `categoriessubcategories` (`CategoryID`, `SubcategoryID`) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(3, 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `courses`
--

CREATE TABLE `courses` (
  `ID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `Image` text NOT NULL,
  `Price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`ID`, `Title`, `Description`, `Image`, `Price`) VALUES
(1, 'Kurs PHP od podstaw', 'Backend w PHP i MySQL', 'https://i.ytimg.com/vi/lKb6qdNP-eE/maxresdefault.jpg', 199.99),
(2, 'React dla początkujących', 'Frontend w React', 'https://i.ytimg.com/vi/lKb6qdNP-eE/maxresdefault.jpg', 249.99),
(3, 'UI/UX Design', 'Projektowanie interfejsów', 'https://i.ytimg.com/vi/lKb6qdNP-eE/maxresdefault.jpg', 179.99),
(4, 'SEO w praktyce', 'Pozycjonowanie stron', 'https://i.ytimg.com/vi/lKb6qdNP-eE/maxresdefault.jpg', 149.99),
(5, 'Social Media Marketing', 'Marketing na Facebook i Instagram', 'https://i.ytimg.com/vi/lKb6qdNP-eE/maxresdefault.jpg', 129.99);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `coursessubcategories`
--

CREATE TABLE `coursessubcategories` (
  `CourseID` int(11) NOT NULL,
  `CategoryID` int(11) NOT NULL,
  `SubcategoryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coursessubcategories`
--

INSERT INTO `coursessubcategories` (`CourseID`, `CategoryID`, `SubcategoryID`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 3, 4),
(5, 3, 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `mycourses`
--

CREATE TABLE `mycourses` (
  `UserID` int(11) NOT NULL,
  `CourseID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mycourses`
--

INSERT INTO `mycourses` (`UserID`, `CourseID`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `refreshtokens`
--

CREATE TABLE `refreshtokens` (
  `ID` int(11) NOT NULL,
  `Token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `subcategories`
--

CREATE TABLE `subcategories` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`ID`, `Name`) VALUES
(1, 'Backend'),
(2, 'Frontend'),
(3, 'UI/UX'),
(4, 'SEO'),
(5, 'Social Media');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `email`, `created_at`) VALUES
(1, 'Jan', 'pass123', '', '2026-02-10 23:06:17'),
(2, 'Anna', 'pass123', '', '2026-02-10 23:06:17'),
(3, 'Piotr', 'pass123', '', '2026-02-10 23:06:17'),
(4, 'Katarzyna', 'pass123', '', '2026-02-10 23:06:17'),
(5, 'Tomasz', 'pass123', '', '2026-02-10 23:06:17'),
(6, 'Agnieszka', 'pass123', '', '2026-02-10 23:06:17'),
(7, 'Michał', 'pass123', '', '2026-02-10 23:06:17'),
(8, 'Monika', 'pass123', '', '2026-02-10 23:06:17'),
(9, 'Paweł', 'pass123', '', '2026-02-10 23:06:17'),
(10, 'Karolina', 'pass123', '', '2026-02-10 23:06:17'),
(11, 'Krystian Tomczyk', '$2b$10$wl9q5C3vQYL2TZlPs/Ih9uoPlrCcGzVxslH6Z7XBctpnFi9Z4XuYK', 'krystian.tomczyk@tm1.edu.pl', '2026-02-10 23:18:04');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `basket`
--
ALTER TABLE `basket`
  ADD PRIMARY KEY (`UserID`,`CourseID`),
  ADD KEY `CourseID` (`CourseID`);

--
-- Indeksy dla tabeli `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `categoriessubcategories`
--
ALTER TABLE `categoriessubcategories`
  ADD PRIMARY KEY (`CategoryID`,`SubcategoryID`),
  ADD KEY `SubcategoryID` (`SubcategoryID`);

--
-- Indeksy dla tabeli `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `coursessubcategories`
--
ALTER TABLE `coursessubcategories`
  ADD PRIMARY KEY (`CourseID`,`CategoryID`,`SubcategoryID`),
  ADD KEY `CategoryID` (`CategoryID`,`SubcategoryID`);

--
-- Indeksy dla tabeli `mycourses`
--
ALTER TABLE `mycourses`
  ADD PRIMARY KEY (`UserID`,`CourseID`),
  ADD KEY `CourseID` (`CourseID`);

--
-- Indeksy dla tabeli `refreshtokens`
--
ALTER TABLE `refreshtokens`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`ID`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `refreshtokens`
--
ALTER TABLE `refreshtokens`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `basket`
--
ALTER TABLE `basket`
  ADD CONSTRAINT `basket_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  ADD CONSTRAINT `basket_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`ID`);

--
-- Constraints for table `categoriessubcategories`
--
ALTER TABLE `categoriessubcategories`
  ADD CONSTRAINT `categoriessubcategories_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`ID`),
  ADD CONSTRAINT `categoriessubcategories_ibfk_2` FOREIGN KEY (`SubcategoryID`) REFERENCES `subcategories` (`ID`);

--
-- Constraints for table `coursessubcategories`
--
ALTER TABLE `coursessubcategories`
  ADD CONSTRAINT `coursessubcategories_ibfk_1` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`ID`),
  ADD CONSTRAINT `coursessubcategories_ibfk_2` FOREIGN KEY (`CategoryID`,`SubcategoryID`) REFERENCES `categoriessubcategories` (`CategoryID`, `SubcategoryID`);

--
-- Constraints for table `mycourses`
--
ALTER TABLE `mycourses`
  ADD CONSTRAINT `mycourses_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  ADD CONSTRAINT `mycourses_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
