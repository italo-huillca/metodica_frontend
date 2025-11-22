// ============================================
// TIPOS PRINCIPALES DEL SISTEMA METÓDICA
// ============================================

// --- ESTUDIANTE ---
export interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  codigo: string;
  ciclo: number;
  carrera: string;
  foto_url?: string;
  created_at: string;
  updated_at: string;
}

// --- RIESGO ---
export type NivelRiesgo = "bajo" | "medio" | "alto";

export interface RiesgoEstudiante {
  estudiante_id: string;
  score: number; // 0-100
  nivel: NivelRiesgo;
  factores: string[];
  ultima_actualizacion: string;
}

export interface RangoRiesgo {
  nivel: NivelRiesgo;
  min: number;
  max: number;
  color: string;
  label: string;
}

export const RANGOS_RIESGO: RangoRiesgo[] = [
  { nivel: "bajo", min: 0, max: 30, color: "green", label: "Bajo" },
  { nivel: "medio", min: 31, max: 65, color: "yellow", label: "Medio" },
  { nivel: "alto", min: 66, max: 100, color: "red", label: "Alto" },
];

// --- ACADÉMICO ---
export interface Nota {
  id: string;
  estudiante_id: string;
  curso: string;
  nota: number;
  tipo: "parcial" | "final" | "tarea" | "proyecto";
  fecha: string;
  peso: number;
}

export interface Curso {
  id: string;
  nombre: string;
  codigo: string;
  creditos: number;
  ciclo: number;
}

export type EstadoAcademico = "AP" | "NP" | "AN" | "DI" | "RE";

export interface RegistroAcademico {
  estudiante_id: string;
  curso_id: string;
  estado: EstadoAcademico;
  promedio: number;
  desaprobaciones_previas: number;
  fecha_registro: string;
}

// --- ASISTENCIA ---
export interface Asistencia {
  id: string;
  estudiante_id: string;
  curso_id: string;
  fecha: string;
  estado: "presente" | "ausente" | "tardanza";
}

export interface EstadisticaAsistencia {
  estudiante_id: string;
  total_clases: number;
  presentes: number;
  ausentes: number;
  tardanzas: number;
  porcentaje: number;
}

// --- EMOCIONAL ---
export type TipoEmocion =
  | "feliz"
  | "neutral"
  | "triste"
  | "estresado"
  | "frustrado"
  | "motivado"
  | "desmotivado";

export interface EventoEmocional {
  id: string;
  estudiante_id: string;
  emocion: TipoEmocion;
  intensidad: number; // 1-5
  contexto?: string;
  timestamp: string;
}

export interface TendenciaEmocional {
  estudiante_id: string;
  periodo: string;
  emociones: {
    tipo: TipoEmocion;
    frecuencia: number;
  }[];
  promedio_intensidad: number;
}

// --- ALERTAS ---
export type TipoAlerta =
  | "academico"
  | "asistencia"
  | "emocional"
  | "comportamiento"
  | "critico";

export interface Alerta {
  id: string;
  estudiante_id: string;
  tipo: TipoAlerta;
  nivel: "info" | "warning" | "error";
  titulo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
}

// --- RECOMENDACIONES ---
export interface Recomendacion {
  id: string;
  estudiante_id: string;
  tipo: "tutor" | "estudiante";
  categoria: "academico" | "emocional" | "motivacional";
  titulo: string;
  descripcion: string;
  prioridad: "baja" | "media" | "alta";
  created_at: string;
}

// --- CANVAS LMS ---
export interface TareaCanvas {
  id: string;
  nombre: string;
  curso: string;
  fecha_entrega: string;
  estado: "pendiente" | "entregada" | "tarde" | "no_entregada";
  calificacion?: number;
}

// --- AVATAR ---
export interface MensajeAvatar {
  id: string;
  estudiante_id: string;
  mensaje: string;
  tipo: "greeting" | "alert" | "motivational" | "reminder";
  timestamp: string;
}

// --- SUPERVIVENCIA ---
export interface DatoSupervivencia {
  estudiante_id: string;
  tiempo_estimado: number; // días hasta riesgo crítico
  probabilidad_desercion: number; // 0-1
  factores_criticos: string[];
  ultima_actualizacion: string;
}

// --- DASHBOARD ---
export interface EstadisticaSalon {
  total_estudiantes: number;
  riesgo_bajo: number;
  riesgo_medio: number;
  riesgo_alto: number;
  promedio_asistencia: number;
  promedio_notas: number;
  alertas_activas: number;
}

export interface RankingEstudiante {
  estudiante: Estudiante;
  riesgo: RiesgoEstudiante;
  asistencia: EstadisticaAsistencia;
  promedio_academico: number;
}

// --- GRÁFICOS ---
export interface HeatmapData {
  estudiante: string;
  fecha: string;
  valor: number;
  tipo: "nota" | "asistencia" | "emocion";
}

export interface TimelineEvento {
  id: string;
  estudiante_id: string;
  tipo: "academico" | "asistencia" | "emocional" | "alerta";
  titulo: string;
  descripcion: string;
  fecha: string;
  icono?: string;
  color?: string;
}

// --- FILTROS Y BÚSQUEDA ---
export interface FiltroEstudiantes {
  ciclo?: number;
  carrera?: string;
  nivel_riesgo?: NivelRiesgo;
  busqueda?: string;
}

export interface PaginacionParams {
  page: number;
  limit: number;
}

export interface PaginacionResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
