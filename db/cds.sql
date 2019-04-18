-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `apply`;
CREATE TABLE `apply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_persian_ci,
  `country` text COLLATE utf8_persian_ci,
  `university` text COLLATE utf8_persian_ci,
  `education_language` text COLLATE utf8_persian_ci NOT NULL,
  `field` text COLLATE utf8_persian_ci,
  `cv` text COLLATE utf8_persian_ci,
  `sop` text COLLATE utf8_persian_ci,
  `rc` text COLLATE utf8_persian_ci,
  `reg_date` text COLLATE utf8_persian_ci,
  `cuid` varchar(100) COLLATE utf8_persian_ci NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_ind` (`user_id`),
  CONSTRAINT `apply_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) DEFAULT NULL,
  `content` text COLLATE utf8_persian_ci NOT NULL,
  `name` text COLLATE utf8_persian_ci NOT NULL,
  `email` text COLLATE utf8_persian_ci NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `cuid` varchar(100) COLLATE utf8_persian_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_ind` (`page_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


DROP TABLE IF EXISTS `error`;
CREATE TABLE `error` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `msg` text COLLATE utf8_persian_ci,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


DROP TABLE IF EXISTS `form`;
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
  `GRE_analytical_score` text COLLATE utf8_persian_ci,
  `other_language_info` text COLLATE utf8_persian_ci,
  `oddinfo1` text COLLATE utf8_persian_ci,
  `oddinfo2` text COLLATE utf8_persian_ci,
  `oddinfo3` text COLLATE utf8_persian_ci,
  `oddinfo4` text COLLATE utf8_persian_ci,
  `oddinfo5` text COLLATE utf8_persian_ci,
  `oddinfo6` text COLLATE utf8_persian_ci,
  `details` text COLLATE utf8_persian_ci,
  `document` text COLLATE utf8_persian_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


DROP TABLE IF EXISTS `freetime`;
CREATE TABLE `freetime` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` text COLLATE utf8_persian_ci NOT NULL,
  `time` text COLLATE utf8_persian_ci NOT NULL,
  `price` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


DROP TABLE IF EXISTS `page`;
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
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title_key` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


DROP TABLE IF EXISTS `reserve`;
CREATE TABLE `reserve` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `freetime_id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


DROP TABLE IF EXISTS `route`;
CREATE TABLE `route` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `access` int(11) DEFAULT NULL,
  `title` text COLLATE utf8_persian_ci NOT NULL,
  `en_title` text COLLATE utf8_persian_ci NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paid` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` text COLLATE utf8_persian_ci,
  `lastname` text COLLATE utf8_persian_ci,
  `email` text COLLATE utf8_persian_ci NOT NULL,
  `password` text COLLATE utf8_persian_ci NOT NULL,
  `access` int(11) NOT NULL DEFAULT '2',
  `avatar` text COLLATE utf8_persian_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;


-- 2019-04-18 19:40:01
