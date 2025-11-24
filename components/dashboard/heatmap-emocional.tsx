"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, memo } from "react";
import type { Estudiante, EmotionType } from "@/types";

interface HeatmapEmocionalProps {
  students: Estudiante[];
}

export const HeatmapEmocional = memo(function HeatmapEmocional({ students }: HeatmapEmocionalProps) {
  // Generar datos emocionales basados en el timeline real de emociones
  const heatmapEmocionalData = useMemo(() => {
    if (students.length === 0) return [];

    const data: Array<{
      estudiante: string;
      dia: string;
      emocion: EmotionType | null;
      valor: number;
    }> = [];

    const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    students.forEach(student => {
      // Agrupar emociones por día de la semana
      const emocionesPorDia = new Map<number, EmotionType[]>();

      student.emotional_data.timeline.forEach(evento => {
        const fecha = new Date(evento.timestamp);
        const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ...

        if (!emocionesPorDia.has(diaSemana)) {
          emocionesPorDia.set(diaSemana, []);
        }
        emocionesPorDia.get(diaSemana)!.push(evento.emotion);
      });

      // Crear datos para cada día
      diasSemana.forEach((dia, idx) => {
        // Ajustar índice (nuestro array empieza en Lun, Date.getDay() empieza en Dom)
        const diaIdx = idx === 6 ? 0 : idx + 1; // Lun=1, Mar=2, ..., Dom=0
        const emociones = emocionesPorDia.get(diaIdx) || [];

        if (emociones.length > 0) {
          // Calcular emoción predominante
          const emocionMasReciente = emociones[emociones.length - 1];
          const valor = getEmotionValue(emocionMasReciente);

          data.push({
            estudiante: student.name, // Nombre completo
            dia,
            emocion: emocionMasReciente,
            valor
          });
        } else {
          // Si no hay datos para ese día, usar emoción neutral
          data.push({
            estudiante: student.name, // Nombre completo
            dia,
            emocion: null,
            valor: 3
          });
        }
      });
    });

    return data;
  }, [students]);

  // Convertir emoción a valor numérico (1-5)
  function getEmotionValue(emotion: EmotionType): number {
    const emotionValues: Record<EmotionType, number> = {
      "happy": 5,
      "neutral": 3,
      "stressed": 2,
      "sad": 1,
      "anxious": 2,
      "angry": 1
    };
    return emotionValues[emotion] || 3;
  }

  // Obtener días únicos
  const dias = useMemo(() => {
    return Array.from(new Set(heatmapEmocionalData.map((d) => d.dia))).sort((a, b) => {
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

  // Función para obtener emoji según la emoción real
  const getEmoji = (emocion: EmotionType | null): string => {
    if (!emocion) return "😐";
    const emojis: Record<EmotionType, string> = {
      happy: "😊",
      neutral: "😐",
      sad: "😢",
      stressed: "😰",
      anxious: "😟",
      angry: "😤"
    };
    return emojis[emocion] || "😐";
  };

  // Función para obtener texto según la emoción
  const getTexto = (emocion: EmotionType | null): string => {
    if (!emocion) return "Sin datos";
    const textos: Record<EmotionType, string> = {
      happy: "Feliz",
      neutral: "Neutral",
      sad: "Triste",
      stressed: "Estresado",
      anxious: "Ansioso",
      angry: "Enojado"
    };
    return textos[emocion] || "Neutral";
  };

  // Función para obtener valor de celda
  const getDataCell = (estudiante: string, dia: string) => {
    const cell = heatmapEmocionalData.find(
      (d) => d.estudiante === estudiante && d.dia === dia
    );
    return cell || null;
  };

  if (heatmapEmocionalData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Heatmap Emocional</CardTitle>
          <CardDescription>
            No hay datos emocionales disponibles para los filtros seleccionados
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap Emocional</CardTitle>
        <CardDescription>
          Estado emocional real de estudiantes por día de la semana (datos de timeline emocional)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border bg-muted p-2 text-left text-xs font-medium sticky left-0 z-10">
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
                  <td className="border border-border p-2 text-xs font-medium bg-muted/50 sticky left-0 z-10">
                    {estudiante}
                  </td>
                  {dias.map((dia) => {
                    const cellData = getDataCell(estudiante, dia);
                    const valor = cellData?.valor || 3;
                    const emocion = cellData?.emocion || null;

                    return (
                      <td
                        key={`${estudiante}-${dia}`}
                        className="border border-border p-0"
                      >
                        <div
                          className={`${getColor(
                            valor
                          )} text-white font-semibold text-2xl h-16 w-full flex flex-col items-center justify-center hover:opacity-80 transition-opacity cursor-help`}
                          title={`${estudiante} - ${dia}: ${getTexto(emocion)}`}
                        >
                          <span>{getEmoji(emocion)}</span>
                          {emocion && <span className="text-xs mt-1">{valor}/5</span>}
                        </div>
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
          <span className="font-medium">Emociones detectadas:</span>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              😢
            </div>
            <span>Triste/Enojado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-orange-400 rounded flex items-center justify-center">
              😰
            </div>
            <span>Estresado/Ansioso</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
              😐
            </div>
            <span>Neutral</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
              😊
            </div>
            <span>Feliz</span>
          </div>
          <div className="ml-4 text-muted-foreground">
            Datos reales desde extensión Chrome y auto-reporte
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
