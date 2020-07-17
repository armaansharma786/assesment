module.exports = {
    "up": "CREATE TABLE `tb_subjects` (  `id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(40) NOT NULL,  `subject_code` varchar(30) NOT NULL,  `is_deleted` tinyint(1) NOT NULL DEFAULT '0', `creation_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,`updation_datetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`id`),   KEY `is_deleted` (`is_deleted`)  )",
    "down": ""
}