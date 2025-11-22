"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { memo, useMemo } from "react";
import type { StudentSummary } from "@/types";

interface GraficoSupervivenciaProps {
  students: StudentSummary[];
}

export const GraficoSupervivencia = memo(function GraficoSupervivencia({ students }: GraficoSupervivenciaProps) {
  // Generar datos de supervivencia basados en estudiantes reales
  const supervivenciaData = useMemo(() => {
    if (students.length === 0) return [];
    
    // Seleccionar estudiantes representativos de cada nivel
    const estudiantesCritico = students.filter(s => s.risk_score >= 80).slice(0, 1);
    const estudiantesAltoRiesgo = students.filter(s => s.risk_score >= 65 && s.risk_score < 80).slice(0, 1);
    const estudiantesRiesgoModerado = students.filter(s => s.risk_score >= 50 && s.risk_score < 65).slice(0, 1);
    const estudiantesRegular = students.filter(s => s.risk_score >= 30 && s.risk_score < 50).slice(0, 1);
    const estudiantesBueno = students.filter(s => s.risk_score < 30).slice(0, 1);
    
    const estudiantesSeleccionados = [
      ...estudiantesCritico, 
      ...estudiantesAltoRiesgo, 
      ...estudiantesRiesgoModerado,
      ...estudiantesRegular,
      ...estudiantesBueno
    ].filter(s => s); // Filtrar undefined si no hay estudiantes en algún nivel
    
    // Generar probabilidades de supervivencia para 12 semanas
    const semanas = Array.from({ length: 13 }, (_, i) => i);
    
    // Datos individuales con curva exponencial más realista
    const datosIndividuales = estudiantesSeleccionados.flatMap(student => 
      semanas.map(semana => {
        // Función exponencial: P(t) = 100 * e^(-λt)
        // λ (lambda) es proporcional al risk_score
        const lambda = (student.risk_score / 100) * 0.15; // Factor de decaimiento
        const probabilidad = 100 * Math.exp(-lambda * semana);
        
        return {
          estudiante: student.name.split(",")[0],
          tiempo: semana,
          probabilidad: Math.round(Math.max(0, Math.min(100, probabilidad)) * 100) / 100 // Redondear a 2 decimales
        };
      })
    );
    
    // Calcular promedio del salón
    const promedioSalon = semanas.map(semana => {
      const promedioRiesgo = students.reduce((sum, s) => sum + s.risk_score, 0) / students.length;
      const lambda = (promedioRiesgo / 100) * 0.15;
      const probabilidad = 100 * Math.exp(-lambda * semana);
      
      return {
        estudiante: "Promedio Salón",
        tiempo: semana,
        probabilidad: Math.round(Math.max(0, Math.min(100, probabilidad)) * 100) / 100
      };
    });
    
    return [...datosIndividuales, ...promedioSalon];
  }, [students]);
  
  // Transformar datos para Recharts - memoizado para evitar recálculos
  const chartData = useMemo(() => {
    return supervivenciaData.reduce((acc, item) => {
      const existing = acc.find((d) => d.tiempo === item.tiempo);
      if (existing) {
        existing[item.estudiante] = item.probabilidad;
      } else {
        acc.push({
          tiempo: item.tiempo,
          [item.estudiante]: item.probabilidad,
        });
      }
      return acc;
    }, [] as any[]);
  }, [supervivenciaData]);

  // Obtener estudiantes únicos
  const estudiantes = useMemo(() => {
    return Array.from(new Set(supervivenciaData.map(d => d.estudiante)));
  }, [supervivenciaData]);

  // Configuración de colores para cada línea
  const colores = useMemo(() => {
    const colors = ["#ef4444", "#f97316", "#fb923c", "#eab308", "#22c55e"];
    const result: Record<string, string> = {};
    
    estudiantes.forEach((est, idx) => {
      // El promedio del salón en azul punteado
      if (est === "Promedio Salón") {
        result[est] = "#3b82f6";
      } else {
        result[est] = colors[idx % colors.length];
      }
    });
    
    return result;
  }, [estudiantes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Curva de Supervivencia</CardTitle>
        <CardDescription>
          Probabilidad de permanencia estimada en las próximas semanas (basado en análisis de riesgo)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="tiempo"
                label={{ value: "Semanas", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "Probabilidad de Permanencia (%)", angle: -90, position: "insideLeft" }}
                domain={[0, 100]}
              />
              <Tooltip
                formatter={(value: number) => `${typeof value === 'number' ? value.toFixed(2) : value}%`}
                labelFormatter={(label) => `Semana ${label}`}
              />
              <Legend />
              {estudiantes.map((estudiante) => (
                <Line
                  key={estudiante}
                  type="monotone"
                  dataKey={estudiante}
                  stroke={colores[estudiante]}
                  strokeWidth={estudiante === "Promedio Salón" ? 3 : 2}
                  strokeDasharray={estudiante === "Promedio Salón" ? "5 5" : "0"}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Interpretación */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Interpretación:</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>
              • <strong className="text-foreground">Línea más pronunciada hacia abajo:</strong> Mayor riesgo de deserción
            </li>
            {estudiantes.filter(e => e !== "Promedio Salón").map((est, idx) => (
              <li key={est}>
                • <strong className="text-foreground" style={{ color: colores[est] }}>{est}:</strong>{" "}
                {idx === 0 ? "Alto riesgo - Requiere intervención urgente" : 
                 idx === 1 ? "Riesgo moderado-alto - Atención prioritaria" : 
                 idx === 2 ? "Riesgo moderado - Seguimiento cercano" :
                 idx === 3 ? "Riesgo bajo-moderado - Seguimiento regular" :
                 "Bajo riesgo - Estado óptimo"}
              </li>
            ))}
            {estudiantes.includes("Promedio Salón") && (
              <li>
                • <strong className="text-foreground" style={{ color: colores["Promedio Salón"] }}>
                  Promedio Salón (línea punteada):
                </strong> Tendencia general del grupo
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
});
