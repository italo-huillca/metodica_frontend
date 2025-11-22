// Datos mock para desarrollo sin backend

import type {
  Estudiante,
  RiesgoEstudiante,
  Alerta,
  EstadisticaSalon,
  RankingEstudiante,
  Recomendacion,
  TimelineEvento,
  EventoEmocional,
  Nota,
  Asistencia,
  EstadisticaAsistencia,
  TareaCanvas,
} from "@/types";

// --- ESTUDIANTES MOCK ---
export const estudiantesMock: Estudiante[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez López",
    email: "juan.perez@tecsup.edu.pe",
    codigo: "C20210001",
    ciclo: 1,
    carrera: "Ingeniería de Sistemas",
    foto_url: undefined,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-11-21T00:00:00Z",
  },
  {
    id: "2",
    nombre: "María",
    apellido: "García Torres",
    email: "maria.garcia@tecsup.edu.pe",
    codigo: "C20210002",
    ciclo: 1,
    carrera: "Ingeniería de Sistemas",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-11-21T00:00:00Z",
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez Sánchez",
    email: "carlos.rodriguez@tecsup.edu.pe",
    codigo: "C20210003",
    ciclo: 1,
    carrera: "Ingeniería de Sistemas",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-11-21T00:00:00Z",
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Martínez Flores",
    email: "ana.martinez@tecsup.edu.pe",
    codigo: "C20210004",
    ciclo: 1,
    carrera: "Ingeniería de Sistemas",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-11-21T00:00:00Z",
  },
  {
    id: "5",
    nombre: "Luis",
    apellido: "Torres Vega",
    email: "luis.torres@tecsup.edu.pe",
    codigo: "C20210005",
    ciclo: 1,
    carrera: "Ingeniería de Sistemas",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-11-21T00:00:00Z",
  },
  {
    id: "6",
    nombre: "Carmen",
    apellido: "Díaz Ruiz",
    email: "carmen.diaz@tecsup.edu.pe",
    codigo: "C20210006",
    ciclo: 1,
    carrera: "Ingeniería de Sistemas",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-11-21T00:00:00Z",
  },
];

// --- RIESGO MOCK ---
export const riesgosMock: RiesgoEstudiante[] = [
  {
    estudiante_id: "1",
    score: 85,
    nivel: "alto",
    factores: ["3 faltas consecutivas", "Nota < 13 en Matemáticas", "Estado emocional: tristeza"],
    ultima_actualizacion: new Date().toISOString(),
  },
  {
    estudiante_id: "2",
    score: 72,
    nivel: "alto",
    factores: ["Nota < 13 en Física", "2 desaprobaciones", "Emociones negativas"],
    ultima_actualizacion: new Date().toISOString(),
  },
  {
    estudiante_id: "3",
    score: 58,
    nivel: "medio",
    factores: ["Asistencia 75%", "Tendencia descendente en notas"],
    ultima_actualizacion: new Date().toISOString(),
  },
  {
    estudiante_id: "4",
    score: 45,
    nivel: "medio",
    factores: ["Tardanzas frecuentes", "Tareas sin entregar"],
    ultima_actualizacion: new Date().toISOString(),
  },
  {
    estudiante_id: "5",
    score: 28,
    nivel: "bajo",
    factores: [],
    ultima_actualizacion: new Date().toISOString(),
  },
  {
    estudiante_id: "6",
    score: 15,
    nivel: "bajo",
    factores: [],
    ultima_actualizacion: new Date().toISOString(),
  },
];

// --- ALERTAS MOCK ---
export const alertasMock: Alerta[] = [
  {
    id: "1",
    estudiante_id: "1",
    tipo: "asistencia",
    nivel: "error",
    titulo: "3 faltas consecutivas",
    mensaje: "Juan Pérez ha faltado 3 veces consecutivas en Matemáticas",
    leida: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    estudiante_id: "2",
    tipo: "academico",
    nivel: "warning",
    titulo: "Nota menor a 13",
    mensaje: "María García obtuvo 11 en el parcial de Física",
    leida: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    estudiante_id: "1",
    tipo: "emocional",
    nivel: "warning",
    titulo: "Estado emocional: tristeza",
    mensaje: "Juan Pérez reportó sentirse triste en las últimas 3 sesiones",
    leida: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    estudiante_id: "3",
    tipo: "comportamiento",
    nivel: "info",
    titulo: "Baja participación en Canvas",
    mensaje: "Carlos Rodríguez no ha interactuado con el material del curso esta semana",
    leida: true,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

// --- ESTADÍSTICAS DEL SALÓN ---
export const estadisticasSalonMock: EstadisticaSalon = {
  total_estudiantes: 32,
  riesgo_bajo: 18,
  riesgo_medio: 10,
  riesgo_alto: 4,
  promedio_asistencia: 82.5,
  promedio_notas: 13.8,
  alertas_activas: 12,
};

// --- RANKING MOCK ---
export const rankingMock: RankingEstudiante[] = estudiantesMock.slice(0, 6).map((estudiante) => {
  const riesgo = riesgosMock.find((r) => r.estudiante_id === estudiante.id)!;
  return {
    estudiante,
    riesgo,
    asistencia: {
      estudiante_id: estudiante.id,
      total_clases: 40,
      presentes: 32,
      ausentes: 6,
      tardanzas: 2,
      porcentaje: 80,
    },
    promedio_academico: 14.5 - riesgo.score / 10,
  };
});

// --- EVENTOS EMOCIONALES MOCK ---
export const eventosEmocionalesMock: EventoEmocional[] = [
  {
    id: "1",
    estudiante_id: "1",
    emocion: "triste",
    intensidad: 4,
    contexto: "Dificultad con el examen de matemáticas",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    estudiante_id: "1",
    emocion: "estresado",
    intensidad: 5,
    contexto: "Muchas tareas pendientes",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    estudiante_id: "1",
    emocion: "neutral",
    intensidad: 3,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    estudiante_id: "2",
    emocion: "motivado",
    intensidad: 4,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

// --- TIMELINE MOCK ---
export const timelineEventosMock: TimelineEvento[] = [
  {
    id: "1",
    estudiante_id: "1",
    tipo: "alerta",
    titulo: "3 faltas consecutivas",
    descripcion: "Faltas registradas en Matemáticas",
    fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    color: "red",
  },
  {
    id: "2",
    estudiante_id: "1",
    tipo: "academico",
    titulo: "Parcial de Física: 11",
    descripcion: "Nota por debajo del promedio esperado",
    fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    color: "yellow",
  },
  {
    id: "3",
    estudiante_id: "1",
    tipo: "emocional",
    titulo: "Estado emocional: Triste",
    descripcion: "Reportó dificultades con el material del curso",
    fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    color: "blue",
  },
  {
    id: "4",
    estudiante_id: "1",
    tipo: "asistencia",
    titulo: "Tardanza",
    descripcion: "Llegó 15 minutos tarde a la clase de Programación",
    fecha: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    color: "orange",
  },
];

// --- RECOMENDACIONES MOCK ---
export const recomendacionesMock: Recomendacion[] = [
  {
    id: "1",
    estudiante_id: "1",
    tipo: "tutor",
    categoria: "academico",
    titulo: "Sesión de reforzamiento en Matemáticas",
    descripcion: "Agendar una sesión individual para revisar los temas del último parcial donde tuvo dificultades.",
    prioridad: "alta",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    estudiante_id: "1",
    tipo: "tutor",
    categoria: "emocional",
    titulo: "Conversación sobre bienestar",
    descripcion: "Tener una conversación privada para entender los factores emocionales que están afectando su rendimiento.",
    prioridad: "alta",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    estudiante_id: "1",
    tipo: "tutor",
    categoria: "motivacional",
    titulo: "Reconocer esfuerzos",
    descripcion: "Destacar sus fortalezas en Programación para motivarlo y mejorar su confianza.",
    prioridad: "media",
    created_at: new Date().toISOString(),
  },
];

// --- NOTAS MOCK ---
export const notasMock: Nota[] = [
  {
    id: "1",
    estudiante_id: "1",
    curso: "Matemáticas I",
    nota: 11,
    tipo: "parcial",
    fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    peso: 0.3,
  },
  {
    id: "2",
    estudiante_id: "1",
    curso: "Física I",
    nota: 11,
    tipo: "parcial",
    fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    peso: 0.3,
  },
  {
    id: "3",
    estudiante_id: "1",
    curso: "Programación I",
    nota: 16,
    tipo: "tarea",
    fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    peso: 0.2,
  },
];

// --- ASISTENCIA MOCK ---
export const asistenciaEstadisticasMock: EstadisticaAsistencia = {
  estudiante_id: "1",
  total_clases: 40,
  presentes: 30,
  ausentes: 8,
  tardanzas: 2,
  porcentaje: 75,
};

// --- TAREAS CANVAS MOCK ---
export const tareasCanvasMock: TareaCanvas[] = [
  {
    id: "1",
    nombre: "Tarea 1: Funciones matemáticas",
    curso: "Matemáticas I",
    fecha_entrega: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    estado: "pendiente",
  },
  {
    id: "2",
    nombre: "Laboratorio 2: Cinemática",
    curso: "Física I",
    fecha_entrega: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estado: "tarde",
  },
  {
    id: "3",
    nombre: "Proyecto: Sistema de gestión",
    curso: "Programación I",
    fecha_entrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estado: "entregada",
    calificacion: 16,
  },
];

// --- HELPERS ---
export function getEstudianteById(id: string): Estudiante | undefined {
  return estudiantesMock.find((e) => e.id === id);
}

export function getRiesgoByEstudianteId(id: string): RiesgoEstudiante | undefined {
  return riesgosMock.find((r) => r.estudiante_id === id);
}

export function getAlertasByEstudianteId(id: string): Alerta[] {
  return alertasMock.filter((a) => a.estudiante_id === id);
}

export function getTimelineByEstudianteId(id: string): TimelineEvento[] {
  return timelineEventosMock.filter((t) => t.estudiante_id === id);
}

export function getRecomendacionesByEstudianteId(id: string): Recomendacion[] {
  return recomendacionesMock.filter((r) => r.estudiante_id === id);
}

// --- HEATMAP DATA ---
// Heatmap académico: Notas por estudiante y semana
export const heatmapAcademicoData = [
  // Semana 1
  { estudiante: "Juan Pérez", semana: "Sem 1", curso: "Matemáticas", valor: 12 },
  { estudiante: "Juan Pérez", semana: "Sem 1", curso: "Física", valor: 14 },
  { estudiante: "Juan Pérez", semana: "Sem 1", curso: "Programación", valor: 16 },
  { estudiante: "María García", semana: "Sem 1", curso: "Matemáticas", valor: 15 },
  { estudiante: "María García", semana: "Sem 1", curso: "Física", valor: 13 },
  { estudiante: "María García", semana: "Sem 1", curso: "Programación", valor: 14 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 1", curso: "Matemáticas", valor: 14 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 1", curso: "Física", valor: 15 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 1", curso: "Programación", valor: 13 },

  // Semana 2
  { estudiante: "Juan Pérez", semana: "Sem 2", curso: "Matemáticas", valor: 11 },
  { estudiante: "Juan Pérez", semana: "Sem 2", curso: "Física", valor: 11 },
  { estudiante: "Juan Pérez", semana: "Sem 2", curso: "Programación", valor: 15 },
  { estudiante: "María García", semana: "Sem 2", curso: "Matemáticas", valor: 14 },
  { estudiante: "María García", semana: "Sem 2", curso: "Física", valor: 11 },
  { estudiante: "María García", semana: "Sem 2", curso: "Programación", valor: 13 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 2", curso: "Matemáticas", valor: 13 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 2", curso: "Física", valor: 14 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 2", curso: "Programación", valor: 12 },

  // Semana 3
  { estudiante: "Juan Pérez", semana: "Sem 3", curso: "Matemáticas", valor: 10 },
  { estudiante: "Juan Pérez", semana: "Sem 3", curso: "Física", valor: 12 },
  { estudiante: "Juan Pérez", semana: "Sem 3", curso: "Programación", valor: 16 },
  { estudiante: "María García", semana: "Sem 3", curso: "Matemáticas", valor: 13 },
  { estudiante: "María García", semana: "Sem 3", curso: "Física", valor: 12 },
  { estudiante: "María García", semana: "Sem 3", curso: "Programación", valor: 15 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 3", curso: "Matemáticas", valor: 12 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 3", curso: "Física", valor: 13 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 3", curso: "Programación", valor: 14 },

  // Semana 4
  { estudiante: "Juan Pérez", semana: "Sem 4", curso: "Matemáticas", valor: 11 },
  { estudiante: "Juan Pérez", semana: "Sem 4", curso: "Física", valor: 10 },
  { estudiante: "Juan Pérez", semana: "Sem 4", curso: "Programación", valor: 17 },
  { estudiante: "María García", semana: "Sem 4", curso: "Matemáticas", valor: 12 },
  { estudiante: "María García", semana: "Sem 4", curso: "Física", valor: 11 },
  { estudiante: "María García", semana: "Sem 4", curso: "Programación", valor: 14 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 4", curso: "Matemáticas", valor: 13 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 4", curso: "Física", valor: 12 },
  { estudiante: "Carlos Rodríguez", semana: "Sem 4", curso: "Programación", valor: 13 },
];

// Heatmap emocional: Emociones por estudiante y día
export const heatmapEmocionalData = [
  { estudiante: "Juan Pérez", fecha: "Lun", valor: 3 }, // 1=muy negativo, 5=muy positivo
  { estudiante: "Juan Pérez", fecha: "Mar", valor: 2 },
  { estudiante: "Juan Pérez", fecha: "Mié", valor: 2 },
  { estudiante: "Juan Pérez", fecha: "Jue", valor: 3 },
  { estudiante: "Juan Pérez", fecha: "Vie", valor: 2 },

  { estudiante: "María García", fecha: "Lun", valor: 4 },
  { estudiante: "María García", fecha: "Mar", valor: 3 },
  { estudiante: "María García", fecha: "Mié", valor: 4 },
  { estudiante: "María García", fecha: "Jue", valor: 3 },
  { estudiante: "María García", fecha: "Vie", valor: 4 },

  { estudiante: "Carlos Rodríguez", fecha: "Lun", valor: 4 },
  { estudiante: "Carlos Rodríguez", fecha: "Mar", valor: 4 },
  { estudiante: "Carlos Rodríguez", fecha: "Mié", valor: 3 },
  { estudiante: "Carlos Rodríguez", fecha: "Jue", valor: 4 },
  { estudiante: "Carlos Rodríguez", fecha: "Vie", valor: 5 },

  { estudiante: "Ana Martínez", fecha: "Lun", valor: 5 },
  { estudiante: "Ana Martínez", fecha: "Mar", valor: 4 },
  { estudiante: "Ana Martínez", fecha: "Mié", valor: 4 },
  { estudiante: "Ana Martínez", fecha: "Jue", valor: 5 },
  { estudiante: "Ana Martínez", fecha: "Vie", valor: 5 },

  { estudiante: "Luis Torres", fecha: "Lun", valor: 5 },
  { estudiante: "Luis Torres", fecha: "Mar", valor: 5 },
  { estudiante: "Luis Torres", fecha: "Mié", valor: 4 },
  { estudiante: "Luis Torres", fecha: "Jue", valor: 5 },
  { estudiante: "Luis Torres", fecha: "Vie", valor: 5 },
];

// Datos de supervivencia: Probabilidad de continuar por tiempo
export const supervivenciaData = [
  { tiempo: 0, probabilidad: 100, estudiante: "Juan Pérez" },
  { tiempo: 1, probabilidad: 92, estudiante: "Juan Pérez" },
  { tiempo: 2, probabilidad: 78, estudiante: "Juan Pérez" },
  { tiempo: 3, probabilidad: 65, estudiante: "Juan Pérez" },
  { tiempo: 4, probabilidad: 48, estudiante: "Juan Pérez" },
  { tiempo: 5, probabilidad: 35, estudiante: "Juan Pérez" },
  { tiempo: 6, probabilidad: 25, estudiante: "Juan Pérez" },

  { tiempo: 0, probabilidad: 100, estudiante: "María García" },
  { tiempo: 1, probabilidad: 95, estudiante: "María García" },
  { tiempo: 2, probabilidad: 85, estudiante: "María García" },
  { tiempo: 3, probabilidad: 72, estudiante: "María García" },
  { tiempo: 4, probabilidad: 58, estudiante: "María García" },
  { tiempo: 5, probabilidad: 45, estudiante: "María García" },
  { tiempo: 6, probabilidad: 35, estudiante: "María García" },

  { tiempo: 0, probabilidad: 100, estudiante: "Carlos Rodríguez" },
  { tiempo: 1, probabilidad: 98, estudiante: "Carlos Rodríguez" },
  { tiempo: 2, probabilidad: 92, estudiante: "Carlos Rodríguez" },
  { tiempo: 3, probabilidad: 85, estudiante: "Carlos Rodríguez" },
  { tiempo: 4, probabilidad: 75, estudiante: "Carlos Rodríguez" },
  { tiempo: 5, probabilidad: 68, estudiante: "Carlos Rodríguez" },
  { tiempo: 6, probabilidad: 62, estudiante: "Carlos Rodríguez" },

  { tiempo: 0, probabilidad: 100, estudiante: "Promedio Salón" },
  { tiempo: 1, probabilidad: 96, estudiante: "Promedio Salón" },
  { tiempo: 2, probabilidad: 88, estudiante: "Promedio Salón" },
  { tiempo: 3, probabilidad: 78, estudiante: "Promedio Salón" },
  { tiempo: 4, probabilidad: 68, estudiante: "Promedio Salón" },
  { tiempo: 5, probabilidad: 58, estudiante: "Promedio Salón" },
  { tiempo: 6, probabilidad: 50, estudiante: "Promedio Salón" },
];
