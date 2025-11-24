"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { memo, useMemo, useState } from "react";
import type { StudentSummary } from "@/types";
import { cn } from "@/lib/utils";

interface GraficoSupervivenciaProps {
  students: StudentSummary[];
}

export const GraficoSupervivencia = memo(function GraficoSupervivencia({ students }: GraficoSupervivenciaProps) {
  const [hiddenStudents, setHiddenStudents] = useState<Set<string>>(new Set());

  // Generar datos de supervivencia basados en estudiantes reales
  const supervivenciaData = useMemo(() => {
    if (students.length === 0) return [];

    // Tomar estudiantes representativos
    const estudiantesOrdenados = [...students].sort((a, b) => b.risk_score - a.risk_score);

    // Limitar a máximo 5 estudiantes para evitar amontonamiento
    let estudiantesSeleccionados: StudentSummary[];

    if (estudiantesOrdenados.length <= 5) {
      estudiantesSeleccionados = estudiantesOrdenados;
    } else {
      // Tomar 5 estudiantes representativos de diferentes niveles
      const step = Math.floor(estudiantesOrdenados.length / 5);
      estudiantesSeleccionados = [];
      for (let i = 0; i < estudiantesOrdenados.length && estudiantesSeleccionados.length < 5; i += step) {
        estudiantesSeleccionados.push(estudiantesOrdenados[i]);
      }
    }

    // Generar probabilidades de supervivencia para 12 semanas
    const semanas = Array.from({ length: 13 }, (_, i) => i);

    // Datos individuales con curva exponencial más realista
    const datosIndividuales = estudiantesSeleccionados.flatMap(student =>
      semanas.map(semana => {
        // Función exponencial: P(t) = 100 * e^(-λt)
        const lambda = (student.risk_score / 100) * 0.15;
        const probabilidad = 100 * Math.exp(-lambda * semana);

        return {
          estudiante: student.name,
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

  // Transformar datos para Recharts
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

  // Configuración de colores
  const colores = useMemo(() => {
    const result: Record<string, string> = {};

    estudiantesConRiesgo.forEach(({ nombre, riskScore }) => {
      if (nombre === "Promedio Salón") {
        result[nombre] = "#3b82f6";
      } else if (riskScore >= 80) {
        result[nombre] = "#dc2626";
      } else if (riskScore >= 65) {
        result[nombre] = "#ef4444";
      } else if (riskScore >= 50) {
        result[nombre] = "#f97316";
      } else if (riskScore >= 30) {
        result[nombre] = "#eab308";
      } else {
        result[nombre] = "#22c55e";
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

  const toggleStudent = (studentName: string) => {
    const newHidden = new Set(hiddenStudents);
    if (newHidden.has(studentName)) {
      newHidden.delete(studentName);
    } else {
      newHidden.add(studentName);
    }
    setHiddenStudents(newHidden);
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

  const visibleStudents = estudiantes.filter(e => !hiddenStudents.has(e));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Curva de Supervivencia (Interactiva)</CardTitle>
        <CardDescription>
          Probabilidad de permanencia • Haz clic en los nombres para mostrar/ocultar líneas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Leyenda interactiva */}
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-xs font-semibold mb-2">Estudiantes (haz clic para ocultar/mostrar):</p>
          <div className="flex flex-wrap gap-2">
            {estudiantesConRiesgo.map(({ nombre, riskScore }) => (
              <button
                key={nombre}
                onClick={() => toggleStudent(nombre)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                  hiddenStudents.has(nombre)
                    ? "bg-gray-200 text-gray-400 line-through opacity-50"
                    : "text-white shadow-sm hover:shadow-md"
                )}
                style={{
                  backgroundColor: hiddenStudents.has(nombre) ? undefined : colores[nombre]
                }}
              >
                {nombre === "Promedio Salón" ? nombre : `${nombre.split(",")[0]} (${getRiskLabel(riskScore)})`}
              </button>
            ))}
          </div>
        </div>

        {/* Gráfico */}
        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="tiempo"
                label={{
                  value: "Semanas",
                  position: "insideBottom",
                  offset: -5,
                  style: { fontWeight: 600 }
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{
                  value: "Probabilidad de Permanencia (%)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { textAnchor: 'middle', fontWeight: 600, fontSize: 12 }
                }}
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px'
                }}
                formatter={(value: number, name: string) => {
                  const estudiante = estudiantesConRiesgo.find(e => e.nombre === name);
                  const riskLabel = estudiante ? ` (${getRiskLabel(estudiante.riskScore)})` : '';
                  return [`${value.toFixed(1)}%`, `${name}${riskLabel}`];
                }}
                labelFormatter={(label) => `Semana ${label}`}
              />
              {visibleStudents.map((estudiante) => (
                <Line
                  key={estudiante}
                  type="monotone"
                  dataKey={estudiante}
                  stroke={colores[estudiante]}
                  strokeWidth={estudiante === "Promedio Salón" ? 3 : 2}
                  strokeDasharray={estudiante === "Promedio Salón" ? "5 5" : "0"}
                  dot={false}
                  activeDot={{ r: 6 }}
                  animationDuration={500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Interpretación */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-semibold mb-2">💡 Cómo interpretar:</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>
              • <strong className="text-foreground">Línea descendente pronunciada:</strong> Mayor riesgo de deserción
            </li>
            <li>
              • <strong className="text-foreground">Colores:</strong> {' '}
              <span className="text-red-600">Rojo (Crítico/Alto)</span> → {' '}
              <span className="text-orange-600">Naranja (Moderado)</span> → {' '}
              <span className="text-yellow-600">Amarillo (Regular)</span> → {' '}
              <span className="text-green-600">Verde (Bajo)</span>
            </li>
            <li>
              • <strong className="text-foreground">Línea punteada azul:</strong> Promedio del grupo filtrado
            </li>
            <li>
              • <strong className="text-foreground">Interactividad:</strong> Haz clic en los nombres arriba para ocultar/mostrar líneas
            </li>
            <li>
              • Mostrando máximo 5 estudiantes representativos de {students.length} estudiantes filtrados
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
});
