-- MySQL dump 10.13  Distrib 5.7.30, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: portal_empleados
-- ------------------------------------------------------
-- Server version	5.7.30-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `incidencias`
--

DROP TABLE IF EXISTS `incidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `incidencias` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `servicios_id` int(10) unsigned NOT NULL,
  `usuarios_id` int(10) unsigned NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_resolucion` datetime DEFAULT NULL,
  `comentario_resolucion` varchar(500) DEFAULT NULL,
  `codigo_incidencia` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_incidencias_servicios` (`servicios_id`),
  KEY `fk_incidencias_usuarios` (`usuarios_id`),
  CONSTRAINT `fk_incidencias_servicios` FOREIGN KEY (`servicios_id`) REFERENCES `servicios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_incidencias_usuarios` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidencias`
--

LOCK TABLES `incidencias` WRITE;
/*!40000 ALTER TABLE `incidencias` DISABLE KEYS */;
INSERT INTO `incidencias` VALUES (1,4,1,'No me funciona la pantalla',0,'2020-02-14 10:00:00','Se ha cambiado la pantalla',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(2,5,5,'Una ventana de la Sala 1 esta rota',0,'2020-03-20 09:00:00','Se ha cambiado el cristal',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(3,6,6,'Se me ha caido un cafe en el suelo de la cafeteria. Os agradecería que pasaseis a limpiarlo',0,'2020-03-05 12:00:00','Se ha procedido a su limpieza',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(4,7,7,'Se me ha estropeado la tarjeta de acceso',0,'2020-04-14 08:30:00','Se ha entregado una tarjeta nueva',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(5,4,8,'No funciona la impresora',1,NULL,NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(6,4,12,'Necesito instalar un programa en mi equipo',1,NULL,NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(7,5,1,'La puerta de la sala de reuniones 5 no abre',1,NULL,NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(8,5,4,'Hay agua en el suelo de la sala por una gotera',1,NULL,NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(9,7,6,'El 14/05/2020 recibiré una visita de Fernando López García con DNI 74212596R',1,NULL,NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40');
/*!40000 ALTER TABLE `incidencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `servicios_id` int(10) unsigned NOT NULL,
  `usuarios_id` int(10) unsigned NOT NULL,
  `fecha_hora_inicio_reserva` datetime NOT NULL,
  `fecha_hora_fin_reserva` datetime NOT NULL,
  `motivo_reserva` text NOT NULL,
  `codigo_reserva` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_reservas_servicios` (`servicios_id`),
  KEY `fk_reservas_usuarios` (`usuarios_id`),
  CONSTRAINT `fk_reservas_servicios` FOREIGN KEY (`servicios_id`) REFERENCES `servicios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_reservas_usuarios` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (1,1,1,'2020-04-10 11:30:00','2020-04-10 14:30:00','visita a cliente 1',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(2,2,2,'2020-04-15 09:15:00','2020-04-15 10:00:00','Reunión departamento',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(3,3,3,'2020-04-18 15:00:00','2020-04-18 16:00:00','Reserva comedor',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(4,2,9,'2020-04-03 16:00:00','2020-04-03 17:00:00','Reunión con proveedor 2',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(5,1,10,'2020-05-12 12:30:00','2020-05-12 14:00:00','Cita en Notaría',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(6,2,11,'2020-05-12 16:00:00','2020-05-12 19:00:00','Videoconferencia',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(7,3,3,'2020-05-02 14:30:00','2020-05-02 15:30:00','Reserva comedor',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(8,1,8,'2020-04-30 09:00:00','2020-04-30 15:00:00','Traslado a reunión en Sede-Coruña',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40');
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sedes`
--

DROP TABLE IF EXISTS `sedes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sedes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `codigo_postal` varchar(10) NOT NULL,
  `localidad` varchar(50) NOT NULL,
  `provincia` varchar(50) NOT NULL,
  `pais` varchar(50) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sedes`
--

LOCK TABLES `sedes` WRITE;
/*!40000 ALTER TABLE `sedes` DISABLE KEYS */;
INSERT INTO `sedes` VALUES (1,1,'Central_Coruña','Cantón Pequeño 1','15001','A Coruña','A Coruña','España','2020-06-08 10:42:39','2020-06-08 10:42:39'),(2,1,'Sede_Vigo','Rua do Principe 1','36202','Vigo','Pontevedra','España','2020-06-08 10:42:39','2020-06-08 10:42:39'),(3,1,'Sede_Santiago','Avenida Rosalia de Castro 1','15705','Santiago','A Coruña','España','2020-06-08 10:42:39','2020-06-08 10:42:39'),(4,1,'Sede_Malaga','Plaza de la Marina 1','29015','Malaga','Malaga','España','2020-06-08 10:42:39','2020-06-08 10:42:39');
/*!40000 ALTER TABLE `sedes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sedes_servicios`
--

DROP TABLE IF EXISTS `sedes_servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sedes_servicios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sedes_id` int(10) unsigned NOT NULL,
  `servicios_id` int(10) unsigned NOT NULL,
  `disponibilidad_servicios` int(10) unsigned DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_sedes_servicios_sedes_id` (`sedes_id`),
  KEY `fk_sedes_servicios_servicios_id` (`servicios_id`),
  CONSTRAINT `fk_sedes_servicios_sedes_id` FOREIGN KEY (`sedes_id`) REFERENCES `sedes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_sedes_servicios_servicios_id` FOREIGN KEY (`servicios_id`) REFERENCES `servicios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sedes_servicios`
--

LOCK TABLES `sedes_servicios` WRITE;
/*!40000 ALTER TABLE `sedes_servicios` DISABLE KEYS */;
INSERT INTO `sedes_servicios` VALUES (1,1,1,6,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(2,2,1,6,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(3,3,1,4,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(4,4,1,4,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(5,1,2,8,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(6,2,2,6,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(7,3,2,4,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(8,4,2,3,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(9,1,3,70,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(10,2,3,50,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(11,3,3,50,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(12,4,3,50,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(13,1,4,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(14,2,4,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(15,3,4,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(16,4,4,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(17,1,5,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(18,3,5,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(19,4,5,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(20,1,6,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(21,2,6,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(22,3,6,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(23,4,6,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(24,1,7,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(25,2,7,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(26,3,7,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(27,4,7,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(28,1,8,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(29,2,8,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(30,3,8,0,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(31,4,8,0,'2020-06-08 10:42:40','2020-06-08 10:42:40');
/*!40000 ALTER TABLE `sedes_servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servicios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `seccion` varchar(50) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,1,'Reserva','Vehículo','Utiliza los vehiculos electricos que pone a tú disposición la empresa para realizar visitas a provedores o a clientes','2020-06-08 10:42:40','2020-06-08 10:42:40'),(2,1,'Reserva','Sala de Reunión','Reserva una sala para realizar tus reuniones o videoconferencias','2020-06-08 10:42:40','2020-06-08 10:42:40'),(3,1,'Reserva','Plaza en el comedor','Indícanos en que turno prefieres comer y reserva tu plaza','2020-06-08 10:42:40','2020-06-08 10:42:40'),(4,1,'Incidencia','Informática','Registra tus incidencias para el departamento de informática','2020-06-08 10:42:40','2020-06-08 10:42:40'),(5,1,'Incidencia','Mantenimiento','Registra tus incidencias para el departamento de mantenimiento','2020-06-08 10:42:40','2020-06-08 10:42:40'),(6,1,'Incidencia','Limpieza','Registra tus incidencias para el departamento de limpieza','2020-06-08 10:42:40','2020-06-08 10:42:40'),(7,1,'Incidencia','Seguridad','Registra tus incidencias para el departamento de seguridad','2020-06-08 10:42:40','2020-06-08 10:42:40'),(8,1,'Incidencia','Otras','Registra aquí otro tipo de incidencias o sugerencias','2020-06-08 10:42:40','2020-06-08 10:42:40');
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo_usuario` enum('admin','user','maintenance') NOT NULL DEFAULT 'user',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `num_doc_identidad` varchar(15) DEFAULT NULL,
  `email` varchar(200) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `fecha_actualizacion_contraseña` datetime NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `localidad` varchar(50) DEFAULT NULL,
  `provincia` varchar(50) DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `codigo_registro` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sedes_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `num_doc_identidad` (`num_doc_identidad`),
  KEY `fk_usuarios_sedes` (`sedes_id`),
  CONSTRAINT `fk_usuarios_sedes` FOREIGN KEY (`sedes_id`) REFERENCES `sedes` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin',1,'Victor','Tojeiro','12121212R','vtojeiroa@gmail.com','$2b$10$h17QA.W6rk6V594Gc7ipz.DYGIDjO3OkUIUROffkQ3yS6is8Rswou','2020-06-08 12:42:40',NULL,'Calle Juan Florez 1','15004','A Coruña','A Coruña','España','981212121',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',1),(2,'maintenance',1,'Luis','González','33232323S','vtojeiroa+1@gmail.com','$2b$10$Qo33Gkrkt9AWxvAHcEirpevzLRrI1FN45yYrmzgPkfIgWzvFcgEpq','2020-06-08 12:42:40',NULL,'Ronda de Outeiro 10','15006','A Coruña','A Coruña','España','981272727',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',1),(3,'user',1,'Pedro','Sánchez','X4341345P','vtojeiroa+2@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Rua de Urzaiz 1','36201','Vigo','Pontevedra','España','986364855',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',2),(4,'user',1,'Raquel','López','12547335B','vtojeiroa+3@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Rua do Horreo 1','15702','Santiago','A Coruña','España','664112347',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',3),(5,'user',1,'David','Rodríguez','32845639X','vtojeiroa+4@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Calle Virgen de la Paloma 1','29007','Malaga','Malaga','España','951260125',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',4),(6,'user',1,'María','Bermúdez','74112368S','vtojeiroa+5@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Avenida Finisterre 1','15008','A Coruña','A Coruña','España','981246258',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',1),(7,'user',1,'Laura','Bernabé','26357849T','vtojeiroa+6@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Rua de Oporto 1','36201','Vigo','Pontevedra','España','654218994',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',2),(8,'user',1,'Martín','del Fraile','74758963V','vtojeiroa+7@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Rua do Franco 1','15702','Santiago','A Coruña','España','981752214',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',3),(9,'user',1,'Jorge','Rosal','Y2369741R','vtojeiroa+8@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Calle Eugenio Gross 1','29010','Malaga','Malaga','España','669841257',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',4),(10,'user',1,'Lucia','Fernández','33654123B','vtojeiroa+9@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Avenida Garcia Barbón 1','36201','Vigo','Pontevedra','España','675635675',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',2),(11,'user',1,'Santiago','Ramos','35674159N','vtojeiroa+10@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Rua do Vilar','15702','Santiago','A Coruña','España','981752364',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',3),(12,'user',1,'Hector','Doval','32886521A','vtojeiroa+11@gmail.com','$2b$10$mX6zIeDOG7wUUzjdDd4mPuwlPKNm9uRssPSnbOaWYTyPyPsMPEt.K','2020-06-08 12:42:40',NULL,'Paseo del Parque 1','29015','Malaga','Malaga','España','951265547',NULL,NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40',4);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valoraciones`
--

DROP TABLE IF EXISTS `valoraciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `valoraciones` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `reservas_id` int(10) unsigned DEFAULT NULL,
  `incidencias_id` int(10) unsigned DEFAULT NULL,
  `usuarios_id` int(10) unsigned NOT NULL,
  `servicios_id` int(10) unsigned NOT NULL,
  `valoracion` enum('1','2','3','4','5') NOT NULL,
  `comentario_valoracion` varchar(500) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_valoraciones_reservas` (`reservas_id`),
  KEY `fk_valoraciones_incidencias` (`incidencias_id`),
  KEY `fk_valoraciones_usuarios` (`usuarios_id`),
  KEY `fk_valoraciones_servicios` (`servicios_id`),
  CONSTRAINT `fk_valoraciones_incidencias` FOREIGN KEY (`incidencias_id`) REFERENCES `incidencias` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_valoraciones_reservas` FOREIGN KEY (`reservas_id`) REFERENCES `reservas` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_valoraciones_servicios` FOREIGN KEY (`servicios_id`) REFERENCES `servicios` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_valoraciones_usuarios` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valoraciones`
--

LOCK TABLES `valoraciones` WRITE;
/*!40000 ALTER TABLE `valoraciones` DISABLE KEYS */;
INSERT INTO `valoraciones` VALUES (1,1,NULL,1,1,'5','Genial','2020-06-08 10:42:40','2020-06-08 10:42:40'),(2,2,NULL,2,2,'4','No funcionaba la videoconferencia','2020-06-08 10:42:40','2020-06-08 10:42:40'),(3,3,NULL,3,3,'3','Tardé 10 minutos en conseguir un sitio para comer','2020-06-08 10:42:40','2020-06-08 10:42:40'),(4,NULL,1,1,4,'5','Me lo solucionaron muy rápido','2020-06-08 10:42:40','2020-06-08 10:42:40'),(5,NULL,2,5,5,'5','Muy buena gestíon','2020-06-08 10:42:40','2020-06-08 10:42:40'),(6,NULL,3,6,6,'1','Tardaron 5 horas en limpiar el suelo','2020-06-08 10:42:40','2020-06-08 10:42:40'),(7,NULL,4,8,4,'5',NULL,'2020-06-08 10:42:40','2020-06-08 10:42:40'),(8,8,NULL,8,1,'2','Cuando fui a recoger el coche no estaba, tardaron 10 minutos','2020-06-08 10:42:40','2020-06-08 10:42:40'),(9,NULL,3,6,2,'5','Genial','2020-06-08 10:42:40','2020-06-08 10:42:40');
/*!40000 ALTER TABLE `valoraciones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-08 12:54:47
