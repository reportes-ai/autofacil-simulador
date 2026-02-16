import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Shield, TrendingUp } from 'lucide-react';

export default function CalculadoraCuotas() {
  const [saldoPrecio, setSaldoPrecio] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [cuotas, setCuotas] = useState({ mes12: 0, mes24: 0, mes36: 0, mes48: 0 });

  // Obtener fecha actual para buscar UF
  const hoy = new Date();
  const diaActual = hoy.getDate();
  const mesActual = hoy.getMonth(); // 0 = enero, 1 = febrero, etc.

  // Tabla UF 2026 (día 1-31, meses enero-diciembre)
  const tablaUF = {
    1: [39731.79, 39703.5, 39656.97, 39600.34, 39534.03, 39474.66, 39422.52, 39377.92, 39340.14, 39309.41, 39285.9, 39269.7],
    2: [39735.63, 39700.94, 39653.09, 39595.99, 39529.13, 39469.28, 39416.64, 39371.52, 39333.19, 39301.87, 39277.74, 39260.88],
    3: [39739.47, 39698.37, 39649.21, 39591.64, 39524.22, 39463.89, 39410.75, 39365.11, 39326.25, 39294.32, 39269.59, 39252.06],
    4: [39743.31, 39695.81, 39645.33, 39587.29, 39519.32, 39458.51, 39404.87, 39358.71, 39319.3, 39286.78, 39261.43, 39243.24],
    5: [39747.15, 39693.25, 39641.45, 39582.94, 39514.42, 39453.13, 39398.99, 39352.3, 39312.36, 39279.23, 39253.28, 39234.42],
    6: [39751, 39690.68, 39637.57, 39578.59, 39509.52, 39447.74, 39393.1, 39345.9, 39305.41, 39271.69, 39245.12, 39225.6],
    7: [39754.84, 39688.12, 39633.69, 39574.24, 39504.62, 39442.36, 39387.22, 39339.49, 39298.47, 39264.14, 39236.97, 39216.78],
    8: [39758.68, 39685.56, 39629.81, 39569.89, 39499.72, 39436.98, 39381.34, 39333.09, 39291.52, 39256.6, 39228.81, 39207.96],
    9: [39762.52, 39682.99, 39625.93, 39565.54, 39494.82, 39431.59, 39375.45, 39326.68, 39284.58, 39249.05, 39220.66, 39199.14],
    10: [39759.95, 39688.65, 39630.08, 39569.22, 39497.93, 39434.23, 39377.59, 39328.3, 39285.66, 39249.58, 39220.62, 39198.49],
    11: [39757.38, 39694.31, 39634.24, 39572.9, 39501.04, 39436.88, 39379.73, 39329.92, 39286.74, 39250.1, 39220.59, 39197.84],
    12: [39754.82, 39699.97, 39638.39, 39576.58, 39504.14, 39439.52, 39381.87, 39331.54, 39287.83, 39250.63, 39220.55, 39197.19],
    13: [39752.25, 39705.63, 39642.55, 39580.26, 39507.25, 39442.17, 39384.01, 39333.16, 39288.91, 39251.15, 39220.52, 39196.54],
    14: [39749.68, 39711.29, 39646.7, 39583.94, 39510.36, 39444.81, 39386.15, 39334.78, 39289.99, 39251.68, 39220.48, 39195.89],
    15: [39747.12, 39716.95, 39650.86, 39587.62, 39513.47, 39447.46, 39388.29, 39336.4, 39291.08, 39252.2, 39220.45, 39195.24],
    16: [39744.55, 39722.61, 39655.01, 39591.3, 39516.58, 39450.1, 39390.43, 39338.02, 39292.16, 39252.73, 39220.41, 39194.59],
    17: [39741.98, 39728.28, 39659.17, 39594.98, 39519.69, 39452.75, 39392.57, 39339.64, 39293.24, 39253.25, 39220.38, 39193.94],
    18: [39739.42, 39733.94, 39663.32, 39598.66, 39522.8, 39455.39, 39394.71, 39341.26, 39294.33, 39253.78, 39220.34, 39193.29],
    19: [39736.85, 39739.6, 39667.48, 39602.34, 39525.91, 39458.04, 39396.85, 39342.88, 39295.41, 39254.3, 39220.31, 39192.64],
    20: [39734.29, 39745.26, 39671.63, 39606.02, 39529.02, 39460.68, 39398.99, 39344.5, 39296.49, 39254.83, 39220.27, 39191.99],
    21: [39731.72, 39750.93, 39675.79, 39609.7, 39532.13, 39463.33, 39401.13, 39346.12, 39297.58, 39255.35, 39220.24, 39191.34],
    22: [39729.16, 39756.59, 39679.94, 39613.38, 39535.24, 39465.97, 39403.27, 39347.74, 39298.66, 39255.88, 39220.2, 39190.69],
    23: [39726.59, 39762.25, 39684.1, 39617.06, 39538.35, 39468.62, 39405.41, 39349.36, 39299.74, 39256.4, 39220.17, 39190.04],
    24: [39724.03, 39767.92, 39688.25, 39620.74, 39541.46, 39471.26, 39407.55, 39350.98, 39300.83, 39256.93, 39220.13, 39189.39],
    25: [39721.46, 39773.58, 39692.41, 39624.42, 39544.57, 39473.91, 39409.69, 39352.6, 39301.91, 39257.45, 39220.1, 39188.74],
    26: [39718.9, 39779.24, 39696.56, 39628.1, 39547.68, 39476.55, 39411.83, 39354.22, 39302.99, 39257.98, 39220.06, 39188.09],
    27: [39716.33, 39784.91, 39700.72, 39631.78, 39550.79, 39479.2, 39413.97, 39355.84, 39304.08, 39258.5, 39220.03, 39187.44],
    28: [39713.77, 39790.57, 39704.87, 39635.46, 39553.9, 39481.84, 39416.11, 39357.46, 39305.16, 39259.03, 39219.99, 39186.79],
    29: [39711.2, null, 39709.03, 39639.14, 39557.01, 39484.49, 39418.25, 39359.08, 39306.24, 39259.55, 39219.96, 39186.14],
    30: [39708.64, null, 39713.18, 39642.82, 39560.12, 39487.13, 39420.39, 39360.7, 39307.33, 39260.08, 39219.92, 39185.49],
    31: [39706.07, null, 39717.34, null, 39563.23, null, 39422.53, 39362.32, null, 39260.6, null, 39184.84]
  };

  // Obtener UF del día actual
  const obtenerUF = () => {
    const ufDelDia = tablaUF[diaActual];
    if (ufDelDia && ufDelDia[mesActual] !== null) {
      return ufDelDia[mesActual];
    }
    // Fallback a un valor por defecto si no existe
    return 39722.61;
  };

  const UF = obtenerUF();
  const PRENDA = 103610;
  const LIMITACION_DOMINIO = 5630;
  const INSCRIPCION = 36030;
  const LIMITE_200_UF = UF * 200;
  const TASA_MENOR_200UF = 0.0276;
  const TASA_MAYOR_200UF = 0.0240;
  const IMPUESTO_TASA = 1.008; // 0.8% de impuesto

  // Tabla de seguros según plazo y combinación
  const segurosData = {
    12: { DESG: 0.0183, RDH: 0.0115, CESA: 0.0365, DESGRDH: 0.0298, DESGCESA: 0.0548, RDHCESA: 0.048, DESGRDHCESA: 0.0663 },
    24: { DESG: 0.0268, RDH: 0.0121, CESA: 0.0404, DESGRDH: 0.0389, DESGCESA: 0.0672, RDHCESA: 0.0525, DESGRDHCESA: 0.0793 },
    36: { DESG: 0.0343, RDH: 0.0126, CESA: 0.045, DESGRDH: 0.0469, DESGCESA: 0.0793, RDHCESA: 0.0576, DESGRDHCESA: 0.0919 },
    48: { DESG: 0.0418, RDH: 0.0282, CESA: 0.0502, DESGRDH: 0.07, DESGCESA: 0.092, RDHCESA: 0.0784, DESGRDHCESA: 0.1202 }
  };

  const calcularCuota = (plazoMeses) => {
    if (!saldoPrecio || parseFloat(saldoPrecio) <= 0) return 0;

    const monto = parseFloat(saldoPrecio);
    
    // 1. Reparaciones Menores (siempre incluido)
    const reparacionesMenores = plazoMeses * 0.24 * UF;
    
    // 2. Subtotal sin seguros (D16)
    const subTotalSinSeguros = monto + PRENDA + LIMITACION_DOMINIO + INSCRIPCION + reparacionesMenores;
    
    // 3. Calcular seguros (siempre incluidos: DESG + RDH + CESA)
    // Usar columna DESGRDHCESA que incluye los 3 seguros
    const factorSeguro = segurosData[plazoMeses].DESGRDHCESA;
    
    // Factor D34 aproximado (basado en tabla, varía según plazo)
    const factorD34Map = { 12: 1.068, 24: 1.0861, 36: 1.0985, 48: 1.1254 };
    const factorD34 = factorD34Map[plazoMeses] || 1.08;
    
    // E34 = D34 * D16
    const montoParaSeguros = factorD34 * subTotalSinSeguros;
    
    // Seguros totales
    const seguros = factorSeguro * montoParaSeguros;
    
    // 4. Subtotal con seguros (D21)
    const subTotalConSeguros = subTotalSinSeguros + seguros;
    
    // 5. Total con impuesto (D23) = D21 * 1.008
    const totalConImpuesto = subTotalConSeguros * IMPUESTO_TASA;
    
    // 6. Determinar tasa según monto
    const tasaMensual = subTotalConSeguros > LIMITE_200_UF ? TASA_MAYOR_200UF : TASA_MENOR_200UF;
    
    // 7. Calcular cuota
    const cuota = calcularPMT(tasaMensual, plazoMeses, totalConImpuesto);
    
    return Math.round(cuota);
  };

  const calcularPMT = (tasa, nper, pv) => {
    if (tasa === 0) return pv / nper;
    const pvif = Math.pow(1 + tasa, nper);
    return (tasa * pv * pvif) / (pvif - 1);
  };

  useEffect(() => {
    setCuotas({
      mes12: calcularCuota(12),
      mes24: calcularCuota(24),
      mes36: calcularCuota(36),
      mes48: calcularCuota(48)
    });
  }, [saldoPrecio]);

  const formatearMonto = (monto) => {
    if (!monto) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  };

  const obtenerTasaAplicable = () => {
    if (!saldoPrecio || parseFloat(saldoPrecio) <= 0) return null;
    const monto = parseFloat(saldoPrecio);
    const reparacionesMenores = 12 * 0.24 * UF;
    const subTotal = monto + PRENDA + LIMITACION_DOMINIO + INSCRIPCION + reparacionesMenores;
    return subTotal > LIMITE_200_UF ? TASA_MAYOR_200UF : TASA_MENOR_200UF;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const numeroSinPuntos = value.replace(/\./g, '');
    
    if (numeroSinPuntos === '' || /^\d+$/.test(numeroSinPuntos)) {
      setSaldoPrecio(numeroSinPuntos);
      
      if (numeroSinPuntos) {
        const formatted = parseInt(numeroSinPuntos).toLocaleString('es-CL');
        setInputValue(formatted);
      } else {
        setInputValue('');
      }
    }
  };

  const calcularCAE = (plazoMeses) => {
    if (!saldoPrecio || parseFloat(saldoPrecio) <= 0) return 0;
    
    const monto = parseFloat(saldoPrecio);
    const cuotaMensual = cuotas[`mes${plazoMeses}`];
    
    if (!cuotaMensual || cuotaMensual === 0) return 0;
    
    let tasa = 0.01;
    const precision = 0.0000001;
    let iteraciones = 0;
    const maxIteraciones = 100;
    
    while (iteraciones < maxIteraciones) {
      const factor = Math.pow(1 + tasa, plazoMeses);
      const pv = cuotaMensual * ((factor - 1) / (tasa * factor));
      const diferencia = pv - monto;
      
      if (Math.abs(diferencia) < precision) break;
      
      const derivada = cuotaMensual * (
        (plazoMeses * Math.pow(1 + tasa, plazoMeses - 1) * (tasa * factor) - 
        (factor - 1) * (factor + tasa * plazoMeses * Math.pow(1 + tasa, plazoMeses - 1))) /
        Math.pow(tasa * factor, 2)
      );
      
      tasa = tasa - diferencia / derivada;
      iteraciones++;
    }
    
    const cae = tasa * 12 * 100;
    return cae;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '0',
      margin: '0'
    },
    wrapper: {
      maxWidth: '480px',
      margin: '0 auto',
      padding: '16px',
      paddingBottom: '32px'
    },
    header: {
      textAlign: 'center',
      paddingTop: '40px',
      paddingBottom: '24px',
      color: 'white'
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      marginBottom: '8px',
      textShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    subtitle: {
      fontSize: '16px',
      opacity: '0.95',
      fontWeight: '500'
    },
    inputCard: {
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      padding: '28px',
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px'
    },
    inputWrapper: {
      position: 'relative'
    },
    dollarIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9CA3AF',
      width: '24px',
      height: '24px'
    },
    input: {
      width: '100%',
      padding: '18px 16px 18px 52px',
      fontSize: '28px',
      fontWeight: '700',
      border: '2px solid #E5E7EB',
      borderRadius: '16px',
      outline: 'none',
      transition: 'all 0.3s',
      boxSizing: 'border-box'
    },
    includeSection: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #F3F4F6'
    },
    includeHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#6B7280',
      marginBottom: '12px',
      fontWeight: '600'
    },
    includeList: {
      marginLeft: '24px',
      fontSize: '12px',
      color: '#9CA3AF'
    },
    includeItem: {
      marginBottom: '6px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
      paddingLeft: '8px'
    },
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    optionCard: {
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      padding: '24px',
      color: 'white',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    },
    optionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px'
    },
    optionLabel: {
      fontSize: '13px',
      fontWeight: '600',
      opacity: '0.9',
      marginBottom: '6px'
    },
    optionAmount: {
      fontSize: '36px',
      fontWeight: '800',
      lineHeight: '1.1'
    },
    optionBadge: {
      background: 'rgba(255,255,255,0.25)',
      borderRadius: '20px',
      padding: '6px 14px',
      fontSize: '11px',
      fontWeight: '700',
      whiteSpace: 'nowrap'
    },
    optionSubtext: {
      fontSize: '14px',
      opacity: '0.9',
      marginBottom: '12px'
    },
    optionTotal: {
      fontSize: '12px',
      opacity: '0.8'
    },
    infoCard: {
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '16px',
      padding: '20px',
      fontSize: '12px',
      color: '#6B7280',
      marginTop: '16px'
    },
    infoTitle: {
      fontWeight: '700',
      color: '#374151',
      marginBottom: '12px',
      fontSize: '13px'
    },
    infoItem: {
      marginBottom: '6px',
      lineHeight: '1.5'
    },
    infoSubitem: {
      marginLeft: '16px',
      color: '#9CA3AF',
      fontSize: '11px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'white'
    },
    emptyIcon: {
      opacity: '0.6',
      marginBottom: '16px'
    },
    emptyText: {
      fontSize: '15px',
      opacity: '0.9'
    }
  };

  const colorSchemes = {
    12: { from: '#10b981', to: '#059669' },
    24: { from: '#3b82f6', to: '#2563eb' },
    36: { from: '#8b5cf6', to: '#7c3aed' },
    48: { from: '#f59e0b', to: '#d97706' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Simulador de Cuotas</h1>
          <p style={styles.subtitle}>AutoFácil Chile</p>
        </div>

        <div style={styles.inputCard}>
          <label style={styles.label}>Saldo Precio a Financiar</label>
          <div style={styles.inputWrapper}>
            <DollarSign style={styles.dollarIcon} />
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ingrese el monto"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div style={styles.includeSection}>
            <div style={styles.includeHeader}>
              <Shield style={{ width: '16px', height: '16px', color: '#667eea' }} />
              <span>Incluye:</span>
            </div>
            <div style={styles.includeList}>
              <div style={styles.includeItem}>✓ Seguro de Desgravamen</div>
              <div style={styles.includeItem}>✓ Seguro RDH</div>
              <div style={styles.includeItem}>✓ Seguro de Cesantía</div>
              <div style={styles.includeItem}>✓ Reparaciones Menores</div>
              <div style={styles.includeItem}>✓ Gastos de Prenda e Inscripción</div>
              <div style={styles.includeItem}>✓ Impuesto (0.8%)</div>
            </div>
          </div>
        </div>

        {saldoPrecio && parseFloat(saldoPrecio) > 0 ? (
          <>
            <div style={styles.sectionTitle}>
              <Calendar style={{ width: '20px', height: '20px' }} />
              Opciones de Pago
            </div>

            <div style={styles.optionsContainer}>
              {[
                { months: 12, label: 'Corto Plazo', color: colorSchemes[12] },
                { months: 24, label: 'Recomendado', color: colorSchemes[24] },
                { months: 36, label: 'Cuota Baja', color: colorSchemes[36] },
                { months: 48, label: 'Más Plazo', color: colorSchemes[48] }
              ].map(({ months, label, color }) => (
                <div
                  key={months}
                  style={{
                    ...styles.optionCard,
                    background: `linear-gradient(135deg, ${color.from} 0%, ${color.to} 100%)`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={styles.optionHeader}>
                    <div>
                      <div style={styles.optionLabel}>{months} Meses</div>
                      <div style={styles.optionAmount}>
                        {formatearMonto(cuotas[`mes${months}`])}
                      </div>
                    </div>
                    <div style={styles.optionBadge}>{label}</div>
                  </div>
                  <div style={styles.optionSubtext}>por mes</div>
                  <div style={styles.optionTotal}>
                    CAE: {calcularCAE(months).toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoTitle}>Condiciones:</div>
              <div style={styles.infoItem}>
                • Tasa: {((obtenerTasaAplicable() || 0) * 100).toFixed(2)}% mensual
              </div>
              <div style={styles.infoSubitem}>
                {obtenerTasaAplicable() === TASA_MAYOR_200UF ? '(Monto > 200 UF)' : '(Monto ≤ 200 UF)'}
              </div>
              <div style={styles.infoItem}>• Valor UF: ${UF.toLocaleString('es-CL')} ({diaActual}/{mesActual + 1}/2026)</div>
              <div style={styles.infoItem}>• Incluye todos los seguros y gastos operacionales</div>
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <TrendingUp style={{ width: '64px', height: '64px', margin: '0 auto' }} />
            </div>
            <p style={styles.emptyText}>
              Ingrese el monto a financiar para ver las opciones de cuotas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
