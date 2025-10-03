-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2025 at 08:45 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hidropro`
--

-- --------------------------------------------------------

--
-- Table structure for table `calendario`
--

CREATE TABLE `calendario` (
  `id_calendario` bigint(20) NOT NULL,
  `id_cliente` bigint(20) DEFAULT NULL,
  `id_equipo` bigint(20) DEFAULT NULL,
  `id_tecnico` bigint(20) DEFAULT NULL,
  `id_orden_mantenimiento` bigint(20) DEFAULT NULL,
  `id_orden_reparacion` bigint(20) DEFAULT NULL,
  `tipo_evento` enum('MANTENCION','REPARACION','EMERGENCIA','INSTALACION') DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `estado` enum('PROGRAMADO','EN_PROCESO','COMPLETADO','CANCELADO') DEFAULT NULL,
  `notificado` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `calendario`
--

INSERT INTO `calendario` (`id_calendario`, `id_cliente`, `id_equipo`, `id_tecnico`, `id_orden_mantenimiento`, `id_orden_reparacion`, `tipo_evento`, `titulo`, `descripcion`, `fecha_inicio`, `fecha_fin`, `estado`, `notificado`, `created_at`) VALUES
(1, 1, 1, 2, NULL, NULL, 'MANTENCION', 'Mantención Preventiva Trimestral', 'Mantención programada del sistema de bombeo principal', '2025-01-15 09:00:00', '2025-01-15 11:00:00', 'PROGRAMADO', 0, '2025-10-02 05:40:54'),
(2, 2, 2, 2, NULL, NULL, 'REPARACION', 'Reparación Bomba Incendio - Torre A', 'Reparación urgente en bomba de incendio, reporte de falla', '2025-01-16 14:00:00', '2025-01-16 16:30:00', 'PROGRAMADO', 0, '2025-10-02 05:40:54'),
(3, 3, 3, 2, NULL, NULL, 'INSTALACION', 'Instalación Motor Ascensor Principal', 'Instalación de nuevo motor para ascensor principal', '2025-01-18 10:00:00', '2025-01-18 13:00:00', 'PROGRAMADO', 0, '2025-10-02 05:40:54'),
(4, 5, 8, 2, NULL, NULL, 'EMERGENCIA', 'Emergencia - Sistema Presurización', 'Falla en sistema de presurización de agua, atención inmediata', '2025-01-20 08:00:00', '2025-01-20 12:00:00', 'EN_PROCESO', 1, '2025-10-02 05:40:54'),
(5, 6, 9, 2, NULL, NULL, 'MANTENCION', 'Mantención Bomba Incendio - Galpón 1', 'Mantención semestral de bomba de incendio principal', '2025-01-22 09:30:00', '2025-01-22 11:30:00', 'PROGRAMADO', 0, '2025-10-02 05:40:54');

-- --------------------------------------------------------

--
-- Table structure for table `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` bigint(20) NOT NULL,
  `n_cliente` int(11) NOT NULL,
  `rut` varchar(20) DEFAULT NULL,
  `nombre1` varchar(100) DEFAULT NULL,
  `nombre2` varchar(100) DEFAULT NULL,
  `telefono1` varchar(20) DEFAULT NULL,
  `telefono2` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `n_cliente`, `rut`, `nombre1`, `nombre2`, `telefono1`, `telefono2`, `correo`, `observaciones`) VALUES
(1, 1, '76.543.210-9', 'Edificio El Navegante', 'Navegante', '222201139', '888844236', 'pacevedoestudiojuridico@yahoo.es', 'Cliente demo'),
(2, 2, '77.123.456-1', 'Condominio Las Palmas', NULL, '229876543', NULL, 'contacto@laspalmas.cl', 'Cliente con varias torres'),
(3, 3, '78.654.321-2', 'Edificio Central Plaza', NULL, '226543210', NULL, 'admin@centralplaza.cl', 'Cliente con 2 ubicaciones'),
(4, 4, '79.111.222-3', 'Colegio San Ignacio', NULL, '227777888', NULL, 'info@sanignacio.cl', 'Institución educativa'),
(5, 5, '80.333.444-4', 'Clínica Los Olivos', NULL, '228888999', NULL, 'soporte@losolivos.cl', 'Centro de salud privado'),
(6, 6, '81.555.666-5', 'Parque Industrial Quilicura', NULL, '229999000', NULL, 'gestion@piquilicura.cl', 'Parque con varias empresas');

-- --------------------------------------------------------

--
-- Table structure for table `comunas`
--

CREATE TABLE `comunas` (
  `id` int(11) NOT NULL,
  `comuna` varchar(250) DEFAULT NULL,
  `region_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comunas`
--

INSERT INTO `comunas` (`id`, `comuna`, `region_id`) VALUES
(1, 'Arica', 1),
(2, 'Camarones', 1),
(3, 'General Lagos', 1),
(4, 'Putre', 1),
(5, 'Alto Hospicio', 2),
(6, 'Iquique', 2),
(7, 'Camiña', 2),
(8, 'Colchane', 2),
(9, 'Huara', 2),
(10, 'Pica', 2),
(11, 'Pozo Almonte', 2),
(12, 'Tocopilla', 3),
(13, 'María Elena', 3),
(14, 'Calama', 3),
(15, 'Ollague', 3),
(16, 'San Pedro de Atacama', 3),
(17, 'Antofagasta', 3),
(18, 'Mejillones', 3),
(19, 'Sierra Gorda', 3),
(20, 'Taltal', 3),
(21, 'Chañaral', 4),
(22, 'Diego de Almagro', 4),
(23, 'Copiapó', 4),
(24, 'Caldera', 4),
(25, 'Tierra Amarilla', 4),
(26, 'Vallenar', 4),
(27, 'Alto del Carmen', 4),
(28, 'Freirina', 4),
(29, 'Huasco', 4),
(30, 'La Serena', 5),
(31, 'Coquimbo', 5),
(32, 'Andacollo', 5),
(33, 'La Higuera', 5),
(34, 'Paihuano', 5),
(35, 'Vicuña', 5),
(36, 'Ovalle', 5),
(37, 'Combarbalá', 5),
(38, 'Monte Patria', 5),
(39, 'Punitaqui', 5),
(40, 'Río Hurtado', 5),
(41, 'Illapel', 5),
(42, 'Canela', 5),
(43, 'Los Vilos', 5),
(44, 'Salamanca', 5),
(45, 'La Ligua', 6),
(46, 'Cabildo', 6),
(47, 'Zapallar', 6),
(48, 'Papudo', 6),
(49, 'Petorca', 6),
(50, 'Los Andes', 6),
(51, 'San Esteban', 6),
(52, 'Calle Larga', 6),
(53, 'Rinconada', 6),
(54, 'San Felipe', 6),
(55, 'Llaillay', 6),
(56, 'Putaendo', 6),
(57, 'Santa María', 6),
(58, 'Catemu', 6),
(59, 'Panquehue', 6),
(60, 'Quillota', 6),
(61, 'La Cruz', 6),
(62, 'La Calera', 6),
(63, 'Nogales', 6),
(64, 'Hijuelas', 6),
(65, 'Valparaíso', 6),
(66, 'Viña del Mar', 6),
(67, 'Concón', 6),
(68, 'Quintero', 6),
(69, 'Puchuncaví', 6),
(70, 'Casablanca', 6),
(71, 'Juan Fernández', 6),
(72, 'San Antonio', 6),
(73, 'Cartagena', 6),
(74, 'El Tabo', 6),
(75, 'El Quisco', 6),
(76, 'Algarrobo', 6),
(77, 'Santo Domingo', 6),
(78, 'Isla de Pascua', 6),
(79, 'Quilpué', 6),
(80, 'Limache', 6),
(81, 'Olmué', 6),
(82, 'Villa Alemana', 6),
(83, 'Colina', 7),
(84, 'Lampa', 7),
(85, 'Tiltil', 7),
(86, 'Santiago', 7),
(87, 'Vitacura', 7),
(88, 'San Ramón', 7),
(89, 'San Miguel', 7),
(90, 'San Joaquín', 7),
(91, 'Renca', 7),
(92, 'Recoleta', 7),
(93, 'Quinta Normal', 7),
(94, 'Quilicura', 7),
(95, 'Pudahuel', 7),
(96, 'Providencia', 7),
(97, 'Peñalolén', 7),
(98, 'Pedro Aguirre Cerda', 7),
(99, 'Ñuñoa', 7),
(100, 'Maipú', 7),
(101, 'Macul', 7),
(102, 'Lo Prado', 7),
(103, 'Lo Espejo', 7),
(104, 'Lo Barnechea', 7),
(105, 'Las Condes', 7),
(106, 'La Reina', 7),
(107, 'La Pintana', 7),
(108, 'La Granja', 7),
(109, 'La Florida', 7),
(110, 'La Cisterna', 7),
(111, 'Independencia', 7),
(112, 'Huechuraba', 7),
(113, 'Estación Central', 7),
(114, 'El Bosque', 7),
(115, 'Conchalí', 7),
(116, 'Cerro Navia', 7),
(117, 'Cerrillos', 7),
(118, 'Puente Alto', 7),
(119, 'San José de Maipo', 7),
(120, 'Pirque', 7),
(121, 'San Bernardo', 7),
(122, 'Buin', 7),
(123, 'Paine', 7),
(124, 'Calera de Tango', 7),
(125, 'Melipilla', 7),
(126, 'Alhué', 7),
(127, 'Curacaví', 7),
(128, 'María Pinto', 7),
(129, 'San Pedro', 7),
(130, 'Isla de Maipo', 7),
(131, 'El Monte', 7),
(132, 'Padre Hurtado', 7),
(133, 'Peñaflor', 7),
(134, 'Talagante', 7),
(135, 'Codegua', 8),
(136, 'Coínco', 8),
(137, 'Coltauco', 8),
(138, 'Doñihue', 8),
(139, 'Graneros', 8),
(140, 'Las Cabras', 8),
(141, 'Machalí', 8),
(142, 'Malloa', 8),
(143, 'Mostazal', 8),
(144, 'Olivar', 8),
(145, 'Peumo', 8),
(146, 'Pichidegua', 8),
(147, 'Quinta de Tilcoco', 8),
(148, 'Rancagua', 8),
(149, 'Rengo', 8),
(150, 'Requínoa', 8),
(151, 'San Vicente de Tagua Tagua', 8),
(152, 'Chépica', 8),
(153, 'Chimbarongo', 8),
(154, 'Lolol', 8),
(155, 'Nancagua', 8),
(156, 'Palmilla', 8),
(157, 'Peralillo', 8),
(158, 'Placilla', 8),
(159, 'Pumanque', 8),
(160, 'San Fernando', 8),
(161, 'Santa Cruz', 8),
(162, 'La Estrella', 8),
(163, 'Litueche', 8),
(164, 'Marchigüe', 8),
(165, 'Navidad', 8),
(166, 'Paredones', 8),
(167, 'Pichilemu', 8),
(168, 'Curicó', 9),
(169, 'Hualañé', 9),
(170, 'Licantén', 9),
(171, 'Molina', 9),
(172, 'Rauco', 9),
(173, 'Romeral', 9),
(174, 'Sagrada Familia', 9),
(175, 'Teno', 9),
(176, 'Vichuquén', 9),
(177, 'Talca', 9),
(178, 'San Clemente', 9),
(179, 'Pelarco', 9),
(180, 'Pencahue', 9),
(181, 'Maule', 9),
(182, 'San Rafael', 9),
(183, 'Curepto', 9),
(184, 'Constitución', 9),
(185, 'Empedrado', 9),
(186, 'Río Claro', 9),
(187, 'Linares', 9),
(188, 'San Javier', 9),
(189, 'Parral', 9),
(190, 'Villa Alegre', 9),
(191, 'Longaví', 9),
(192, 'Colbún', 9),
(193, 'Retiro', 9),
(194, 'Yerbas Buenas', 9),
(195, 'Cauquenes', 9),
(196, 'Chanco', 9),
(197, 'Pelluhue', 9),
(198, 'Bulnes', 10),
(199, 'Chillán', 10),
(200, 'Chillán Viejo', 10),
(201, 'El Carmen', 10),
(202, 'Pemuco', 10),
(203, 'Pinto', 10),
(204, 'Quillón', 10),
(205, 'San Ignacio', 10),
(206, 'Yungay', 10),
(207, 'Cobquecura', 10),
(208, 'Coelemu', 10),
(209, 'Ninhue', 10),
(210, 'Portezuelo', 10),
(211, 'Quirihue', 10),
(212, 'Ránquil', 10),
(213, 'Treguaco', 10),
(214, 'San Carlos', 10),
(215, 'Coihueco', 10),
(216, 'San Nicolás', 10),
(217, 'Ñiquén', 10),
(218, 'San Fabián', 10),
(219, 'Alto Biobío', 11),
(220, 'Antuco', 11),
(221, 'Cabrero', 11),
(222, 'Laja', 11),
(223, 'Los Ángeles', 11),
(224, 'Mulchén', 11),
(225, 'Nacimiento', 11),
(226, 'Negrete', 11),
(227, 'Quilaco', 11),
(228, 'Quilleco', 11),
(229, 'San Rosendo', 11),
(230, 'Santa Bárbara', 11),
(231, 'Tucapel', 11),
(232, 'Yumbel', 11),
(233, 'Concepción', 11),
(234, 'Coronel', 11),
(235, 'Chiguayante', 11),
(236, 'Florida', 11),
(237, 'Hualpén', 11),
(238, 'Hualqui', 11),
(239, 'Lota', 11),
(240, 'Penco', 11),
(241, 'San Pedro de La Paz', 11),
(242, 'Santa Juana', 11),
(243, 'Talcahuano', 11),
(244, 'Tomé', 11),
(245, 'Arauco', 11),
(246, 'Cañete', 11),
(247, 'Contulmo', 11),
(248, 'Curanilahue', 11),
(249, 'Lebu', 11),
(250, 'Los Álamos', 11),
(251, 'Tirúa', 11),
(252, 'Angol', 12),
(253, 'Collipulli', 12),
(254, 'Curacautín', 12),
(255, 'Ercilla', 12),
(256, 'Lonquimay', 12),
(257, 'Los Sauces', 12),
(258, 'Lumaco', 12),
(259, 'Purén', 12),
(260, 'Renaico', 12),
(261, 'Traiguén', 12),
(262, 'Victoria', 12),
(263, 'Temuco', 12),
(264, 'Carahue', 12),
(265, 'Cholchol', 12),
(266, 'Cunco', 12),
(267, 'Curarrehue', 12),
(268, 'Freire', 12),
(269, 'Galvarino', 12),
(270, 'Gorbea', 12),
(271, 'Lautaro', 12),
(272, 'Loncoche', 12),
(273, 'Melipeuco', 12),
(274, 'Nueva Imperial', 12),
(275, 'Padre Las Casas', 12),
(276, 'Perquenco', 12),
(277, 'Pitrufquén', 12),
(278, 'Pucón', 12),
(279, 'Saavedra', 12),
(280, 'Teodoro Schmidt', 12),
(281, 'Toltén', 12),
(282, 'Vilcún', 12),
(283, 'Villarrica', 12),
(284, 'Valdivia', 13),
(285, 'Corral', 13),
(286, 'Lanco', 13),
(287, 'Los Lagos', 13),
(288, 'Máfil', 13),
(289, 'Mariquina', 13),
(290, 'Paillaco', 13),
(291, 'Panguipulli', 13),
(292, 'La Unión', 13),
(293, 'Futrono', 13),
(294, 'Lago Ranco', 13),
(295, 'Río Bueno', 13),
(296, 'Osorno', 14),
(297, 'Puerto Octay', 14),
(298, 'Purranque', 14),
(299, 'Puyehue', 14),
(300, 'Río Negro', 14),
(301, 'San Juan de la Costa', 14),
(302, 'San Pablo', 14),
(303, 'Calbuco', 14),
(304, 'Cochamó', 14),
(305, 'Fresia', 14),
(306, 'Frutillar', 14),
(307, 'Llanquihue', 14),
(308, 'Los Muermos', 14),
(309, 'Maullín', 14),
(310, 'Puerto Montt', 14),
(311, 'Puerto Varas', 14),
(312, 'Ancud', 14),
(313, 'Castro', 14),
(314, 'Chonchi', 14),
(315, 'Curaco de Vélez', 14),
(316, 'Dalcahue', 14),
(317, 'Puqueldón', 14),
(318, 'Queilén', 14),
(319, 'Quellón', 14),
(320, 'Quemchi', 14),
(321, 'Quinchao', 14),
(322, 'Chaitén', 14),
(323, 'Futaleufú', 14),
(324, 'Hualaihué', 14),
(325, 'Palena', 14),
(326, 'Lago Verde', 15),
(327, 'Coihaique', 15),
(328, 'Aysén', 15),
(329, 'Cisnes', 15),
(330, 'Guaitecas', 15),
(331, 'Río Ibáñez', 15),
(332, 'Chile Chico', 15),
(333, 'Cochrane', 15),
(334, 'O\'Higgins', 15),
(335, 'Tortel', 15),
(336, 'Natales', 16),
(337, 'Torres del Paine', 16),
(338, 'Laguna Blanca', 16),
(339, 'Punta Arenas', 16),
(340, 'Río Verde', 16),
(341, 'San Gregorio', 16),
(342, 'Porvenir', 16),
(343, 'Primavera', 16),
(344, 'Timaukel', 16),
(345, 'Cabo de Hornos', 16),
(346, 'Antártica', 16);

-- --------------------------------------------------------

--
-- Table structure for table `equipo_motor`
--

CREATE TABLE `equipo_motor` (
  `id_motor` bigint(20) NOT NULL,
  `id_ubicacion` bigint(20) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `potencia` decimal(10,2) DEFAULT NULL,
  `voltaje` decimal(10,2) DEFAULT NULL,
  `r` decimal(10,2) DEFAULT NULL,
  `s` decimal(10,2) DEFAULT NULL,
  `t` decimal(10,2) DEFAULT NULL,
  `serie` varchar(100) DEFAULT NULL,
  `fecha_instalacion` date DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipo_motor`
--

INSERT INTO `equipo_motor` (`id_motor`, `id_ubicacion`, `tipo`, `marca`, `modelo`, `potencia`, `voltaje`, `r`, `s`, `t`, `serie`, `fecha_instalacion`, `estado`) VALUES
(1, 2, 'Bomba Agua', 'Grundfos', 'CR15', 15.00, 380.00, 10.00, 10.20, 10.10, 'LASPAL-001', '2023-01-10', 'OPERATIVO'),
(2, 3, 'Bomba Incendio', 'KSB', 'Etanorm', 25.00, 380.00, 15.00, 15.10, 15.20, 'LASPAL-002', '2023-01-15', 'OPERATIVO'),
(3, 4, 'Ascensor Motor', 'Otis', 'XG-200', 7.50, 220.00, 5.00, 5.10, 5.20, 'CENTPLAZ-001', '2022-12-01', 'OPERATIVO'),
(4, 5, 'Ventilador Extractor', 'Siemens', 'VX-300', 3.00, 220.00, 1.00, 1.10, 1.20, 'CENTPLAZ-002', '2022-11-20', 'MANTENCIÓN'),
(5, 6, 'Bomba Piscina', 'Pentair', 'ULTRA-500', 2.00, 220.00, 0.50, 0.60, 0.55, 'SANIGN-001', '2023-02-01', 'OPERATIVO'),
(6, 7, 'Compresor Aire', 'Atlas Copco', 'GX11', 11.00, 380.00, 7.00, 7.10, 7.20, 'CLINIC-001', '2023-03-10', 'OPERATIVO'),
(7, 8, 'Bomba de Vacío', 'Busch', 'R5', 4.00, 220.00, 2.00, 2.10, 2.20, 'CLINIC-002', '2023-03-12', 'MANTENCIÓN'),
(8, 9, 'Sistema Presurización', 'Lowara', 'SVN32', 30.00, 380.00, 18.00, 18.20, 18.10, 'CLINIC-003', '2023-03-15', 'OPERATIVO'),
(9, 10, 'Bomba Incendio', 'Wilo', 'NL200', 45.00, 380.00, 25.00, 25.10, 25.20, 'QUILIC-001', '2022-05-01', 'OPERATIVO'),
(10, 11, 'Motor Extractor', 'ABB', 'M3BP', 18.50, 380.00, 9.00, 9.20, 9.10, 'QUILIC-002', '2022-05-10', 'OPERATIVO');

-- --------------------------------------------------------

--
-- Table structure for table `historial_solicitud`
--

CREATE TABLE `historial_solicitud` (
  `id_historial` bigint(20) NOT NULL,
  `id_solicitud` bigint(20) NOT NULL,
  `fecha_cambio` datetime DEFAULT NULL,
  `usuario_cambio` bigint(20) DEFAULT NULL,
  `campo_modificado` varchar(100) DEFAULT NULL,
  `valor_anterior` varchar(200) DEFAULT NULL,
  `valor_nuevo` varchar(200) DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orden_mantenimiento`
--

CREATE TABLE `orden_mantenimiento` (
  `id_orden` bigint(20) NOT NULL,
  `id_motor` bigint(20) NOT NULL,
  `id_tecnico` bigint(20) NOT NULL,
  `hora_ingreso` datetime DEFAULT NULL,
  `hora_salida` datetime DEFAULT NULL,
  `r` decimal(10,2) DEFAULT NULL,
  `s` decimal(10,2) DEFAULT NULL,
  `t` decimal(10,2) DEFAULT NULL,
  `voltaje` decimal(10,2) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `firma_cliente` varchar(200) DEFAULT NULL,
  `tipo_orden` varchar(50) DEFAULT NULL,
  `campo_adicional` varchar(200) DEFAULT NULL,
  `cambio_rodamientos` enum('SI','NO','CB') DEFAULT NULL,
  `cambio_sello` enum('SI','NO','CB') DEFAULT NULL,
  `cambio_voluta` enum('SI','NO','CB') DEFAULT NULL,
  `rebobino_campos` enum('SI','NO','CB') DEFAULT NULL,
  `protecciones_saltadas` enum('SI','NO','CB') DEFAULT NULL,
  `cambio_protecciones` enum('SI','NO','CB') DEFAULT NULL,
  `contactores_quemados` enum('SI','NO','CB') DEFAULT NULL,
  `cambio_contactores` enum('SI','NO','CB') DEFAULT NULL,
  `cambio_luces_piloto` enum('SI','NO','CB') DEFAULT NULL,
  `limpio_tablero` enum('SI','NO','CB') DEFAULT NULL,
  `cambio_presostato` enum('SI','NO','CB') DEFAULT NULL,
  `cambio_manometro` enum('SI','NO','CB') DEFAULT NULL,
  `cargo_con_aire_ep` enum('SI','NO','CB') DEFAULT NULL,
  `reviso_presion_ep` enum('SI','NO','CB') DEFAULT NULL,
  `cambio_valv_retencion` enum('SI','NO','CB') DEFAULT NULL,
  `suprimo_filtracion` enum('SI','NO','CB') DEFAULT NULL,
  `reviso_valv_compuerta` enum('SI','NO','CB') DEFAULT NULL,
  `reviso_valv_flotador` enum('SI','NO','CB') DEFAULT NULL,
  `reviso_estanque_agua` enum('SI','NO','CB') DEFAULT NULL,
  `reviso_fittings_otros` enum('SI','NO','CB') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orden_reparacion`
--

CREATE TABLE `orden_reparacion` (
  `id_orden_reparacion` bigint(20) NOT NULL,
  `id_motor` bigint(20) NOT NULL,
  `id_tecnico` bigint(20) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `progreso` enum('REALIZADO','NO_REALIZADO','EN_GESTION') DEFAULT NULL,
  `firma_cliente` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `regiones`
--

CREATE TABLE `regiones` (
  `id` int(11) NOT NULL,
  `region` varchar(64) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `regiones`
--

INSERT INTO `regiones` (`id`, `region`) VALUES
(1, 'Arica y Parinacota'),
(2, 'Tarapacá'),
(3, 'Antofagasta'),
(4, 'Atacama'),
(5, 'Coquimbo'),
(6, 'Valparaiso'),
(7, 'Metropolitana de Santiago'),
(8, 'Libertador General Bernardo O\'Higgins'),
(9, 'Maule'),
(10, 'Ñuble'),
(11, 'Biobío'),
(12, 'La Araucanía'),
(13, 'Los Ríos'),
(14, 'Los Lagos'),
(15, 'Aysén del General Carlos Ibáñez del Campo'),
(16, 'Magallanes y de la Antártica Chilena');

-- --------------------------------------------------------

--
-- Table structure for table `solicitud`
--

CREATE TABLE `solicitud` (
  `id_solicitud` bigint(20) NOT NULL,
  `id_orden` bigint(20) DEFAULT NULL,
  `tipo_orden` enum('MANTENIMIENTO','REPARACION') DEFAULT NULL,
  `estado` enum('PENDIENTE','EN_PROCESO','APROBADO','RECHAZADO') DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `fecha_revision` datetime DEFAULT NULL,
  `observaciones_admin` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ubicacion`
--

CREATE TABLE `ubicacion` (
  `id_ubicacion` bigint(20) NOT NULL,
  `id_cliente` bigint(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `region_id` int(11) NOT NULL,
  `comuna_id` int(11) NOT NULL,
  `calle` varchar(255) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ubicacion`
--

INSERT INTO `ubicacion` (`id_ubicacion`, `id_cliente`, `nombre`, `region_id`, `comuna_id`, `calle`, `numero`) VALUES
(1, 1, 'Test', 5, 30, 'Cristóbal Colón', '6145'),
(2, 2, 'Torre A', 7, 100, 'Av. Las Palmas', '1234'),
(3, 2, 'Torre B', 7, 100, 'Av. Las Palmas', '1236'),
(4, 3, 'Sede Principal', 7, 86, 'Av. Libertador B. O’Higgins', '1450'),
(5, 3, 'Estacionamiento Subterráneo', 7, 86, 'Av. Libertador B. O’Higgins', '1470'),
(6, 4, 'Campus Central', 7, 99, 'Av. Grecia', '4500'),
(7, 5, 'Edificio Principal', 7, 105, 'Av. Apoquindo', '123'),
(8, 5, 'Urgencias', 7, 105, 'Av. Apoquindo', '125'),
(9, 5, 'Pediatría', 7, 105, 'Av. Apoquindo', '127'),
(10, 6, 'Galpón 1', 7, 94, 'Av. Américo Vespucio', '5000'),
(11, 6, 'Galpón 2', 7, 94, 'Av. Américo Vespucio', '5100');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` bigint(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `rol` enum('SUPER_ADMIN','ADMIN','TECNICO') NOT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `rol`, `usuario`, `contrasena`) VALUES
(1, 'Administrador General', 'ADMIN', 'admin', '$2a$10$pv8F8mXOFgBP0PBQHbisHOKTKlHsbgyqDtnREgfD3g/FWZTAAEb7i'),
(2, 'Juan Pérez', 'TECNICO', 'tecnico', '$2a$10$pv8F8mXOFgBP0PBQHbisHOKTKlHsbgyqDtnREgfD3g/FWZTAAEb7i'),
(3, 'Super Administrador', 'SUPER_ADMIN', 'superadmin', '$2a$10$pv8F8mXOFgBP0PBQHbisHOKTKlHsbgyqDtnREgfD3g/FWZTAAEb7i');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calendario`
--
ALTER TABLE `calendario`
  ADD PRIMARY KEY (`id_calendario`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_equipo` (`id_equipo`),
  ADD KEY `id_tecnico` (`id_tecnico`),
  ADD KEY `id_orden_mantenimiento` (`id_orden_mantenimiento`),
  ADD KEY `id_orden_reparacion` (`id_orden_reparacion`);

--
-- Indexes for table `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `n_cliente` (`n_cliente`);

--
-- Indexes for table `comunas`
--
ALTER TABLE `comunas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `equipo_motor`
--
ALTER TABLE `equipo_motor`
  ADD PRIMARY KEY (`id_motor`),
  ADD KEY `id_ubicacion` (`id_ubicacion`);

--
-- Indexes for table `historial_solicitud`
--
ALTER TABLE `historial_solicitud`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_solicitud` (`id_solicitud`),
  ADD KEY `usuario_cambio` (`usuario_cambio`);

--
-- Indexes for table `orden_mantenimiento`
--
ALTER TABLE `orden_mantenimiento`
  ADD PRIMARY KEY (`id_orden`),
  ADD KEY `id_motor` (`id_motor`),
  ADD KEY `id_tecnico` (`id_tecnico`);

--
-- Indexes for table `orden_reparacion`
--
ALTER TABLE `orden_reparacion`
  ADD PRIMARY KEY (`id_orden_reparacion`),
  ADD KEY `id_motor` (`id_motor`),
  ADD KEY `id_tecnico` (`id_tecnico`);

--
-- Indexes for table `regiones`
--
ALTER TABLE `regiones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `solicitud`
--
ALTER TABLE `solicitud`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD UNIQUE KEY `id_orden` (`id_orden`);

--
-- Indexes for table `ubicacion`
--
ALTER TABLE `ubicacion`
  ADD PRIMARY KEY (`id_ubicacion`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calendario`
--
ALTER TABLE `calendario`
  MODIFY `id_calendario` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `comunas`
--
ALTER TABLE `comunas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=347;

--
-- AUTO_INCREMENT for table `equipo_motor`
--
ALTER TABLE `equipo_motor`
  MODIFY `id_motor` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `historial_solicitud`
--
ALTER TABLE `historial_solicitud`
  MODIFY `id_historial` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orden_mantenimiento`
--
ALTER TABLE `orden_mantenimiento`
  MODIFY `id_orden` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orden_reparacion`
--
ALTER TABLE `orden_reparacion`
  MODIFY `id_orden_reparacion` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `regiones`
--
ALTER TABLE `regiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `solicitud`
--
ALTER TABLE `solicitud`
  MODIFY `id_solicitud` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ubicacion`
--
ALTER TABLE `ubicacion`
  MODIFY `id_ubicacion` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `calendario`
--
ALTER TABLE `calendario`
  ADD CONSTRAINT `calendario_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  ADD CONSTRAINT `calendario_ibfk_2` FOREIGN KEY (`id_equipo`) REFERENCES `equipo_motor` (`id_motor`),
  ADD CONSTRAINT `calendario_ibfk_3` FOREIGN KEY (`id_tecnico`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `calendario_ibfk_4` FOREIGN KEY (`id_orden_mantenimiento`) REFERENCES `orden_mantenimiento` (`id_orden`),
  ADD CONSTRAINT `calendario_ibfk_5` FOREIGN KEY (`id_orden_reparacion`) REFERENCES `orden_reparacion` (`id_orden_reparacion`);

--
-- Constraints for table `equipo_motor`
--
ALTER TABLE `equipo_motor`
  ADD CONSTRAINT `equipo_motor_ibfk_1` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`);

--
-- Constraints for table `historial_solicitud`
--
ALTER TABLE `historial_solicitud`
  ADD CONSTRAINT `historial_solicitud_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitud` (`id_solicitud`),
  ADD CONSTRAINT `historial_solicitud_ibfk_2` FOREIGN KEY (`usuario_cambio`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `orden_mantenimiento`
--
ALTER TABLE `orden_mantenimiento`
  ADD CONSTRAINT `orden_mantenimiento_ibfk_1` FOREIGN KEY (`id_motor`) REFERENCES `equipo_motor` (`id_motor`),
  ADD CONSTRAINT `orden_mantenimiento_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `orden_reparacion`
--
ALTER TABLE `orden_reparacion`
  ADD CONSTRAINT `orden_reparacion_ibfk_1` FOREIGN KEY (`id_motor`) REFERENCES `equipo_motor` (`id_motor`),
  ADD CONSTRAINT `orden_reparacion_ibfk_2` FOREIGN KEY (`id_tecnico`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `solicitud`
--
ALTER TABLE `solicitud`
  ADD CONSTRAINT `solicitud_ibfk_1` FOREIGN KEY (`id_orden`) REFERENCES `orden_mantenimiento` (`id_orden`);

--
-- Constraints for table `ubicacion`
--
ALTER TABLE `ubicacion`
  ADD CONSTRAINT `ubicacion_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
