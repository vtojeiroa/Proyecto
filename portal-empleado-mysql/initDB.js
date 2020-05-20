require('dotenv').config();
const { getConnection } = require('./db');
const faker = require('faker/locale/es');
const bcrypt = require('bcrypt');

/* const fs = require('fs-extra'); 
const { formatDateToDB } = require("./helpers");
const { random } = require("lodash"); 
const path = require("path"); */

const args = process.argv;
const addData = args[2] === '--data';

async function main() {
  // Get reference to db

  const connection = await getConnection();

  console.log('Dropping tables');

  await connection.query('DROP TABLE IF EXISTS valoraciones');
  await connection.query('DROP TABLE IF EXISTS incidencias');
  await connection.query('DROP TABLE IF EXISTS reservas');
  await connection.query('DROP TABLE IF EXISTS sedes_servicios');
  await connection.query('DROP TABLE IF EXISTS servicios');
  await connection.query('DROP TABLE IF EXISTS usuarios');
  await connection.query('DROP TABLE IF EXISTS sedes');

  // Create tables

  await connection.query(`
    CREATE TABLE IF NOT EXISTS sedes(
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
    )`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS usuarios(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tipo_usuario ENUM ("admin","user","maintenance") NOT NULL DEFAULT "user",
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    num_doc_identidad VARCHAR(15) DEFAULT NULL UNIQUE,
    email VARCHAR(200) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    fecha_actualizacion_contraseña DATETIME NOT NULL,
    foto VARCHAR(255) DEFAULT NULL,
    direccion VARCHAR(255) DEFAULT NULL,
    codigo_postal VARCHAR(10) DEFAULT NULL,
    localidad VARCHAR(50) DEFAULT NULL,
    provincia VARCHAR(50) DEFAULT NULL,
    pais VARCHAR(50) DEFAULT NULL,
    telefono VARCHAR(20) DEFAULT NULL,
    fecha_nacimiento DATE DEFAULT NULL,
    codigo_registro VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    sedes_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_usuarios_sedes FOREIGN KEY (sedes_id) REFERENCES sedes(id) ON DELETE RESTRICT ON UPDATE CASCADE
    )`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS servicios(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    activo BOOLEAN NOT NULL DEFAULT TRUE, 
    seccion VARCHAR(50) NOT NULL,	
    tipo VARCHAR(50) NOT NULL,   
    descripcion VARCHAR(500),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()
    )`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS sedes_servicios (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    sedes_id INT UNSIGNED NOT NULL,
    servicios_id INT UNSIGNED NOT NULL,
    disponibilidad_servicios INT UNSIGNED,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    CONSTRAINT fk_sedes_servicios_sedes_id FOREIGN KEY (sedes_id) REFERENCES sedes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sedes_servicios_servicios_id FOREIGN KEY (servicios_id) REFERENCES servicios(id) ON DELETE RESTRICT ON UPDATE CASCADE
    )`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS reservas(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    servicios_id INT UNSIGNED NOT NULL,
    usuarios_id INT UNSIGNED NOT NULL,
    fechahora_reserva DATETIME NOT NULL,
    motivo_reserva TEXT NOT NULL,
    duracion_reserva TIME NOT NULL,
    codigo_reserva VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservas_servicios FOREIGN KEY (servicios_id) REFERENCES servicios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_reservas_usuarios FOREIGN KEY (usuarios_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE)`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS incidencias (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    servicios_id INT UNSIGNED NOT NULL,
    usuarios_id INT UNSIGNED NOT NULL,
    descripcion VARCHAR(500) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_resolucion DATETIME DEFAULT NULL,
    comentario_resolucion VARCHAR(500) DEFAULT NULL,
    codigo_incidencia VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    CONSTRAINT fk_incidencias_servicios FOREIGN KEY (servicios_id) REFERENCES servicios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_incidencias_usuarios FOREIGN KEY (usuarios_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
    )`);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS valoraciones(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    reservas_id INT UNSIGNED ,
    incidencias_id INT UNSIGNED ,
    usuarios_id INT UNSIGNED NOT NULL,
    servicios_id INT UNSIGNED NOT NULL,
    valoracion ENUM("1","2","3","4","5") NOT NULL,
    comentario_valoracion VARCHAR(500),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    CONSTRAINT fk_valoraciones_reservas FOREIGN KEY (reservas_id) REFERENCES reservas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_valoraciones_incidencias FOREIGN KEY (incidencias_id) REFERENCES incidencias(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_valoraciones_usuarios FOREIGN KEY (usuarios_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_valoraciones_servicios FOREIGN KEY (servicios_id) REFERENCES servicios(id) ON DELETE RESTRICT ON UPDATE CASCADE
    )`);

  // Create initial sedes

  await connection.query(` 
        INSERT INTO sedes (activo,nombre,direccion,codigo_postal,localidad,provincia,pais)
        VALUES
            ("1", "Central_Coruña", "Cantón Pequeño 1", "15001", "A Coruña", "A Coruña", "España"),
            ("1", "Sede_Vigo", "Rua do Principe 1", "36202", "Vigo", "Pontevedra", "España"),
            ("1", "Sede_Santiago", "Avenida Rosalia de Castro 1", "15705", "Santiago", "A Coruña", "España"),
            ("1", "Sede_Malaga", "Plaza de la Marina 1", "29015", "Malaga", "Malaga", "España")`);

  // Create initial user
  const passwordAdmin = await bcrypt.hash(
    process.env.DEFAULT_ADMIN_PASSWORD,
    10
  );
  const passwordMaintenance = await bcrypt.hash(
    process.env.DEFAULT_MAINTENANCE_PASSWORD,
    10
  );
  await connection.query(`
        INSERT INTO usuarios(tipo_usuario,activo,nombre,apellidos,num_doc_identidad,email,contraseña, fecha_actualizacion_contraseña ,direccion,codigo_postal,localidad,provincia,pais,telefono,sedes_id)
        VALUES
            ("admin", 1, "Victor", "Tojeiro", "12121212R", "vtojeiroa@gmail.com","${passwordAdmin}", NOW() , "Calle Juan Florez 1", "15004", "A Coruña", "A Coruña", "España", "981212121",1),
            ( "maintenance", 1, "Luis", "González", "33232323S", "vtojeiroa+1@gmail.com", "${passwordMaintenance}", NOW() ,  "Ronda de Outeiro 10", "15006", "A Coruña", "A Coruña", "España", "981272727", 1);`);
  // Create initial data
  if (addData) {
    console.log('Adding initial data');

    const passwordUsers = await bcrypt.hash(faker.internet.password(), 10);

    await connection.query(`
    
        INSERT INTO usuarios (activo,nombre,apellidos,num_doc_identidad,email,contraseña, fecha_actualizacion_contraseña ,direccion,codigo_postal,localidad,provincia,pais,telefono,sedes_id)
        VALUES
            
            (  1, "Pedro", "Sánchez", "X4341345P", "vtojeiroa+2@gmail.com", "${passwordUsers}", NOW() ,  "Rua de Urzaiz 1", "36201", "Vigo", "Pontevedra", "España", "986364855", 2),
            (  1, "Raquel", "López", "12547335B", "vtojeiroa+3@gmail.com", "${passwordUsers}", NOW() ,  "Rua do Horreo 1", "15702", "Santiago", "A Coruña", "España", "664112347",    3),
            (  1, "David", "Rodríguez", "32845639X", "vtojeiroa+4@gmail.com", "${passwordUsers}", NOW() ,  "Calle Virgen de la Paloma 1", "29007", "Malaga", "Malaga", "España", "951260125", 4),
            (  1, "María", "Bermúdez", "74112368S", "vtojeiroa+5@gmail.com", "${passwordUsers}", NOW() ,  "Avenida Finisterre 1", "15008", "A Coruña", "A Coruña", "España", "981246258", 1),
            (  1, "Laura", "Bernabé", "26357849T", "vtojeiroa+6@gmail.com", "${passwordUsers}", NOW() ,  "Rua de Oporto 1", "36201", "Vigo", "Pontevedra", "España", "654218994",    2),
            (  1, "Martín", "del Fraile", "74758963V", "vtojeiroa+7@gmail.com", "${passwordUsers}", NOW() ,  "Rua do Franco 1", "15702", "Santiago", "A Coruña", "España", "981752214", 3),
            (  1, "Jorge", "Rosal", "Y2369741R", "vtojeiroa+8@gmail.com", "${passwordUsers}", NOW() ,  "Calle Eugenio Gross 1", "29010", "Malaga", "Malaga", "España", "669841257", 4),
            (  1, "Lucia", "Fernández", "33654123B", "vtojeiroa+9@gmail.com", "${passwordUsers}", NOW() ,  "Avenida Garcia Barbón 1", "36201", "Vigo", "Pontevedra", "España", "675635675", 2),
            (  1, "Santiago", "Ramos", "35674159N", "vtojeiroa+10@gmail.com", "${passwordUsers}", NOW() ,  "Rua do Vilar", "15702", "Santiago", "A Coruña", "España", "981752364", 3),
            (  1, "Hector", "Doval", "32886521A", "vtojeiroa+11@gmail.com", "${passwordUsers}", NOW() ,  "Paseo del Parque 1", "29015", "Malaga", "Malaga", "España", "951265547", 4);

            `);

    await connection.query(`
        INSERT INTO servicios (activo, seccion, tipo, descripcion)
        VALUES
            ( "1", "Reserva", "Vehículo", "Utiliza los vehiculos electricos que pone a tú disposición la empresa para realizar visitas a provedores o a clientes"),
            ( "1", "Reserva", "Sala de Reunión", "Reserva una sala para realizar tus reuniones o videoconferencias"),
            ( "1", "Reserva", "Plaza en el comedor", "Indicanos en que turno prefieres comer"),
            ( "1", "Incidencia", "Informática", "Registra tus incidencias para el departamento de informática"),
            ( "1", "Incidencia", "Mantenimiento", "Registra tus incidencias para el departamento de mantenimiento"),
            ( "1", "Incidencia", "Limpieza", "Registra tus incidencias para el departamento de limpieza"),
            ( "1", "Incidencia", "Seguridad", "Registra tus incidencias para el departamento de seguridad"),
            ( "1", "Incidencia", "Otras", "Registra aquí tus incidencias o sugerencias");
            `);

    await connection.query(`
        INSERT INTO sedes_servicios (sedes_id, servicios_id, disponibilidad_servicios)
        VALUES
            ( 1, 1, 6),
            ( 2, 1, 6),
            ( 3, 1, 4),
            ( 4, 1, 4),
            ( 1, 2, 8),
            ( 2, 2, 6),
            ( 3, 2, 4),
            ( 4, 2, 3),
            ( 1, 3, 70),
            ( 2, 3, 50),
            ( 3, 3, 50),
            ( 4, 3, 50),
            ( 1, 4, 0),
            ( 2, 4, 0),
            ( 3, 4, 0),
            ( 4, 4, 0),
            ( 1, 5, 0),
            ( 3, 5, 0),
            ( 4, 5, 0),
            ( 1, 6, 0),
            ( 2, 6, 0),
            ( 3, 6, 0),
            ( 4, 6, 0),
            ( 1, 7, 0),
            ( 2, 7, 0),
            ( 3, 7, 0),
            ( 4, 7, 0),
            ( 1, 8, 0),
            ( 2, 8, 0),
            ( 3, 8, 0),
            ( 4, 8, 0);
        `);

    await connection.query(`
        INSERT INTO reservas (servicios_id, usuarios_id, fechahora_reserva, motivo_reserva, duracion_reserva)
        VALUES
            ( 1, 1, "2020-04-10 11:30", "visita a cliente 1", "03:00"),
            ( 2, 2, "2020-04-15 09:15", "Reunión departamento", "00:45"),
            ( 3, 3, "2020-04-18 15:00", "Reserva comedor", "01:00"),
            ( 2, 9, "2020-04-03 16:00", "Reunión con proveedor 2", "01:00"),
            ( 1, 10, "2020-05-12 12:30", "Cita en Notaría", "01:30"),
            ( 2, 11, "2020-05-12 16:00", "Videoconferencia", "03:00"),
            ( 3, 3, "2020-05-02 14:30", "Reserva comedor", "01:00"),
            ( 1, 8, "2020-04-30 09:00", "Traslado a reunión en Sede-Coruña", "06:00");
        `);

    await connection.query(`
        INSERT INTO incidencias (servicios_id, usuarios_id, descripcion, activo, fecha_resolucion, comentario_resolucion)
        VALUES
            ( 4, 1, "No me funciona la pantalla", 0, "2020-02-14 10:00", "Se ha cambiado la pantalla"),
            ( 5, 5, "Una ventana de la Sala 1 esta rota", 0, "2020-03-20 09:00", "Se ha cambiado el cristal"),
            ( 6, 6, "Se me ha caido un cafe en el suelo de la cafeteria. Os agradecería que pasaseis a limpiarlo", 0, "2020-03-05 12:00", "Se ha procedido a su limpieza"),
            ( 7, 7, "Se me ha estropeado la tarjeta de acceso", 0, "2020-04-14 08:30", "Se ha entregado una tarjeta nueva"),
            ( 4, 8, "No funciona la impresora", 1, null, null),
            ( 4, 12, "Necesito instalar un programa en mi equipo", 1, null, null),
            ( 5, 1, "La puerta de la sala de reuniones 5 no abre", 1, null, null),
            ( 5, 4, "Hay agua en el suelo de la sala por una gotera", 1, null, null),
            ( 7, 6, "El 14/05/2020 recibiré una visita de Fernando López García con DNI 74212596R", 1, null, null);
        `);

    await connection.query(`
        INSERT INTO valoraciones (reservas_id, incidencias_id, usuarios_id, servicios_id, valoracion, comentario_valoracion)
        VALUES
            ( 1, null, 1, 1, 5, "Genial"),
            (2,null, 2, 2, 4, "No funcionaba la videoconferencia"),
            (3,null, 3, 3, 3, "Tardé 10 minutos en conseguir un sitio para comer"),
            (null,1, 1, 4, 5, "Me lo solucionaron muy rápido"),
            ( null,2,5, 5, 5, "Muy buena gestíon"),
            ( null, 3, 6, 6, 1, "Tardaron 5 horas en limpiar el suelo"),
            ( null, 4,8, 4, 5,null),
            ( 8,null,8, 1, 2, "Cuando fui a recoger el coche no estaba, tardaron 10 minutos"),
            ( null, 3,6, 2, 5, "Genial");
        `);
  }

  console.log('Initial structure created');

  connection.release();
  process.exit();
}

main();
