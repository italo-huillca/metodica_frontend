"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, memo } from "react";
import type { StudentSummary } from "@/types";

interface HeatmapAcademicoProps {
  students: StudentSummary[];
}

export const HeatmapAcademico = memo(function HeatmapAcademico({ students }: HeatmapAcademicoProps) {
  // Generar datos de heatmap basados en estudiantes reales
  const data = useMemo(() => {
    if (students.length === 0) return [];
    
    // Generar 4 semanas de datos simulados basados en el promedio de cada estudiante
    const semanas = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
    const cursos = ["Matemáticas", "Programación", "Base de Datos"];
    
    return students.flatMap(student => 
      semanas.flatMap(semana => 
        cursos.map(curso => {
          // Simular variación basada en el promedio real del estudiante
          const valor = student.promedio_acumulado + (Math.random() - 0.5) * 4;
          return {
            estudiante: student.name.split(",")[0], // Primer apellido
            semana,
            curso,
            valor: Math.round(Math.max(0, Math.min(20, valor)) * 100) / 100 // Redondear a 2 decimales
          };
        })
      )
    );
  }, [students]);

  // Obtener semanas únicas
  const semanas = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.semana))).sort();
  }, [data]);

  // Obtener estudiantes únicos
  const estudiantes = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.estudiante)));
  }, [data]);

  // Obtener cursos únicos
  const cursos = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.curso)));
  }, [data]);

  // Función para obtener color según la nota
  const getColor = (valor: number): string => {
    if (valor >= 16) return "bg-green-600";
    if (valor >= 14) return "bg-green-400";
    if (valor >= 13) return "bg-yellow-400";
    if (valor >= 11) return "bg-orange-400";
    return "bg-red-500";
  };

  // Función para obtener valor de celda
  const getValue = (estudiante: string, semana: string, curso: string): number | null => {
    const cell = data.find(
      (d) => d.estudiante === estudiante && d.semana === semana && d.curso === curso
    );
    return cell ? cell.valor : null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap Académico</CardTitle>
        <CardDescription>
          Notas por estudiante, semana y curso (Rojo: &lt;11, Naranja: 11-12, Amarillo: 13, Verde: 14+)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {cursos.map((curso) => (
            <div key={curso} className="mb-6">
              <h4 className="font-semibold mb-2 text-sm">{curso}</h4>
              <div className="inline-block min-w-full">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-border bg-muted p-2 text-left text-xs font-medium">
                        Estudiante
                      </th>
                      {semanas.map((semana) => (
                        <th
                          key={semana}
                          className="border border-border bg-muted p-2 text-center text-xs font-medium"
                        >
                          {semana}
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
                        {semanas.map((semana) => {
                          const valor = getValue(estudiante, semana, curso);
                          return (
                            <td
                              key={`${estudiante}-${semana}`}
                              className="border border-border p-0"
                            >
                              {valor !== null && (
                                <div
                                  className={`${getColor(
                                    valor
                                  )} text-white font-semibold text-xs h-12 w-full flex items-center justify-center hover:opacity-80 transition-opacity`}
                                  title={`${estudiante} - ${semana} - ${curso}: ${valor}`}
                                >
                                  {valor}
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
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="mt-4 flex items-center gap-4 text-xs">
          <span className="font-medium">Escala:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>&lt; 11</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span>11-12</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>13</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span>14-15</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>16+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
