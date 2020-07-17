module.exports = {
    "up": " CREATE TABLE `tb_faculty_subjects_mapping` (`id` int(11) NOT NULL AUTO_INCREMENT, `faculty_id` int(11) NOT NULL,`subject_id` int(11) NOT NULL,`is_deleted` tinyint(1) NOT NULL DEFAULT '0', `creation_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,`updation_datetime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (`id`),  UNIQUE KEY `faculty_id` (`faculty_id`,`subject_id`),   KEY `is_deleted` (`is_deleted`))",
    "down": ""
}