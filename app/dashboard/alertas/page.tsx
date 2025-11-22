"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { alertasMock, getEstudianteById } from "@/lib/mock/data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Filter,
  BookOpen,
  Calendar,
  Heart,
  UserCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import type { TipoAlerta } from "@/types";

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

function getAlertIcon(tipo: TipoAlerta) {
  switch (tipo) {
    case "academico":
      return <BookOpen className="h-5 w-5" />;
    case "asistencia":
      return <Calendar className="h-5 w-5" />;
    case "emocional":
      return <Heart className="h-5 w-5" />;
    case "comportamiento":
      return <UserCircle className="h-5 w-5" />;
    case "critico":
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
}

export default function AlertasPage() {
  const [filtroTipo, setFiltroTipo] = useState<TipoAlerta | "todos">("todos");
  const [mostrarLeidas, setMostrarLeidas] = useState(false);

  const alertasFiltradas = alertasMock
    .filter((alerta) => {
      const matchTipo = filtroTipo === "todos" || alerta.tipo === filtroTipo;
      const matchLeida = mostrarLeidas || !alerta.leida;
      return matchTipo && matchLeida;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const alertasNoLeidas = alertasMock.filter((a) => !a.leida).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alertas</h1>
        <p className="text-muted-foreground">
          Notificaciones y alertas del sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Leer</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertasNoLeidas}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alertas</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertasMock.length}</div>
            <p className="text-xs text-muted-foreground">
              Todas las alertas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alertasMock.filter((a) => a.nivel === "error").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nivel error
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertencias</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {alertasMock.filter((a) => a.nivel === "warning").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nivel warning
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltroTipo("todos")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroTipo === "todos"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltroTipo("academico")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  filtroTipo === "academico"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <BookOpen className="h-4 w-4" />
                Académicas
              </button>
              <button
                onClick={() => setFiltroTipo("asistencia")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  filtroTipo === "asistencia"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <Calendar className="h-4 w-4" />
                Asistencia
              </button>
              <button
                onClick={() => setFiltroTipo("emocional")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  filtroTipo === "emocional"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <Heart className="h-4 w-4" />
                Emocionales
              </button>
            </div>

            {/* Show Read Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mostrarLeidas}
                  onChange={(e) => setMostrarLeidas(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Mostrar leídas</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {alertasFiltradas.length} de {alertasMock.length} alertas
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alertasFiltradas.length > 0 ? (
          alertasFiltradas.map((alerta) => {
            const estudiante = getEstudianteById(alerta.estudiante_id);

            return (
              <Card
                key={alerta.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  !alerta.leida && "border-l-4",
                  alerta.nivel === "error" && !alerta.leida && "border-l-red-500",
                  alerta.nivel === "warning" && !alerta.leida && "border-l-yellow-500",
                  alerta.nivel === "info" && !alerta.leida && "border-l-blue-500"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        alerta.nivel === "error" && "bg-red-100 text-red-600",
                        alerta.nivel === "warning" && "bg-yellow-100 text-yellow-600",
                        alerta.nivel === "info" && "bg-blue-100 text-blue-600"
                      )}
                    >
                      {getAlertIcon(alerta.tipo)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold">{alerta.titulo}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alerta.mensaje}
                          </p>
                        </div>
                        {!alerta.leida && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                              Nuevo
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <span className="flex items-center gap-1">
                          <UserCircle className="h-3 w-3" />
                          {estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : "Estudiante"}
                        </span>
                        <span className="capitalize">
                          {alerta.tipo}
                        </span>
                        <span>
                          {getTimeAgo(alerta.created_at)}
                        </span>
                        {estudiante && (
                          <Link
                            href={`/dashboard/estudiante/${estudiante.id}`}
                            className="text-primary hover:underline ml-auto"
                          >
                            Ver perfil →
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      {alerta.leida ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                No hay alertas para mostrar
              </p>
              <p className="text-sm text-muted-foreground">
                {!mostrarLeidas
                  ? "Todas las alertas han sido atendidas"
                  : "No hay alertas que coincidan con los filtros"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
