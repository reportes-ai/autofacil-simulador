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
    1: [39731.79, 39703.5, 39796.31, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    2: [39735.63, 39700.94, 39801.98, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    3: [39739.47, 39698.37, 39807.65, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    4: [39743.31, 39695.81, 39813.33, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    5: [39747.15, 39693.25, 39819.01, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    6: [39751, 39690.68, 39824.68, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    7: [39754.84, 39688.12, 39830.36, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    8: [39758.68, 39685.56, 39836.04, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    9: [39762.52, 39682.99, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    10: [39759.95, 39688.65, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    11: [39757.38, 39694.31, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    12: [39754.82, 39699.97, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    13: [39752.25, 39705.63, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    14: [39749.68, 39711.29, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    15: [39747.12, 39716.95, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    16: [39744.55, 39722.61, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    17: [39741.98, 39728.28, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    18: [39739.42, 39733.94, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    19: [39736.85, 39739.61, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    20: [39734.28, 39745.27, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    21: [39731.72, 39750.94, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    22: [39729.15, 39756.61, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    23: [39726.59, 39762.28, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    24: [39724.02, 39767.95, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    25: [39721.45, 39773.62, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    26: [39718.89, 39779.29, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    27: [39716.32, 39784.96, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    28: [39713.76, 39790.63, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    29: [39711.2, null, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    30: [39708.63, null, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72],
    31: [39706.07, null, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72, 39841.72]
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
  const TASA_MENOR_200UF = 0.0282;
  const TASA_MAYOR_200UF = 0.0248;
  const IMPUESTO_TASA = 1.008;

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
          <div style={{ marginBottom: '20px' }}>
            <img 
              src="/logo.png" 
              alt="AutoFácil" 
              style={{ 
                height: '60px', 
                width: 'auto',
                display: 'block',
                margin: '0 auto'
              }} 
            />
          </div>
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
              <div style={{ ...styles.infoItem, marginTop: '12px', fontStyle: 'italic', color: '#9CA3AF', fontSize: '11px' }}>
                Valores referenciales, con primera cuota a 30 días.
              </div>
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
