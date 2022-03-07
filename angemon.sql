# ************************************************************
# Sequel Ace SQL dump
# 版本号： 20029
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: 127.0.0.1 (MySQL 8.0.26)
# 数据库: angemon
# 生成时间: 2022-03-07 04:13:40 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 转储表 ag_admin
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ag_admin`;

CREATE TABLE `ag_admin` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(24) NOT NULL DEFAULT '',
  `username` char(24) NOT NULL DEFAULT '',
  `avatar` varchar(255) NOT NULL DEFAULT '',
  `roles` varchar(255) NOT NULL DEFAULT '',
  `password` char(32) NOT NULL DEFAULT '',
  `salt` char(4) NOT NULL DEFAULT '',
  `created_time` int unsigned NOT NULL DEFAULT '0',
  `update_time` int unsigned NOT NULL DEFAULT '0',
  `last_login_time` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 ag_content
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ag_content`;

CREATE TABLE `ag_content` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nUniqueid` bigint unsigned NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL DEFAULT '',
  `summary` text NOT NULL,
  `created` int unsigned NOT NULL DEFAULT '0',
  `modify` int unsigned NOT NULL DEFAULT '0',
  `sContentPath` char(64) NOT NULL DEFAULT '',
  `state` tinyint unsigned NOT NULL DEFAULT '1',
  `sort` tinyint unsigned NOT NULL DEFAULT '0',
  `content` text,
  `category` tinyint unsigned NOT NULL DEFAULT '0',
  `nCommentNum` smallint unsigned NOT NULL DEFAULT '0',
  `nClickNum` smallint unsigned NOT NULL DEFAULT '0',
  `uid` int NOT NULL DEFAULT '0',
  `tags` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



# 转储表 ag_images
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ag_images`;

CREATE TABLE `ag_images` (
  `id` bigint unsigned NOT NULL,
  `host` varchar(32) NOT NULL DEFAULT '',
  `uri` varchar(255) DEFAULT '',
  `aid` int unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 ag_options
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ag_options`;

CREATE TABLE `ag_options` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `value` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 ag_post
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ag_post`;

CREATE TABLE `ag_post` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `created` int unsigned NOT NULL,
  `updated` int NOT NULL,
  `content` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `markdown` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;



# 转储表 ag_tags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ag_tags`;

CREATE TABLE `ag_tags` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `md5` char(32) NOT NULL DEFAULT '',
  `name` varchar(48) NOT NULL DEFAULT '',
  `aids` text NOT NULL,
  `updated` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_md5` (`md5`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
