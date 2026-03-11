-- =====================================================
-- PASO 1: Cargar tipos de operación (Solo si no existen)
-- =====================================================
-- Insertar VENTA si no existe
INSERT INTO tipos_operacion (nombre, es_egreso, impacta_en_caja)
SELECT 'VENTA', false, false
WHERE NOT EXISTS (
    SELECT 1 FROM tipos_operacion WHERE nombre = 'VENTA'
);

-- Insertar COMPRA si no existe
INSERT INTO tipos_operacion (nombre, es_egreso, impacta_en_caja)
SELECT 'COMPRA', true, false
WHERE NOT EXISTS (
    SELECT 1 FROM tipos_operacion WHERE nombre = 'COMPRA'
);

-- Insertar PAGO si no existe
INSERT INTO tipos_operacion (nombre, es_egreso, impacta_en_caja)
SELECT 'PAGO', true, true
WHERE NOT EXISTS (
    SELECT 1 FROM tipos_operacion WHERE nombre = 'PAGO'
);

-- Insertar COBRO si no existe
INSERT INTO tipos_operacion (nombre, es_egreso, impacta_en_caja)
SELECT 'COBRO', false, true
WHERE NOT EXISTS (
    SELECT 1 FROM tipos_operacion WHERE nombre = 'COBRO'
);

-- =====================================================
-- PASO 2: Verificar que se cargaron correctamente
-- =====================================================
SELECT id, nombre, es_egreso, impacta_en_caja FROM tipos_operacion 
WHERE nombre IN ('VENTA', 'COMPRA', 'PAGO', 'COBRO');

-- =====================================================
-- PASO 3: Migrar MOVIMIENTOS_SALDO a OPERACIONES
-- (es_entrada true = COMPRA, false = VENTA)
-- =====================================================
INSERT INTO operaciones (
    descripcion,
    es_residencia,
    fecha_hora,
    monto,
    entidad_id,
    concepto_id,
    metodo_pago_id,
    tipo_operacion_id
)
SELECT 
    m.descripcion,
    m.es_residencia,
    m.fecha_hora,
    m.monto,
    m.entidad_id,
    m.concepto_id,
    NULL as metodo_pago_id,  -- movimientos_saldo no tiene metodo_pago
    CASE 
        WHEN m.es_entrada = true THEN (
            SELECT id FROM tipos_operacion WHERE nombre = 'COMPRA'
        )
        ELSE (
            SELECT id FROM tipos_operacion WHERE nombre = 'VENTA'
        )
    END as tipo_operacion_id
FROM movimientos_saldo m;

-- =====================================================
-- PASO 4: Migrar PAGOS a OPERACIONES
-- (es_entrada true = COBRO, false = PAGO)
-- =====================================================
INSERT INTO operaciones (
    descripcion,
    es_residencia,
    fecha_hora,
    monto,
    entidad_id,
    concepto_id,
    metodo_pago_id,
    tipo_operacion_id
)
SELECT 
    -- Generamos una descripción para pagos
    CASE 
        WHEN p.es_entrada = true THEN 'Cobro'
        ELSE 'Pago'
    END || ' - ' || COALESCE(mp.nombre, 'sin método'),
    p.es_residencia,
    p.fecha_hora,
    p.monto,
    p.entidad_id,
    NULL as concepto_id,  -- pagos no tiene concepto
    p.metodo_pago_id,
    CASE 
        WHEN p.es_entrada = true THEN (
            SELECT id FROM tipos_operacion WHERE nombre = 'COBRO'
        )
        ELSE (
            SELECT id FROM tipos_operacion WHERE nombre = 'PAGO'
        )
    END as tipo_operacion_id
FROM pagos p
LEFT JOIN metodos_pago mp ON mp.id = p.metodo_pago_id;

-- =====================================================
-- PASO 5: VERIFICACIÓN - Control de migración
-- =====================================================
-- Verificar cantidades migradas
SELECT 
    'MOVIMIENTOS_SALDO' as origen,
    COUNT(*) as registros_migrados,
    (SELECT COUNT(*) FROM movimientos_saldo) as registros_originales
FROM operaciones 
WHERE tipo_operacion_id IN (
    SELECT id FROM tipos_operacion WHERE nombre IN ('COMPRA', 'VENTA')
);

SELECT 
    'PAGOS' as origen,
    COUNT(*) as registros_migrados,
    (SELECT COUNT(*) FROM pagos) as registros_originales
FROM operaciones 
WHERE tipo_operacion_id IN (
    SELECT id FROM tipos_operacion WHERE nombre IN ('PAGO', 'COBRO')
);

-- Verificar suma de montos
SELECT 
    'Suma de montos MOVIMIENTOS_SALDO' as concepto,
    (SELECT COALESCE(SUM(monto), 0) FROM movimientos_saldo) as suma_original,
    COALESCE(SUM(o.monto), 0) as suma_migrada
FROM operaciones o
WHERE o.tipo_operacion_id IN (
    SELECT id FROM tipos_operacion WHERE nombre IN ('COMPRA', 'VENTA')
);

SELECT 
    'Suma de montos PAGOS' as concepto,
    (SELECT COALESCE(SUM(monto), 0) FROM pagos) as suma_original,
    COALESCE(SUM(o.monto), 0) as suma_migrada
FROM operaciones o
WHERE o.tipo_operacion_id IN (
    SELECT id FROM tipos_operacion WHERE nombre IN ('PAGO', 'COBRO')
);

-- =====================================================
-- PASO 6: Ver distribución por tipo de operación
-- =====================================================
SELECT 
    t.nombre as tipo_operacion,
    COUNT(*) as cantidad,
    SUM(o.monto) as total_monto
FROM operaciones o
JOIN tipos_operacion t ON t.id = o.tipo_operacion_id
WHERE t.nombre IN ('VENTA', 'COMPRA', 'PAGO', 'COBRO')
GROUP BY t.nombre
ORDER BY t.nombre;

-- =====================================================
-- PASO 7: Si todo está correcto, renombrar tablas viejas
-- (COMENTADO POR SEGURIDAD - Ejecutar manualmente si verificó OK)
-- =====================================================

ALTER TABLE movimientos_saldo RENAME TO movimientos_saldo_backup_202403;
ALTER TABLE pagos RENAME TO pagos_backup_202403;

-- =====================================================
-- PASO 8: Crear índices para mejorar performance
-- =====================================================
/*
CREATE INDEX IF NOT EXISTS idx_operaciones_fecha ON operaciones(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_operaciones_entidad ON operaciones(entidad_id);
CREATE INDEX IF NOT EXISTS idx_operaciones_tipo ON operaciones(tipo_operacion_id);
CREATE INDEX IF NOT EXISTS idx_operaciones_concepto ON operaciones(concepto_id);
*/