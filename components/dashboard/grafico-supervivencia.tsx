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

    // Tomar TODOS los estudiantes filtrados (no solo 1 por nivel)
    // Ordenar por risk_score para mostrar curvas representativas
    const estudiantesOrdenados = [...students].sort((a, b) => b.risk_score - a.risk_score);

    // Seleccionar estudiantes representativos:
    // - Si hay muchos estudiantes (>10), tomar 1 de cada 10%
    // - Si hay pocos (<10), mostrar todos
    let estudiantesSeleccionados: StudentSummary[];

    if (estudiantesOrdenados.length <= 10) {
      // Mostrar todos si son pocos
      estudiantesSeleccionados = estudiantesOrdenados;
    } else {
      // Tomar estudiantes representativos de diferentes niveles de riesgo
      const step = Math.floor(estudiantesOrdenados.length / 8); // Máximo 8 líneas
      estudiantesSeleccionados = [];
      for (let i = 0; i < estudiantesOrdenados.length; i += step) {
        estudiantesSeleccionados.push(estudiantesOrdenados[i]);
        if (estudiantesSeleccionados.length >= 8) break;
      }
    }

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
          estudiante: student.name, // Nombre completo
          tiempo: semana,
          probabilidad: Math.round(Math.max(0, Math.min(100, probabilidad)) * 100) / 100,
          riskScore: student.risk_score
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
        probabilidad: Math.round(Math.max(0, Math.min(100, probabilidad)) * 100) / 100,
        riskScore: promedioRiesgo
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

  // Obtener estudiantes únicos con sus risk scores
  const estudiantesConRiesgo = useMemo(() => {
    const uniqueStudents = new Map<string, number>();
    supervivenciaData.forEach(d => {
      if (!uniqueStudents.has(d.estudiante)) {
        uniqueStudents.set(d.estudiante, d.riskScore);
      }
    });
    return Array.from(uniqueStudents.entries()).map(([nombre, score]) => ({
      nombre,
      riskScore: score
    }));
  }, [supervivenciaData]);

  const estudiantes = useMemo(() => {
    return estudiantesConRiesgo.map(e => e.nombre);
  }, [estudiantesConRiesgo]);

  // Configuración de colores para cada línea basada en risk_score
  const colores = useMemo(() => {
    const result: Record<string, string> = {};

    estudiantesConRiesgo.forEach(({ nombre, riskScore }) => {
      if (nombre === "Promedio Salón") {
        result[nombre] = "#3b82f6"; // Azul
      } else if (riskScore >= 80) {
        result[nombre] = "#dc2626"; // Rojo oscuro (crítico)
      } else if (riskScore >= 65) {
        result[nombre] = "#ef4444"; // Rojo (alto)
      } else if (riskScore >= 50) {
        result[nombre] = "#f97316"; // Naranja (moderado)
      } else if (riskScore >= 30) {
        result[nombre] = "#eab308"; // Amarillo (regular)
      } else {
        result[nombre] = "#22c55e"; // Verde (bueno)
      }
    });

    return result;
  }, [estudiantesConRiesgo]);

  const getRiskLabel = (score: number) => {
    if (score >= 80) return "Crítico";
    if (score >= 65) return "Alto";
    if (score >= 50) return "Moderado";
    if (score >= 30) return "Regular";
    return "Bajo";
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Curva de Supervivencia</CardTitle>
          <CardDescription>
            No hay datos disponibles para los filtros seleccionados
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Curva de Supervivencia</CardTitle>
        <CardDescription>
          Probabilidad de permanencia estimada en las próximas semanas ({estudiantes.length - 1} estudiantes mostrados)
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
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                formatter={(value) => {
                  const estudiante = estudiantesConRiesgo.find(e => e.nombre === value);
                  if (!estudiante) return value;
                  if (value === "Promedio Salón") return value;
                  const riskLabel = getRiskLabel(estudiante.riskScore);
                  return `${value} (${riskLabel})`;
                }}
              />
              {estudiantes.map((estudiante) => (
                <Line
                  key={estudiante}
                  type="monotone"
                  dataKey={estudiante}
                  stroke={colores[estudiante]}
                  strokeWidth={estudiante === "Promedio Salón" ? 3 : 2}
                  strokeDasharray={estudiante === "Promedio Salón" ? "5 5" : "0"}
                  dot={false}
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
            <li>
              • <strong className="text-foreground">Colores:</strong> Rojo (Crítico/Alto) → Naranja (Moderado) → Amarillo (Regular) → Verde (Bajo)
            </li>
            {estudiantes.includes("Promedio Salón") && (
              <li>
                • <strong className="text-foreground" style={{ color: colores["Promedio Salón"] }}>
                  Promedio Salón (línea punteada):
                </strong> Tendencia general del grupo filtrado
              </li>
            )}
            <li>
              • <strong className="text-foreground">Mostrando {estudiantes.length - 1} estudiantes</strong> según filtros aplicados
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
});
