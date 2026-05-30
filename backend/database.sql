-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: zephyr.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Table structure for table `canjes_puntos`
--

DROP TABLE IF EXISTS `canjes_puntos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canjes_puntos` (
  `id_canje` bigint NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) NOT NULL,
  `fecha_canje` datetime(6) NOT NULL,
  `puntos_usados` int NOT NULL,
  `tipo_canje` varchar(255) NOT NULL,
  `usado` bit(1) NOT NULL,
  `id_usuario` bigint NOT NULL,
  PRIMARY KEY (`id_canje`),
  UNIQUE KEY `UK_59puy198mhwaqn699gl32q49w` (`codigo`),
  KEY `FKbx1arkfyomhgvw9b37so0sflb` (`id_usuario`),
  CONSTRAINT `FKbx1arkfyomhgvw9b37so0sflb` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canjes_puntos`
--

LOCK TABLES `canjes_puntos` WRITE;
/*!40000 ALTER TABLE `canjes_puntos` DISABLE KEYS */;
INSERT INTO `canjes_puntos` VALUES (1,'DESC-FEB9B825','2026-05-26 17:29:11.562338',500,'DESCUENTO_5',_binary '\0',17),(2,'DESC-B520A23A','2026-05-26 20:47:54.694834',500,'DESCUENTO_5',_binary '\0',15),(3,'DESC-A2A129F0','2026-05-26 21:11:31.968488',500,'DESCUENTO_5',_binary '\0',17),(4,'DESC-C50CC656','2026-05-26 21:34:21.936353',500,'DESCUENTO_5',_binary '\0',16);
/*!40000 ALTER TABLE `canjes_puntos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` bigint NOT NULL AUTO_INCREMENT,
  `fecha_creacion` datetime(6) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'2026-02-24 12:17:11.000000','PlayStation 5','PLATAFORMA'),(2,'2026-02-24 12:17:11.000000','Xbox Series X','PLATAFORMA'),(3,'2026-02-24 12:17:11.000000','Nintendo Switch','PLATAFORMA'),(4,'2026-02-24 12:17:11.000000','PC','PLATAFORMA'),(5,'2026-02-24 12:17:11.000000','PlayStation 4','PLATAFORMA'),(6,'2026-02-24 12:17:11.000000','Xbox One','PLATAFORMA'),(7,'2026-02-24 12:17:11.000000','Videojuego','TIPO_ARTICULO'),(8,'2026-02-24 12:17:11.000000','Accesorio','TIPO_ARTICULO'),(9,'2026-02-24 12:17:11.000000','Consola','TIPO_ARTICULO'),(10,'2026-02-24 12:17:11.000000','Merchandise','TIPO_ARTICULO'),(11,'2026-02-24 12:17:11.000000','Nuevo','ESTADO_ARTICULO'),(12,'2026-02-24 12:17:11.000000','Como nuevo','ESTADO_ARTICULO'),(13,'2026-02-24 12:17:11.000000','Buen estado','ESTADO_ARTICULO'),(14,'2026-02-24 12:17:11.000000','En uso','ESTADO_ARTICULO'),(15,'2026-02-24 12:17:11.000000','Defectuoso','ESTADO_ARTICULO'),(16,'2026-02-24 12:17:11.000000','Español','IDIOMA'),(17,'2026-02-24 12:17:11.000000','Inglés','IDIOMA'),(18,'2026-02-24 12:17:11.000000','Francés','IDIOMA'),(19,'2026-02-24 12:17:11.000000','Alemán','IDIOMA'),(20,'2026-02-24 12:17:11.000000','Europa','REGION'),(21,'2026-02-24 12:17:11.000000','América del Norte','REGION'),(22,'2026-02-24 12:17:11.000000','América del Sur','REGION'),(23,'2026-02-24 12:17:11.000000','Asia','REGION');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenes`
--

DROP TABLE IF EXISTS `imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenes` (
  `id_imagen` bigint NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `ruta_imagen` varchar(255) NOT NULL,
  `id_publicacion` bigint NOT NULL,
  `public_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_imagen`),
  KEY `FKb7b5ka5ew9lyh5okldnmq6lwx` (`id_publicacion`),
  CONSTRAINT `FKb7b5ka5ew9lyh5okldnmq6lwx` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenes`
--

LOCK TABLES `imagenes` WRITE;
/*!40000 ALTER TABLE `imagenes` DISABLE KEYS */;
INSERT INTO `imagenes` VALUES (32,NULL,'2026-05-26 17:23:14.231766','https://res.cloudinary.com/drq4f7l51/image/upload/v1779816193/dvksx2rghgdn69qfqgjo.webp',46,'dvksx2rghgdn69qfqgjo'),(33,NULL,'2026-05-26 17:25:36.997824','https://res.cloudinary.com/drq4f7l51/image/upload/v1779816336/nc0mtmidrnfacaqc2yav.webp',47,'nc0mtmidrnfacaqc2yav'),(34,NULL,'2026-05-26 17:32:55.172736','https://res.cloudinary.com/drq4f7l51/image/upload/v1779816774/kci9fk6axezxl79s2uyl.webp',48,'kci9fk6axezxl79s2uyl'),(35,NULL,'2026-05-26 17:33:46.157815','https://res.cloudinary.com/drq4f7l51/image/upload/v1779816825/wicz56jur2nswcgilf3d.webp',49,'wicz56jur2nswcgilf3d'),(36,NULL,'2026-05-26 17:38:39.642658','https://res.cloudinary.com/drq4f7l51/image/upload/v1779817119/tedwt8mpkwze0ftu1mo4.webp',51,'tedwt8mpkwze0ftu1mo4'),(41,NULL,'2026-05-26 21:35:02.776393','https://res.cloudinary.com/drq4f7l51/image/upload/v1779831302/m2j9k3mhhdk4s3wiuyrr.webp',56,'m2j9k3mhhdk4s3wiuyrr'),(42,NULL,'2026-05-26 21:35:04.074033','https://res.cloudinary.com/drq4f7l51/image/upload/v1779831303/onl94sfoqjmgmxjfjlyc.webp',56,'onl94sfoqjmgmxjfjlyc');
/*!40000 ALTER TABLE `imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intercambios`
--

DROP TABLE IF EXISTS `intercambios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intercambios` (
  `id_intercambio` bigint NOT NULL AUTO_INCREMENT,
  `estado` enum('PENDIENTE','ACEPTADA','RECHAZADA','CANCELADA','COMPLETADA') DEFAULT 'PENDIENTE',
  `fecha_creacion` datetime(6) NOT NULL,
  `mensaje` text,
  `id_publicacion` bigint NOT NULL,
  `id_solicitado` bigint NOT NULL,
  `id_solicitante` bigint NOT NULL,
  `completado_por_solicitante` tinyint(1) DEFAULT '0',
  `completado_por_solicitado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_intercambio`),
  KEY `FK2pfbewiden5kgvesea7kftn1o` (`id_publicacion`),
  KEY `FKn1klasr4eb2549wklwupoo0r8` (`id_solicitado`),
  KEY `FKqkmpn7bb8t6nmpao0d965rtoh` (`id_solicitante`),
  CONSTRAINT `FK2pfbewiden5kgvesea7kftn1o` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`),
  CONSTRAINT `FKn1klasr4eb2549wklwupoo0r8` FOREIGN KEY (`id_solicitado`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `FKqkmpn7bb8t6nmpao0d965rtoh` FOREIGN KEY (`id_solicitante`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intercambios`
--

LOCK TABLES `intercambios` WRITE;
/*!40000 ALTER TABLE `intercambios` DISABLE KEYS */;
INSERT INTO `intercambios` VALUES (4,'COMPLETADA','2026-05-26 21:35:17.792538','me gusta el juego',56,24,16,1,1);
/*!40000 ALTER TABLE `intercambios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicaciones`
--

DROP TABLE IF EXISTS `publicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicaciones` (
  `id_publicacion` bigint NOT NULL AUTO_INCREMENT,
  `descripcion_estado` text,
  `destacado` bit(1) DEFAULT NULL,
  `estado_publicacion` enum('ACTIVA','DESACTIVADA') NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `tipo_transaccion` enum('VENTA','INTERCAMBIO') NOT NULL,
  `estado_articulo_id` bigint DEFAULT NULL,
  `idioma_id` bigint DEFAULT NULL,
  `region_id` bigint DEFAULT NULL,
  `id_usuario` bigint NOT NULL,
  `descripcion` text,
  `titulo` varchar(255) DEFAULT NULL,
  `plataforma_id` bigint DEFAULT NULL,
  `tipo_articulo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id_publicacion`),
  KEY `FKgop60o93bbpyx4k2tkjtq0hvb` (`estado_articulo_id`),
  KEY `FK9sabyk5cdxee05q7ob3knbcmh` (`idioma_id`),
  KEY `FKa5ihq0ls02v4e5ighbjuux81x` (`region_id`),
  KEY `FKk477xvix6omjoytndeqcneh8m` (`id_usuario`),
  KEY `FK9cox2mfbhk387940gyaitmjpt` (`plataforma_id`),
  KEY `FKc683skvftrd9mdce90apd521d` (`tipo_articulo_id`),
  CONSTRAINT `FK9cox2mfbhk387940gyaitmjpt` FOREIGN KEY (`plataforma_id`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `FK9sabyk5cdxee05q7ob3knbcmh` FOREIGN KEY (`idioma_id`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `FKa5ihq0ls02v4e5ighbjuux81x` FOREIGN KEY (`region_id`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `FKc683skvftrd9mdce90apd521d` FOREIGN KEY (`tipo_articulo_id`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `FKgop60o93bbpyx4k2tkjtq0hvb` FOREIGN KEY (`estado_articulo_id`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `FKk477xvix6omjoytndeqcneh8m` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicaciones`
--

LOCK TABLES `publicaciones` WRITE;
/*!40000 ALTER TABLE `publicaciones` DISABLE KEYS */;
INSERT INTO `publicaciones` VALUES (46,'Esto es un estado',_binary '\0','ACTIVA','2026-05-26 17:23:12.361986',35.00,'VENTA',11,16,20,17,'Videojuego Elden Ring para PC','Elden Ring',4,NULL),(47,'',_binary '\0','ACTIVA','2026-05-26 17:25:35.037088',0.00,'INTERCAMBIO',13,16,20,17,'Juego Mario Galaxy','Mario Galaxy',3,NULL),(48,'Solo tiene un pequeño desperfecto en un lateral',_binary '\0','ACTIVA','2026-05-26 17:32:53.851143',15.00,'VENTA',12,16,20,16,'Videojuego Hollow Knight','Hollow Knight',3,NULL),(49,'',_binary '\0','ACTIVA','2026-05-26 17:33:44.607057',40.00,'VENTA',11,17,20,16,'','Baldurs Gate',2,NULL),(51,'',_binary '\0','ACTIVA','2026-05-26 17:38:38.210555',55.00,'VENTA',11,16,20,15,'Videojuego Dune','Dune',4,NULL),(56,'esta perfecto',_binary '\0','ACTIVA','2026-05-26 21:35:01.080888',0.00,'INTERCAMBIO',11,16,20,24,'juego zelda','Zeld',3,NULL);
/*!40000 ALTER TABLE `publicaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas` (
  `id_resena` bigint NOT NULL AUTO_INCREMENT,
  `comentario` text,
  `fecha_creacion` datetime(6) NOT NULL,
  `puntuacion` int NOT NULL,
  `id_autor` bigint NOT NULL,
  `id_publicacion` bigint DEFAULT NULL,
  `id_receptor` bigint NOT NULL,
  `id_transaccion` bigint DEFAULT NULL,
  PRIMARY KEY (`id_resena`),
  KEY `FKfp10j6rycwoysc26ncpc8ed0o` (`id_autor`),
  KEY `FKcxowb2st8ewf4r48bphm54ybn` (`id_publicacion`),
  KEY `FKnefc1q4v8dvsananbc5bad5he` (`id_receptor`),
  KEY `FKoov0ccpyg010wwa397q4w0m8` (`id_transaccion`),
  CONSTRAINT `FKcxowb2st8ewf4r48bphm54ybn` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`),
  CONSTRAINT `FKfp10j6rycwoysc26ncpc8ed0o` FOREIGN KEY (`id_autor`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `FKnefc1q4v8dvsananbc5bad5he` FOREIGN KEY (`id_receptor`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `FKoov0ccpyg010wwa397q4w0m8` FOREIGN KEY (`id_transaccion`) REFERENCES `transacciones` (`id_transaccion`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
INSERT INTO `resenas` VALUES (8,'Excelente','2026-05-26 17:44:02.759946',5,15,48,16,NULL),(14,'Todo perfecto','2026-05-26 20:45:51.316193',5,16,51,15,NULL),(15,'Todo perfecto','2026-05-26 21:10:29.255114',5,21,49,16,NULL),(18,'muy bien','2026-05-26 21:36:23.542127',5,16,56,24,NULL);
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transacciones`
--

DROP TABLE IF EXISTS `transacciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacciones` (
  `id_transaccion` bigint NOT NULL AUTO_INCREMENT,
  `comision` decimal(10,2) DEFAULT NULL,
  `estado` enum('PENDIENTE','EN_TRANSITO','COMPLETADA','CANCELADA','DEVUELTA') NOT NULL,
  `fecha_transaccion` datetime(6) NOT NULL,
  `precio_final` decimal(10,2) NOT NULL,
  `tipo` enum('VENTA','INTERCAMBIO') NOT NULL,
  `id_comprador` bigint NOT NULL,
  `id_publicacion` bigint NOT NULL,
  `id_vendedor` bigint NOT NULL,
  PRIMARY KEY (`id_transaccion`),
  KEY `FKto0r3uyue3fx80ephyj2dt3wb` (`id_comprador`),
  KEY `FKo9ifcew00vawvjb1oy4ajrwbr` (`id_publicacion`),
  KEY `FKjet4iksyw192x4l5qhavr9xt6` (`id_vendedor`),
  CONSTRAINT `FKjet4iksyw192x4l5qhavr9xt6` FOREIGN KEY (`id_vendedor`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `FKo9ifcew00vawvjb1oy4ajrwbr` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`),
  CONSTRAINT `FKto0r3uyue3fx80ephyj2dt3wb` FOREIGN KEY (`id_comprador`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transacciones`
--

LOCK TABLES `transacciones` WRITE;
/*!40000 ALTER TABLE `transacciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `transacciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL DEFAULT 1,
  `contrasena` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `nombre_usuario` varchar(255) NOT NULL,
  `puntos_acumulados` bigint NOT NULL,
  `reputacion_media` decimal(3,2) NOT NULL,
  `rol` enum('INVITADO','REGISTRADO','ADMIN') NOT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `verificado_identidad` bit(1) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `UK_kfsp0s1tflm1cwlj8idhqsad0` (`email`),
  UNIQUE KEY `UK_of5vabgukahdwmgxk4kjrbu98` (`nombre_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin123','admin@looteria.com','2026-02-24 12:17:11.000000','admin',1000,5.00,'ADMIN','España',_binary ''),(15,'2.Pepito.3','raul@gmail.com','2026-05-26 17:18:08.892636','rauulvt',50,5.00,'REGISTRADO','Sevilla',_binary ''),(16,'2.Josemi.3','josemi@gmail.com','2026-05-26 17:19:09.444512','jmzerpa06',150,5.00,'REGISTRADO','Bollullos',_binary ''),(17,'2.Israel.3','israel@gmail.com','2026-05-26 17:19:43.455302','narvaaez',125,0.00,'REGISTRADO','',_binary '\0'),(21,'2.Antonio.3','antonio@gmail.com','2026-05-26 21:06:55.983154','Antonio',75,4.00,'REGISTRADO','Huelva',_binary '\0'),(24,'2.Pepe.3','pepe@gmail.com','2026-05-26 21:30:21.997708','Pepe',175,5.00,'REGISTRADO','Sevilla',_binary '');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verificaciones`
--

DROP TABLE IF EXISTS `verificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verificaciones` (
  `id_verificacion` bigint NOT NULL AUTO_INCREMENT,
  `comentario_admin` text,
  `estado` enum('PENDIENTE','APROBADA','RECHAZADA','CANCELADA') NOT NULL,
  `fecha_respuesta` datetime(6) DEFAULT NULL,
  `fecha_solicitud` datetime(6) NOT NULL,
  `id_admin_verificador` bigint DEFAULT NULL,
  `id_publicacion` bigint NOT NULL,
  `id_transaccion` bigint NOT NULL,
  PRIMARY KEY (`id_verificacion`),
  KEY `FKt02845aviiw3q2t3av43fb1d2` (`id_admin_verificador`),
  KEY `FKq05euy8gh20kh5e2bm1s3ollo` (`id_publicacion`),
  KEY `FK16q55ep0h7jihgoauasg9apdj` (`id_transaccion`),
  CONSTRAINT `FK16q55ep0h7jihgoauasg9apdj` FOREIGN KEY (`id_transaccion`) REFERENCES `transacciones` (`id_transaccion`),
  CONSTRAINT `FKq05euy8gh20kh5e2bm1s3ollo` FOREIGN KEY (`id_publicacion`) REFERENCES `publicaciones` (`id_publicacion`),
  CONSTRAINT `FKt02845aviiw3q2t3av43fb1d2` FOREIGN KEY (`id_admin_verificador`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verificaciones`
--

LOCK TABLES `verificaciones` WRITE;
/*!40000 ALTER TABLE `verificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `verificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_codes`
--

DROP TABLE IF EXISTS `verification_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_codes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `fecha_expiracion` datetime(6) NOT NULL,
  `usado` bit(1) NOT NULL,
  `id_usuario` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhpsd7ln6lhrfg1tbb0g8bs48u` (`id_usuario`),
  CONSTRAINT `FKhpsd7ln6lhrfg1tbb0g8bs48u` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_codes`
--

LOCK TABLES `verification_codes` WRITE;
/*!40000 ALTER TABLE `verification_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'railway'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-30 19:10:40
