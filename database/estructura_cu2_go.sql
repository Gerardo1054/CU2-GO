-- MySQL dump 10.13  Distrib 8.4.13, for Linux (aarch64)
--
-- Host: localhost    Database: cu2_go
-- ------------------------------------------------------
-- Server version	8.4.13

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
-- Table structure for table `edificios`
--

DROP TABLE IF EXISTS `edificios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `edificios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `evidencias_seguimiento`
--

DROP TABLE IF EXISTS `evidencias_seguimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidencias_seguimiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seguimiento_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `ruta_archivo` varchar(500) NOT NULL,
  `tipo` enum('imagen','video') NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_evidencia_seguimiento` (`seguimiento_id`),
  KEY `fk_evidencia_usuario` (`usuario_id`),
  CONSTRAINT `fk_evidencia_seguimiento` FOREIGN KEY (`seguimiento_id`) REFERENCES `seguimiento` (`id`),
  CONSTRAINT `fk_evidencia_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incidencias`
--

DROP TABLE IF EXISTS `incidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text NOT NULL,
  `categoria` enum('computo','proyectores','internet','mobiliario','electricidad','otros') NOT NULL,
  `tipo_problema` varchar(50) NOT NULL DEFAULT 'sin_especificar',
  `estado` enum('recibida','en_proceso','pendiente_validacion','arreglada') DEFAULT 'recibida',
  `usuario_id` int NOT NULL,
  `docente_id` int DEFAULT NULL,
  `salon_id` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `evidencia_nombre` varchar(255) DEFAULT NULL,
  `evidencia_ruta` varchar(500) DEFAULT NULL,
  `evidencia_tipo` enum('imagen','video') DEFAULT NULL,
  `recurso_id` int DEFAULT NULL,
  `recurso_activo_id` int GENERATED ALWAYS AS ((case when ((`recurso_id` is not null) and (`estado` in (_utf8mb4'recibida',_utf8mb4'en_proceso',_utf8mb4'pendiente_validacion'))) then `recurso_id` else NULL end)) STORED,
  `recurso_problema_activo` varchar(100) GENERATED ALWAYS AS ((case when ((`recurso_id` is not null) and (`estado` in (_utf8mb4'recibida',_utf8mb4'en_proceso',_utf8mb4'pendiente_validacion'))) then concat(`recurso_id`,_utf8mb4':',`tipo_problema`) else NULL end)) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_recurso_tipo_problema_activo` (`recurso_problema_activo`),
  KEY `usuario_id` (`usuario_id`),
  KEY `salon_id` (`salon_id`),
  KEY `idx_incidencias_recurso` (`recurso_id`),
  KEY `fk_incidencias_docente` (`docente_id`),
  CONSTRAINT `fk_incidencias_docente` FOREIGN KEY (`docente_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_incidencias_recurso` FOREIGN KEY (`recurso_id`) REFERENCES `recursos` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `incidencias_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `incidencias_ibfk_2` FOREIGN KEY (`salon_id`) REFERENCES `salones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `salon_id` int NOT NULL,
  `codigo` varchar(40) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `tipo` enum('computadora','monitor','teclado','mouse','multicontacto','aire_acondicionado','lampara','television','proyector','mesa','silla','contacto','otro') NOT NULL DEFAULT 'otro',
  `categoria` enum('computo','electricidad','climatizacion','iluminacion','audiovisual','mobiliario','otros') NOT NULL DEFAULT 'otros',
  `posicion_x` decimal(5,2) NOT NULL DEFAULT '50.00',
  `posicion_y` decimal(5,2) NOT NULL DEFAULT '50.00',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_recurso_salon_codigo` (`salon_id`,`codigo`),
  KEY `idx_recursos_salon_categoria` (`salon_id`,`categoria`),
  CONSTRAINT `fk_recursos_salon` FOREIGN KEY (`salon_id`) REFERENCES `salones` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=43602 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `salones`
--

DROP TABLE IF EXISTS `salones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `edificio_id` int NOT NULL,
  `tipo_espacio` enum('laboratorio','normal','sin_clasificar') NOT NULL DEFAULT 'sin_clasificar',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`,`edificio_id`),
  KEY `edificio_id` (`edificio_id`),
  CONSTRAINT `salones_ibfk_1` FOREIGN KEY (`edificio_id`) REFERENCES `edificios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=481 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seguimiento`
--

DROP TABLE IF EXISTS `seguimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguimiento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `incidencia_id` int NOT NULL,
  `administrador_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `observacion` text NOT NULL,
  `estado_anterior` varchar(30) DEFAULT NULL,
  `estado_nuevo` varchar(30) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `incidencia_id` (`incidencia_id`),
  KEY `administrador_id` (`administrador_id`),
  KEY `fk_seguimiento_usuario` (`usuario_id`),
  CONSTRAINT `fk_seguimiento_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `seguimiento_ibfk_1` FOREIGN KEY (`incidencia_id`) REFERENCES `incidencias` (`id`),
  CONSTRAINT `seguimiento_ibfk_2` FOREIGN KEY (`administrador_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('alumno','docente','administrador') NOT NULL DEFAULT 'alumno',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-14 22:37:50
