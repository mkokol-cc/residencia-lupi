-- Primero, eliminamos todos los datos existentes
TRUNCATE TABLE movimientos_saldo, pagos, proveedores, residentes, 
             conceptos, metodos_pago, entidades CASCADE;

-- Reseteamos las secuencias
ALTER SEQUENCE entidades_id_seq RESTART WITH 1;
ALTER SEQUENCE conceptos_id_seq RESTART WITH 1;
ALTER SEQUENCE metodos_pago_id_seq RESTART WITH 1;
ALTER SEQUENCE movimientos_saldo_id_seq RESTART WITH 1;
ALTER SEQUENCE pagos_id_seq RESTART WITH 1;
ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;
