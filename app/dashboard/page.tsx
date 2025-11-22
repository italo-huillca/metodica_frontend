import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { riskService, classroomService } from "@/lib/api/services";

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

export default async function DashboardPage() {
  // Obtener datos del backend
  const [stats, students] = await Promise.all([
    riskService.getClassroomSummary(),
    classroomService.getAllStudents(),
  ]);

  // Ranking de riesgo (top 5 en riesgo)
  const ranking = [...students]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  // Alertas de estudiantes críticos
  const alertasRecientes = [
    ...stats.students_critical.map((s) => ({
      titulo: `Riesgo crítico: ${s.nombre}`,
      mensaje: s.top_factors[0]?.description || "Requiere intervención inmediata",
      nivel: "error" as const,
      created_at: new Date().toISOString(),
    })),
    ...stats.students_at_high_risk.slice(0, 3).map((s) => ({
      titulo: `Riesgo alto: ${s.nombre}`,
      mensaje: s.top_factors[0]?.description || "Monitoreo requerido",
      nivel: "warning" as const,
      created_at: new Date().toISOString(),
    })),
  ].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vista general del estado del salón y riesgo de deserción
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Estudiantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_students}</div>
            <p className="text-xs text-muted-foreground">
              Ciclo actual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sin Riesgo
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.risk_distribution.excelente + stats.risk_distribution.bueno}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(((stats.risk_distribution.excelente + stats.risk_distribution.bueno) / stats.total_students) * 100)}% del salón
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Riesgo Moderado
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.risk_distribution.regular + stats.risk_distribution.riesgo_moderado}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(((stats.risk_distribution.regular + stats.risk_distribution.riesgo_moderado) / stats.total_students) * 100)}% del salón
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Riesgo Alto/Crítico
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.risk_distribution.riesgo_alto + stats.risk_distribution.riesgo_critico}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.intervention_required} requieren intervención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ranking de Riesgo</CardTitle>
            <CardDescription>
              Estudiantes ordenados por nivel de riesgo de deserción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ranking.map((item) => {
                const isHigh = item.risk_level.includes("critico") || item.risk_level.includes("riesgo_alto");
                const isMedium = item.risk_level.includes("moderado") || item.risk_level === "regular";
                
                const colorClass = isHigh ? "bg-red-500" : isMedium ? "bg-yellow-500" : "bg-green-500";
                const badgeClass = isHigh 
                  ? "bg-red-100 text-red-800" 
                  : isMedium 
                  ? "bg-yellow-100 text-yellow-800" 
                  : "bg-green-100 text-green-800";

                return (
                  <Link
                    key={item.student_id}
                    href={`/dashboard/estudiante/${item.student_id}`}
                    className="flex items-center gap-4 hover:bg-accent/50 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-40 text-sm font-medium truncate">
                      {item.name}
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn("h-full transition-all", colorClass)}
                          style={{ width: `${item.risk_score}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-medium">
                      {item.risk_score}
                    </div>
                    <div className={cn("px-2 py-1 rounded text-xs font-medium whitespace-nowrap", badgeClass)}>
                      {item.risk_level.replace(/_/g, " ").toUpperCase()}
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Alertas Recientes</CardTitle>
            <CardDescription>
              Eventos que requieren tu atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertasRecientes.map((alerta) => (
                <div key={alerta.id} className="flex gap-3">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full mt-2",
                      alerta.nivel === "error" ? "bg-red-500" :
                      alerta.nivel === "warning" ? "bg-yellow-500" :
                      "bg-blue-500"
                    )}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{alerta.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {alerta.mensaje}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getTimeAgo(alerta.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
