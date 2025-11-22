"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { estudiantesMock, riesgosMock } from "@/lib/mock/data";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import type { NivelRiesgo } from "@/types";

export default function EstudiantesPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroRiesgo, setFiltroRiesgo] = useState<NivelRiesgo | "todos">("todos");

  const estudiantesConRiesgo = estudiantesMock.map((estudiante) => {
    const riesgo = riesgosMock.find((r) => r.estudiante_id === estudiante.id);
    return { estudiante, riesgo };
  });

  const estudiantesFiltrados = estudiantesConRiesgo
    .filter((item) => {
      const matchBusqueda =
        item.estudiante.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.estudiante.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.estudiante.codigo.toLowerCase().includes(busqueda.toLowerCase());

      const matchRiesgo =
        filtroRiesgo === "todos" || item.riesgo?.nivel === filtroRiesgo;

      return matchBusqueda && matchRiesgo;
    })
    .sort((a, b) => (b.riesgo?.score || 0) - (a.riesgo?.score || 0));

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
            <div className="flex-1 relative">
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
            <div className="flex gap-2">
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
                onClick={() => setFiltroRiesgo("alto")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroRiesgo === "alto"
                    ? "bg-red-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Alto
              </button>
              <button
                onClick={() => setFiltroRiesgo("medio")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroRiesgo === "medio"
                    ? "bg-yellow-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Medio
              </button>
              <button
                onClick={() => setFiltroRiesgo("bajo")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  filtroRiesgo === "bajo"
                    ? "bg-green-600 text-white"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Bajo
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {estudiantesFiltrados.length} de {estudiantesMock.length} estudiantes
      </div>

      {/* Students Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {estudiantesFiltrados.map(({ estudiante, riesgo }) => (
          <Link
            key={estudiante.id}
            href={`/dashboard/estudiante/${estudiante.id}`}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {estudiante.nombre} {estudiante.apellido}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {estudiante.codigo}
                    </p>
                  </div>
                  {riesgo && (
                    <div
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        riesgo.nivel === "alto"
                          ? "bg-red-100 text-red-800"
                          : riesgo.nivel === "medio"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      )}
                    >
                      {riesgo.nivel.toUpperCase()}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Risk Score */}
                  {riesgo && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Riesgo</span>
                        <span className="font-medium">{riesgo.score}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
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
                  )}

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Ciclo</p>
                      <p className="font-medium">{estudiante.ciclo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Carrera</p>
                      <p className="font-medium text-xs">
                        {estudiante.carrera.split(" ")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  {riesgo && riesgo.factores.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Factores de riesgo:
                      </p>
                      <ul className="space-y-1">
                        {riesgo.factores.slice(0, 2).map((factor, idx) => (
                          <li key={idx} className="text-xs flex items-start gap-1">
                            <span className="text-muted-foreground">•</span>
                            <span className="flex-1">{factor}</span>
                          </li>
                        ))}
                      </ul>
                      {riesgo.factores.length > 2 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          +{riesgo.factores.length - 2} más
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
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
    </div>
  );
}
