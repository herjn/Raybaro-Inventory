CREATE TABLE `report` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `writer` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `administer` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adcompany1` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sn1` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sn2` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sn3` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `regdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `moddate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE report ADD COLUMN image varchar(45);
ALTER TABLE report ADD COLUMN requestdate date DEFAULT NULL;
ALTER TABLE report ADD COLUMN repairdate date DEFAULT NULL;