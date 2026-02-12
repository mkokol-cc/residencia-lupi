-- =====================================================
-- SCRIPT DE DATOS MODERADOS PARA RESIDENCIADB
-- PostgreSQL - ~2,500 registros totales
-- =====================================================

BEGIN;

-- =====================================================
-- 1. MÉTODOS DE PAGO (8 registros fijos)
-- =====================================================
INSERT INTO public.metodos_pago (id, nombre) VALUES
(1, 'Efectivo'),
(2, 'Tarjeta de Crédito'),
(3, 'Tarjeta de Débito'),
(4, 'Transferencia Bancaria'),
(5, 'Cheque'),
(6, 'MercadoPago'),
(7, 'Criptomonedas'),
(8, 'Cuenta Corriente')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. CONCEPTOS JERÁRQUICOS (35 registros)
-- =====================================================
-- Conceptos raíz (nivel 0)
INSERT INTO public.conceptos (id, nombre, es_de_ingreso, padre_id) VALUES
(1, 'INGRESOS', true, NULL),
(2, 'EGRESOS', false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Nivel 1 - Ingresos
INSERT INTO public.conceptos (id, nombre, es_de_ingreso, padre_id) VALUES
(10, 'ALQUILERES', true, 1),
(11, 'EXPENSAS', true, 1),
(12, 'SERVICIOS', true, 1),
(13, 'OTROS INGRESOS', true, 1)
ON CONFLICT (id) DO NOTHING;

-- Nivel 1 - Egresos
INSERT INTO public.conceptos (id, nombre, es_de_ingreso, padre_id) VALUES
(20, 'SERVICIOS', false, 2),
(21, 'MANTENIMIENTO', false, 2),
(22, 'IMPUESTOS', false, 2),
(23, 'SUELDOS', false, 2),
(24, 'PROVEEDORES', false, 2),
(25, 'GASTOS VARIOS', false, 2)
ON CONFLICT (id) DO NOTHING;

-- Nivel 2 - Subconceptos
INSERT INTO public.conceptos (id, nombre, es_de_ingreso, padre_id) VALUES
(101, 'Alquiler Oficinas', true, 10),
(102, 'Alquiler Comercial', true, 10),
(103, 'Alquiler Residencias', true, 10),
(111, 'Expensas Ordinarias', true, 11),
(112, 'Expensas Extraordinarias', true, 11),
(121, 'Luz', true, 12),
(122, 'Agua', true, 12),
(123, 'Gas', true, 12),
(124, 'Internet', true, 12),
(201, 'Luz', false, 20),
(202, 'Agua', false, 20),
(203, 'Gas', false, 20),
(204, 'Internet', false, 20),
(211, 'Limpieza', false, 21),
(212, 'Jardinería', false, 21),
(213, 'Reparaciones', false, 21),
(214, 'Seguridad', false, 21),
(221, 'IVA', false, 22),
(222, 'IIBB', false, 22),
(223, 'Ganancias', false, 22),
(231, 'Sueldos Admin', false, 23),
(232, 'Sueldos Operarios', false, 23),
(241, 'Insumos', false, 24),
(242, 'Servicios', false, 24),
(251, 'Papelería', false, 25)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. ENTIDADES (350 registros total: 100 residentes + 250 proveedores)
-- =====================================================
WITH RECURSIVE generate_entities AS (
    SELECT 
        generate_series(1, 350) AS id,
        generate_series(1, 350) AS seq
)
INSERT INTO public.entidades (id, dni_cuit, nombre)
SELECT 
    id,
    CASE 
        WHEN id <= 100 THEN 
            LPAD((10000000 + floor(random() * 90000000)::int)::text, 8, '0')  -- DNI 8 dígitos
        ELSE 
            '20-' || LPAD((floor(random() * 90000000) + 10000000)::text, 8, '0') || '-' || 
            floor(random() * 9)::text  -- CUIT formato 20-XXXXXXXX-X
    END AS dni_cuit,
    CASE 
        WHEN id <= 100 THEN 
            (ARRAY['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura', 'Diego', 'Sofía', 'Martín', 'Valentina',
                   'Javier', 'Lucía', 'Ricardo', 'Florencia', 'Gustavo', 'Camila', 'Andrés', 'Paula', 'Sergio', 'Elena',
                   'Federico', 'Clara', 'Emiliano', 'Julieta', 'Leandro', 'Melisa', 'Hernán', 'Roxana', 'Patricio', 'Gimena'])[floor(random() * 30 + 1)] || ' ' ||
            (ARRAY['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Pérez', 'Gómez', 'Sánchez', 'Díaz',
                   'Romero', 'Torres', 'Álvarez', 'Ruiz', 'Vázquez', 'Castro', 'Ortiz', 'Silva', 'Morales', 'Núñez',
                   'Acosta', 'Medina', 'Herrera', 'Suárez', 'Aguirre', 'Benítez', 'Coronel', 'Mansilla', 'Pereyra', 'Quiroga'])[floor(random() * 30 + 1)]
        ELSE
            (ARRAY['Constructora', 'Servicios', 'Proveeduría', 'Tecnología', 'Alimentos', 'Limpieza', 'Seguridad', 
                   'Jardinería', 'Transporte', 'Consultora', 'Inmobiliaria', 'Gestoría', 'Mantenimiento', 'Electricidad', 
                   'Gas', 'Agua', 'Telecomunicaciones', 'Informática', 'Logística', 'Eventos'])[floor(random() * 20 + 1)] || ' ' ||
            (ARRAY['SA', 'SRL', 'SAS', 'EIRL', 'Ltda.', 'y Cía.', 'Hermanos', 'Asociados'])[floor(random() * 8 + 1)]
    END AS nombre
FROM generate_entities
ON CONFLICT (dni_cuit) DO NOTHING;

-- =====================================================
-- 4. RESIDENTES (100 registros)
-- =====================================================
INSERT INTO public.residentes (entidad_id, apellido, nombre_pila, es_activo, fecha_ingreso, nota)
SELECT 
    e.id,
    SPLIT_PART(e.nombre, ' ', 2) AS apellido,
    SPLIT_PART(e.nombre, ' ', 1) AS nombre_pila,
    random() > 0.1 AS es_activo,  -- 90% activos
    (CURRENT_DATE - (random() * 365 * 3)::int) AS fecha_ingreso,  -- Últimos 3 años
    CASE floor(random() * 4)
        WHEN 0 THEN 'Cliente preferencial'
        WHEN 1 THEN 'Solicitó factura A'
        WHEN 2 THEN 'Contacto de emergencia: ' || (ARRAY['Hermano', 'Madre', 'Padre', 'Esposo/a', 'Hijo'])[floor(random() * 5 + 1)]
        WHEN 3 THEN 'Deuda pendiente'
        ELSE NULL
    END AS nota
FROM public.entidades e
LEFT JOIN public.residentes r ON e.id = r.entidad_id
WHERE e.id <= 100 AND r.entidad_id IS NULL;

-- =====================================================
-- 5. PROVEEDORES (250 registros)
-- =====================================================
INSERT INTO public.proveedores (entidad_id, direccion, telefono)
SELECT 
    e.id,
    (ARRAY['Av. Corrientes', 'Calle Florida', 'Av. Rivadavia', 'Av. Santa Fe', 'Av. Callao', 'Belgrano', 
           'San Martín', 'Mitre', 'Sarmiento', '9 de Julio'])[floor(random() * 10 + 1)] || ' ' || 
        floor(random() * 5000 + 100)::text || 
        CASE floor(random() * 3)
            WHEN 0 THEN ', CABA'
            WHEN 1 THEN ', Bs As'
            ELSE ', Argentina'
        END,
    '11-' || LPAD(floor(random() * 10000000)::text, 8, '0')
FROM public.entidades e
LEFT JOIN public.proveedores p ON e.id = p.entidad_id
WHERE e.id > 100 AND e.id <= 350 AND p.entidad_id IS NULL;

-- =====================================================
-- 6. MOVIMIENTOS DE SALDO (1,200 registros)
-- =====================================================
WITH fechas AS (
    SELECT 
        generate_series(1, 1200) AS id,
        (CURRENT_TIMESTAMP - (random() * INTERVAL '180 days')) AS fecha_random
)
INSERT INTO public.movimientos_saldo (
    id, fecha_hora, descripcion, es_entrada, es_residencia, 
    monto, concepto_id, entidad_id
)
SELECT 
    id,
    fecha_random,
    CASE floor(random() * 8)
        WHEN 0 THEN 'Pago mensual'
        WHEN 1 THEN 'Factura N° ' || floor(random() * 1000 + 1)::text
        WHEN 2 THEN 'Ajuste de cuenta'
        WHEN 3 THEN 'Transferencia'
        WHEN 4 THEN 'Pago anticipado'
        WHEN 5 THEN 'Devolución'
        WHEN 6 THEN 'Comisión bancaria'
        ELSE 'Regularización'
    END AS descripcion,
    random() > 0.4 AS es_entrada,  -- 60% entradas
    random() > 0.3 AS es_residencia,  -- 70% residencia
    (random() * 25000 + 500)::numeric(10,2)::double precision AS monto,
    CASE 
        WHEN random() > 0.5 THEN 
            (ARRAY[101,102,103,111,112,121,122,123,124])[floor(random() * 9 + 1)]
        ELSE 
            (ARRAY[201,202,203,204,211,212,213,214,221,222,223,231,232,241,242,251])[floor(random() * 16 + 1)]
    END AS concepto_id,
    floor(random() * 350 + 1)::bigint AS entidad_id
FROM fechas
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 7. PAGOS (800 registros)
-- =====================================================
WITH pagos_data AS (
    SELECT 
        generate_series(1, 800) AS id,
        (CURRENT_TIMESTAMP - (random() * INTERVAL '120 days')) AS fecha_random,
        floor(random() * 350 + 1)::bigint AS entidad_id,
        floor(random() * 8 + 1)::bigint AS metodo_pago_id,
        (random() * 25000 + 1000)::numeric(10,2)::double precision AS monto
)
INSERT INTO public.pagos (
    id, fecha_hora, es_entrada, es_residencia,
    monto, entidad_id, metodo_pago_id
)
SELECT 
    id,
    fecha_random,
    random() > 0.3 AS es_entrada,
    random() > 0.3 AS es_residencia,
    monto,
    entidad_id,
    metodo_pago_id
FROM pagos_data
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. ACTUALIZAR SECUENCIAS
-- =====================================================
SELECT setval('public.entidades_id_seq', COALESCE((SELECT MAX(id) FROM public.entidades), 350));
SELECT setval('public.conceptos_id_seq', COALESCE((SELECT MAX(id) FROM public.conceptos), 251));
SELECT setval('public.metodos_pago_id_seq', COALESCE((SELECT MAX(id) FROM public.metodos_pago), 8));
SELECT setval('public.movimientos_saldo_id_seq', COALESCE((SELECT MAX(id) FROM public.movimientos_saldo), 1200));
SELECT setval('public.pagos_id_seq', COALESCE((SELECT MAX(id) FROM public.pagos), 800));

-- =====================================================
-- 9. ESTADÍSTICAS DE CARGA
-- =====================================================
DO $$
DECLARE
    count_entidades INT;
    count_residentes INT;
    count_proveedores INT;
    count_movimientos INT;
    count_pagos INT;
BEGIN
    SELECT COUNT(*) INTO count_entidades FROM entidades;
    SELECT COUNT(*) INTO count_residentes FROM residentes;
    SELECT COUNT(*) INTO count_proveedores FROM proveedores;
    SELECT COUNT(*) INTO count_movimientos FROM movimientos_saldo;
    SELECT COUNT(*) INTO count_pagos FROM pagos;
    
    RAISE NOTICE '==========================================';
    RAISE NOTICE '✅ CARGA COMPLETADA EXITOSAMENTE';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '📊 ESTADÍSTICAS FINALES:';
    RAISE NOTICE '------------------------------------------';
    RAISE NOTICE '🏢 Entidades:        %', count_entidades;
    RAISE NOTICE '👤 Residentes:       %', count_residentes;
    RAISE NOTICE '🏭 Proveedores:      %', count_proveedores;
    RAISE NOTICE '💰 Movimientos:      %', count_movimientos;
    RAISE NOTICE '💳 Pagos:           %', count_pagos;
    RAISE NOTICE '------------------------------------------';
    RAISE NOTICE '📝 TOTAL REGISTROS:  %', 
        count_entidades + count_residentes + count_proveedores + 
        count_movimientos + count_pagos + 43; -- + conceptos y métodos de pago
    RAISE NOTICE '==========================================';
END $$;

COMMIT;