CREATE DATABASE portal_empleado;

-- DROP DATABASE portal_empleado;

USE portal_empleado;

CREATE TABLE sedes(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE,
nombre VARCHAR(255) NOT NULL,
direccion VARCHAR(255) NOT NULL,
codigo_postal VARCHAR(10) NOT NULL,
localidad VARCHAR(50) NOT NULL,
provincia VARCHAR(50) NOT NULL,
pais VARCHAR(50) NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
);

INSERT INTO sedes VALUES (null,1,'Central_Coruña','Cantón Pequeño 1', 15001, 'A Coruña','A Coruña','España',null,null);
INSERT INTO sedes VALUES (null,1,'Sede_Vigo', 'Rua do Principe 1', 36202, 'Vigo','Pontevedra','España',null,null);
INSERT INTO sedes VALUES (null,1,'Sede_Santiago','Avenida Rosalia de Castro 1', 15705, 'Santiago','A Coruña','España',null,null);
INSERT INTO sedes VALUES (null,0,'Sede_Malaga','Plaza de la Marina 1', 29015,'Malaga','Malaga','España',null,null);

CREATE TABLE usuarios(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
tipo_usuario VARCHAR(100) NOT NULL,
activo BOOLEAN NOT NULL DEFAULT TRUE,
nombre VARCHAR(255) NOT NULL,
apellidos VARCHAR(255) NOT NULL,
doc_identidad VARCHAR(15) NOT NULL UNIQUE,
email VARCHAR(200) NOT NULL UNIQUE,
contraseña VARCHAR(50) NOT NULL,
foto VARCHAR(255) DEFAULT NULL,
direccion VARCHAR(255) NOT NULL,
codigo_postal VARCHAR(10) NOT NULL,
localidad VARCHAR(50) NOT NULL,
provincia VARCHAR(50) NOT NULL,
pais VARCHAR(50) NOT NULL,
telefono VARCHAR(20) NOT NULL,
fecha_nacimiento DATE DEFAULT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
id_sedes INT UNSIGNED NOT NULL,
CONSTRAINT fk_usuarios_sedes FOREIGN KEY (id_sedes) REFERENCES sedes(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO usuarios VALUES (null,'admin',1,'Victor','Tojeiro','34341345P','victortojeiro@gmail.com','12121212',null,'Calle Juan Florez 1','15004','A Coruña','A Coruña','España','981212121',null,null,null,1);
INSERT INTO usuarios VALUES (null,'test',1,'Luis','González','33232323S','luisgonzalez@gmail.com','12345678',null,'Ronda de Outeiro 10','15006','A Coruña','A Coruña','España','981272727',null,null,null,1);
INSERT INTO usuarios VALUES (null,'test',1,'Pedro','Sánchez','34341345P','pedrosanchez@gmail.com','11111111',null,'Rua de Urzaiz 1','36201','Vigo','Pontevedra','España','986364855',null,null,null,2);
INSERT INTO usuarios VALUES (null,'test',1,'Raquel','López','12547335B','raquellopez@gmail.com','22222222',null,'Rua do Horreo 1','15702','Santiago','A Coruña','España','664112347',null,null,null,3);
INSERT INTO usuarios VALUES (null,'test',0,'David','Rodríguez','32845639X','davidrodriguez@gmail.com','33333333',null,'Calle Virgen de la Paloma 1','29007','Malaga','Malaga','España','951260125',null,null,null,4);
INSERT INTO usuarios VALUES (null,'test',1,'María','Bermúdez','74112368S','mariabermudez@gmail.com','44444444',null,'Avenida Finisterre 1','15008','A Coruña','A Coruña','España','981246258',null,null,null,1);
INSERT INTO usuarios VALUES (null,'test',1,'Laura','Bernabé','26357849T','laurabernabe@gmail.com','55555555',null,'Rua de Oporto 1','36201','Vigo','Pontevedra','España','654218994',null,null,null,2);
INSERT INTO usuarios VALUES (null,'test',1,'Martín','del Fraile','74758963V','martindelfraile@gmail.com','66666666',null,'Calle Juan Florez 1','15004','Santiago','A Coruña','España','981752214',null,null,null,3);
INSERT INTO usuarios VALUES (null,'test',0,'Jorge','Rosal','32369741R','jorgerosal@gmail.com','77777777',null,'Calle Eugenio Gross 1','29010','Malaga','Malaga','España','669841257',null,null,null,4);
INSERT INTO usuarios VALUES (null,'test',1,'Lucia','Fernández','33654123B','luciafernandez@gmail.com','88888888',null,'Avenida Garcia Barbón 1','36201','Vigo','Pontevedra','España','675635675',null,null,null,2);
INSERT INTO usuarios VALUES (null,'test',1,'Santiago','Ramos','35674159N','santiagoramos@gmail.com','99999999',null,'Rua do Vilar','15702','Santiago','A Coruña','España','981752364',null,null,null,3);
INSERT INTO usuarios VALUES (null,'test',0,'Hector','Doval','32886521A','hectordoval@gmail.com','10101010',null,'Paseo del Parque 1','29015','Malaga','Malaga','España','951265547',null,null,null,4);


CREATE TABLE servicios (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE, 
clase VARCHAR(50) NOT NULL,
nombre VARCHAR(50) NOT NULL,
descripcion VARCHAR(500),
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
);

INSERT INTO servicios VALUES (null,1,'reserva','vehiculo','utiliza los vehiculos electricos que pone a tú disposición la empresa para realizar visitas a provedores o a clientes',null,null);
INSERT INTO servicios VALUES (null,1,'reserva','sala','reserva la sala para realizar tus reuniones o videoconferencias',null,null);
INSERT INTO servicios VALUES (null,1,'reserva','comida','reserva la hora para comer en el comedor de la empresa',null,null);
INSERT INTO servicios VALUES (null,1,'registro','incidencia','comunicanos las incidencias informaticas, de limpieza o en las instalaciones que observes',null,null);

CREATE TABLE solicitudes (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
id_usuarios INT UNSIGNED NOT NULL,
id_servicios INT UNSIGNED NOT NULL,
fecha DATE NOT NULL,
hora TIME NOT NULL,
motivo VARCHAR(500),
duracion TIME NOT NULL,
fecha_resolución_incidencia DATETIME,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
CONSTRAINT fk_solicitudes_usuarios FOREIGN KEY (id_usuarios) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_solicitudes_servicios FOREIGN KEY (id_servicios) REFERENCES servicios(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE TABLE valoraciones(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
id_usuarios INT UNSIGNED NOT NULL,
id_servicios INT UNSIGNED NOT NULL,
valoracion ENUM('1','2','3','4','5') NOT NULL,
comentario_valoracion VARCHAR(500),
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
CONSTRAINT fk_valoraciones_usuarios FOREIGN KEY (id_usuarios) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_valoraciones_servicios FOREIGN KEY (id_servicios) REFERENCES servicios(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE TABLE sedes_servicios (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
id_sedes INT UNSIGNED NOT NULL,
id_servicios INT UNSIGNED NOT NULL,
CONSTRAINT fk_sedes_servicios_id_sedes FOREIGN KEY (id_sedes) REFERENCES sedes(id),
CONSTRAINT fk_sedes_servicios_id_servicios FOREIGN KEY (id_servicios) REFERENCES servicios(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

