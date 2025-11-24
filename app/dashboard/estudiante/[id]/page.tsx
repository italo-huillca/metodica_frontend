import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { classroomService, estudianteService, riskService } from "@/lib/api/services";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Calendar,
  BookOpen,
  Heart,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { EmotionalTimelineLive } from "@/components/dashboard/emotional-timeline-live";
import { TourButton } from "@/components/ui/tour-button";

interface PageProps {
  params: {
    id: string;
  };
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Hace menos de 1 hora";
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
}

function getEmocionEmoji(emotion: string): string {
  const emojis: Record<string, string> = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
    stressed: "😰",
    anxious: "😟",
    angry: "😤",
  };
  return emojis[emotion] || "😐";
}

function getEmocionLabel(emotion: string): string {
  const labels: Record<string, string> = {
    happy: "Feliz",
    neutral: "Neutral",
    sad: "Triste",
    stressed: "Estresado",
    anxious: "Ansioso",
    angry: "Molesto",
  };
  return labels[emotion] || emotion;
}

export default async function EstudiantePage({ params }: PageProps) {
  try {
    // Obtener datos del estudiante desde el backend
    const estudiante = await classroomService.getStudent(params.id);
    const riskData = await riskService.getStudentRisk(params.id);
    const alertsData = await riskService.getStudentAlerts(params.id);

    if (!estudiante) {
      notFound();
    }

    // Calcular promedio de cursos SEVA
    const promedios = estudiante.seva_data.cursos.map(c => c.promedio);
    const promedioGeneral = promedios.length > 0
      ? promedios.reduce((a, b) => a + b, 0) / promedios.length
      : 0;

    // Calcular asistencia promedio
    const asistencias = estudiante.seva_data.cursos.map(c => c.asistencias.porcentaje_asistencia);
    const asistenciaPromedio = asistencias.length > 0
      ? asistencias.reduce((a, b) => a + b, 0) / asistencias.length
      : 0;

    // Última emoción
    const ultimaEmocion = estudiante.emotional_data.timeline.length > 0
      ? estudiante.emotional_data.timeline[estudiante.emotional_data.timeline.length - 1]
      : null;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/dashboard/estudiantes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a estudiantes
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between" data-tour="student-header">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {estudiante.name}
            </h1>
            <p className="text-muted-foreground">
              {estudiante.sis_id} • {estudiante.especialidad}
            </p>
          </div>
          <div
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium",
              estudiante.risk_profile.color === "red"
                ? "bg-red-100 text-red-800"
                : estudiante.risk_profile.color === "yellow"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            )}
          >
            {estudiante.risk_profile.level.replace(/_/g, " ").toUpperCase()}: {estudiante.risk_profile.score}
          </div>
        </div>

        {/* Risk Overview */}
        <Card data-tour="risk-overview">
          <CardHeader>
            <CardTitle>Resumen de Riesgo</CardTitle>
            <CardDescription>
              Análisis del nivel de riesgo de deserción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Score de Riesgo</span>
                  <span className="font-bold">{estudiante.risk_profile.score}</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      estudiante.risk_profile.color === "red"
                        ? "bg-red-500"
                        : estudiante.risk_profile.color === "yellow"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    )}
                    style={{ width: `${estudiante.risk_profile.score}%` }}
                  />
                </div>
              </div>

              {/* Risk Factors Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Académico</p>
                  <p className="text-2xl font-bold">{estudiante.risk_profile.factors.academic.score}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Emocional</p>
                  <p className="text-2xl font-bold">{estudiante.risk_profile.factors.emotional.score}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Asistencia</p>
                  <p className="text-2xl font-bold">{estudiante.risk_profile.factors.attendance.score}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Participación</p>
                  <p className="text-2xl font-bold">{estudiante.risk_profile.factors.engagement.score}</p>
                </div>
              </div>

              {/* Risk Alerts */}
              {alertsData.alerts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Alertas Activas
                  </h4>
                  <ul className="space-y-2">
                    {alertsData.alerts.slice(0, 5).map((alert, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm p-2 bg-accent/50 rounded">
                        <XCircle className={cn(
                          "h-4 w-4 mt-0.5 flex-shrink-0",
                          alert.severity === "high" ? "text-red-500" : "text-yellow-500"
                        )} />
                        <span>{alert.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Académico</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {promedioGeneral.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {promedioGeneral >= 13 ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Por encima del mínimo
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    Por debajo del mínimo
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{asistenciaPromedio.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {estudiante.seva_data.cursos.reduce((sum, c) => sum + c.asistencias.faltas, 0)} faltas totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado Emocional</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ultimaEmocion ? getEmocionEmoji(ultimaEmocion.emotion) : "😐"}
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {ultimaEmocion ? getEmocionLabel(ultimaEmocion.emotion) : "Sin registros"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Timeline Emocional - Auto-actualización cada 10s */}
          <div data-tour="emotional-timeline">
            <EmotionalTimelineLive
              studentId={params.id}
              initialData={estudiante}
            />
          </div>

          {/* Recomendaciones */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Acciones Recomendadas</CardTitle>
              <CardDescription>
                Sugerencias basadas en el análisis de riesgo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertsData.alerts.length > 0 ? (
                  alertsData.alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-4 rounded-lg border-l-4",
                        alert.severity === "high"
                          ? "bg-red-50 border-red-500"
                          : alert.severity === "medium"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-blue-50 border-blue-500"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium mb-1 capitalize">
                            {alert.type.replace(/_/g, " ")}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.message}
                          </p>
                          {alert.action && (
                            <p className="text-sm font-medium text-blue-600">
                              ✓ {alert.action}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-xs font-medium",
                                alert.severity === "high"
                                  ? "bg-red-100 text-red-800"
                                  : alert.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              )}
                            >
                              {alert.severity === "high" ? "Alta" : alert.severity === "medium" ? "Media" : "Baja"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay recomendaciones en este momento
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Details - Cursos SEVA */}
        <Card data-tour="academic-details">
          <CardHeader>
            <CardTitle>Detalle por Curso</CardTitle>
            <CardDescription>
              Rendimiento y asistencia en cada curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {estudiante.seva_data.cursos.length > 0 ? (
              <div className="space-y-4">
                {estudiante.seva_data.cursos.map((curso, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{curso.nombre}</h4>
                        <p className="text-sm text-muted-foreground">
                          {curso.codigo_curso} • {curso.ciclo} • Sección {curso.seccion}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-2xl font-bold",
                            curso.promedio >= 13 ? "text-green-600" : "text-red-600"
                          )}
                        >
                          {curso.promedio.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">Promedio</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Asistencia</p>
                        <p className={cn(
                          "text-lg font-semibold",
                          curso.asistencias.porcentaje_asistencia >= 80 ? "text-green-600" : "text-red-600"
                        )}>
                          {curso.asistencias.porcentaje_asistencia.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {curso.asistencias.faltas} faltas • {curso.asistencias.tardanzas} tardanzas
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Evaluaciones</p>
                        <p className="text-lg font-semibold">
                          {curso.evaluaciones.pruebas_aula.length + curso.evaluaciones.pruebas_laboratorio.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {curso.nro_veces > 1 ? `Repetido ${curso.nro_veces} veces` : "Primera vez"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay cursos registrados
              </p>
            )}
          </CardContent>
        </Card>

        <TourButton page="student-profile" />
      </div>
    );
  } catch (error) {
    console.error("Error loading student data:", error);
    notFound();
  }
}
