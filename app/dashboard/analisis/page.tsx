"use client";

import { useState, useEffect } from "react";
import { HeatmapAcademico } from "@/components/dashboard/heatmap-academico";
import { HeatmapEmocional } from "@/components/dashboard/heatmap-emocional";
import { GraficoSupervivencia } from "@/components/dashboard/grafico-supervivencia";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertCircle, Loader2, Filter } from "lucide-react";
import { riskService, classroomService } from "@/lib/api/services";
import type { EstadisticaSalon, StudentSummary, Estudiante, RiskLevel } from "@/types";
import { Button } from "@/components/ui/button";
import { TourButton } from "@/components/ui/tour-button";

// Mapeo de niveles de riesgo del backend (inglés) al frontend (español)
const RISK_LEVEL_MAP: Record<string, RiskLevel> = {
  // Niveles bajos / excelentes
  "excellent": "excelente",
  "low": "excelente",        // Bajo riesgo = Excelente
  "very_low": "excelente",
  "minimal": "excelente",

  // Niveles buenos
  "good": "bueno",
  "low_medium": "bueno",

  // Niveles regulares
  "regular": "regular",
  "normal": "regular",

  // Niveles moderados
  "medium": "riesgo_moderado",
  "moderate": "riesgo_moderado",
  "medium_high": "riesgo_moderado",

  // Niveles altos
  "high": "riesgo_alto",
  "severe": "riesgo_alto",

  // Niveles críticos
  "critical": "riesgo_critico",
  "very_high": "riesgo_critico",
  "extreme": "riesgo_critico",

  // Por si acaso ya vienen en español
  "excelente": "excelente",
  "bueno": "bueno",
  "riesgo_moderado": "riesgo_moderado",
  "riesgo_alto": "riesgo_alto",
  "riesgo_critico": "riesgo_critico",
};

// Normalizar nivel de riesgo basado en score (más confiable)
function normalizeRiskLevelByScore(score: number): RiskLevel {
  if (score >= 81) return "riesgo_critico";      // 81-100
  if (score >= 66) return "riesgo_alto";         // 66-80
  if (score >= 51) return "riesgo_moderado";     // 51-65
  if (score >= 31) return "regular";             // 31-50
  if (score >= 16) return "bueno";               // 16-30
  return "excelente";                            // 0-15
}

export default function AnalisisPage() {
  const [stats, setStats] = useState<EstadisticaSalon | null>(null);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [fullStudents, setFullStudents] = useState<Estudiante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<RiskLevel | "todos">("todos");
  const [selectedCourse, setSelectedCourse] = useState<string>("todos");
  const [showHeatmapAcademico, setShowHeatmapAcademico] = useState(true);
  const [showHeatmapEmocional, setShowHeatmapEmocional] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, studentsData] = await Promise.all([
          riskService.getClassroomSummary(),
          classroomService.getAllStudents(),
        ]);

        console.log("📊 Estudiantes cargados:", studentsData.length);

        setStats(statsData);
        setStudents(studentsData);

        // Cargar datos completos de cada estudiante para los heatmaps
        console.log("📥 Cargando datos completos de estudiantes...");
        const fullStudentsData = await Promise.all(
          studentsData.map(async (s) => {
            try {
              return await classroomService.getStudent(s.student_id);
            } catch (error) {
              console.error(`Error cargando estudiante ${s.name}:`, error);
              return null;
            }
          })
        );

        // Filtrar nulls y verificar
        const validFullStudents = fullStudentsData.filter(s => s !== null) as Estudiante[];
        console.log("✅ Datos completos cargados:", validFullStudents.length);

        // Log de todos los niveles de riesgo únicos encontrados
        const uniqueRiskLevels = Array.from(new Set(validFullStudents.map(s => s.risk_profile.level)));
        console.log("📋 Niveles de riesgo únicos del backend:", uniqueRiskLevels);

        // Mostrar distribución por nivel
        const distribution: Record<string, number> = {};
        validFullStudents.forEach(s => {
          const level = s.risk_profile.level;
          distribution[level] = (distribution[level] || 0) + 1;
        });
        console.log("📊 Distribución de niveles:", distribution);

        setFullStudents(validFullStudents);
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
  const porcentajeRiesgo = Math.round((estudiantesEnRiesgo / totalEstudiantes) * 100);

  // Calcular estado emocional general (basado en riesgo emocional)
  const estudiantesPositivos = stats.risk_distribution.excelente + stats.risk_distribution.bueno;
  const porcentajePositivo = Math.round((estudiantesPositivos / totalEstudiantes) * 100);

  // Identificar estudiantes para reconocimiento (bajo riesgo)
  const estudiantesExcelentes = students
    .filter(s => s.risk_level === "excelente" || s.risk_level === "bueno")
    .slice(0, 2);

  // Obtener cursos únicos de todos los estudiantes (manejar estudiantes sin cursos)
  const cursosUnicos = Array.from(
    new Set(
      fullStudents.flatMap(s => {
        // Verificar si tiene cursos SEVA antes de mapear
        if (s.seva_data?.cursos && s.seva_data.cursos.length > 0) {
          return s.seva_data.cursos.map(c => c.nombre);
        }
        return [];
      })
    )
  ).sort();

  // Calcular distribución real basada en risk_score
  const realDistribution = {
    excelente: students.filter(s => s.risk_score < 16).length,
    bueno: students.filter(s => s.risk_score >= 16 && s.risk_score < 31).length,
    regular: students.filter(s => s.risk_score >= 31 && s.risk_score < 51).length,
    riesgo_moderado: students.filter(s => s.risk_score >= 51 && s.risk_score < 66).length,
    riesgo_alto: students.filter(s => s.risk_score >= 66 && s.risk_score < 81).length,
    riesgo_critico: students.filter(s => s.risk_score >= 81).length,
  };

  console.log("📊 Distribución real calculada:", realDistribution);

  // Filtrar estudiantes según selección (incluir estudiantes sin cursos SEVA)
  const filteredFullStudents = fullStudents.filter(student => {
    // Normalizar el nivel de riesgo del estudiante basado en score
    const normalizedRiskLevel = normalizeRiskLevelByScore(student.risk_profile.score);
    const matchesRisk = selectedRiskLevel === "todos" || normalizedRiskLevel === selectedRiskLevel;

    // Si el curso es "todos", incluir todos los estudiantes
    // Si el estudiante no tiene cursos SEVA, solo incluirlo si el curso es "todos"
    const hasCourses = student.seva_data?.cursos && student.seva_data.cursos.length > 0;
    const matchesCourse = selectedCourse === "todos" ||
      (hasCourses && student.seva_data.cursos.some(c => c.nombre === selectedCourse));

    // Para estudiantes sin cursos (Canvas Users), solo filtrar por riesgo
    if (!hasCourses) {
      return matchesRisk && selectedCourse === "todos";
    }

    return matchesRisk && matchesCourse;
  });

  const filteredStudents = students.filter(student => {
    const normalizedLevel = normalizeRiskLevelByScore(student.risk_score);
    return selectedRiskLevel === "todos" || normalizedLevel === selectedRiskLevel;
  });

  // Debug del filtrado
  console.log("🎯 Filtros aplicados:", {
    selectedRiskLevel,
    selectedCourse,
    totalFullStudents: fullStudents.length,
    filteredFullStudents: filteredFullStudents.length,
    totalStudents: students.length,
    filteredStudents: filteredStudents.length,

  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análisis</h1>
        <p className="text-muted-foreground">
          Visualizaciones avanzadas y análisis predictivo del salón
        </p>
      </div>

      {/* Filtros */}
      <Card data-tour="analysis-filters">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Visualización
          </CardTitle>
          <CardDescription>
            Personaliza las visualizaciones según nivel de riesgo y curso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Filtro por nivel de riesgo */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Nivel de Riesgo</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedRiskLevel === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("todos")}
                >
                  Todos ({students.length})
                </Button>
                <Button
                  variant={selectedRiskLevel === "riesgo_critico" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("riesgo_critico")}
                >
                  Crítico ({realDistribution.riesgo_critico})
                </Button>
                <Button
                  variant={selectedRiskLevel === "riesgo_alto" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("riesgo_alto")}
                >
                  Alto ({realDistribution.riesgo_alto})
                </Button>
                <Button
                  variant={selectedRiskLevel === "riesgo_moderado" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("riesgo_moderado")}
                >
                  Moderado ({realDistribution.riesgo_moderado})
                </Button>
                <Button
                  variant={selectedRiskLevel === "regular" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("regular")}
                >
                  Regular ({realDistribution.regular})
                </Button>
                <Button
                  variant={selectedRiskLevel === "bueno" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("bueno")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Bueno ({realDistribution.bueno})
                </Button>
                <Button
                  variant={selectedRiskLevel === "excelente" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRiskLevel("excelente")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Excelente ({realDistribution.excelente})
                </Button>
              </div>
            </div>

            {/* Filtro por curso */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Curso</label>
              <select
                className="w-full p-2 border border-border rounded-md text-sm"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="todos">Todos los cursos</option>
                {cursosUnicos.map(curso => (
                  <option key={curso} value={curso}>{curso}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contador de estudiantes filtrados */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredFullStudents.length} de {fullStudents.length} estudiantes
              </p>

              {/* Controles de visualización */}
              <div className="flex gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showHeatmapAcademico}
                    onChange={(e) => setShowHeatmapAcademico(e.target.checked)}
                    className="rounded"
                  />
                  <span>Heatmap Académico</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showHeatmapEmocional}
                    onChange={(e) => setShowHeatmapEmocional(e.target.checked)}
                    className="rounded"
                  />
                  <span>Heatmap Emocional</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
      <div data-tour="survival-graph">
        <GraficoSupervivencia students={filteredStudents} />
      </div>

      {/* Heatmap Académico */}
      {showHeatmapAcademico && (
        <div data-tour="heatmap-academic">
          <HeatmapAcademico students={filteredFullStudents} selectedCourse={selectedCourse} />
        </div>
      )}

      {/* Heatmap Emocional */}
      {showHeatmapEmocional && (
        <div data-tour="heatmap-emotional">
          <HeatmapEmocional students={filteredFullStudents} />
        </div>
      )}

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

      <TourButton page="analisis" />
    </div>
  );
}
