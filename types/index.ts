// ============================================
// TIPOS ALINEADOS CON EL BACKEND (FastAPI + Pydantic)
// ============================================

// --- ENUMS Y TIPOS BASE ---
export type RiskLevel = "excelente" | "bueno" | "regular" | "riesgo_moderado" | "riesgo_alto" | "riesgo_critico";
export type RiskColor = "green" | "yellow" | "red";
export type EmotionType = "happy" | "neutral" | "stressed" | "sad" | "anxious" | "angry";
export type AlertSeverity = "low" | "medium" | "high" | "critical";

// --- RIESGO ---
export interface RiskFactor {
  score: number; // 0-100
}

export interface RiskFactors {
  academic: RiskFactor;
  emotional: RiskFactor;
  attendance: RiskFactor;
  engagement: RiskFactor;
}

export interface Alert {
  id: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface RiskProfile {
  score: number; // 0-100
  level: RiskLevel;
  color: RiskColor;
  factors: RiskFactors;
  alerts: Alert[];
}

// --- ACADÉMICO (SEVA) ---
export interface Evaluacion {
  numero: string;
  nota: number;
  docente: string;
  estado: string; // OK, NP, AN, DI
}

export interface Evaluaciones {
  pruebas_aula: Evaluacion[];
  pruebas_laboratorio: Evaluacion[];
  examenes: Evaluacion[];
}

export interface AsistenciaDesglose {
  faltas: number;
  total: number;
}

export interface Asistencias {
  total_sesiones: number;
  asistencias: number;
  tardanzas: number;
  faltas: number;
  faltas_justificadas: number;
  faltas_sin_justificar: number;
  faltas_por_tardanzas: number;
  faltas_totales: number;
  porcentaje_asistencia: number;
  porcentaje_inasistencia: number;
  desglose?: Record<string, AsistenciaDesglose>;
}

export interface CursoSeva {
  codigo_curso: string;
  nombre: string;
  ciclo: string;
  seccion: string;
  sistema_evaluacion: string;
  nro_veces: number;
  promedio: number;
  evaluaciones: Evaluaciones;
  asistencias: Asistencias;
  historial_repeticiones: string[];
}

export interface SevaData {
  cursos: CursoSeva[];
}

// --- EMOCIONAL ---
export interface EmotionEvent {
  timestamp: string;
  emotion: EmotionType;
  source: string; // "self_reported" o "avatar_inferred"
  context: string;
}

export interface EmotionSummary {
  happy: number;
  neutral: number;
  stressed: number;
  sad: number;
  anxious: number;
  angry: number;
  tendencia: string;
  ultimo_estado: string;
  consecutivos_negativos: number;
}

export interface EmotionalData {
  timeline: EmotionEvent[];
  summary: EmotionSummary;
}

// --- ESTUDIANTE ---
export interface RankingInfo {
  numero: number;
  descripcion: string;
}

export interface StudentMetadata {
  created_at: string;
  updated_at?: string;
  perfil_simulado?: string;
  seed_version: string;
}

export interface Estudiante {
  student_id: string;
  name: string;
  email: string;
  sis_id: string;
  especialidad: string;
  periodo: string;
  promedio_acumulado: number;
  ranking: RankingInfo;
  risk_profile: RiskProfile;
  seva_data: SevaData;
  emotional_data: EmotionalData;
  metadata: StudentMetadata;
  canvas_data?: any;
}

// Alias para compatibilidad
export type Student = Estudiante;

// --- RESÚMENES ---
export interface StudentSummary {
  student_id: string;
  name: string;
  email: string;
  promedio_acumulado: number;
  risk_score: number;
  risk_level: RiskLevel;
  risk_color: RiskColor;
  alerts_count: number;
}

export interface ClassroomInfo {
  classroom_id: string;
  name: string;
  periodo: string;
  total_students: number;
  students_at_risk: number;
  average_risk_score: number;
  promedio_salon: number;
}

// --- ESTADÍSTICAS DEL SALÓN ---
export interface EstadisticaSalon {
  total_students: number;
  risk_distribution: {
    excelente: number;
    bueno: number;
    regular: number;
    riesgo_moderado: number;
    riesgo_alto: number;
    riesgo_critico: number;
  };
  students_at_high_risk: StudentRiskSummary[];
  students_critical: StudentRiskSummary[];
  intervention_required: number;
}

export interface StudentRiskSummary {
  id: string;
  nombre: string;
  correo: string;
  score: number;
  level: RiskLevel;
  level_display: string;
  requires_intervention: boolean;
  top_factors: RiskFactorDetail[];
}

export interface RiskFactorDetail {
  type: string;
  severity: string;
  description: string;
  score: number;
  timestamp?: string;
  value?: any;
}

// --- ALERTAS ---
export interface StudentAlerts {
  student_id: string;
  risk_level: RiskLevel;
  risk_score: number;
  alerts: AlertDetail[];
  requires_intervention: boolean;
  generated_at: string;
}

export interface AlertDetail {
  type: string;
  severity: string;
  message: string;
  timestamp?: string;
  value?: any;
  action?: string;
}

// --- REQUESTS ---
export interface EmotionCreate {
  student_id: string;
  emotion: EmotionType;
  source?: string;
  context?: string;
}

// --- RANKING ---
export interface RankingEstudiante {
  estudiante: Estudiante;
  riesgo_score: number;
  riesgo_level: RiskLevel;
}

// --- GRÁFICOS ---
export interface HeatmapData {
  estudiante: string;
  fecha: string;
  valor: number;
  tipo: "nota" | "asistencia" | "emocion";
}

export interface DatoSupervivencia {
  estudiante_id: string;
  tiempo_estimado: number;
  probabilidad_desercion: number;
  factores_criticos: string[];
  ultima_actualizacion: string;
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

// --- CANVAS (no usado por ahora) ---
export interface TareaCanvas {
  id: string;
  nombre: string;
  curso: string;
  fecha_entrega: string;
  estado: "pendiente" | "entregada" | "tarde" | "no_entregada";
  calificacion?: number;
}

// --- RANGOS DE RIESGO ---
export interface RangoRiesgo {
  nivel: RiskLevel;
  min: number;
  max: number;
  color: string;
  label: string;
}

export const RANGOS_RIESGO: RangoRiesgo[] = [
  { nivel: "excelente", min: 0, max: 15, color: "green", label: "Excelente" },
  { nivel: "bueno", min: 16, max: 30, color: "green", label: "Bueno" },
  { nivel: "regular", min: 31, max: 50, color: "yellow", label: "Regular" },
  { nivel: "riesgo_moderado", min: 51, max: 65, color: "yellow", label: "Riesgo Moderado" },
  { nivel: "riesgo_alto", min: 66, max: 80, color: "red", label: "Riesgo Alto" },
  { nivel: "riesgo_critico", min: 81, max: 100, color: "red", label: "Riesgo Crítico" },
];

// --- ALERTA (backward compatibility) ---
export interface Alerta extends Alert {}

// --- TIPOS LEGACY (mantener por si acaso) ---
export type NivelRiesgo = "bajo" | "medio" | "alto";

export interface RiesgoEstudiante {
  estudiante_id: string;
  score: number;
  nivel: NivelRiesgo;
  factores: string[];
  ultima_actualizacion: string;
}

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
