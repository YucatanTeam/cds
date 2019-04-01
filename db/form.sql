-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

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


-- 2019-04-01 19:15:54
