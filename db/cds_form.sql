-- MySQL dump 10.13  Distrib 8.0.14, for Win64 (x86_64)
--
-- Host: localhost    Database: cds
-- ------------------------------------------------------
-- Server version	8.0.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `form`
--

DROP TABLE IF EXISTS `form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` text COLLATE utf8_persian_ci,
  `lastname` text COLLATE utf8_persian_ci,
  `birthday_date` text COLLATE utf8_persian_ci,
  `marrital_status` text COLLATE utf8_persian_ci,
  `gender` text COLLATE utf8_persian_ci,
  `nationality` text COLLATE utf8_persian_ci,
  `country_of_residency` text COLLATE utf8_persian_ci,
  `city_of_residency` text COLLATE utf8_persian_ci,
  `address` text COLLATE utf8_persian_ci,
  `postal_code` text COLLATE utf8_persian_ci,
  `telephone_number` text COLLATE utf8_persian_ci,
  `mobile_number` text COLLATE utf8_persian_ci,
  `email` text COLLATE utf8_persian_ci,
  `latest_academic_qualification` text COLLATE utf8_persian_ci,
  `field_of_study` text COLLATE utf8_persian_ci,
  `country` text COLLATE utf8_persian_ci,
  `GPA` text COLLATE utf8_persian_ci,
  `year_awarded` text COLLATE utf8_persian_ci,
  `institution` text COLLATE utf8_persian_ci,
  `language_certificate` text COLLATE utf8_persian_ci,
  `IELTS_listening` text COLLATE utf8_persian_ci,
  `IELTS_reading` text COLLATE utf8_persian_ci,
  `IELTS_writing` text COLLATE utf8_persian_ci,
  `IELTS_speaking` text COLLATE utf8_persian_ci,
  `IELTS_overall_band` text COLLATE utf8_persian_ci,
  `TOFEL_IBT_listening` text COLLATE utf8_persian_ci,
  `TOFEL_IBT_reading` text COLLATE utf8_persian_ci,
  `TOFEL_IBT_writing` text COLLATE utf8_persian_ci,
  `TOFEL_IBT_speaking` text COLLATE utf8_persian_ci,
  `TOFEL_IBT_overall_band` text COLLATE utf8_persian_ci,
  `GMAT_test_date` text COLLATE utf8_persian_ci,
  `GMAT_verbal` text COLLATE utf8_persian_ci,
  `GMAT_quantitative` text COLLATE utf8_persian_ci,
  `GMAT_total` text COLLATE utf8_persian_ci,
  `GMAT_analytical_writing` text COLLATE utf8_persian_ci,
  `GRE_verbal_score` text COLLATE utf8_persian_ci,
  `GRE_quantitative_score` text COLLATE utf8_persian_ci,
  `GRE_analytical_scroe` text COLLATE utf8_persian_ci,
  `other_language_info` text COLLATE utf8_persian_ci,
  `oddinfo1` text COLLATE utf8_persian_ci,
  `oddinfo2` text COLLATE utf8_persian_ci,
  `oddinfo3` text COLLATE utf8_persian_ci,
  `oddinfo4` text COLLATE utf8_persian_ci,
  `oddinfo5` text COLLATE utf8_persian_ci,
  `oddinfo6` text COLLATE utf8_persian_ci,
  `details` text COLLATE utf8_persian_ci,
  `document` text COLLATE utf8_persian_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form`
--

LOCK TABLES `form` WRITE;
/*!40000 ALTER TABLE `form` DISABLE KEYS */;
/*!40000 ALTER TABLE `form` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-20 17:41:23
