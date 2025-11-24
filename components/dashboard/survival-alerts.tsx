"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, TrendingDown, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SurvivalPrediction } from "@/lib/utils/survival";
import { formatDaysToRisk, getTrajectoryIcon } from "@/lib/utils/survival";

interface SurvivalAlertsProps {
  predictions: SurvivalPrediction[];
  maxDisplay?: number;
}

export function SurvivalAlerts({ predictions, maxDisplay = 5 }: SurvivalAlertsProps) {
  const displayPredictions = predictions.slice(0, maxDisplay);

  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Alertas de Supervivencia
          </CardTitle>
          <CardDescription>
            Predicciones basadas en la curva de supervivencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No hay estudiantes en riesgo inminente</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Alertas de Supervivencia
        </CardTitle>
        <CardDescription>
          Estudiantes que podrían alcanzar riesgo crítico próximamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayPredictions.map((prediction) => {
            const urgencyColor = 
              prediction.urgency === "immediate" ? "bg-red-500" :
              prediction.urgency === "high" ? "bg-orange-500" :
              prediction.urgency === "medium" ? "bg-yellow-500" :
              "bg-green-500";

            const urgencyTextColor = 
              prediction.urgency === "immediate" ? "text-red-600" :
              prediction.urgency === "high" ? "text-orange-600" :
              prediction.urgency === "medium" ? "text-yellow-600" :
              "text-green-600";

            const urgencyBgColor = 
              prediction.urgency === "immediate" ? "bg-red-50" :
              prediction.urgency === "high" ? "bg-orange-50" :
              prediction.urgency === "medium" ? "bg-yellow-50" :
              "bg-green-50";

            return (
              <div
                key={prediction.student_id}
                className={cn(
                  "block p-3 rounded-lg border-l-4 transition-all hover:shadow-md",
                  urgencyBgColor,
                  prediction.urgency === "immediate" && "border-l-red-500",
                  prediction.urgency === "high" && "border-l-orange-500",
                  prediction.urgency === "medium" && "border-l-yellow-500",
                  prediction.urgency === "low" && "border-l-green-500"
                )}
              >
                <Link
                  href={`/dashboard/estudiante/${prediction.student_id}`}
                  className="block"
                >
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">
                        {prediction.student_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-xs font-medium", urgencyTextColor)}>
                          {getTrajectoryIcon(prediction.trajectory)} {prediction.trajectory === "critical" ? "CRÍTICO" : prediction.trajectory === "declining" ? "En declive" : "Estable"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Score: {prediction.current_risk_score}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                        urgencyTextColor,
                        urgencyBgColor
                      )}>
                        {prediction.urgency === "immediate" && <Zap className="h-3 w-3" />}
                        {prediction.urgency === "high" && <AlertTriangle className="h-3 w-3" />}
                        {prediction.urgency === "medium" && <TrendingDown className="h-3 w-3" />}
                        {prediction.urgency === "immediate" ? "AHORA" : 
                         prediction.urgency === "high" ? "URGENTE" :
                         prediction.urgency === "medium" ? "PRONTO" : "MONITOREO"}
                      </div>
                    </div>
                  </div>

                  {/* Time to risk */}
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Tiempo estimado hasta riesgo crítico:
                    </span>
                    <span className={cn("font-semibold", urgencyTextColor)}>
                      {formatDaysToRisk(prediction.estimated_days_to_critical)}
                    </span>
                  </div>

                  {/* Critical factors */}
                  {prediction.critical_factors.length > 0 && (
                    <div className="text-xs space-y-1">
                      <p className="text-muted-foreground font-medium">Factores críticos:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                        {prediction.critical_factors.slice(0, 2).map((factor, idx) => (
                          <li key={idx}>{factor}</li>
                        ))}
                        {prediction.critical_factors.length > 2 && (
                          <li className="italic">+{prediction.critical_factors.length - 2} más...</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Recommended action */}
                  {prediction.recommended_actions.length > 0 && (
                    <div className="text-xs">
                      <p className={cn("font-medium", urgencyTextColor)}>
                        → {prediction.recommended_actions[0]}
                      </p>
                    </div>
                  )}
                </div>
                </Link>
              </div>
            );
          })}
        </div>

        {predictions.length > maxDisplay && (
          <div className="mt-4 text-center">
            <Link
              href="/dashboard/alertas"
              className="text-sm text-primary hover:underline"
            >
              Ver todas las alertas ({predictions.length}) →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
