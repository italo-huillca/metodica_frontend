"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, RefreshCw } from "lucide-react";
import { classroomService } from "@/lib/api/services";
import type { Estudiante } from "@/types";

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
  // Auto-actualización cada 10 segundos
  const { data: estudiante, isLoading, isFetching } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => classroomService.getStudent(studentId),
    initialData: initialData,
    refetchInterval: 10000, // 10 segundos
    refetchOnWindowFocus: true,
    staleTime: 5000, // Considera los datos stale después de 5 segundos
  });

  const timeline = estudiante?.emotional_data?.timeline || [];
  const isUpdating = isFetching && !isLoading;

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Timeline Emocional</CardTitle>
            <CardDescription>
              Historial de estados emocionales
            </CardDescription>
          </div>
          {isUpdating && (
            <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.length > 0 ? (
            timeline.slice(-5).reverse().map((evento, idx) => (
              <div key={`${evento.timestamp}-${idx}`} className="flex gap-3">
                <div className="text-2xl">
                  {getEmocionEmoji(evento.emotion)}
                </div>
                <div className="flex-1 space-y-1 pb-4 border-l-2 border-border pl-4 -ml-1">
                  <p className="text-sm font-medium capitalize">
                    {getEmocionLabel(evento.emotion)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {evento.context.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getTimeAgo(evento.timestamp)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay eventos emocionales registrados
            </p>
          )}
        </div>

        {timeline.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Actualización automática cada 10 segundos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
