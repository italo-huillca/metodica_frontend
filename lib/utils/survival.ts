// Utilidades para calcular predicciones de supervivencia y tiempo hasta riesgo crítico

import type { StudentSummary, Estudiante, RiskLevel, Alert } from "@/types";

export interface SurvivalPrediction {
  student_id: string;
  student_name: string;
  current_risk_score: number;
  current_risk_level: RiskLevel;
  estimated_days_to_critical: number | null;
  trajectory: "improving" | "stable" | "declining" | "critical";
  urgency: "immediate" | "high" | "medium" | "low";
  critical_factors: string[];
  intervention_priority: number; // 1-10
  recommended_actions: string[];
}

/**
 * Calcula el tiempo estimado hasta alcanzar riesgo crítico
 * basado en el score actual y factores de riesgo
 */
export function calculateTimeToRisk(
  student: StudentSummary | Estudiante
): SurvivalPrediction {
  // Extraer datos comunes
  const risk_score = 'risk_score' in student 
    ? student.risk_score 
    : student.risk_profile.score;
  const risk_level = 'risk_level' in student 
    ? student.risk_level 
    : student.risk_profile.level;
  
  // Factores críticos del estudiante
  const critical_factors: string[] = [];
  const recommended_actions: string[] = [];
  
  // Analizar estudiante completo si está disponible
  if ('risk_profile' in student) {
    const estudiante = student as Estudiante;
    
    // Factor académico
    if (estudiante.risk_profile.factors.academic.score > 50) {
      critical_factors.push(`Riesgo académico alto (${Math.round(estudiante.risk_profile.factors.academic.score)}%)`);
      recommended_actions.push("Reforzamiento académico urgente");
    }
    
    // Factor emocional
    if (estudiante.risk_profile.factors.emotional.score > 50) {
      critical_factors.push(`Estado emocional preocupante (${Math.round(estudiante.risk_profile.factors.emotional.score)}%)`);
      recommended_actions.push("Sesión con orientación psicológica");
    }
    
    // Factor de asistencia
    if (estudiante.risk_profile.factors.attendance.score > 50) {
      critical_factors.push(`Asistencia deficiente (${Math.round(estudiante.risk_profile.factors.attendance.score)}%)`);
      recommended_actions.push("Monitoreo de asistencia semanal");
    }
    
    // Factor de engagement
    if (estudiante.risk_profile.factors.engagement.score > 50) {
      critical_factors.push(`Bajo compromiso (${Math.round(estudiante.risk_profile.factors.engagement.score)}%)`);
      recommended_actions.push("Actividades de motivación y engagement");
    }
    
    // Alertas activas
    if (estudiante.risk_profile.alerts.length > 0) {
      const unacknowledged = estudiante.risk_profile.alerts.filter(a => !a.acknowledged).length;
      if (unacknowledged > 0) {
        critical_factors.push(`${unacknowledged} alerta(s) sin atender`);
      }
    }
  }
  
  // Calcular días estimados hasta riesgo crítico (score 81+)
  let estimated_days_to_critical: number | null = null;
  let trajectory: "improving" | "stable" | "declining" | "critical" = "stable";
  let urgency: "immediate" | "high" | "medium" | "low" = "low";
  
  if (risk_score >= 81) {
    // Ya está en riesgo crítico
    estimated_days_to_critical = 0;
    trajectory = "critical";
    urgency = "immediate";
    if (!recommended_actions.includes("Intervención inmediata requerida")) {
      recommended_actions.unshift("Intervención inmediata requerida");
    }
  } else if (risk_score >= 66) {
    // Riesgo alto - estimado 7-14 días hasta crítico
    const points_to_critical = 81 - risk_score;
    // Asumiendo progresión de ~2-3 puntos por semana en riesgo alto
    estimated_days_to_critical = Math.round(points_to_critical / 2 * 7);
    trajectory = "declining";
    urgency = "high";
    recommended_actions.unshift("Plan de intervención en 48 horas");
  } else if (risk_score >= 51) {
    // Riesgo moderado - estimado 14-30 días
    const points_to_critical = 81 - risk_score;
    // Asumiendo progresión de ~1-2 puntos por semana en riesgo moderado
    estimated_days_to_critical = Math.round(points_to_critical / 1.5 * 7);
    trajectory = "declining";
    urgency = "medium";
    recommended_actions.unshift("Monitoreo semanal y plan preventivo");
  } else if (risk_score >= 31) {
    // Regular - estimado 30-60 días
    const points_to_critical = 81 - risk_score;
    estimated_days_to_critical = Math.round(points_to_critical / 1 * 7);
    trajectory = "stable";
    urgency = "low";
    recommended_actions.push("Seguimiento quincenal");
  } else {
    // Bajo riesgo - más de 60 días o improbable
    estimated_days_to_critical = null; // No aplica
    trajectory = "stable";
    urgency = "low";
  }
  
  // Calcular prioridad de intervención (1-10)
  const intervention_priority = calculateInterventionPriority(
    risk_score,
    critical_factors.length,
    urgency
  );
  
  return {
    student_id: student.student_id,
    student_name: student.name,
    current_risk_score: risk_score,
    current_risk_level: risk_level,
    estimated_days_to_critical,
    trajectory,
    urgency,
    critical_factors,
    intervention_priority,
    recommended_actions,
  };
}

/**
 * Calcula prioridad de intervención (1-10, donde 10 es máxima prioridad)
 */
function calculateInterventionPriority(
  risk_score: number,
  factors_count: number,
  urgency: "immediate" | "high" | "medium" | "low"
): number {
  let priority = 0;
  
  // Base en risk score (0-5 puntos)
  if (risk_score >= 81) priority += 5;
  else if (risk_score >= 66) priority += 4;
  else if (risk_score >= 51) priority += 3;
  else if (risk_score >= 31) priority += 2;
  else priority += 1;
  
  // Factores críticos (0-3 puntos)
  priority += Math.min(factors_count, 3);
  
  // Urgencia (0-2 puntos)
  if (urgency === "immediate") priority += 2;
  else if (urgency === "high") priority += 1;
  
  return Math.min(priority, 10);
}

/**
 * Genera alertas basadas en curva de supervivencia
 */
export function generateSurvivalAlerts(
  students: StudentSummary[]
): SurvivalPrediction[] {
  return students
    .map(student => calculateTimeToRisk(student))
    .filter(pred => 
      pred.estimated_days_to_critical !== null && 
      pred.estimated_days_to_critical <= 60
    )
    .sort((a, b) => {
      // Ordenar por prioridad de intervención
      if (b.intervention_priority !== a.intervention_priority) {
        return b.intervention_priority - a.intervention_priority;
      }
      // Si tienen igual prioridad, ordenar por días hasta crítico
      const daysA = a.estimated_days_to_critical ?? 999;
      const daysB = b.estimated_days_to_critical ?? 999;
      return daysA - daysB;
    });
}

/**
 * Formatea días en texto legible
 */
export function formatDaysToRisk(days: number | null): string {
  if (days === null) return "Bajo riesgo";
  if (days === 0) return "CRÍTICO - Intervención inmediata";
  if (days <= 7) return `${days} día${days > 1 ? 's' : ''} - URGENTE`;
  if (days <= 14) return `${days} días - Alta prioridad`;
  if (days <= 30) return `${Math.round(days / 7)} semana${days > 14 ? 's' : ''} aprox.`;
  return `${Math.round(days / 30)} mes${days > 60 ? 'es' : ''} aprox.`;
}

/**
 * Obtiene color según urgencia
 */
export function getUrgencyColor(urgency: "immediate" | "high" | "medium" | "low"): string {
  switch (urgency) {
    case "immediate": return "red";
    case "high": return "orange";
    case "medium": return "yellow";
    case "low": return "green";
  }
}

/**
 * Obtiene icono según trayectoria
 */
export function getTrajectoryIcon(trajectory: "improving" | "stable" | "declining" | "critical"): string {
  switch (trajectory) {
    case "improving": return "↗️";
    case "stable": return "→";
    case "declining": return "↘️";
    case "critical": return "⚠️";
  }
}
