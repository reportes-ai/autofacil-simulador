import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Shield, TrendingUp } from 'lucide-react';

export default function CalculadoraCuotas() {
  const [saldoPrecio, setSaldoPrecio] = useState('');
  const [inputValue, setInputValue] = useState(''); // Valor mostrado en el input con formato
  const [cuotas, setCuotas] = useState({ mes12: 0, mes24: 0, mes36: 0, mes48: 0 });

  const UF = 39762.52;
  const PRENDA = 103610;
  const LIMITACION_DOMINIO = 5630;
  const INSCRIPCION = 36030;
  const LIMITE_200_UF = UF * 200;
  const TASA_MENOR_200UF = 0.0258;
  const TASA_MAYOR_200UF = 0.0213;

  const seguros = {
    12: { desg: 0.0183, rdh: 0.0115 },
    24: { desg: 0.0268, rdh: 0.0121 },
    36: { desg: 0.0343, rdh: 0.0126 },
    48: { desg: 0.0418, rdh: 0.0282 }
  };

  const calcularCuota = (plazoMeses) => {
    if (!saldoPrecio || parseFloat(saldoPrecio) <= 0) return 0;
    const monto = parseFloat(saldoPrecio);
    const reparacionesMenores = plazoMeses * 0.24 * UF;
    const subTotalSinSeguros = monto + PRENDA + LIMITACION_DOMINIO + INSCRIPCION + reparacionesMenores;
    const factorVP = 1.04;
    const montoParaSeguros = subTotalSinSeguros * factorVP;
    const seguroDesg = seguros[plazoMeses].desg * montoParaSeguros;
    const seguroRDH = seguros[plazoMeses].rdh * montoParaSeguros;
    const totalFinanciar = subTotalSinSeguros + seguroDesg + seguroRDH;
    const tasaMensual = totalFinanciar > LIMITE_200_UF ? TASA_MAYOR_200UF : TASA_MENOR_200UF;
    const cuota = calcularPMT(tasaMensual, plazoMeses, totalFinanciar);
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
    const totalEstimado = subTotal * 1.04;
    return totalEstimado > LIMITE_200_UF ? TASA_MAYOR_200UF : TASA_MENOR_200UF;
  };

  // Manejar cambio en el input con formato de miles
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Remover todos los puntos para obtener el número puro
    const numeroSinPuntos = value.replace(/\./g, '');
    
    // Validar que solo sean números
    if (numeroSinPuntos === '' || /^\d+$/.test(numeroSinPuntos)) {
      setSaldoPrecio(numeroSinPuntos);
      
      // Formatear con puntos de miles para mostrar
      if (numeroSinPuntos) {
        const formatted = parseInt(numeroSinPuntos).toLocaleString('es-CL');
        setInputValue(formatted);
      } else {
        setInputValue('');
      }
    }
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
              <div style={styles.includeItem}>✓ Reparaciones Menores</div>
              <div style={styles.includeItem}>✓ Gastos de Prenda e Inscripción</div>
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
                    Total: {formatearMonto(cuotas[`mes${months}`] * months)}
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
              <div style={styles.infoItem}>• Valor UF: ${UF.toLocaleString('es-CL')}</div>
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
