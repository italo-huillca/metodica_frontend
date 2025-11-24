"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, memo } from "react";
import type { Estudiante } from "@/types";

interface HeatmapAcademicoProps {
  students: Estudiante[];
  selectedCourse?: string;
}

export const HeatmapAcademico = memo(function HeatmapAcademico({ students, selectedCourse = "todos" }: HeatmapAcademicoProps) {
  // Generar datos de heatmap basados en evaluaciones reales de SEVA
  const data = useMemo(() => {
    if (students.length === 0) return [];

    const heatmapData: Array<{
      estudiante: string;
      curso: string;
      evaluacion: string;
      valor: number;
      tipo: string;
    }> = [];

    students.forEach(student => {
      // Verificar si el estudiante tiene cursos SEVA
      if (!student.seva_data?.cursos || student.seva_data.cursos.length === 0) {
        return; // Saltar estudiantes sin cursos SEVA (Canvas Users)
      }

      const cursos = selectedCourse === "todos"
        ? student.seva_data.cursos
        : student.seva_data.cursos.filter(c => c.nombre === selectedCourse);

      cursos.forEach(curso => {
        // Agregar promedio del curso
        heatmapData.push({
          estudiante: student.name, // Nombre completo
          curso: curso.nombre,
          evaluacion: "Promedio",
          valor: curso.promedio,
          tipo: "promedio"
        });

        // Agregar pruebas de aula
        curso.evaluaciones.pruebas_aula.forEach((prueba, idx) => {
          heatmapData.push({
            estudiante: student.name, // Nombre completo
            curso: curso.nombre,
            evaluacion: `PA${idx + 1}`,
            valor: prueba.nota,
            tipo: "prueba_aula"
          });
        });

        // Agregar pruebas de laboratorio
        curso.evaluaciones.pruebas_laboratorio.forEach((prueba, idx) => {
          heatmapData.push({
            estudiante: student.name, // Nombre completo
            curso: curso.nombre,
            evaluacion: `PL${idx + 1}`,
            valor: prueba.nota,
            tipo: "prueba_lab"
          });
        });

        // Agregar exámenes
        curso.evaluaciones.examenes.forEach((examen, idx) => {
          heatmapData.push({
            estudiante: student.name, // Nombre completo
            curso: curso.nombre,
            evaluacion: `EX${idx + 1}`,
            valor: examen.nota,
            tipo: "examen"
          });
        });
      });
    });

    return heatmapData;
  }, [students, selectedCourse]);

  // Obtener cursos únicos
  const cursos = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.curso))).sort();
  }, [data]);

  // Obtener estudiantes únicos
  const estudiantes = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.estudiante)));
  }, [data]);

  // Obtener evaluaciones únicas por curso
  const getEvaluaciones = (curso: string) => {
    const evals = data
      .filter(d => d.curso === curso)
      .map(d => d.evaluacion);
    return Array.from(new Set(evals));
  };

  // Función para obtener color según la nota
  const getColor = (valor: number): string => {
    if (valor >= 16) return "bg-green-600";
    if (valor >= 14) return "bg-green-400";
    if (valor >= 13) return "bg-yellow-400";
    if (valor >= 11) return "bg-orange-400";
    return "bg-red-500";
  };

  // Función para obtener valor de celda
  const getValue = (estudiante: string, curso: string, evaluacion: string): number | null => {
    const cell = data.find(
      (d) => d.estudiante === estudiante && d.curso === curso && d.evaluacion === evaluacion
    );
    return cell ? cell.valor : null;
  };

  const estudiantesSinDatos = students.filter(s => !s.seva_data?.cursos || s.seva_data.cursos.length === 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Heatmap Académico</CardTitle>
          <CardDescription>
            No hay datos de evaluaciones SEVA disponibles para los filtros seleccionados
          </CardDescription>
        </CardHeader>
        {estudiantesSinDatos.length > 0 && (
          <CardContent>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-900 mb-2">
                ⚠️ Estudiantes sin datos académicos SEVA:
              </p>
              <ul className="text-sm text-yellow-800 list-disc list-inside">
                {estudiantesSinDatos.map(s => (
                  <li key={s.student_id}>
                    {s.name} ({s.sis_id || s.student_id}) - Usuario de Canvas sin datos SEVA
                  </li>
                ))}
              </ul>
              <p className="text-xs text-yellow-700 mt-2">
                Estos estudiantes aparecen en el Heatmap Emocional pero no tienen calificaciones en SEVA.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap Académico</CardTitle>
        <CardDescription>
          Notas reales por estudiante y evaluación (PA: Prueba Aula, PL: Prueba Lab, EX: Examen)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {cursos.map((curso) => {
            const evaluaciones = getEvaluaciones(curso);
            return (
              <div key={curso} className="mb-6">
                <h4 className="font-semibold mb-2 text-sm">{curso}</h4>
                <div className="inline-block min-w-full">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-border bg-muted p-2 text-left text-xs font-medium sticky left-0 z-10">
                          Estudiante
                        </th>
                        {evaluaciones.map((evaluacion) => (
                          <th
                            key={evaluacion}
                            className="border border-border bg-muted p-2 text-center text-xs font-medium"
                          >
                            {evaluacion}
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
                          {evaluaciones.map((evaluacion) => {
                            const valor = getValue(estudiante, curso, evaluacion);
                            return (
                              <td
                                key={`${estudiante}-${evaluacion}`}
                                className="border border-border p-0"
                              >
                                {valor !== null && (
                                  <div
                                    className={`${getColor(
                                      valor
                                    )} text-white font-semibold text-xs h-12 w-full flex items-center justify-center hover:opacity-80 transition-opacity`}
                                    title={`${estudiante} - ${curso} - ${evaluacion}: ${valor.toFixed(2)}`}
                                  >
                                    {valor.toFixed(1)}
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
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
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
          <div className="ml-4 text-muted-foreground">
            Datos reales desde SEVA • PA: Prueba Aula • PL: Prueba Lab • EX: Examen
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
