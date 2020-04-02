CREATE TABLE `sort_data` (
`idx` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `raybaro`.`sort_data` (`name`) VALUES ('통신계측기수리');
INSERT INTO `raybaro`.`sort_data` (`name`) VALUES ('기지국장비수리');
INSERT INTO `raybaro`.`sort_data` (`name`) VALUES ('전자저울수리');



CREATE TABLE `recompany_data` (
`idx` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('누비콤');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('키사이트테크놀로지');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('삼성전자');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('삼성SDS');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('온세미세미컨덕터');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('큐웨이');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('엘지전자');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('파워넷');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('아이텍전자');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('트림블');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('히로세코리아');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('울쏘하이텍');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('아비코전자');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('비스타콤');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('고려대학교');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('국민대학교');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('대전테크노파크');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('히다찌엘지');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('평일');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('맥스텍');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('카이네트웍스');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('파워넷');
INSERT INTO `raybaro`.`recompany_data` (`name`) VALUES ('성호전자');



CREATE TABLE `title_data` (
`idx` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `raybaro`.`title_data` (`name`) VALUES ('통신계측기');
INSERT INTO `raybaro`.`title_data` (`name`) VALUES ('기지국장비');
INSERT INTO `raybaro`.`title_data` (`name`) VALUES ('전자저울');



CREATE TABLE `gearcompany_data` (
`idx` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
PRIMARY KEY (`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `raybaro`.`gearcompany_data` (`name`) VALUES ('keysight(hp,agilent)');
INSERT INTO `raybaro`.`gearcompany_data` (`name`) VALUES ('키슬리');
INSERT INTO `raybaro`.`gearcompany_data` (`name`) VALUES ('로데슈바르츠');
INSERT INTO `raybaro`.`gearcompany_data` (`name`) VALUES ('아이텍');
INSERT INTO `raybaro`.`gearcompany_data` (`name`) VALUES ('텍트로닉스');
INSERT INTO `raybaro`.`gearcompany_data` (`name`) VALUES ('시멘트로콤사');
INSERT INTO `raybaro`.`gearcompany_data` (`name`) VALUES ('트림블');