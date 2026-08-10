-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 10, 2026 at 07:14 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `filmora`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_dashboard`
--

CREATE TABLE `admin_dashboard` (
  `admin_id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `isAdmin` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin_dashboard`
--

INSERT INTO `admin_dashboard` (`admin_id`, `email`, `password`, `isAdmin`) VALUES
(1, 'abhay@admin.com', 'abhay@admin0511', '2026-08-05 06:07:16');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `category_description` varchar(150) NOT NULL,
  `category_type` varchar(50) NOT NULL,
  `category_display` varchar(50) NOT NULL,
  `tems` varchar(50) NOT NULL,
  `category_status` int(50) NOT NULL,
  `category_Icon` varchar(50) NOT NULL,
  `category_thumbnail` varchar(150) NOT NULL,
  `isCategory` timestamp NOT NULL DEFAULT current_timestamp(),
  `c_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_name`, `slug`, `category_description`, `category_type`, `category_display`, `tems`, `category_status`, `category_Icon`, `category_thumbnail`, `isCategory`, `c_id`) VALUES
('Action', 'action', 'Action', 'Movies & Series', '1', '0', 0, 'fa-bolt', 'images_1.jpg', '2026-08-06 05:03:22', 1);

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `movie_id` varchar(255) NOT NULL,
  `movie_name` varchar(50) NOT NULL,
  `movie_description` varchar(150) NOT NULL,
  `movie_access` varchar(25) NOT NULL,
  `movie_language` varchar(50) NOT NULL,
  `movie_categories` varchar(50) NOT NULL,
  `movie_release_date` varchar(25) NOT NULL,
  `movie_duration` varchar(50) NOT NULL,
  `movie_status` varchar(50) NOT NULL,
  `movie_thumbnail` varchar(150) NOT NULL,
  `movie_poster` varchar(150) NOT NULL,
  `Ishomepage` tinyint(1) NOT NULL,
  `Isposter` tinyint(1) NOT NULL,
  `movie_release_year` year(4) NOT NULL,
  `seo_title` varchar(50) NOT NULL,
  `seo_keywords` varchar(50) NOT NULL,
  `seo_description` varchar(150) NOT NULL,
  `review` double NOT NULL,
  `view` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`movie_id`, `movie_name`, `movie_description`, `movie_access`, `movie_language`, `movie_categories`, `movie_release_date`, `movie_duration`, `movie_status`, `movie_thumbnail`, `movie_poster`, `Ishomepage`, `Isposter`, `movie_release_year`, `seo_title`, `seo_keywords`, `seo_description`, `review`, `view`) VALUES
('FQU6F07629', 'Guardians of the Galaxy', 'Guardians of the Galaxy', 'Free', 'Hindi', 'Action', '2026-08-05', '2h1m', 'published', 'images.jpg', 'Guardians_of_the_Galaxy_film_poster.jpg', 1, 1, 2014, 'Guardians of the Galaxy', 'Guardians of the Galaxy', 'Guardians of the Galaxy', 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `movie_cast`
--

CREATE TABLE `movie_cast` (
  `movie_id` varchar(50) NOT NULL,
  `movie_cast_id` varchar(50) NOT NULL,
  `movie_cast_type` varchar(25) NOT NULL,
  `movie_cast_name` varchar(25) NOT NULL,
  `movie_cast_role` varchar(25) NOT NULL,
  `file_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `movie_cast`
--

INSERT INTO `movie_cast` (`movie_id`, `movie_cast_id`, `movie_cast_type`, `movie_cast_name`, `movie_cast_role`, `file_date`) VALUES
('FQU6F07629', 'NTNC1BPX', 'Cast', 'abhay', 'Actor', '2026-08-06 05:14:21');

-- --------------------------------------------------------

--
-- Table structure for table `movie_file`
--

CREATE TABLE `movie_file` (
  `movie_id` varchar(50) NOT NULL,
  `movie_file_id` varchar(50) NOT NULL,
  `movie_quality` varchar(50) NOT NULL,
  `movie_file` varchar(50) NOT NULL,
  `movie_download` tinyint(1) NOT NULL,
  `isFile` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `movie_file`
--

INSERT INTO `movie_file` (`movie_id`, `movie_file_id`, `movie_quality`, `movie_file`, `movie_download`, `isFile`) VALUES
('FQU6F07629', 'MAWS1HL3', '1080P', 'Guardians.of.the.Galaxy.mkv', 1, '2026-08-06 05:14:22');

-- --------------------------------------------------------

--
-- Table structure for table `movie_subtitles`
--

CREATE TABLE `movie_subtitles` (
  `movie_id` varchar(50) NOT NULL,
  `movie_subtitle_id` varchar(50) NOT NULL,
  `movie_sub_language` varchar(25) NOT NULL,
  `movie_subtitle` varchar(50) NOT NULL,
  `istitle` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `movie_subtitles`
--

INSERT INTO `movie_subtitles` (`movie_id`, `movie_subtitle_id`, `movie_sub_language`, `movie_subtitle`, `istitle`) VALUES
('FQU6F07629', 'EKB89CL6', 'Hindi', 'Guardians.of.the.Galaxy.2014.1080p.BluRay.x264.YIF', '2026-08-06 05:14:22');

-- --------------------------------------------------------

--
-- Table structure for table `series`
--

CREATE TABLE `series` (
  `series_id` varchar(50) NOT NULL,
  `series_name` varchar(50) NOT NULL,
  `series_description` varchar(150) NOT NULL,
  `series_access` varchar(50) NOT NULL,
  `series_ language` varchar(25) NOT NULL,
  `series_category` varchar(50) NOT NULL,
  `series_status` varchar(50) NOT NULL,
  `series_seasons` varchar(50) NOT NULL,
  `series_episodes` varchar(50) NOT NULL,
  `series_release_year` year(4) NOT NULL,
  `series_release_date` date NOT NULL,
  `series_rating` float NOT NULL,
  `seo_title` varchar(25) NOT NULL,
  `seo_description` varchar(50) NOT NULL,
  `seo_keywords` varchar(50) NOT NULL,
  `series_thumbnail` varchar(150) NOT NULL,
  `series_Poster` varchar(150) NOT NULL,
  `series_trailer_url` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `subscribed` varchar(50) NOT NULL,
  `isLogdin` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `username`, `subscribed`, `isLogdin`) VALUES
(1, 'abhay', 'khakhriya', 'khakhriyaabhay073@gmail.com', 'scrypt:32768:8:1$vctx2grY2q4G2bhS$8b8f1c61bbda3413c3a3573782c1c2ff9236a531143b83d027c0b0653a98c5d11564e3647604451cff9ae3bfc1900744f76ecb8360cebe963db33a54f34b6320', '', '', '2026-08-05 05:52:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_dashboard`
--
ALTER TABLE `admin_dashboard`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD UNIQUE KEY `movie_id` (`movie_id`);

--
-- Indexes for table `movie_cast`
--
ALTER TABLE `movie_cast`
  ADD UNIQUE KEY `movie_cast_id` (`movie_cast_id`);

--
-- Indexes for table `movie_file`
--
ALTER TABLE `movie_file`
  ADD UNIQUE KEY `movie_file_id` (`movie_file_id`);

--
-- Indexes for table `movie_subtitles`
--
ALTER TABLE `movie_subtitles`
  ADD UNIQUE KEY `movie_subtitle_id` (`movie_subtitle_id`);

--
-- Indexes for table `series`
--
ALTER TABLE `series`
  ADD UNIQUE KEY `series_id` (`series_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_dashboard`
--
ALTER TABLE `admin_dashboard`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `c_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
