"use client";

import { useState, useEffect } from "react";
import { HeatmapAcademico } from "@/components/dashboard/heatmap-academico";
import { HeatmapEmocional } from "@/components/dashboard/heatmap-emocional";
import { GraficoSupervivencia } from "@/components/dashboard/grafico-supervivencia";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { riskService, classroomService } from "@/lib/api/services";
import type { EstadisticaSalon, StudentSummary } from "@/types";

export default function AnalisisPage() {
  const [stats, setStats] = useState<EstadisticaSalon | null>(null);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, studentsData] = await Promise.all([
          riskService.getClassroomSummary(),
          classroomService.getAllStudents(),
        ]);
        setStats(statsData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Error cargando datos de análisis:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No se pudieron cargar los datos</p>
      </div>
    );
  }

  // Calcular tendencias - incluir riesgo_moderado y superiores
  const estudiantesEnRiesgo = stats.risk_distribution.riesgo_moderado + 
                              stats.risk_distribution.riesgo_alto + 
                              stats.risk_distribution.riesgo_critico;
  const estudiantesRiesgoAlto = stats.students_at_high_risk.length + stats.students_critical.length;
  const totalEstudiantes = stats.total_students;
  const porcentajeRiesgo = ((estudiantesEnRiesgo / totalEstudiantes) * 100).toFixed(0);

  // Calcular estado emocional general (basado en riesgo emocional)
  const estudiantesPositivos = stats.risk_distribution.excelente + stats.risk_distribution.bueno;
  const porcentajePositivo = ((estudiantesPositivos / totalEstudiantes) * 100).toFixed(0);

  // Identificar estudiantes para reconocimiento (bajo riesgo)
  const estudiantesExcelentes = students
    .filter(s => s.risk_level === "excelente" || s.risk_level === "bueno")
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análisis</h1>
        <p className="text-muted-foreground">
          Visualizaciones avanzadas y análisis predictivo del salón
        </p>
      </div>

      {/* Resumen de Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tendencia Académica
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {porcentajeRiesgo}% en riesgo
            </div>
            <p className="text-xs text-muted-foreground">
              {estudiantesEnRiesgo} estudiantes requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado General del Salón
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {porcentajePositivo > 65 ? "Positivo" : porcentajePositivo > 45 ? "Regular" : "Crítico"}
            </div>
            <p className="text-xs text-muted-foreground">
              {porcentajePositivo}% del salón en buen estado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Intervención Requerida
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {estudiantesEnRiesgo}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.students_critical.length > 0 ? "Casos críticos detectados" : 
               estudiantesEnRiesgo > 0 ? `${stats.risk_distribution.riesgo_moderado} en riesgo moderado` :
               "Monitoreo continuo"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Supervivencia */}
      <GraficoSupervivencia students={students} />

      {/* Heatmap Académico */}
      <HeatmapAcademico students={students} />

      {/* Heatmap Emocional */}
      <HeatmapEmocional students={students} />

      {/* Recomendaciones basadas en análisis */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones del Sistema</CardTitle>
          <CardDescription>
            Acciones sugeridas basadas en el análisis de datos del backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Casos Críticos */}
            {stats.students_critical.length > 0 && stats.students_critical.slice(0, 2).map((estudiante, idx) => (
              <div key={`critico-${idx}`} className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <h4 className="font-semibold text-sm text-red-900 mb-1">
                  Alta Prioridad: {estudiante.nombre}
                </h4>
                <p className="text-sm text-red-800 mb-2">
                  Score de riesgo: {estudiante.score}. Estado crítico detectado.
                </p>
                {estudiante.top_factors.length > 0 && (
                  <ul className="text-sm text-red-800 list-disc list-inside">
                    {estudiante.top_factors.slice(0, 2).map((factor, fidx) => (
                      <li key={fidx}>{factor.description}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Casos de Alto Riesgo */}
            {stats.students_at_high_risk.length > 0 && stats.students_at_high_risk.slice(0, 2).map((estudiante, idx) => (
              <div key={`alto-${idx}`} className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <h4 className="font-semibold text-sm text-yellow-900 mb-1">
                  Media Prioridad: {estudiante.nombre}
                </h4>
                <p className="text-sm text-yellow-800 mb-2">
                  Score de riesgo: {estudiante.score}. Requiere seguimiento cercano.
                </p>
                {estudiante.top_factors.length > 0 && (
                  <ul className="text-sm text-yellow-800 list-disc list-inside">
                    {estudiante.top_factors.slice(0, 2).map((factor, fidx) => (
                      <li key={fidx}>{factor.description}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Estudiantes Estables */}
            {stats.risk_distribution.regular + stats.risk_distribution.riesgo_moderado > 0 && (
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h4 className="font-semibold text-sm text-blue-900 mb-1">
                  Seguimiento Regular
                </h4>
                <p className="text-sm text-blue-800">
                  {stats.risk_distribution.regular + stats.risk_distribution.riesgo_moderado} estudiantes en estado regular.
                  Mantener monitoreo continuo y apoyo preventivo.
                </p>
              </div>
            )}

            {/* Reconocimiento a Estudiantes Destacados */}
            {estudiantesExcelentes.length > 0 && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <h4 className="font-semibold text-sm text-green-900 mb-1">
                  Reconocimiento: {estudiantesExcelentes.map(e => e.name.split(",")[0]).join(", ")}
                </h4>
                <p className="text-sm text-green-800">
                  Excelente desempeño académico y emocional. Considerar como mentores para
                  estudiantes en riesgo.
                </p>
              </div>
            )}

            {/* Estudiantes en Riesgo Moderado */}
            {stats.risk_distribution.riesgo_moderado > 0 && (
              <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                <h4 className="font-semibold text-sm text-orange-900 mb-1">
                  Riesgo Moderado: {stats.risk_distribution.riesgo_moderado} estudiantes
                </h4>
                <p className="text-sm text-orange-800">
                  Estudiantes en zona de alerta. Se recomienda aumentar el seguimiento y 
                  proporcionar apoyo académico preventivo.
                </p>
              </div>
            )}

            {/* Si no hay estudiantes en riesgo */}
            {estudiantesEnRiesgo === 0 && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <h4 className="font-semibold text-sm text-green-900 mb-1">
                  Estado Óptimo del Salón
                </h4>
                <p className="text-sm text-green-800">
                  No se detectaron estudiantes en riesgo alto. Continuar con el monitoreo preventivo.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
