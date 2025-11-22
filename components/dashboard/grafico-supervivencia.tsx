"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supervivenciaData } from "@/lib/mock/data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { memo, useMemo } from "react";

export const GraficoSupervivencia = memo(function GraficoSupervivencia() {
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
  }, []);

  // Configuración de colores para cada línea
  const colores = {
    "Juan Pérez": "#ef4444", // rojo
    "María García": "#f97316", // naranja
    "Carlos Rodríguez": "#eab308", // amarillo
    "Promedio Salón": "#3b82f6", // azul
  };

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
                formatter={(value: number) => `${value}%`}
                labelFormatter={(label) => `Semana ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Juan Pérez"
                stroke={colores["Juan Pérez"]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="María García"
                stroke={colores["María García"]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Carlos Rodríguez"
                stroke={colores["Carlos Rodríguez"]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Promedio Salón"
                stroke={colores["Promedio Salón"]}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
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
              • <strong className="text-foreground">Juan Pérez (rojo):</strong> Requiere intervención urgente
            </li>
            <li>
              • <strong className="text-foreground">María García (naranja):</strong> Atención prioritaria
            </li>
            <li>
              • <strong className="text-foreground">Carlos Rodríguez (amarillo):</strong> Seguimiento regular
            </li>
            <li>
              • <strong className="text-foreground">Línea punteada (azul):</strong> Promedio del salón como referencia
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
});
