CREATE DATABASE  IF NOT EXISTS `wastetrack` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `wastetrack`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: wastetrack
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `recycling_centres`
--

DROP TABLE IF EXISTS `recycling_centres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recycling_centres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `tags` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recycling_centres`
--

LOCK TABLES `recycling_centres` WRITE;
/*!40000 ALTER TABLE `recycling_centres` DISABLE KEYS */;
INSERT INTO `recycling_centres` VALUES (1,'IPC Recycling & Buy-Back Centre','Multi-Waste Centre','PJ','https://commons.wikimedia.org/wiki/Special:FilePath/Waste_bins_recyclable.jpg','Plastic, Paper, Glass, General'),(2,'Tzu Chi Recycling Center','Community Centre','KL','https://commons.wikimedia.org/wiki/Special:FilePath/Zapfendorf_Plastic_Recycling-20180621-RM-114359.jpg','Plastic, Paper, Glass'),(3,'Pusat Kitar Semula MBSA','Government Facility','Shah Alam','https://commons.wikimedia.org/wiki/Special:FilePath/Plastic_Recycling.jpg','Plastic, Paper, General'),(4,'Pusat Kitar Semula Komuniti','Community Centre','KL','https://commons.wikimedia.org/wiki/Special:FilePath/Textile_Recycling_Container_and_Waste_Containers.jpg','Paper, Glass, General'),(5,'1RECYCLING CENTRE (1RC)','Multi-Waste Centre','PJ','https://commons.wikimedia.org/wiki/Special:FilePath/Plastic_recycling_notice_in_a_Sainsbury%27s.jpg','Plastic, Paper, Glass, General'),(6,'Kloth Cares Recycling Bins','Fabric & General','KL','https://commons.wikimedia.org/wiki/Special:FilePath/TexCycle_container.jpeg','General'),(7,'KRV Metal Subang 2 @ Besi Buruk','Scrap & Metal','Shah Alam','https://commons.wikimedia.org/wiki/Special:FilePath/Scrap_metal_dealers.jpg','General'),(8,'PJ Eco Recycling Plaza','Eco Hub','PJ','https://commons.wikimedia.org/wiki/Special:FilePath/E-Waste_Recycling_(7027059003).jpg','Plastic, Paper, Glass'),(9,'Pusat Kitar Semula SS17 Subang Jaya','Community Centre','Subang Jaya','https://commons.wikimedia.org/wiki/Special:FilePath/Recycling_003_2024_10_23.jpg','Plastic, Paper'),(10,'Pusat Kitar Semula MBSA (Branch)','Government Facility','Shah Alam','https://commons.wikimedia.org/wiki/Special:FilePath/E-waste.jpg','Plastic, Glass, General'),(11,'Win Wins Recycling Trading','Commercial Recycler','Klang','https://commons.wikimedia.org/wiki/Special:FilePath/Scrap_Metal.JPG','Plastic, Paper'),(12,'Recycle Centre @ The School','Drop-off Point','PJ','https://commons.wikimedia.org/wiki/Special:FilePath/Book_and_textile_recycling_-_Choice_Textile_Recycling_-_Book_Savers.jpg','Paper, General'),(13,'TechWaste Recycling Malaysia','E-Waste & General','Shah Alam','https://commons.wikimedia.org/wiki/Special:FilePath/E-waste_(2)_-_IMG_2290.jpg','General'),(14,'PJ Fibre Recovery Sdn Bhd','Paper & Fibre','PJ','https://commons.wikimedia.org/wiki/Special:FilePath/Poor_paper_recycling.jpg','Paper'),(15,'DSS Resources Recycling Centre','Multi-Waste Centre','KL','https://commons.wikimedia.org/wiki/Special:FilePath/Metal_scrap_in_Aomi.jpg','Plastic, Paper, Glass, General'),(16,'Community Recycle Centre','Community Centre','Subang Jaya','https://commons.wikimedia.org/wiki/Special:FilePath/Glass_and_plastic_recycling_065_ubt.JPG','Plastic, Paper, Glass'),(17,'Recycle Centre - Perfect VR','Drop-off Point','KL','https://commons.wikimedia.org/wiki/Special:FilePath/E-waste_-_IMG_2295_-_337453385.jpg','Plastic, General'),(18,'Mudajaya Recycle Sdn Bhd','Commercial Recycler','PJ','https://commons.wikimedia.org/wiki/Special:FilePath/Scrap_metal_recycling_-_geograph.org.uk_-_2931357.jpg','Paper, Glass, General'),(19,'Vairam Recycle Trading','Commercial Recycler','Seri Kembangan','https://commons.wikimedia.org/wiki/Special:FilePath/Silver_and_gold_scrap_metal.jpg','Plastic, Paper'),(20,'USJ Paper Recyclers Sdn. Bhd.','Paper Specialist','Subang Jaya','https://commons.wikimedia.org/wiki/Special:FilePath/Recyclable_Cardboard_Packaging.jpg','Paper');
/*!40000 ALTER TABLE `recycling_centres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminders`
--

DROP TABLE IF EXISTS `reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reminders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `reminder_date` date NOT NULL,
  `reminder_time` time NOT NULL,
  `waste_type` varchar(100) NOT NULL,
  `amount` float DEFAULT NULL,
  `notes` text,
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminders`
--

LOCK TABLES `reminders` WRITE;
/*!40000 ALTER TABLE `reminders` DISABLE KEYS */;
INSERT INTO `reminders` VALUES (10,'sandy@gmail.com','2026-03-10','17:00:00','Glass',7,'','Putrajaya Precinct 9 Recycling','active'),(11,'gcmengli@gmail.com','2026-03-10','09:35:00','Plastic',12,'','Tzu Chi Recycling Center','dismissed'),(12,'gcmengli@gmail.com','2026-03-11','09:39:00','General',3,'Pack in bundles and put them in the car','IPC Recycling & Buy-Back Centre','active'),(13,'jamie@email.com','2026-03-31','15:00:00','Glass',5,'','IPC Recycling & Buy-Back Centre','active');
/*!40000 ALTER TABLE `reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (14,'Sandy','sandy@gmail.com','scrypt:32768:8:1$wZoxWQnaDe913kSF$51967e1f4aed0b9af5bdd2c966e2fd222dc0fc5ece4108550ffc4f4a1d81f05cb758882f7ee627261c81c525711994c3b10eb6f938413b3149364029ffb1ef8b'),(15,'Grace','gcmengli@gmail.com','scrypt:32768:8:1$qDNzheMLLNSxT9tn$01b497bfd811bb0215e75917bda98367baceb3dd85c3510426b51f5bbe89d04c100338080f91dbd428d70c28cca275f0680b5b76b12e7b5a1ec4adebb070bfc1'),(16,'Henry','henry@gmail.com','scrypt:32768:8:1$6bnfHS2ck8ETeeGv$c1bd5303f77cdcb3a8b02b1caf4a516d5316bc1d74b27f5f7e7d7b0f822c3ce350f9e5e56a959a4916eacd1696427b1cb861d5dd65b10905025d1c6649d3efa6'),(17,'Grace','grace@email.com','scrypt:32768:8:1$eoc3ZLGHMzXSHCgM$7cc36562a9d7dc27bf5fa4772ce42d9587de98b9c7fd65043433a93ee136cf0898f6c58f6524809b068093375ec81c03ec85986b8d0c4e16808f12fba61054d8'),(18,'Jamie','jamie@email.com','scrypt:32768:8:1$wioG83c7e1NdhwLA$2a7be188c48336c4a76dabea561c2a7b8bb79e1545101ac817e85117c1ad25468e40b8b42e28f54d5556b9b76943166f32a3e793d3d04d117e7593b7c3341b47'),(19,'Grace ','gracie@email.com','scrypt:32768:8:1$Znu0syVy04RonCmz$df3b1fedaa59929a2db0a3fa40d3799cc796aac3ca51b99e524f9dc9aedff29f838b3c5bb2c170938f5f7d13888f807c7cb81d29516583948dd0ca3438785c94'),(20,'Grace','gracey@email.com','scrypt:32768:8:1$0bvISG1mui9FJldG$dbbe8f0697bb63afcb19ab97767d064c4155099a5555bd890d5c7133ab47ca1d6ba41e015bd2aa1e0e92e6a7b1407192fe2ebf377ddcff45db113b4330584d18'),(21,'Jessie ','jessiegoh2110@gmail.com','scrypt:32768:8:1$expAwcPyYHHTejv0$2e298fdacd42e0669e6ca143993d2ca9f0cf301a48bade5dba0c2eb0660bf144fb20aea1506cc4733a43434d1e1dba1eb6ab39cb0d2420630ddbd1cd7af1b174'),(22,'Grace','gracee@email.com','scrypt:32768:8:1$vXsYUomLx6GrpTvC$52eafdd0a94e171a64d67bd99973897ea1d9376848add7acad5042e8f8af3446d0125f1899c71c0cbab130cde6a952245536c6fb07b0cd9ffd2cb668d51a84f1'),(23,'Grace','graceee@email.com','scrypt:32768:8:1$uIXeJ5OqUYg4pdZS$a3563b9e83fc4daaa2b5e8ce5fc700142fa6fa0e14c6740bf27c60a6c4e30ae13aa5550cf989cd7f1c19946bae3b6a94a2fd2a0647cfebf2dc4b4f1861069d1d'),(24,'Halen','halen@email.com','scrypt:32768:8:1$DrTv30ok9KrncKdL$d8769a6806cfb307516f7503dea202f0bad82a839aa4ba1c4815384c575ca686c21ed85c39c0c20406504f4578b049e23d59040241c1b96d7cefac449468018d');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waste_logs`
--

DROP TABLE IF EXISTS `waste_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waste_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `waste_type` varchar(50) NOT NULL,
  `weight` float NOT NULL,
  `log_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=282 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waste_logs`
--

LOCK TABLES `waste_logs` WRITE;
/*!40000 ALTER TABLE `waste_logs` DISABLE KEYS */;
INSERT INTO `waste_logs` VALUES (26,'sandy@gmail.com','Plastic',18,'2025-06-14 16:00:00'),(27,'sandy@gmail.com','Paper',15,'2025-06-14 16:00:00'),(28,'sandy@gmail.com','Glass',8,'2025-06-14 16:00:00'),(29,'sandy@gmail.com','General',4,'2025-06-14 16:00:00'),(30,'sandy@gmail.com','Plastic',20,'2025-07-14 16:00:00'),(31,'sandy@gmail.com','Paper',18,'2025-07-14 16:00:00'),(32,'sandy@gmail.com','Glass',10,'2025-07-14 16:00:00'),(33,'sandy@gmail.com','General',5,'2025-07-14 16:00:00'),(34,'sandy@gmail.com','Plastic',25,'2025-08-14 16:00:00'),(35,'sandy@gmail.com','Paper',20,'2025-08-14 16:00:00'),(36,'sandy@gmail.com','Glass',12,'2025-08-14 16:00:00'),(37,'sandy@gmail.com','General',6,'2025-08-14 16:00:00'),(38,'sandy@gmail.com','Plastic',30,'2025-09-14 16:00:00'),(39,'sandy@gmail.com','Paper',25,'2025-09-14 16:00:00'),(40,'sandy@gmail.com','Glass',15,'2025-09-14 16:00:00'),(41,'sandy@gmail.com','General',8,'2025-09-14 16:00:00'),(42,'sandy@gmail.com','Plastic',35,'2025-10-14 16:00:00'),(43,'sandy@gmail.com','Paper',28,'2025-10-14 16:00:00'),(44,'sandy@gmail.com','Glass',18,'2025-10-14 16:00:00'),(45,'sandy@gmail.com','General',10,'2025-10-14 16:00:00'),(46,'sandy@gmail.com','Plastic',40,'2025-11-14 16:00:00'),(47,'sandy@gmail.com','Paper',30,'2025-11-14 16:00:00'),(48,'sandy@gmail.com','Glass',20,'2025-11-14 16:00:00'),(49,'sandy@gmail.com','General',12,'2025-11-14 16:00:00'),(50,'sandy@gmail.com','Plastic',182,'2025-01-09 16:00:00'),(51,'sandy@gmail.com','Paper',124,'2025-01-09 16:00:00'),(52,'sandy@gmail.com','Glass',117,'2025-01-09 16:00:00'),(53,'sandy@gmail.com','General',175,'2025-01-09 16:00:00'),(54,'sandy@gmail.com','Plastic',300,'2024-06-14 16:00:00'),(55,'sandy@gmail.com','Paper',240,'2024-06-14 16:00:00'),(56,'sandy@gmail.com','Glass',180,'2024-06-14 16:00:00'),(57,'sandy@gmail.com','General',200,'2024-06-14 16:00:00'),(58,'sandy@gmail.com','Plastic',280,'2023-06-14 16:00:00'),(59,'sandy@gmail.com','Paper',220,'2023-06-14 16:00:00'),(60,'sandy@gmail.com','Glass',160,'2023-06-14 16:00:00'),(61,'sandy@gmail.com','General',180,'2023-06-14 16:00:00'),(62,'sandy@gmail.com','Plastic',320,'2022-06-14 16:00:00'),(63,'sandy@gmail.com','Paper',250,'2022-06-14 16:00:00'),(64,'sandy@gmail.com','Glass',190,'2022-06-14 16:00:00'),(65,'sandy@gmail.com','General',210,'2022-06-14 16:00:00'),(66,'sandy@gmail.com','Plastic',270,'2021-06-14 16:00:00'),(67,'sandy@gmail.com','Paper',210,'2021-06-14 16:00:00'),(68,'sandy@gmail.com','Glass',150,'2021-06-14 16:00:00'),(69,'sandy@gmail.com','General',170,'2021-06-14 16:00:00'),(70,'sandy@gmail.com','General',0,'2025-02-14 16:00:00'),(71,'sandy@gmail.com','General',0,'2025-03-14 16:00:00'),(72,'sandy@gmail.com','General',0,'2025-04-14 16:00:00'),(73,'sandy@gmail.com','General',0,'2025-05-14 16:00:00'),(74,'sandy@gmail.com','General',0,'2025-12-14 16:00:00'),(194,'sandy@gmail.com','Plastic',10,'2026-01-14 16:00:00'),(195,'sandy@gmail.com','Paper',8,'2026-01-14 16:00:00'),(196,'sandy@gmail.com','Glass',4,'2026-01-14 16:00:00'),(197,'sandy@gmail.com','General',2,'2026-01-14 16:00:00'),(198,'sandy@gmail.com','Plastic',12,'2026-02-14 16:00:00'),(199,'sandy@gmail.com','Paper',9,'2026-02-14 16:00:00'),(200,'sandy@gmail.com','Glass',5,'2026-02-14 16:00:00'),(201,'sandy@gmail.com','General',2,'2026-02-14 16:00:00'),(202,'sandy@gmail.com','Plastic',14,'2026-03-14 16:00:00'),(203,'sandy@gmail.com','Paper',11,'2026-03-14 16:00:00'),(204,'sandy@gmail.com','Glass',6,'2026-03-14 16:00:00'),(205,'sandy@gmail.com','General',3,'2026-03-14 16:00:00'),(206,'sandy@gmail.com','Plastic',15,'2026-04-14 16:00:00'),(207,'sandy@gmail.com','Paper',12,'2026-04-14 16:00:00'),(208,'sandy@gmail.com','Glass',7,'2026-04-14 16:00:00'),(209,'sandy@gmail.com','General',3,'2026-04-14 16:00:00'),(210,'sandy@gmail.com','Plastic',16,'2026-05-14 16:00:00'),(211,'sandy@gmail.com','Paper',13,'2026-05-14 16:00:00'),(212,'sandy@gmail.com','Glass',8,'2026-05-14 16:00:00'),(213,'sandy@gmail.com','General',4,'2026-05-14 16:00:00'),(214,'sandy@gmail.com','Plastic',18,'2026-06-14 16:00:00'),(215,'sandy@gmail.com','Paper',15,'2026-06-14 16:00:00'),(216,'sandy@gmail.com','Glass',8,'2026-06-14 16:00:00'),(217,'sandy@gmail.com','General',4,'2026-06-14 16:00:00'),(218,'sandy@gmail.com','Plastic',20,'2026-07-14 16:00:00'),(219,'sandy@gmail.com','Paper',18,'2026-07-14 16:00:00'),(220,'sandy@gmail.com','Glass',10,'2026-07-14 16:00:00'),(221,'sandy@gmail.com','General',5,'2026-07-14 16:00:00'),(222,'sandy@gmail.com','Plastic',25,'2026-08-14 16:00:00'),(223,'sandy@gmail.com','Paper',20,'2026-08-14 16:00:00'),(224,'sandy@gmail.com','Glass',12,'2026-08-14 16:00:00'),(225,'sandy@gmail.com','General',6,'2026-08-14 16:00:00'),(226,'sandy@gmail.com','Plastic',30,'2026-09-14 16:00:00'),(227,'sandy@gmail.com','Paper',25,'2026-09-14 16:00:00'),(228,'sandy@gmail.com','Glass',15,'2026-09-14 16:00:00'),(229,'sandy@gmail.com','General',8,'2026-09-14 16:00:00'),(230,'sandy@gmail.com','Plastic',35,'2026-10-14 16:00:00'),(231,'sandy@gmail.com','Paper',28,'2026-10-14 16:00:00'),(232,'sandy@gmail.com','Glass',18,'2026-10-14 16:00:00'),(233,'sandy@gmail.com','General',10,'2026-10-14 16:00:00'),(234,'sandy@gmail.com','Plastic',40,'2026-11-14 16:00:00'),(235,'sandy@gmail.com','Paper',30,'2026-11-14 16:00:00'),(236,'sandy@gmail.com','Glass',20,'2026-11-14 16:00:00'),(237,'sandy@gmail.com','General',12,'2026-11-14 16:00:00'),(238,'sandy@gmail.com','Plastic',42,'2026-12-14 16:00:00'),(239,'sandy@gmail.com','Paper',32,'2026-12-14 16:00:00'),(240,'sandy@gmail.com','Glass',22,'2026-12-14 16:00:00'),(241,'sandy@gmail.com','General',14,'2026-12-14 16:00:00'),(242,'sandy@gmail.com','Plastic',0.5,'2026-03-07 09:55:15'),(243,'sandy@gmail.com','Plastic',1,'2026-03-07 12:57:27'),(244,'sandy@gmail.com','Plastic',0.5,'2026-03-07 15:52:44'),(245,'gcmengli@gmail.com','Plastic',8.5,'2026-03-10 01:22:03'),(246,'gcmengli@gmail.com','Paper',1.5,'2026-03-10 01:23:40'),(247,'gcmengli@gmail.com','General',3.5,'2026-03-10 01:24:35'),(248,'gcmengli@gmail.com','General',0.5,'2026-03-10 01:33:18'),(249,'gcmengli@gmail.com','Food',2,'2026-03-11 14:23:26'),(250,'gcmengli@gmail.com','Glass',2.5,'2026-03-11 14:24:23'),(251,'gcmengli@gmail.com','Clothes',5,'2026-03-11 14:25:09'),(252,'gcmengli@gmail.com','Shoes',6.5,'2026-03-11 14:25:55'),(253,'gcmengli@gmail.com','Mixed trash',9,'2026-03-11 14:26:51'),(254,'gcmengli@gmail.com','Plastic',5,'2026-03-11 14:39:25'),(255,'gcmengli@gmail.com','Paper',0.5,'2026-03-11 14:42:57'),(256,'gcmengli@gmail.com','Glass',0.5,'2026-03-11 14:43:51'),(257,'jamie@email.com','Glass',5,'2026-03-30 15:08:48'),(258,'jamie@email.com','Food',8.3,'2026-03-30 15:10:01'),(259,'jamie@email.com','Paper',0.5,'2026-03-30 15:12:20'),(260,'jamie@email.com','Food',6,'2026-03-30 15:13:49'),(261,'jamie@email.com','Shoes',8,'2026-03-30 15:19:12'),(262,'jamie@email.com','Mixed trash',8.5,'2026-03-30 15:42:51'),(263,'jamie@email.com','Food',9.9,'2026-03-30 15:44:27'),(264,'jamie@email.com','Plastic',7,'2026-03-31 03:29:00'),(265,'jamie@email.com','Clothes',4.5,'2026-03-31 03:29:54'),(266,'jamie@email.com','General',0.5,'2026-03-31 03:32:27'),(267,'gracie@email.com','Plastic',12,'2026-04-09 15:53:36'),(268,'gracie@email.com','Paper',0.5,'2026-04-09 15:56:35'),(269,'gracey@email.com','Plastic',5,'2026-04-10 02:17:46'),(270,'gracey@email.com','Glass',0.5,'2026-04-10 02:20:35'),(271,'gracey@email.com','Food',8,'2026-04-10 02:21:47'),(272,'jessiegoh2110@gmail.com','Paper',500,'2026-04-10 02:50:05'),(273,'jessiegoh2110@gmail.com','General',0.5,'2026-04-10 02:52:10'),(274,'jamie@email.com','Paper',0.5,'2026-04-15 11:23:07'),(275,'jamie@email.com','Paper',1,'2026-04-15 11:24:02'),(276,'gracee@email.com','Plastic',5,'2026-04-20 16:12:42'),(277,'gracee@email.com','General',0.5,'2026-04-20 16:15:15'),(278,'graceee@email.com','Plastic',6,'2026-04-20 16:36:46'),(279,'graceee@email.com','General',0.5,'2026-04-20 16:38:07'),(280,'halen@email.com','Plastic',7,'2026-04-20 17:01:26'),(281,'halen@email.com','Glass',0.5,'2026-04-20 17:04:08');
/*!40000 ALTER TABLE `waste_logs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-21 20:26:55
