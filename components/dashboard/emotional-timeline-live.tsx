"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, RefreshCw, AlertCircle } from "lucide-react";
import { classroomService } from "@/lib/api/services";
import type { Estudiante } from "@/types";
import { cn } from "@/lib/utils";

interface EmotionalTimelineLiveProps {
  studentId: string;
  initialData?: Estudiante;
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
    angry: "Enojado",
  };
  return labels[emotion] || emotion;
}

export function EmotionalTimelineLive({ studentId, initialData }: EmotionalTimelineLiveProps) {
  // Auto-actualización cada 10 segundos (más balanceado)
  const { data: estudiante, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => classroomService.getStudent(studentId),
    initialData: initialData,
    refetchInterval: 10000, // 10 segundos (balance entre actualización y recursos)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false,
    staleTime: 5000, // 5 segundos antes de considerar stale
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });

  const timeline = estudiante?.emotional_data?.timeline || [];
  const isUpdating = isFetching && !isLoading;
  const lastEmotion = timeline[0]; // El más reciente

  // Skeleton loader mientras carga inicialmente
  if (isLoading) {
    return (
      <Card className="md:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state con opción de reintentar
  if (isError) {
    return (
      <Card className="md:col-span-1 border-red-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Error al cargar timeline
              </CardTitle>
              <CardDescription>
                No se pudo conectar con el servidor
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Timeline Emocional
              {lastEmotion && (
                <span className="text-2xl animate-pulse">
                  {getEmocionEmoji(lastEmotion.emotion)}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Historial de estados emocionales • {timeline.length} eventos
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isUpdating}
              className={cn(
                "p-2 rounded-lg hover:bg-accent transition-colors",
                isUpdating && "cursor-not-allowed opacity-50"
              )}
              title="Actualizar ahora"
            >
              <RefreshCw className={cn(
                "h-4 w-4 text-muted-foreground",
                isUpdating && "animate-spin"
              )} />
            </button>
            <div className="text-right">
              <span className={cn(
                "text-xs font-medium",
                isUpdating ? "text-blue-600" : "text-green-600"
              )}>
                {isUpdating ? "Actualizando..." : "En línea"}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timeline de eventos */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {timeline.length > 0 ? (
            timeline.slice(0, 10).map((evento, idx) => {
              const isRecent = idx === 0;
              const emotionColor = 
                evento.emotion === "happy" ? "bg-green-100 border-green-300" :
                evento.emotion === "neutral" ? "bg-gray-100 border-gray-300" :
                evento.emotion === "sad" ? "bg-blue-100 border-blue-300" :
                evento.emotion === "stressed" ? "bg-orange-100 border-orange-300" :
                evento.emotion === "anxious" ? "bg-yellow-100 border-yellow-300" :
                "bg-red-100 border-red-300";

              return (
                <div 
                  key={`${evento.timestamp}-${idx}`} 
                  className={cn(
                    "flex gap-3 p-3 rounded-lg border-2 transition-all",
                    emotionColor,
                    isRecent && "ring-2 ring-primary ring-offset-2 shadow-md"
                  )}
                >
                  <div className="text-3xl flex-shrink-0">
                    {getEmocionEmoji(evento.emotion)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold capitalize">
                        {getEmocionLabel(evento.emotion)}
                      </p>
                      {isRecent && (
                        <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                          Más reciente
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {evento.source === "extension" ? "📱 Reportado desde extensión" : 
                       evento.source === "self_reported" ? "✍️ Auto-reporte" : 
                       "🤖 " + evento.context.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(evento.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">😐</div>
              <p className="text-sm">No hay eventos emocionales registrados</p>
              <p className="text-xs mt-1">Los datos aparecerán aquí cuando el estudiante reporte su estado</p>
            </div>
          )}
        </div>

        {/* Footer con información de actualización */}
        {timeline.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Actualización automática cada 10s</span>
              </div>
              {timeline.length > 10 && (
                <span>Mostrando últimos 10 de {timeline.length}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
