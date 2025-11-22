"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, memo } from "react";
import type { StudentSummary } from "@/types";

interface HeatmapEmocionalProps {
  students: StudentSummary[];
}

export const HeatmapEmocional = memo(function HeatmapEmocional({ students }: HeatmapEmocionalProps) {
  // Generar datos emocionales basados en estudiantes reales
  const heatmapEmocionalData = useMemo(() => {
    if (students.length === 0) return [];
    
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];
    
    return students.flatMap(student => 
      dias.map(dia => ({
        estudiante: student.name.split(",")[0],
        fecha: dia,
        // Simular estado emocional basado en el nivel de riesgo
        // Menor riesgo = mejor estado emocional
        valor: student.risk_score < 30 ? Math.floor(Math.random() * 2) + 4 : // 4-5 (bueno)
               student.risk_score < 50 ? 3 : // 3 (neutral)
               student.risk_score < 70 ? 2 : // 2 (negativo)
               Math.floor(Math.random() * 2) + 1 // 1-2 (muy negativo)
      }))
    );
  }, [students]);
  
  // Obtener días únicos
  const dias = useMemo(() => {
    return Array.from(new Set(heatmapEmocionalData.map((d) => d.fecha))).sort((a, b) => {
      const orden = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      return orden.indexOf(a) - orden.indexOf(b);
    });
  }, [heatmapEmocionalData]);

  // Obtener estudiantes únicos
  const estudiantes = useMemo(() => {
    return Array.from(new Set(heatmapEmocionalData.map((d) => d.estudiante)));
  }, [heatmapEmocionalData]);

  // Función para obtener color según el valor emocional
  const getColor = (valor: number): string => {
    // 1 = muy negativo (rojo), 5 = muy positivo (verde)
    if (valor === 5) return "bg-green-600";
    if (valor === 4) return "bg-green-400";
    if (valor === 3) return "bg-yellow-400";
    if (valor === 2) return "bg-orange-400";
    return "bg-red-500";
  };

  // Función para obtener emoji según el valor
  const getEmoji = (valor: number): string => {
    if (valor === 5) return "😊";
    if (valor === 4) return "🙂";
    if (valor === 3) return "😐";
    if (valor === 2) return "😔";
    return "😢";
  };

  // Función para obtener texto según el valor
  const getTexto = (valor: number): string => {
    if (valor === 5) return "Muy positivo";
    if (valor === 4) return "Positivo";
    if (valor === 3) return "Neutral";
    if (valor === 2) return "Negativo";
    return "Muy negativo";
  };

  // Función para obtener valor de celda
  const getValue = (estudiante: string, fecha: string): number | null => {
    const cell = heatmapEmocionalData.find(
      (d) => d.estudiante === estudiante && d.fecha === fecha
    );
    return cell ? cell.valor : null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap Emocional</CardTitle>
        <CardDescription>
          Estado emocional de estudiantes por día de la semana (1=Muy negativo, 5=Muy positivo)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border bg-muted p-2 text-left text-xs font-medium">
                  Estudiante
                </th>
                {dias.map((dia) => (
                  <th
                    key={dia}
                    className="border border-border bg-muted p-2 text-center text-xs font-medium"
                  >
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => (
                <tr key={estudiante}>
                  <td className="border border-border p-2 text-xs font-medium bg-muted/50">
                    {estudiante}
                  </td>
                  {dias.map((dia) => {
                    const valor = getValue(estudiante, dia);
                    return (
                      <td
                        key={`${estudiante}-${dia}`}
                        className="border border-border p-0"
                      >
                        {valor !== null && (
                          <div
                            className={`${getColor(
                              valor
                            )} text-white font-semibold text-2xl h-16 w-full flex flex-col items-center justify-center hover:opacity-80 transition-opacity cursor-help`}
                            title={`${estudiante} - ${dia}: ${getTexto(valor)}`}
                          >
                            <span>{getEmoji(valor)}</span>
                            <span className="text-xs mt-1">{valor}/5</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leyenda */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
          <span className="font-medium">Escala emocional:</span>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              😢
            </div>
            <span>1 - Muy negativo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-orange-400 rounded flex items-center justify-center">
              😔
            </div>
            <span>2 - Negativo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
              😐
            </div>
            <span>3 - Neutral</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-green-400 rounded flex items-center justify-center">
              🙂
            </div>
            <span>4 - Positivo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
              😊
            </div>
            <span>5 - Muy positivo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
