// Servicios de API para interactuar con el backend FastAPI
// Endpoints del backend en http://localhost:8000

import { apiClient } from "./client";
import type {
  Estudiante,
  StudentSummary,
  ClassroomInfo,
  EstadisticaSalon,
  StudentAlerts,
  EmotionCreate,
  EmotionEvent,
  RankingEstudiante,
  Recomendacion,
  TimelineEvento,
  HeatmapData,
  DatoSupervivencia,
} from "@/types";

// --- CLASSROOM / SALÓN ---
export const classroomService = {
  // GET /api/classroom/info
  getInfo: async (): Promise<ClassroomInfo> => {
    return apiClient.get<ClassroomInfo>("/api/classroom/info");
  },

  // GET /api/classroom/students
  getAllStudents: async (): Promise<StudentSummary[]> => {
    return apiClient.get<StudentSummary[]>("/api/classroom/students");
  },

  // GET /api/classroom/students/at-risk
  getStudentsAtRisk: async (minScore: number = 31): Promise<StudentSummary[]> => {
    return apiClient.get<StudentSummary[]>(
      `/api/classroom/students/at-risk?min_score=${minScore}`
    );
  },

  // GET /api/classroom/statistics
  getStatistics: async (): Promise<any> => {
    return apiClient.get<any>("/api/classroom/statistics");
  },

  // GET /api/classroom/student/{student_id}
  getStudent: async (studentId: string): Promise<Estudiante> => {
    return apiClient.get<Estudiante>(`/api/classroom/student/${studentId}`);
  },
};

// --- ESTUDIANTES ---
export const estudianteService = {
  // GET /api/student/me (estudiante actual - Italo)
  getMe: async (): Promise<Estudiante> => {
    return apiClient.get<Estudiante>("/api/student/me");
  },

  // GET /api/student/{student_id}
  getEstudiante: async (id: string): Promise<Estudiante> => {
    return apiClient.get<Estudiante>(`/api/student/${id}`);
  },

  // POST /api/student/emotion
  addEmotion: async (emotionData: EmotionCreate): Promise<any> => {
    return apiClient.post<any>("/api/student/emotion", emotionData);
  },

  // GET /api/student/{student_id}/alerts
  getAlertas: async (studentId: string): Promise<any[]> => {
    return apiClient.get<any[]>(`/api/student/${studentId}/alerts`);
  },

  // POST /api/student/{student_id}/alerts/{alert_id}/acknowledge
  acknowledgeAlert: async (
    studentId: string,
    alertId: string
  ): Promise<any> => {
    return apiClient.post<any>(
      `/api/student/${studentId}/alerts/${alertId}/acknowledge`
    );
  },

  // GET /api/student/{student_id}/emotions
  getEmotions: async (studentId: string, limit: number = 10): Promise<any> => {
    return apiClient.get<any>(
      `/api/student/${studentId}/emotions?limit=${limit}`
    );
  },
};

// --- RIESGO ---
export const riskService = {
  // GET /api/risk/{student_id}
  getStudentRisk: async (
    studentId: string,
    useRealData: boolean = false
  ): Promise<any> => {
    return apiClient.get<any>(
      `/api/risk/${studentId}?use_real_data=${useRealData}`
    );
  },

  // GET /api/risk/classroom/summary
  getClassroomSummary: async (): Promise<EstadisticaSalon> => {
    return apiClient.get<EstadisticaSalon>("/api/risk/classroom/summary");
  },

  // GET /api/risk/alerts/{student_id}
  getStudentAlerts: async (studentId: string): Promise<StudentAlerts> => {
    return apiClient.get<StudentAlerts>(`/api/risk/alerts/${studentId}`);
  },
};

// --- DASHBOARD (combinación de servicios) ---
export const dashboardService = {
  // Obtiene estadísticas generales del salón
  getEstadisticasSalon: async (): Promise<EstadisticaSalon> => {
    return riskService.getClassroomSummary();
  },

  // Obtiene ranking de riesgo
  getRankingRiesgo: async (): Promise<StudentSummary[]> => {
    const students = await classroomService.getAllStudents();
    // Ordenar por score de riesgo descendente
    return students.sort((a, b) => b.risk_score - a.risk_score);
  },

  // Obtiene alertas recientes de todos los estudiantes
  getAlertasRecientes: async (): Promise<any[]> => {
    const students = await classroomService.getAllStudents();
    const alertsPromises = students
      .filter((s) => s.alerts_count > 0)
      .map((s) => estudianteService.getAlertas(s.student_id));

    const allAlerts = await Promise.all(alertsPromises);
    return allAlerts.flat().slice(0, 10); // Últimas 10 alertas
  },
};

// --- GRÁFICOS (placeholder - implementar cuando existan endpoints) ---
export const graficosService = {
  getHeatmapAcademico: async (salon_id: string): Promise<HeatmapData[]> => {
    // TODO: Implementar cuando exista endpoint en backend
    console.warn("Endpoint de heatmap académico no implementado aún");
    return [];
  },

  getHeatmapEmocional: async (salon_id: string): Promise<HeatmapData[]> => {
    // TODO: Implementar cuando exista endpoint en backend
    console.warn("Endpoint de heatmap emocional no implementado aún");
    return [];
  },

  getSupervivencia: async (
    estudiante_id: string
  ): Promise<DatoSupervivencia> => {
    // TODO: Implementar cuando exista endpoint en backend
    console.warn("Endpoint de supervivencia no implementado aún");
    return {
      estudiante_id,
      tiempo_estimado: 0,
      probabilidad_desercion: 0,
      factores_criticos: [],
      ultima_actualizacion: new Date().toISOString(),
    };
  },
};

// --- ALERTAS ---
export const alertasService = {
  getAlertas: async (): Promise<any[]> => {
    return dashboardService.getAlertasRecientes();
  },

  marcarLeida: async (studentId: string, alertId: string): Promise<void> => {
    return estudianteService.acknowledgeAlert(studentId, alertId);
  },
};

// --- CANVAS (integración futura) ---
export const canvasService = {
  // POST /api/canvas/auth
  authenticate: async (accessToken: string): Promise<any> => {
    return apiClient.post<any>("/api/canvas/auth", { 
      canvas_token: accessToken,
      canvas_base_url: "https://tecsup.instructure.com/api/v1"
    });
  },

  // POST /api/canvas/sync
  sync: async (userId: string): Promise<any> => {
    return apiClient.post<any>(`/api/canvas/sync?user_id=${userId}`, {});
  },

  // GET /api/canvas/me
  getMe: async (userId: string): Promise<any> => {
    return apiClient.get<any>(`/api/canvas/me?user_id=${userId}`);
  },

  // GET /api/canvas/status
  getStatus: async (userId: string): Promise<any> => {
    return apiClient.get<any>(`/api/canvas/status?user_id=${userId}`);
  },

  // DELETE /api/canvas/logout
  logout: async (userId: string): Promise<any> => {
    return apiClient.delete<any>(`/api/canvas/logout?user_id=${userId}`);
  },

  // GET /api/canvas/planner
  getPlanner: async (userId: string): Promise<any> => {
    return apiClient.get<any>(`/api/canvas/planner?user_id=${userId}`);
  },
};
