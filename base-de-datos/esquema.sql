CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(50) NOT NULL,
    numero_documento VARCHAR(50) UNIQUE NOT NULL,
    nombre_razon_social VARCHAR(150) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(30),
    ciudad VARCHAR(50),
    contrasena_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(12, 2) NOT NULL,
    en_oferta BOOLEAN DEFAULT FALSE,
    categoria VARCHAR(50) NOT NULL,
    icono VARCHAR(50),
    stock INT DEFAULT 10
);

CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    total NUMERIC(12, 2) NOT NULL,
    estado_pago VARCHAR(30) DEFAULT 'Pendiente',
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets_soporte (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    asunto VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    prioridad VARCHAR(20) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(30) DEFAULT 'Abierto',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipos (
    id SERIAL PRIMARY KEY,
    serial VARCHAR(50) UNIQUE NOT NULL,
    nombre_equipo VARCHAR(100) NOT NULL,
    estado VARCHAR(30) NOT NULL, -- Operativo, Mantenimiento, Vencido
    proximo_mantenimiento VARCHAR(50),
    en_oferta BOOLEAN DEFAULT FALSE
);
