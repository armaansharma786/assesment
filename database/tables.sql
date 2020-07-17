
CREATE TABLE `tb_faculty` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `first_name` varchar(50) NOT NULL,
 `last_name` varchar(50) DEFAULT NULL,
 `email` varchar(80) NOT NULL,
 `contact_number` varchar(20) NOT NULL,
 `dob` varchar(20) NOT NULL,
 `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
 `creation_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updation_datetime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`),
 UNIQUE KEY `email` (`email`),
 UNIQUE KEY `contact_number` (`contact_number`),
 KEY `is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1

CREATE TABLE `tb_students` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `first_name` varchar(50) NOT NULL,
 `last_name` varchar(50) DEFAULT NULL,
 `email` varchar(50) NOT NULL,
 `class` varchar(10) NOT NULL,
 `dob` varchar(20) NOT NULL,
 `contact_number` varchar(20) DEFAULT NULL,
 `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
 `creation_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updation_datetime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`),
 UNIQUE KEY `email` (`email`),
 UNIQUE KEY `phone` (`contact_number`),
 KEY `is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1

CREATE TABLE `tb_subjects` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar(40) NOT NULL,
 `subject_code` varchar(30) NOT NULL,
 `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
 `creation_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updation_datetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`),
 KEY `is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1

CREATE TABLE `tb_faculty_subjects_mapping` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `faculty_id` int(11) NOT NULL,
 `subject_id` int(11) NOT NULL,
 `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
 `creation_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 `updation_datetime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`),
 UNIQUE KEY `faculty_id` (`faculty_id`,`subject_id`),
 KEY `is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1


CREATE TABLE `tb_students_subjects_mapping` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `student_id` int(11) NOT NULL,
 `subject_id` int(11) NOT NULL,
 `is_deleted` int(11) NOT NULL DEFAULT '0',
 `creation_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY (`id`),
 UNIQUE KEY `student_id_subject_id` (`student_id`,`subject_id`) USING BTREE,
 KEY `is_deleted` (`is_deleted`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1