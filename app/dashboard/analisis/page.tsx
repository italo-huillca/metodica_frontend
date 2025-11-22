import { HeatmapAcademico } from "@/components/dashboard/heatmap-academico";
import { HeatmapEmocional } from "@/components/dashboard/heatmap-emocional";
import { GraficoSupervivencia } from "@/components/dashboard/grafico-supervivencia";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertCircle } from "lucide-react";

export default function AnalisisPage() {
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
            <div className="text-2xl font-bold">Descendente</div>
            <p className="text-xs text-muted-foreground">
              3 estudiantes con notas en descenso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estado Emocional General
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Positivo</div>
            <p className="text-xs text-muted-foreground">
              65% del salón en estado positivo/neutral
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Predicción de Riesgo
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Moderado</div>
            <p className="text-xs text-muted-foreground">
              Intervención temprana recomendada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Supervivencia */}
      <GraficoSupervivencia />

      {/* Heatmap Académico */}
      <HeatmapAcademico />

      {/* Heatmap Emocional */}
      <HeatmapEmocional />

      {/* Recomendaciones basadas en análisis */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones del Sistema</CardTitle>
          <CardDescription>
            Acciones sugeridas basadas en el análisis de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <h4 className="font-semibold text-sm text-red-900 mb-1">
                Alta Prioridad: Juan Pérez
              </h4>
              <p className="text-sm text-red-800">
                Curva de supervivencia crítica. Se recomienda intervención inmediata del tutor.
                Coordinar sesión de reforzamiento en Matemáticas y Física esta semana.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <h4 className="font-semibold text-sm text-yellow-900 mb-1">
                Media Prioridad: María García
              </h4>
              <p className="text-sm text-yellow-800">
                Tendencia descendente en notas. Programar sesión de tutoría para identificar
                dificultades específicas y brindar apoyo emocional.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-semibold text-sm text-blue-900 mb-1">
                Seguimiento: Carlos Rodríguez
              </h4>
              <p className="text-sm text-blue-800">
                Mantener seguimiento regular. Estado emocional positivo y notas estables.
                Reforzar aspectos positivos para mantener motivación.
              </p>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <h4 className="font-semibold text-sm text-green-900 mb-1">
                Reconocimiento: Luis Torres y Ana Martínez
              </h4>
              <p className="text-sm text-green-800">
                Excelente desempeño académico y emocional. Considerar como mentores para
                estudiantes en riesgo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
