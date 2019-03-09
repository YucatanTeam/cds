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
-- Table structure for table `page`
--

DROP TABLE IF EXISTS `page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_id` int(11) DEFAULT NULL,
  `tags` text COLLATE utf8_persian_ci,
  `title` varchar(100) COLLATE utf8_persian_ci NOT NULL,
  `en_title` text COLLATE utf8_persian_ci NOT NULL,
  `cover` text COLLATE utf8_persian_ci,
  `content` text COLLATE utf8_persian_ci NOT NULL,
  `en_content` text COLLATE utf8_persian_ci NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `comment` tinyint(4) NOT NULL DEFAULT '0',
  `cuid` varchar(100) COLLATE utf8_persian_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title_key` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page`
--

LOCK TABLES `page` WRITE;
/*!40000 ALTER TABLE `page` DISABLE KEYS */;
INSERT INTO `page` VALUES (1,4,'govah,cando,certificate','گواه فارسی','english govah',NULL,'govah e khoshgel','nice govah',0,0,'cjt0nejr400004gwb51e4e26c','2019-03-08 22:45:19','2019-03-09 01:35:18'),(2,1,'first post,canada,کانادا,اولین پست','اولین پست','first post ','C:\\Users\\VOCFU\\Desktop\\cds\\images\\upload_bd6dfd0d77b62ab364d257b2c285ccd2.jpg','<p>اولین پست مهاجرت به کانادا</p>','<p>first post about immigration to canada</p>',1,1,'cjt0nqk9y00002swb005tga8m','2019-03-08 22:54:36','2019-03-08 22:54:36'),(4,2,'australia,education system,نظام اموزشی,استرالیا','نظام اموزشی استرالیا','australia education system',NULL,'<p>متنی در مورد نظام اموزشی استرالیا</p>','<p>australia education system about. ...</p>',1,0,'cjt0u4y3b0001kgwb5js76ee5','2019-03-09 01:53:44','2019-03-09 01:53:44'),(5,3,'newzealand,نیوزلند','نظام آموزشی نیوزلند','newzealand education system',NULL,'<p>متنی در مورد نظام اموزشی نیوزلند</p>','<p>education system newzealand</p>',1,1,'cjt0u8d4a0002kgwb99r2b5jc','2019-03-09 01:56:24','2019-03-09 01:56:24');
/*!40000 ALTER TABLE `page` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-09  5:43:55
