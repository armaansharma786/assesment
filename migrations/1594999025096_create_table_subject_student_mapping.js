module.exports = {
    "up": "CREATE TABLE `tb_students_subjects_mapping` (  `id` int(11) NOT NULL AUTO_INCREMENT,`student_id` int(11) NOT NULL,`subject_id` int(11) NOT NULL,`is_deleted` int(11) NOT NULL DEFAULT '0', `creation_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`),  UNIQUE KEY `student_id_subject_id` (`student_id`,`subject_id`) USING BTREE,    KEY `is_deleted` (`is_deleted`) )",
    "down": ""
}