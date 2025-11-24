"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { classroomService } from "@/lib/api/services";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { StudentSummary, RiskLevel } from "@/types";
import { TourButton } from "@/components/ui/tour-button";

// Normalizar el risk_level del backend al formato esperado
function normalizeRiskLevel(student: StudentSummary): RiskLevel {
  const score = student.risk_score;
  
  // Clasificar por score (más confiable que el risk_level del backend)
  // Usar >= para incluir límites y evitar gaps
  if (score >= 81) return "riesgo_critico";      // 81-100
  if (score >= 66) return "riesgo_alto";         // 66-80
  if (score >= 51) return "riesgo_moderado";     // 51-65
  if (score >= 31) return "regular";             // 31-50
  if (score >= 16) return "bueno";               // 16-30
  return "excelente";                            // 0-15
}

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRiesgo, setFiltroRiesgo] = useState<RiskLevel | "todos">("todos");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await classroomService.getAllStudents();
        console.log("📊 Loaded students:", data.length);
        
        // Debug: Verificar distribución real
        const distribution = {
          critico: data.filter(s => s.risk_score >= 81).length,
          alto: data.filter(s => s.risk_score >= 66 && s.risk_score < 81).length,
          moderado: data.filter(s => s.risk_score >= 51 && s.risk_score < 66).length,
          regular: data.filter(s => s.risk_score >= 31 && s.risk_score < 51).length,
          bueno: data.filter(s => s.risk_score >= 16 && s.risk_score < 31).length,
          excelente: data.filter(s => s.risk_score < 16).length,
        };
        console.log("📊 Distribución real por score:", distribution);
        
        setEstudiantes(data);
      } catch (error) {
        console.error("Error loading students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const estudiantesFiltrados = estudiantes
    .filter((item) => {
      const matchBusqueda =
        item.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.student_id.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.email.toLowerCase().includes(busqueda.toLowerCase());

      // Normalizar el risk_level para comparación correcta
      const normalizedLevel = normalizeRiskLevel(item);
      const matchRiesgo =
        filtroRiesgo === "todos" || normalizedLevel === filtroRiesgo;

      return matchBusqueda && matchRiesgo;
    })
    .sort((a, b) => b.risk_score - a.risk_score);

  const getRiskLevelLabel = (level: RiskLevel) => {
    const labels: Record<RiskLevel, string> = {
      excelente: "Excelente",
      bueno: "Bueno",
      regular: "Regular",
      riesgo_moderado: "Riesgo Moderado",
      riesgo_alto: "Riesgo Alto",
      riesgo_critico: "Riesgo Crítico",
    };
    return labels[level] || level;
  };

  const isHighRisk = (level: RiskLevel) => 
    level === "riesgo_alto" || level === "riesgo_critico";
  
  const isMediumRisk = (level: RiskLevel) => 
    level === "regular" || level === "riesgo_moderado";

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estudiantes</h1>
          <p className="text-muted-foreground">Cargando lista de estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estudiantes</h1>
        <p className="text-muted-foreground">
          Lista completa de estudiantes del salón
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative" data-tour="search-bar">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Risk Filter */}
            <div className="flex gap-2" data-tour="risk-filters">
              <button
                onClick={() => setFiltroRiesgo("todos")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroRiesgo === "todos"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroRiesgo("riesgo_critico")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroRiesgo === "riesgo_critico"
                    ? "bg-red-800 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Crítico
              </button>
              <button
                onClick={() => setFiltroRiesgo("riesgo_alto")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroRiesgo === "riesgo_alto"
                    ? "bg-red-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Alto
              </button>
              <button
                onClick={() => setFiltroRiesgo("riesgo_moderado")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroRiesgo === "riesgo_moderado"
                    ? "bg-yellow-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Moderado
              </button>
              <button
                onClick={() => setFiltroRiesgo("regular")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroRiesgo === "regular"
                    ? "bg-yellow-500 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Regular
              </button>
              <button
                onClick={() => setFiltroRiesgo("bueno")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroRiesgo === "bueno"
                    ? "bg-green-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Bueno
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground" data-tour="results-count">
        Mostrando {estudiantesFiltrados.length} de {estudiantes.length} estudiantes
      </div>

      {/* Students Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {estudiantesFiltrados.map((estudiante, index) => {
          const normalizedLevel = normalizeRiskLevel(estudiante);
          return (
          <Link
            key={estudiante.student_id}
            href={`/dashboard/estudiante/${estudiante.student_id}`}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" data-tour={index === 0 ? "student-card" : undefined}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {estudiante.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {estudiante.student_id}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
                      isHighRisk(normalizedLevel)
                        ? "bg-red-100 text-red-800"
                        : isMediumRisk(normalizedLevel)
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    )}
                  >
                    {getRiskLevelLabel(normalizedLevel)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Risk Score */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Riesgo</span>
                      <span className="font-medium">{estudiante.risk_score}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          isHighRisk(normalizedLevel)
                            ? "bg-red-500"
                            : isMediumRisk(normalizedLevel)
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        )}
                        style={{ width: `${estudiante.risk_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Promedio</p>
                      <p className="font-medium">{estudiante.promedio_acumulado.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Alertas</p>
                      <p className={cn(
                        "font-medium",
                        estudiante.alerts_count > 0 ? "text-red-600" : "text-green-600"
                      )}>
                        {estudiante.alerts_count}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
        })}
      </div>

      {/* No results */}
      {estudiantesFiltrados.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No se encontraron estudiantes que coincidan con los filtros.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Botón de Tutorial Flotante */}
      <TourButton page="estudiantes" />
    </div>
  );
}
