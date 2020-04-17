CREATE DATABASE portal_empleado;

DROP DATABASE portal_empleado;

USE portal_empleado;

CREATE TABLE sede(
sede_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE,
nombre VARCHAR(255) NOT NULL,
direccion VARCHAR(255) NOT NULL,
codigo_postal VARCHAR(10) NOT NULL,
localidad VARCHAR(50) NOT NULL,
provincia VARCHAR(50) NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO sede VALUES (null,'','Central_Coruña','Cantón Pequeño 1', 15001, 'A Coruña','A Coruña',null,null);
INSERT INTO sede VALUES (null,'','Sede_Vigo', 'Rua do Principe 1', 36202, 'Vigo','Pontevedra',null,null);
INSERT INTO sede VALUES (null,'','Sede_Santiago','Avenida Rosalia de Castro 1', 15705, 'Santiago','A Coruña',null,null);
INSERT INTO sede VALUES (null,'','Sede_Malaga', 'Plaza de la Marina 1', 29015, 'Malaga','Malaga',null,null);

select * from sede;

CREATE TABLE usuario(
usuario_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
tipo_usuario ENUM('user','admin','test') NOT NULL,
activo BOOLEAN NOT NULL DEFAULT TRUE,
nombre VARCHAR(255) NOT NULL,
apellidos VARCHAR(255) NOT NULL,
dni VARCHAR(9) NOT NULL,
email VARCHAR(200) NOT NULL,
contraseña VARCHAR(50) NOT NULL,
foto VARCHAR(255) DEFAULT NULL,
direccion VARCHAR(255) NOT NULL,
codigo_postal VARCHAR(10) NOT NULL,
localidad VARCHAR(50) NOT NULL,
telefono VARCHAR(20) NOT NULL,
fecha_nacimiento DATE DEFAULT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
sede_id INT UNSIGNED NOT NULL,
CONSTRAINT fk_usuario_sede_id FOREIGN KEY (sede_id) REFERENCES sede(sede_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

alter table usuario change column dni num_doc_identidad varchar(15) not null;
DROP TABLE usuario;

INSERT INTO usuario VALUES (null,'admin','Victor','Tojeiro','34341345P','victortojeiro@gmail.com','12121212',null,'Calle Juan Florez 1','15004','A Coruña','981212121',null,null,null,1);
INSERT INTO usuario VALUES (2,3,'Luis','González','33232323S','luisgonzalez@gmail.com','12345678',null,'Ronda de Outeiro 10','15006','A Coruña','981272727',null,null,null,1);
INSERT INTO usuario VALUES (null,3,'Pedro','Sánchez','34341345P','pedrosanchez@gmail.com','11111111',null,'Rua de Urzaiz 1','36201','Vigo','986364855',null,null,null,2);
INSERT INTO usuario VALUES (null,3,'Raquel','López','12547335B','raquellopez@gmail.com','22222222',null,'Rua do Horreo 1','15702','Santiago','664112347',null,null,null,3);
INSERT INTO usuario VALUES (null,3,'David','Rodríguez','32845639X','davidrodriguez@gmail.com','33333333',null,'Calle Virgen de la Paloma 1','29007','Malaga','951260125',null,null,null,4);
INSERT INTO usuario VALUES (null,3,'María','Bermúdez','74112368S','mariabermudez@gmail.com','44444444',null,'Avenida Finisterre 1','15008','A Coruña','981246258',null,null,null,1);
INSERT INTO usuario VALUES (null,3,'Laura','Bernabé','26357849T','laurabernabe@gmail.com','55555555',null,'Rua de Oporto 1','36201','Vigo','654218994',null,null,null,2);
INSERT INTO usuario VALUES (null,3,'Martín','del Fraile','74758963V','martindelfraile@gmail.com','66666666',null,'Calle Juan Florez 1','15004','Santiago','981752214',null,null,null,3);
INSERT INTO usuario VALUES (null,3,'Jorge','Rosal','32369741R','jorgerosal@gmail.com','77777777',null,'Calle Eugenio Gross 1','29010','Malaga','669841257',null,null,null,4);
INSERT INTO usuario VALUES (null,3,'Lucia','Fernández','33654123B','luciafernandez@gmail.com','88888888',null,'Avenida Garcia Barbón 1','36201','Vigo','675635675',null,null,null,2);
INSERT INTO usuario VALUES (null,3,'Santiago','Ramos','35674159N','santiagoramos@gmail.com','99999999',null,'Rua do Vilar','15702','Santiago','981752364',null,null,null,3);
INSERT INTO usuario VALUES (null,3,'Hector','Doval','32886521A','hectordoval@gmail.com','10101010',null,'Paseo del Parque 1','29015','Malaga','951265547',null,null,null,4);

delete from usuario where id=3;

d INT PRIMARY KEY AUTO_INCREMENT,
matricula VARCHAR(7) NOT NULL UNIQUE,
fecha_matriculacion DATE NOT NULL,
modelos_vehiculos_id INT NOT NULL,
constraint fk_modelo_vehiculo FOREIGN KEY (modelos_vehiculos_id) REFERENCES modelos_vehiculos(id)
);
CREATE TABLE modelo(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE,
marca VARCHAR(50) NOT NULL,
modelo VARCHAR(50) NOT NULL,
numero_plazas SMALLINT UNSIGNED NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vehiculo(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE,
matricula VARCHAR(7) NOT NULL UNIQUE,
fecha_matriculacion DATE NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
modelo_id INT UNSIGNED NOT NULL,
sede_id INT UNSIGNED NOT NULL,
CONSTRAINT fk_vehiculo_modelo_id FOREIGN KEY (modelo_id) REFERENCES modelo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_vehiculo_sede_id FOREIGN KEY (sede_id) REFERENCES sede(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE sala(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE,
nombre VARCHAR(255) NOT NULL,
capacidad_maxima INT UNSIGNED NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
sede_id INT NOT NULL,
CONSTRAINT fk_sala_sede_id FOREIGN KEY (sede_id) REFERENCES sede(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE reserva_vehiculo(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
usuario_id INT NOT NULL,
vehiculo_id INT NOT NULL,
fecha_reserva DATE NOT NULL,
hora_reserva TIME NOT NULL,
motivo_reserva TEXT NOT NULL,
duracion_reserva TIME NOT NULL,
valoracion ENUM('1','2','3','4','5') NOT NULL DEFAULT 0,
comentario_valoracion TEXT DEFAULT NULL,
fecha_valoracion DATETIME DEFAULT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_rv_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_rv_vehiculo_id FOREIGN KEY (vehiculo_id) REFERENCES vehiculo(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE reserva_sala(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
usuario_id INT NOT NULL,
sala_id INT NOT NULL,
fecha_reserva DATE NOT NULL,
hora_reserva TIME NOT NULL,
motivo_reserva TEXT NOT NULL,
duracion_reserva TIME NOT NULL,
valoracion ENUM('1','2','3','4','5') NOT NULL DEFAULT 0,
comentario_valoracion TEXT DEFAULT NULL,
fecha_valoracion DATETIME DEFAULT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_rs_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_rs_sala_id FOREIGN KEY (sala_id) REFERENCES sala(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE incidencia (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
usuario_id INT NOT NULL,
sede_id INT NOT NULL,
tipo ENUM ('informática','mantenimiento','limpieza','seguridad','otra') NOT NULL,
descripcion TEXT NOT NULL,
fecha_registro DATETIME NOT NULL,
estado ENUM('pendiente','resuelta') NOT NULL DEFAULT 'pendiente',
fecha_resolucion DATETIME DEFAULT NULL,
comentario_resolucion TEXT DEFAULT NULL,
valoracion ENUM('1','2','3','4','5') NOT NULL DEFAULT 0,
comentario_valoracion TEXT DEFAULT NULL,
fecha_valoracion DATETIME DEFAULT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_incidencia_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_incidencia_sede FOREIGN KEY (sede_id) REFERENCES sede(id) ON DELETE RESTRICT ON UPDATE CASCADE
);



CREATE TABLE primer_plato(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE,
nombre VARCHAR(255) NOT NULL,
precio DECIMAL (5,2) NOT NULL,
imagen VARCHAR (255) NOT NULL,
fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE segundo_plato (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE,
nombre VARCHAR(255) NOT NULL,
precio DECIMAL(5,2) UNSIGNED NOT NULL,
imagen VARCHAR(255) NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE postre (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE,
nombre VARCHAR(255) NOT NULL,
precio DECIMAL(5,2) UNSIGNED NOT NULL,
imagen VARCHAR(255) NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

);
CREATE TABLE bebida (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
activo BOOLEAN NOT NULL DEFAULT TRUE,
nombre VARCHAR(255) NOT NULL,
precio DECIMAL(5,2) UNSIGNED NOT NULL,
imagen VARCHAR(255) NOT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE menu (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
usuario_id INT NOT NULL,
sede_id INT NOT NULL,
fecha_reserva DATE NOT NULL,
hora_reserva TIME NOT NULL,
lugar ENUM ('comedor','para llevar') NOT NULL DEFAULT 'comedor',
primer_plato_id INT DEFAULT NULL,
segundo_plato_id INT DEFAULT NULL,
postre_id INT DEFAULT NULL,
bebida_id INT DEFAULT NULL,
total_menu DECIMAL(5,2) DEFAULT NULL,
modo_pago ENUM ('pago al retirar','descuento en nomina'), 
valoracion ENUM('1','2','3','4','5') NOT NULL DEFAULT '0',
comentario_valoracion TEXT DEFAULT NULL,
fecha_valoracion DATETIME DEFAULT NULL,
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_menu_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
CONSTRAINT fk_menu_sede FOREIGN KEY (sede_id) REFERENCES sede(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_menu_primer_plato_id FOREIGN KEY (primer_plato_id) REFERENCES primer_plato(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_menu_segundo_plato_id FOREIGN KEY (segundo_plato_id) REFERENCES segundo_plato(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_menu_postre_id FOREIGN KEY (postre_id) REFERENCES postre(id) ON DELETE RESTRICT ON UPDATE CASCADE,
CONSTRAINT fk_menu_bebida_id FOREIGN KEY (bebida_id) REFERENCES bebida(id) ON DELETE RESTRICT ON UPDATE CASCADE
);