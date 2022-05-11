-- MySQL dump 10.13  Distrib 8.0.27, for macos11 (x86_64)
--
-- Host: localhost    Database: ticket_system
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL COMMENT '分类id',
  `name` varchar(20) NOT NULL COMMENT '类别名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_id` (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,2070,'保洁'),(2,2071,'安防'),(3,2072,'园林'),(4,2073,'客服'),(5,2074,'维修');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `committee`
--

DROP TABLE IF EXISTS `committee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `committee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `position_id` int NOT NULL COMMENT '职位id',
  `del_flag` tinyint(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `position_id` (`position_id`),
  CONSTRAINT `committee_ibfk_1` FOREIGN KEY (`position_id`) REFERENCES `committeePosition` (`id`),
  CONSTRAINT `committee_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `committee`
--

LOCK TABLES `committee` WRITE;
/*!40000 ALTER TABLE `committee` DISABLE KEYS */;
/*!40000 ALTER TABLE `committee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `committeePosition`
--

DROP TABLE IF EXISTS `committeePosition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `committeePosition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '职位',
  `del_flag` tinyint(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `committeePosition`
--

LOCK TABLES `committeePosition` WRITE;
/*!40000 ALTER TABLE `committeePosition` DISABLE KEYS */;
/*!40000 ALTER TABLE `committeePosition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `job_num` varchar(20) NOT NULL COMMENT '工号',
  `name` varchar(20) NOT NULL COMMENT '真实姓名',
  `mobile` varchar(20) NOT NULL,
  `identity_num` varchar(18) NOT NULL COMMENT '身份证号',
  `dept_id` int NOT NULL COMMENT '部门id',
  `position_id` int NOT NULL COMMENT '职位id',
  `del_flag` tinyint(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_by` varchar(64) DEFAULT NULL COMMENT '创建者',
  `create_time` date DEFAULT NULL COMMENT '创建时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `sex` tinyint(1) DEFAULT '0' COMMENT '性别，1男 0女',
  `update_time` date DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `job_num` (`job_num`),
  UNIQUE KEY `mobile` (`mobile`),
  UNIQUE KEY `identity_num` (`identity_num`),
  KEY `employee_ibfk_3` (`position_id`),
  KEY `employee_ibfk_2` (`dept_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`dept_id`) REFERENCES `propertyManagementDepartment` (`id`),
  CONSTRAINT `employee_ibfk_3` FOREIGN KEY (`position_id`) REFERENCES `propertyManagementposition` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propertyManagementDepartment`
--

DROP TABLE IF EXISTS `propertyManagementDepartment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propertyManagementDepartment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '部门名称',
  `leader` varchar(20) DEFAULT NULL COMMENT '负责人',
  `phone` varchar(20) DEFAULT NULL COMMENT '负责人电话',
  `dept_status` tinyint(1) DEFAULT '0' COMMENT '部门状态（0正常 1停用）',
  `del_flag` tinyint(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `leader_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `leader_id` (`leader_id`),
  CONSTRAINT `propertyManagementDepartment_ibfk_1` FOREIGN KEY (`leader_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1005 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propertyManagementDepartment`
--

LOCK TABLES `propertyManagementDepartment` WRITE;
/*!40000 ALTER TABLE `propertyManagementDepartment` DISABLE KEYS */;
INSERT INTO `propertyManagementDepartment` VALUES (1,'保洁部',NULL,NULL,NULL,0,NULL),(2,'安防部',NULL,NULL,NULL,0,NULL),(3,'园林部',NULL,NULL,NULL,0,NULL),(4,'客服部',NULL,NULL,NULL,0,NULL),(5,'维修部',NULL,NULL,NULL,0,NULL),(6,'主任部',NULL,NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `propertyManagementDepartment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propertyManagementPosition`
--

DROP TABLE IF EXISTS `propertyManagementPosition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propertyManagementPosition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '职位名称',
  `del_flag` tinyint(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propertyManagementPosition`
--

LOCK TABLES `propertyManagementPosition` WRITE;
/*!40000 ALTER TABLE `propertyManagementPosition` DISABLE KEYS */;
INSERT INTO `propertyManagementPosition` VALUES (1,'主管',0),(2,'副主管',0),(3,'员工',0),(4,'主任',0),(5,'副主任',0);
/*!40000 ALTER TABLE `propertyManagementPosition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resident`
--

DROP TABLE IF EXISTS `resident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resident` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `name` varchar(20) NOT NULL COMMENT '真实姓名',
  `mobile` varchar(20) NOT NULL,
  `identity_num` varchar(18) NOT NULL COMMENT '身份证号',
  `is_committee` tinyint(1) DEFAULT '1' COMMENT '是否业委会（0是 1不是）',
  `resident_type` tinyint(1) DEFAULT NULL COMMENT '住户类型（0业主 2租户）',
  `proprietor_remark` tinyint(1) DEFAULT NULL COMMENT '业主备注（0户主 1家属）',
  `building_num` varchar(10) DEFAULT NULL COMMENT '幢',
  `apartment_num` varchar(10) DEFAULT NULL COMMENT '单元',
  `room_num` varchar(10) DEFAULT NULL COMMENT '房号',
  `del_flag` tinyint(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_time` date DEFAULT NULL COMMENT '创建时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `identity_num` (`identity_num`),
  UNIQUE KEY `mobile` (`mobile`),
  CONSTRAINT `resident_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resident`
--

LOCK TABLES `resident` WRITE;
/*!40000 ALTER TABLE `resident` DISABLE KEYS */;
/*!40000 ALTER TABLE `resident` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(20) NOT NULL COMMENT '工单标题',
  `content` varchar(500) NOT NULL COMMENT '工单内容',
  `attachment` varchar(500) DEFAULT NULL COMMENT '附件地址',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `creator_id` int NOT NULL COMMENT '创建者用户ID',
  `creator` varchar(20) NOT NULL COMMENT '创建者姓名',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态（0创建 1进行中 2部分完成 3完成）',
  `category` int DEFAULT NULL COMMENT '分类（2070保洁 2071安防 2072绿化 2073客服 2074维修 2075其他）',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `process_list` varchar(500) DEFAULT NULL COMMENT 'json 流转历史，第一个节点允许指派多个人员，之后只能指派一人',
  `relative_staff` varchar(100) DEFAULT NULL COMMENT '相关人员，用，分开',
  `current_handler` int DEFAULT NULL COMMENT '当前处理人ID',
  `dept_id` int DEFAULT NULL COMMENT '所属部门',
  `del_flag` tinyint(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `creator_id` (`creator_id`,`title`,`content`),
  KEY `user_ticket` (`current_handler`),
  KEY `employee_ibfk_2` (`dept_id`),
  KEY `ticket_ibfk_2` (`category`),
  CONSTRAINT `dept_ticket` FOREIGN KEY (`dept_id`) REFERENCES `propertyManagementDepartment` (`id`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`category`) REFERENCES `category` (`category_id`),
  CONSTRAINT `user_ticket` FOREIGN KEY (`current_handler`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `password` varchar(60) NOT NULL,
  `user_status` tinyint(1) DEFAULT '0' COMMENT '帐号状态（0正常 1停用）',
  `is_committee` tinyint(1) DEFAULT '0' COMMENT '是否业委会（1是，0不是）',
  `is_resident` tinyint(1) DEFAULT '0' COMMENT '是否住户（1是，0不是）',
  `del_flag` tinyint(1) DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `is_employee` tinyint(1) DEFAULT '0' COMMENT '是否物业员工（1是，0不是）',
  `wx_open_id` varchar(50) DEFAULT NULL COMMENT '微信openID',
  `is_admin` tinyint(1) DEFAULT '0' COMMENT '管理员权限（1有，0无）',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `wx_open_id` (`wx_open_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-11 11:07:35
