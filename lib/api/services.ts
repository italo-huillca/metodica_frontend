// Servicios de API para interactuar con el backend

import { apiClient } from "./client";
import type {
  Estudiante,
  RiesgoEstudiante,
  Alerta,
  EstadisticaSalon,
  RankingEstudiante,
  Recomendacion,
  TimelineEvento,
  HeatmapData,
  DatoSupervivencia,
} from "@/types";

// --- DASHBOARD ---
export const dashboardService = {
  getEstadisticasSalon: async (): Promise<EstadisticaSalon> => {
    return apiClient.get<EstadisticaSalon>("/tutor/classroom/stats");
  },

  getRankingRiesgo: async (): Promise<RankingEstudiante[]> => {
    return apiClient.get<RankingEstudiante[]>("/tutor/classroom/risk");
  },

  getAlertasRecientes: async (): Promise<Alerta[]> => {
    return apiClient.get<Alerta[]>("/tutor/alerts/recent");
  },
};

// --- ESTUDIANTES ---
export const estudianteService = {
  getEstudiante: async (id: string): Promise<Estudiante> => {
    return apiClient.get<Estudiante>(`/tutor/student/${id}`);
  },

  getRiesgoEstudiante: async (id: string): Promise<RiesgoEstudiante> => {
    return apiClient.get<RiesgoEstudiante>(`/tutor/student/${id}/risk`);
  },

  getRecomendaciones: async (id: string): Promise<Recomendacion[]> => {
    return apiClient.get<Recomendacion[]>(`/tutor/student/${id}/recommendations`);
  },

  getTimeline: async (id: string): Promise<TimelineEvento[]> => {
    return apiClient.get<TimelineEvento[]>(`/tutor/student/${id}/timeline`);
  },
};

// --- GRÁFICOS ---
export const graficosService = {
  getHeatmapAcademico: async (salon_id: string): Promise<HeatmapData[]> => {
    return apiClient.get<HeatmapData[]>(`/graphs/heatmap/academico/${salon_id}`);
  },

  getHeatmapEmocional: async (salon_id: string): Promise<HeatmapData[]> => {
    return apiClient.get<HeatmapData[]>(`/graphs/heatmap/emocional/${salon_id}`);
  },

  getSupervivencia: async (estudiante_id: string): Promise<DatoSupervivencia> => {
    return apiClient.get<DatoSupervivencia>(`/graphs/survival/${estudiante_id}`);
  },
};

// --- ALERTAS ---
export const alertasService = {
  getAlertas: async (): Promise<Alerta[]> => {
    return apiClient.get<Alerta[]>("/tutor/alerts");
  },

  marcarLeida: async (alerta_id: string): Promise<void> => {
    return apiClient.put<void>(`/tutor/alerts/${alerta_id}/read`);
  },
};
