-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 192.168.1.143    Database: techtube
-- ------------------------------------------------------
-- Server version	8.0.31

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
-- Table structure for table `artikkel`
--

DROP TABLE IF EXISTS `artikkel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artikkel` (
  `artikkel_id` int NOT NULL AUTO_INCREMENT,
  `tittel` varchar(45) NOT NULL,
  `moduler` mediumtext NOT NULL,
  `lagt_til_av_id` int NOT NULL,
  `lagt_til_dato` int NOT NULL,
  `tema_id` int NOT NULL,
  PRIMARY KEY (`artikkel_id`),
  KEY `art2bruker_idx` (`lagt_til_av_id`),
  KEY `art2tema_idx` (`tema_id`),
  CONSTRAINT `art2bruker` FOREIGN KEY (`lagt_til_av_id`) REFERENCES `brukere` (`bruker_id`),
  CONSTRAINT `art2tema` FOREIGN KEY (`tema_id`) REFERENCES `tema` (`tema_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artikkel`
--

LOCK TABLES `artikkel` WRITE;
/*!40000 ALTER TABLE `artikkel` DISABLE KEYS */;
INSERT INTO `artikkel` VALUES (1,'Hvordan lage en artikkel','[{\"type\":\"undertittel\",\"tekst\":\"Hei maxim\"},{\"type\":\"brødtekst\",\"tekst\":\"Brødtekst\"}]',1,1667988016,1),(46,'Økonom om priskrisen','[{\"type\":\"undertittel\",\"tekst\":\"Noen sliter skikkelig. Andre trenger kanskje en real hestekur.\"},{\"type\":\"brødtekst\",\"tekst\":\"Prisene fyker til værs. Renten øker i rekordfart.\\n\\nFolk er bekymret for økonomien sin.\\n\\nTips oss\\nSMS2200Tlf.2200 0000E-post2200@vg.no\\nMen mange sliter muligens mer med vaner heller enn dårlig råd, sier privatøkonom Endre Jo Reite i BN Bank til VG.\\n\\n– Gitt at folk hadde sett over forbruket, er det riktig som Norges Bank sier, de aller fleste kan håndtere renteøkningene. Vi må anerkjenne smerten det er å si opp streamingabonnementet og droppe en ferie. Og det er en reell smerte hvis du har hatt flere tiår med gode tider.\\n\\nReite er direktør for personmarked, og har i en årrekke analysert nordmenns forbruk over tid.\"},{\"type\":\"undertittel\",\"tekst\":\"Mange har makset lån\\n\"},{\"type\":\"brødtekst\",\"tekst\":\"Det er kanskje noen som kan kjenne seg igjen i at måtehold ikke er helt beskrivende for sitt eget forbruk de siste årene.\\n\\n– Og det er naturlig, for vi har hatt en lang periode der vi har hatt lave renter og strømpriser, som har gjort at man gradvis har økt boliggjelden sin.\\n\\nSpesielt i østlandsområdet og de store byene har lav rente gjort at man kanskje har makset lånet, og likevel hatt mye å rutte med.\"}]',2,1668669851,1),(48,'Karoline Kristensen','[{\"type\":\"undertittel\",\"tekst\":\"Beskrivelse\"},{\"type\":\"brødtekst\",\"tekst\":\"Elevene skal i grupper planlegge og gjennomføre en økt i hallen som de leder resten av klassen igjennom. Elevene må gjennom øktplanen og den praktiske gjennomførelsen vise til hvordan økten kan bidra til medelevers læring.\"},{\"type\":\"undertittel\",\"tekst\":\"Kommentar\"},{\"type\":\"brødtekst\",\"tekst\":\"Vel gjennomført elevstyrt økt. Denne økten ser jeg at dere har planlagt godt på forhånd, økten har god struktur, dere gjennomfører den planlagte økten, tilpasser ved behov og går grundig gjennom øvelser og aktiviteter. Som instruktører snakker dere høyt og tydelig og viser gode kunnskaper om aktiviteten, ferdigheter og regler. Videre kontrollerer dere om øvelsene blir gjennomført på riktig måte, dere samler medelever ved beskjeder og gir positive tilbakemeldinger til medelever under aktivitetene – BRA! En ting som kan arbeides mer med: 1. Til neste gang – hvordan an dere øke aktiviteten blant deltakerne i hinderløypen? Rekken med elever som venter på sin tur blir lang, kunne dere ha organisert dette annerledes for å øke aktiviteten deres?\\n\"},{\"type\":\"undertittel\",\"tekst\":\"Eksamenstype\"},{\"type\":\"brødtekst\",\"tekst\":\"Karakter og kommentar\\n\"},{\"type\":\"undertittel\",\"tekst\":\"Kompetansemål\"},{\"type\":\"brødtekst\",\"tekst\":\"Gjennomføre leikar, idrettsaktivitetar og andre bevegelsesaktivitetar og forstå korleis ulike aktivitetar påverkar og utviklar koordinasjon, styrke, uthald og bevegelegheit\\nPraktisere reglar for å delta i ulike bevegelsesaktivitetar og medverke til læring for andre\\n\"}]',2,1668670343,1),(63,'Fortnite','[{\"type\":\"undertittel\",\"tekst\":\"Maxim er kul\"},{\"type\":\"brødtekst\",\"tekst\":\"Jul er gøy, Nei\\nJa. Klasserommet er fint pyntet, men mangler litt godteri\\n\"}]',2,1669716218,1);
/*!40000 ALTER TABLE `artikkel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bruker_rolle`
--

DROP TABLE IF EXISTS `bruker_rolle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bruker_rolle` (
  `bruker_rolle_id` int NOT NULL AUTO_INCREMENT,
  `rolle_navn` varchar(45) NOT NULL,
  `autoritet` int NOT NULL,
  PRIMARY KEY (`bruker_rolle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bruker_rolle`
--

LOCK TABLES `bruker_rolle` WRITE;
/*!40000 ALTER TABLE `bruker_rolle` DISABLE KEYS */;
INSERT INTO `bruker_rolle` VALUES (1,'administrator',1),(2,'intern_2it',2),(3,'bruker',3);
/*!40000 ALTER TABLE `bruker_rolle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brukere`
--

DROP TABLE IF EXISTS `brukere`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brukere` (
  `bruker_id` int NOT NULL AUTO_INCREMENT,
  `brukernavn` varchar(45) NOT NULL,
  `passord` varchar(45) NOT NULL,
  `rolle_id` int NOT NULL,
  PRIMARY KEY (`bruker_id`),
  KEY `bruker2brukerrolle_idx` (`rolle_id`),
  KEY `bruker2role_idx` (`rolle_id`),
  CONSTRAINT `bruker2role` FOREIGN KEY (`rolle_id`) REFERENCES `bruker_rolle` (`bruker_rolle_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brukere`
--

LOCK TABLES `brukere` WRITE;
/*!40000 ALTER TABLE `brukere` DISABLE KEYS */;
INSERT INTO `brukere` VALUES (1,'largis21','qwerty',1),(2,'maxmak21','U2FsdGVkX18g7cm1h2yilejD4mur70CDbNGqBuYsNLg=',1),(15,'sjakgutten82','U2FsdGVkX19BjdWrqN8jfxY3cmyN8bGWNIXxNql2VD4=',3),(17,'endre','U2FsdGVkX192Wu/XGpaftSqT5mFDBhli5qn9dCHFNP0=',3);
/*!40000 ALTER TABLE `brukere` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `katalog`
--

DROP TABLE IF EXISTS `katalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `katalog` (
  `katalog_id` int NOT NULL,
  `navn` varchar(45) NOT NULL,
  `beskrivelse` varchar(45) NOT NULL,
  PRIMARY KEY (`katalog_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `katalog`
--

LOCK TABLES `katalog` WRITE;
/*!40000 ALTER TABLE `katalog` DISABLE KEYS */;
INSERT INTO `katalog` VALUES (1,'Intern','Katalog for interne dokumenter');
/*!40000 ALTER TABLE `katalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tema`
--

DROP TABLE IF EXISTS `tema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tema` (
  `tema_id` int NOT NULL AUTO_INCREMENT,
  `navn` varchar(45) NOT NULL,
  `beskrivelse` varchar(45) NOT NULL,
  `kat_id` int NOT NULL,
  PRIMARY KEY (`tema_id`),
  KEY `tem2kat_idx` (`kat_id`),
  CONSTRAINT `tem2kat` FOREIGN KEY (`kat_id`) REFERENCES `katalog` (`katalog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tema`
--

LOCK TABLES `tema` WRITE;
/*!40000 ALTER TABLE `tema` DISABLE KEYS */;
INSERT INTO `tema` VALUES (1,'Annet','Temaer som ikke passer inn i andre temaer',1),(2,'Driftsmonitor','test',1),(3,'Automatisk backup','testtest',1);
/*!40000 ALTER TABLE `tema` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-30 12:56:49
