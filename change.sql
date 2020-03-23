CREATE TABLE `report` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `sort` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recompany` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `writer` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gearcompany` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codenum` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codeserial` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startday` date DEFAULT NULL,
  `endday` date DEFAULT NULL,
  `clientsym` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `repairsym` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
<<<<<<< HEAD
  `immage` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
=======
  `image` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
>>>>>>> 7e76658cef98b6817820ffba5601cab0f0cc941b
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
