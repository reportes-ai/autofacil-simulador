import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Calendar, Shield } from 'lucide-react';

export default function CalculadoraCuotas() {
  const [saldoPrecio, setSaldoPrecio] = useState('');
  const [cuotas, setCuotas] = useState({ mes12: 0, mes24: 0, mes36: 0, mes48: 0 });

  // Valores fijos del simulador
  const UF = 39762.52;
  const PRENDA = 103610;
  const LIMITACION_DOMINIO = 5630;
  const INSCRIPCION = 36030;
  const LIMITE_200_UF = UF * 200; // $7,952,504
  const TASA_MENOR_200UF = 0.0258; // 2.58% mensual para montos ≤ 200 UF
  const TASA_MAYOR_200UF = 0.0213; // 2.13% mensual para montos > 200 UF

  // Tabla de seguros (desde la hoja SEGUROS del Excel)
  const seguros = {
    12: { desg: 0.0183, rdh: 0.0115 },
    24: { desg: 0.0268, rdh: 0.0121 },
    36: { desg: 0.0343, rdh: 0.0126 },
    48: { desg: 0.0418, rdh: 0.0282 }
  };

  const calcularCuota = (plazoMeses) => {
    if (!saldoPrecio || parseFloat(saldoPrecio) <= 0) return 0;

    const monto = parseFloat(saldoPrecio);
    
    // 1. Cálculo de Reparaciones Menores (0.24 UF por mes)
    const reparacionesMenores = plazoMeses * 0.24 * UF;
    
    // 2. Subtotal sin seguros
    const subTotalSinSeguros = 
      monto + 
      PRENDA + 
      LIMITACION_DOMINIO + 
      INSCRIPCION + 
      reparacionesMenores;
    
    // 3. Factor de seguros (necesita el monto total financiado)
    // Para calcular seguros necesitamos el factor de valor presente
    const factorVP = calcularFactorVP(plazoMeses);
    const montoParaSeguros = subTotalSinSeguros * factorVP;
    
    // 4. Seguros
    const seguroDesg = seguros[plazoMeses].desg * montoParaSeguros;
    const seguroRDH = seguros[plazoMeses].rdh * montoParaSeguros;
    
    // 5. Total a financiar
    const totalFinanciar = subTotalSinSeguros + seguroDesg + seguroRDH;
    
    // 6. Determinar tasa según monto total (D4: =IF(D21>P3,Q5,P5))
    const tasaMensual = totalFinanciar > LIMITE_200_UF ? TASA_MAYOR_200UF : TASA_MENOR_200UF;
    
    // 7. Cálculo de cuota usando PMT
    const cuota = calcularPMT(tasaMensual, plazoMeses, totalFinanciar);
    
    return Math.round(cuota);
  };

  // Función PMT (Payment) - equivalente a -PMT en Excel
  const calcularPMT = (tasa, nper, pv) => {
    if (tasa === 0) return pv / nper;
    const pvif = Math.pow(1 + tasa, nper);
    return (tasa * pv * pvif) / (pvif - 1);
  };

  // Factor de valor presente para cálculo de seguros
  const calcularFactorVP = (nper) => {
    // Este factor simula la relación entre el monto inicial y el financiado
    // Basado en el patrón del Excel: D32 = VLOOKUP que da aprox 1.04
    return 1.04;
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

  // Función para obtener la tasa aplicable
  const obtenerTasaAplicable = () => {
    if (!saldoPrecio || parseFloat(saldoPrecio) <= 0) return null;
    
    const monto = parseFloat(saldoPrecio);
    const reparacionesMenores = 12 * 0.24 * UF; // Usar 12 meses como referencia
    const subTotal = monto + PRENDA + LIMITACION_DOMINIO + INSCRIPCION + reparacionesMenores;
    
    // Estimación del total con seguros (aproximado)
    const totalEstimado = subTotal * 1.04;
    
    return totalEstimado > LIMITE_200_UF ? TASA_MAYOR_200UF : TASA_MENOR_200UF;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Simulador de Cuotas
          </h1>
          <p className="text-gray-600">Financiamiento Automotriz</p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Saldo Precio a Financiar
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={saldoPrecio}
              onChange={(e) => setSaldoPrecio(e.target.value)}
              placeholder="Ingrese el monto"
              className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          
          {/* Incluye */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Incluye:</span>
            </div>
            <div className="space-y-1 text-xs text-gray-500 ml-6">
              <div>✓ Seguro de Desgravamen</div>
              <div>✓ Seguro RDH</div>
              <div>✓ Reparaciones Menores</div>
              <div>✓ Gastos de Prenda e Inscripción</div>
            </div>
          </div>
        </div>

        {/* Results */}
        {saldoPrecio && parseFloat(saldoPrecio) > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700 px-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Opciones de Pago
            </h2>

            {/* 12 meses */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-medium opacity-90">12 Meses</div>
                  <div className="text-4xl font-bold mt-1">
                    {formatearMonto(cuotas.mes12)}
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-semibold">
                  Corto Plazo
                </div>
              </div>
              <div className="text-sm opacity-90">por mes</div>
              <div className="text-xs opacity-75 mt-3">
                Total: {formatearMonto(cuotas.mes12 * 12)}
              </div>
            </div>

            {/* 24 meses */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-medium opacity-90">24 Meses</div>
                  <div className="text-4xl font-bold mt-1">
                    {formatearMonto(cuotas.mes24)}
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-semibold">
                  Recomendado
                </div>
              </div>
              <div className="text-sm opacity-90">por mes</div>
              <div className="text-xs opacity-75 mt-3">
                Total: {formatearMonto(cuotas.mes24 * 24)}
              </div>
            </div>

            {/* 36 meses */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-medium opacity-90">36 Meses</div>
                  <div className="text-4xl font-bold mt-1">
                    {formatearMonto(cuotas.mes36)}
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-semibold">
                  Cuota Baja
                </div>
              </div>
              <div className="text-sm opacity-90">por mes</div>
              <div className="text-xs opacity-75 mt-3">
                Total: {formatearMonto(cuotas.mes36 * 36)}
              </div>
            </div>

            {/* 48 meses */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-medium opacity-90">48 Meses</div>
                  <div className="text-4xl font-bold mt-1">
                    {formatearMonto(cuotas.mes48)}
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-semibold">
                  Más Plazo
                </div>
              </div>
              <div className="text-sm opacity-90">por mes</div>
              <div className="text-xs opacity-75 mt-3">
                Total: {formatearMonto(cuotas.mes48 * 48)}
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        {saldoPrecio && parseFloat(saldoPrecio) > 0 && (
          <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 border border-gray-200">
            <div className="font-semibold mb-2 text-gray-700">Condiciones:</div>
            <div className="space-y-1">
              <div>• Tasa: {((obtenerTasaAplicable() || 0) * 100).toFixed(2)}% mensual</div>
              <div className="text-gray-500 ml-4">
                {obtenerTasaAplicable() === TASA_MAYOR_200UF 
                  ? '(Monto > 200 UF)' 
                  : '(Monto ≤ 200 UF)'}
              </div>
              <div>• Valor UF: ${UF.toLocaleString('es-CL')}</div>
              <div>• Incluye todos los seguros y gastos operacionales</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!saldoPrecio || parseFloat(saldoPrecio) <= 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <Calculator className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <p className="text-gray-500">
              Ingrese el monto a financiar para ver las opciones de cuotas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
