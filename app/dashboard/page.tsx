"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Users, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { riskService, classroomService } from "@/lib/api/services";
import { SurvivalAlerts } from "@/components/dashboard/survival-alerts";
import { generateSurvivalAlerts } from "@/lib/utils/survival";
import { useState, useEffect } from "react";
import type { EstadisticaSalon, StudentSummary } from "@/types";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { TourButton } from "@/components/ui/tour-button";

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

export default function DashboardPage() {
  const [stats, setStats] = useState<EstadisticaSalon | null>(null);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, studentsData] = await Promise.all([
        riskService.getClassroomSummary(),
        classroomService.getAllStudents(),
      ]);
      
      // Debug: Ver distribución de riesgo
      console.log("📊 Estadísticas del backend:", {
        total: statsData.total_students,
        distribution: statsData.risk_distribution,
        alto_critico: statsData.risk_distribution.riesgo_alto + statsData.risk_distribution.riesgo_critico,
        intervention_required: statsData.intervention_required
      });

      // Debug: Ver estudiantes con riesgo alto/crítico
      const highRisk = studentsData.filter(s => 
        s.risk_level === "riesgo_alto" || s.risk_level === "riesgo_critico" || s.risk_level === "high"
      );
      console.log("🔴 Estudiantes con riesgo alto/crítico:", highRisk.length, highRisk.map(s => ({
        name: s.name,
        level: s.risk_level,
        score: s.risk_score
      })));

      // Verificar valores únicos de risk_level
      const uniqueLevels = [...new Set(studentsData.map(s => s.risk_level))];
      console.log("📋 Niveles de riesgo únicos encontrados:", uniqueLevels);

      // Calcular distribución real
      const realDist = {
        excelente: studentsData.filter(s => s.risk_score <= 15).length,
        bueno: studentsData.filter(s => s.risk_score > 15 && s.risk_score <= 30).length,
        regular: studentsData.filter(s => s.risk_score > 30 && s.risk_score <= 50).length,
        riesgo_moderado: studentsData.filter(s => s.risk_score > 50 && s.risk_score <= 65).length,
        riesgo_alto: studentsData.filter(s => s.risk_score > 65 && s.risk_score <= 80).length,
        riesgo_critico: studentsData.filter(s => s.risk_score > 80).length,
      };
      
      console.log("🔢 Distribución calculada en frontend:", realDist);
      console.log("📊 Distribución del backend:", statsData.risk_distribution);

      setStats(statsData);
      setStudents(studentsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-actualizar cada 30 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return <DashboardSkeleton />;
  }

  // Ranking de riesgo (top 5 en riesgo)
  const ranking = [...students]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  // Generar alertas de supervivencia
  const survivalPredictions = generateSurvivalAlerts(students);

  // Calcular distribución real basada en risk_score (por si hay desajuste con el backend)
  const realDistribution = {
    excelente: students.filter(s => s.risk_score <= 15).length,
    bueno: students.filter(s => s.risk_score > 15 && s.risk_score <= 30).length,
    regular: students.filter(s => s.risk_score > 30 && s.risk_score <= 50).length,
    riesgo_moderado: students.filter(s => s.risk_score > 50 && s.risk_score <= 65).length,
    riesgo_alto: students.filter(s => s.risk_score > 65 && s.risk_score <= 80).length,
    riesgo_critico: students.filter(s => s.risk_score > 80).length,
  };

  // Alertas de estudiantes críticos - incluir emociones recientes y supervivencia
  const alertasRecientes = [
    // Alertas críticas de riesgo
    ...stats.students_critical.map((s, index) => ({
      id: `critical-${s.id || index}`,
      titulo: `Riesgo crítico: ${s.nombre}`,
      mensaje: s.top_factors[0]?.description || "Requiere intervención inmediata",
      nivel: "error" as const,
      created_at: s.top_factors[0]?.timestamp || new Date(Date.now() - index * 60000).toISOString(),
    })),
    // Alertas de supervivencia urgentes
    ...survivalPredictions.slice(0, 2).filter(p => p.urgency === "immediate" || p.urgency === "high").map((p, index) => ({
      id: `survival-${p.student_id}`,
      titulo: `Alerta de supervivencia: ${p.student_name}`,
      mensaje: `Riesgo crítico estimado en ${p.estimated_days_to_critical === 0 ? 'ahora' : p.estimated_days_to_critical + ' días'} - ${p.recommended_actions[0]}`,
      nivel: p.urgency === "immediate" ? "error" as const : "warning" as const,
      created_at: new Date(Date.now() - index * 30000).toISOString(),
    })),
    // Alertas emocionales desde extensión (emociones negativas recientes)
    ...students.slice(0, 5).filter(s => {
      if (!('emotional_data' in s)) return false;
      const lastEmotion = (s as any).emotional_data?.timeline?.[0];
      if (!lastEmotion) return false;
      const negativeEmotions = ['stressed', 'sad', 'anxious', 'angry'];
      return negativeEmotions.includes(lastEmotion.emotion) && 
             lastEmotion.source === 'extension' &&
             (Date.now() - new Date(lastEmotion.timestamp).getTime()) < 3600000; // Última hora
    }).map((s, index) => {
      const lastEmotion = (s as any).emotional_data.timeline[0];
      const emotionLabels: Record<string, string> = {
        stressed: 'estresado/a',
        sad: 'triste',
        anxious: 'ansioso/a',
        angry: 'frustrado/a'
      };
      return {
        id: `emotion-${s.student_id}-${index}`,
        titulo: `Estado emocional: ${s.name}`,
        mensaje: `Se reportó ${emotionLabels[lastEmotion.emotion]} desde la extensión`,
        nivel: "warning" as const,
        created_at: lastEmotion.timestamp,
      };
    }),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between" data-tour="header">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general del estado del salón y riesgo de deserción
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors text-sm font-medium",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Actualizar
          </button>
          <div className="text-xs text-muted-foreground">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-tour="stats-total">
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

        <Card data-tour="stats-safe">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sin Riesgo
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {realDistribution.excelente + realDistribution.bueno}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(((realDistribution.excelente + realDistribution.bueno) / students.length) * 100)}% del salón
            </p>
          </CardContent>
        </Card>

        <Card data-tour="stats-moderate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Riesgo Moderado
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {realDistribution.regular + realDistribution.riesgo_moderado}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(((realDistribution.regular + realDistribution.riesgo_moderado) / students.length) * 100)}% del salón
            </p>
          </CardContent>
        </Card>

        <Card data-tour="stats-critical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Riesgo Alto/Crítico
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {realDistribution.riesgo_alto + realDistribution.riesgo_critico}
            </div>
            <p className="text-xs text-muted-foreground">
              {realDistribution.riesgo_alto + realDistribution.riesgo_critico} requieren intervención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Survival Alerts Section */}
      {survivalPredictions.length > 0 && (
        <div data-tour="survival-alerts">
          <SurvivalAlerts predictions={survivalPredictions} maxDisplay={3} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4" data-tour="ranking">
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

        <Card className="col-span-3" data-tour="recent-alerts">
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

      {/* Botón de Tutorial Flotante */}
      <TourButton page="dashboard" />
    </div>
  );
}
