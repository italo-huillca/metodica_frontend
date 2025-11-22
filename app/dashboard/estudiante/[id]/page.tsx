import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getEstudianteById,
  getRiesgoByEstudianteId,
  getTimelineByEstudianteId,
  getRecomendacionesByEstudianteId,
  notasMock,
  asistenciaEstadisticasMock,
  eventosEmocionalesMock,
} from "@/lib/mock/data";
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

function getEmocionEmoji(emocion: string): string {
  const emojis: Record<string, string> = {
    feliz: "😊",
    neutral: "😐",
    triste: "😢",
    estresado: "😰",
    frustrado: "😤",
    motivado: "💪",
    desmotivado: "😔",
  };
  return emojis[emocion] || "😐";
}

export default function EstudiantePage({ params }: PageProps) {
  const estudiante = getEstudianteById(params.id);
  const riesgo = getRiesgoByEstudianteId(params.id);
  const timeline = getTimelineByEstudianteId(params.id);
  const recomendaciones = getRecomendacionesByEstudianteId(params.id);
  const notas = notasMock.filter((n) => n.estudiante_id === params.id);
  const asistencia = asistenciaEstadisticasMock;
  const emociones = eventosEmocionalesMock.filter((e) => e.estudiante_id === params.id);

  if (!estudiante || !riesgo) {
    notFound();
  }

  const promedioNotas = notas.length > 0
    ? notas.reduce((sum, n) => sum + n.nota, 0) / notas.length
    : 0;

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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {estudiante.nombre} {estudiante.apellido}
          </h1>
          <p className="text-muted-foreground">
            {estudiante.codigo} • Ciclo {estudiante.ciclo} • {estudiante.carrera}
          </p>
        </div>
        <div
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium",
            riesgo.nivel === "alto"
              ? "bg-red-100 text-red-800"
              : riesgo.nivel === "medio"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          )}
        >
          Riesgo {riesgo.nivel.toUpperCase()}: {riesgo.score}%
        </div>
      </div>

      {/* Risk Overview */}
      <Card>
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
                <span className="font-bold">{riesgo.score}%</span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    riesgo.nivel === "alto"
                      ? "bg-red-500"
                      : riesgo.nivel === "medio"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  )}
                  style={{ width: `${riesgo.score}%` }}
                />
              </div>
            </div>

            {/* Risk Factors */}
            {riesgo.factores.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Factores de Riesgo Identificados
                </h4>
                <ul className="space-y-2">
                  {riesgo.factores.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{factor}</span>
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
              {promedioNotas.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              {promedioNotas >= 13 ? (
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
            <CardTitle className="text-sm font-medium">Asistencia</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{asistencia.porcentaje}%</div>
            <p className="text-xs text-muted-foreground">
              {asistencia.ausentes} faltas, {asistencia.tardanzas} tardanzas
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
              {emociones.length > 0 ? getEmocionEmoji(emociones[0].emocion) : "😐"}
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              {emociones.length > 0 ? emociones[0].emocion : "Sin registros"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Timeline */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Timeline de Eventos</CardTitle>
            <CardDescription>
              Historial de eventos importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeline.length > 0 ? (
                timeline.slice(0, 5).map((evento) => (
                  <div key={evento.id} className="flex gap-3">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                        evento.color === "red" && "bg-red-500",
                        evento.color === "yellow" && "bg-yellow-500",
                        evento.color === "blue" && "bg-blue-500",
                        evento.color === "orange" && "bg-orange-500",
                        evento.color === "green" && "bg-green-500"
                      )}
                    />
                    <div className="flex-1 space-y-1 pb-4 border-l-2 border-border pl-4 -ml-1">
                      <p className="text-sm font-medium">{evento.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        {evento.descripcion}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(evento.fecha)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay eventos registrados
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recomendaciones para el Tutor</CardTitle>
            <CardDescription>
              Acciones sugeridas para apoyar al estudiante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recomendaciones.length > 0 ? (
                recomendaciones.map((rec) => (
                  <div
                    key={rec.id}
                    className={cn(
                      "p-4 rounded-lg border-l-4",
                      rec.prioridad === "alta"
                        ? "bg-red-50 border-red-500"
                        : rec.prioridad === "media"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-blue-50 border-blue-500"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1">{rec.titulo}</h4>
                        <p className="text-sm text-muted-foreground">
                          {rec.descripcion}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              rec.prioridad === "alta"
                                ? "bg-red-100 text-red-800"
                                : rec.prioridad === "media"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            )}
                          >
                            Prioridad {rec.prioridad}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {rec.categoria}
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

      {/* Academic Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle Académico</CardTitle>
          <CardDescription>
            Notas y evaluaciones recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notas.length > 0 ? (
            <div className="space-y-3">
              {notas.map((nota) => (
                <div
                  key={nota.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
                >
                  <div className="flex-1">
                    <p className="font-medium">{nota.curso}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {nota.tipo} • {new Date(nota.fecha).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-2xl font-bold",
                        nota.nota >= 13 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {nota.nota}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Peso: {(nota.peso * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay notas registradas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
