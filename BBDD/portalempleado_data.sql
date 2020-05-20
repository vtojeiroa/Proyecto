
USE proyecto_portal_empleado;


INSERT INTO sedes VALUES (null,1,'Central_Coruña','Cantón Pequeño 1', 15001, 'A Coruña','A Coruña','España',null,null);
INSERT INTO sedes VALUES (null,1,'Sede_Vigo', 'Rua do Principe 1', 36202, 'Vigo','Pontevedra','España',null,null);
INSERT INTO sedes VALUES (null,1,'Sede_Santiago','Avenida Rosalia de Castro 1', 15705, 'Santiago','A Coruña','España',null,null);
INSERT INTO sedes VALUES (null,0,'Sede_Malaga','Plaza de la Marina 1', 29015,'Malaga','Malaga','España',null,null);

select * from sedes;

INSERT INTO usuarios VALUES (null,'admin',1,'Victor','Tojeiro','34341345P','victortojeiro@gmail.com','12121212',null,'Calle Juan Florez 1','15004','A Coruña','A Coruña','España','981212121',null,null,null,1);
INSERT INTO usuarios VALUES (null,'test',1,'Luis','González','33232323S','luisgonzalez@gmail.com','12345678',null,'Ronda de Outeiro 10','15006','A Coruña','A Coruña','España','981272727',null,null,null,1);
INSERT INTO usuarios VALUES (null,'test',1,'Pedro','Sánchez','X4341345P','pedrosanchez@gmail.com','11111111',null,'Rua de Urzaiz 1','36201','Vigo','Pontevedra','España','986364855',null,null,null,2);
INSERT INTO usuarios VALUES (null,'test',1,'Raquel','López','12547335B','raquellopez@gmail.com','22222222',null,'Rua do Horreo 1','15702','Santiago','A Coruña','España','664112347',null,null,null,3);
INSERT INTO usuarios VALUES (null,'test',0,'David','Rodríguez','32845639X','davidrodriguez@gmail.com','33333333',null,'Calle Virgen de la Paloma 1','29007','Malaga','Malaga','España','951260125',null,null,null,4);
INSERT INTO usuarios VALUES (null,'test',1,'María','Bermúdez','74112368S','mariabermudez@gmail.com','44444444',null,'Avenida Finisterre 1','15008','A Coruña','A Coruña','España','981246258',null,null,null,1);
INSERT INTO usuarios VALUES (null,'test',1,'Laura','Bernabé','26357849T','laurabernabe@gmail.com','55555555',null,'Rua de Oporto 1','36201','Vigo','Pontevedra','España','654218994',null,null,null,2);
INSERT INTO usuarios VALUES (null,'test',1,'Martín','del Fraile','74758963V','martindelfraile@gmail.com','66666666',null,'Rua do Franco 1','15702','Santiago','A Coruña','España','981752214',null,null,null,3);
INSERT INTO usuarios VALUES (null,'test',0,'Jorge','Rosal','Y2369741R','jorgerosal@gmail.com','77777777',null,'Calle Eugenio Gross 1','29010','Malaga','Malaga','España','669841257',null,null,null,4);
INSERT INTO usuarios VALUES (null,'test',1,'Lucia','Fernández','33654123B','luciafernandez@gmail.com','88888888',null,'Avenida Garcia Barbón 1','36201','Vigo','Pontevedra','España','675635675',null,null,null,2);
INSERT INTO usuarios VALUES (null,'test',1,'Santiago','Ramos','35674159N','santiagoramos@gmail.com','99999999',null,'Rua do Vilar','15702','Santiago','A Coruña','España','981752364',null,null,null,3);
INSERT INTO usuarios VALUES (null,'test',0,'Hector','Doval','32886521A','hectordoval@gmail.com','10101010',null,'Paseo del Parque 1','29015','Malaga','Malaga','España','951265547',null,null,null,4);

select * from usuarios;

INSERT INTO servicios VALUES (null,1,'Reserva','Vehículo','Utiliza los vehiculos electricos que pone a tú disposición la empresa para realizar visitas a provedores o a clientes',null,null);
INSERT INTO servicios VALUES (null,1,'Reserva', 'Sala de Reunión','Reserva una sala para realizar tus reuniones o videoconferencias',null,null);
INSERT INTO servicios VALUES (null,1,'Reserva', 'Plaza en el comedor','Indicanos en que turno prefieres comer',null,null);
INSERT INTO servicios VALUES (null,1,'Incidencia','Informática','Registra tus incidencias para el departamento de informática',null,null);
INSERT INTO servicios VALUES (null,1,'Incidencia','Mantenimiento','Registra tus incidencias para el departamento de mantenimiento',null,null);
INSERT INTO servicios VALUES (null,1,'Incidencia','Limpieza','Registra tus incidencias para el departamento de limpieza',null,null);
INSERT INTO servicios VALUES (null,1,'Incidencia','Seguridad','Registra tus incidencias para el departamento de seguridad',null,null);
INSERT INTO servicios VALUES (null,1,'Incidencia','Otras','Registra aquí tus incidencias o sugerencias',null,null);

select * from servicios;

INSERT INTO sedes_servicios VALUES (null, 1,1,6,null,null);
INSERT INTO sedes_servicios VALUES (null, 2,1,6,null,null);
INSERT INTO sedes_servicios VALUES (null, 3,1,4,null,null);
INSERT INTO sedes_servicios VALUES (null, 4,1,4,null,null);
INSERT INTO sedes_servicios VALUES (null, 1,2,8,null,null);
INSERT INTO sedes_servicios VALUES (null, 2,2,6,null,null);
INSERT INTO sedes_servicios VALUES (null, 3,2,4,null,null);
INSERT INTO sedes_servicios VALUES (null, 4,2,3,null,null);
INSERT INTO sedes_servicios VALUES (null, 1,3,70,null,null);
INSERT INTO sedes_servicios VALUES (null, 2,3,50,null,null);
INSERT INTO sedes_servicios VALUES (null, 3,3,50,null,null);
INSERT INTO sedes_servicios VALUES (null, 4,3,50,null,null);
INSERT INTO sedes_servicios VALUES (null, 1,4,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 2,4,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 3,4,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 4,4,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 1,5,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 3,5,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 4,5,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 1,6,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 2,6,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 3,6,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 4,6,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 1,7,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 2,7,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 3,7,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 4,7,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 1,8,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 2,8,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 3,8,0,null,null);
INSERT INTO sedes_servicios VALUES (null, 4,8,0,null,null);

select * from sedes_servicios;

INSERT INTO reservas VALUES(null,1,1,'2020-04-10 11:30','visita a cliente 1','03:00',null,null);
INSERT INTO reservas VALUES(null,2,2,'2020-04-15 09:15','Reunión departamento','00:45',null,null);
INSERT INTO reservas VALUES(null,3,3,'2020-04-18 15:00','Reserva comedor','01:00',null,null);
INSERT INTO reservas VALUES(null,2,9,'2020-04-03 16:00','Reunión con proveedor 2','01:00',null,null);
INSERT INTO reservas VALUES(null,1,10,'2020-05-12 12:30','Cita en Notaría','01:30',null,null);
INSERT INTO reservas VALUES(null,2,11,'2020-05-12 16:00','Videoconferencia','03:00',null,null);
INSERT INTO reservas VALUES(null,3,3,'2020-05-02 14:30','Reserva comedor','01:00',null,null);
INSERT INTO reservas VALUES(null,1,8,'2020-04-30 09:00','Traslado a reunión en Sede-Coruña','06:00',null,null);

select * from reservas;

INSERT INTO incidencias VALUES(null,4,1,'No me funciona la pantalla',0,'2020-02-14 10:00','Se ha cambiado la pantalla','2020-02-14 12:00',null);
INSERT INTO incidencias VALUES(null,5,5,'Una ventana de la Sala 1 esta rota',0,'2020-03-20 09:00','Se ha cambiado el cristal','2020-03-22 12:00',null);
INSERT INTO incidencias VALUES(null,6,6,'Se me ha caido un cafe en el suelo de la cafeteria. Os agradecería que pasaseis a limpiarlo',0,'2020-03-05 12:00','Se ha procedido a su limpieza','2020-03-05 12:15',null);
INSERT INTO incidencias VALUES(null,7,7,'Se me ha estropeado la tarjeta de acceso',0,'2020-04-14 08:30','Se ha entregado una tarjeta nueva','2020-04-14 10:00',null);
INSERT INTO incidencias VALUES(null,4,8,'No funciona la impresora',1,null,null,null,null);
INSERT INTO incidencias VALUES(null,4,12,'Necesito instalar un progama en mi equipo',1,null,null,null,null);
INSERT INTO incidencias VALUES(null,5,1,'La puerta de la sala de reuniones 5 no abre',1,null,null,null,null);
INSERT INTO incidencias VALUES(null,5,4,'Hay agua en el suelo de la sala por una gotera',1,null,null,null,null);
INSERT INTO incidencias VALUES(null,7,6,'El 14/05/2020 recibiré una visita de Fernando López García con DNI 74212596R',1,null,null,null,null);

select * from incidencias;  

INSERT INTO valoraciones VALUES(null,1,2,5,'Genial',null,null);
INSERT INTO valoraciones VALUES(null,2,3,4,'No funcionaba la videoconferencia',null,null);
INSERT INTO valoraciones VALUES(null,3,4,3,'Tardé 10 minutos en conseguir un sitio para comer',null,null);
INSERT INTO valoraciones VALUES(null,4,5,4,'Me lo solucionaron muy rápido',null,null);
INSERT INTO valoraciones VALUES(null,5,6,5,'Muy buena gestíon',null,null);
INSERT INTO valoraciones VALUES(null,6,7,1,'Tardaron 5 horas en limpiar el suelo',null,null);
INSERT INTO valoraciones VALUES(null,7,8,5,null,null,null);
INSERT INTO valoraciones VALUES(null,8,1,2,'Cuando fui a recoger el coche no estaba, tardaron 10 minutos',null,null);
INSERT INTO valoraciones VALUES(null,6,2,5,'Genial',null,null);

select * from valoraciones;
