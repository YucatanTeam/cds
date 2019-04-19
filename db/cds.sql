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

INSERT INTO `comment` (`id`, `page_id`, `content`, `name`, `email`, `status`, `cuid`, `created_at`, `updated_at`) VALUES
(1,	1,	'این پست عالی است!',	'wilonion',	'ea_pain@yahoo.com',	0,	'cjtrim4l30002w6btcl7g3fw1',	'2019-03-27 18:00:57',	'2019-03-27 18:00:57');

DROP TABLE IF EXISTS `error`;
CREATE TABLE `error` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `msg` text COLLATE utf8_persian_ci,
  `status` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

INSERT INTO `error` (`id`, `msg`, `status`) VALUES
(1,	'ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \'?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\' at line 2',	1),
(2,	'ER_BAD_FIELD_ERROR: Unknown column \'gre_analytical_score\' in \'field list\'',	1),
(3,	'ER_BAD_FIELD_ERROR: Unknown column \'GRE_analytical_score\' in \'field list\'',	1),
(4,	'ENOENT: no such file or directory, open \'/root/Desktop/cds/doc/upload_e88c8e21b9de57cb137cdfd166e01768.png,upload_272d09c8f2abf8e6da9d0cc4121b2269.png,upload_728493128eabc4a7c976087efae0f0bd.png\'',	1),
(5,	'read EINVAL',	1),
(6,	'Timeout',	1);

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

INSERT INTO `page` (`id`, `route_id`, `tags`, `title`, `en_title`, `cover`, `content`, `en_content`, `status`, `comment`, `cuid`, `created_at`, `updated_at`) VALUES
(1,	1,	'govah,cando,certificate',	'گواه فارسی',	'english govah',	NULL,	'govah e khoshgel',	'nice govah',	0,	0,	'cjtrilz100000w6bt6zkrbick',	'2019-03-27 18:00:56',	'2019-03-27 18:00:56');

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

INSERT INTO `route` (`id`, `access`, `title`, `en_title`, `status`) VALUES
(1,	3,	'اعزام به کانادا',	'study in canada',	1),
(2,	3,	'اعزام به استرالیا',	'study in australia',	1),
(3,	3,	'اعزام به نیوزلند',	'study in newzealand',	1),
(4,	3,	'مجله خبری cds',	'cds newsletter',	1),
(5,	3,	'main',	'main',	1);

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

INSERT INTO `user` (`id`, `firstname`, `lastname`, `email`, `password`, `access`, `avatar`) VALUES
(1,	'dev',	'eloper',	'dev@cds.org.ir',	'958e2438cc45417e4c892f685a1c33d8��4��H\n�97~YL��Ҹ	hF���ۡ�\Z�\0A}%\nH�X��1��� k����u�\"_�?�z�3',	7,	NULL),
(2,	'wild',	'onion',	'wild_onion@yhaoo.com',	'0fa38801b632fe32a1ea81f426e640b1\0���y�	Ndc��\n�*]������\Z̷{2�w/s��X��3��\'�\\H��R��E�YYa=�8F��',	2,	NULL);

-- 2019-04-19 14:23:29
