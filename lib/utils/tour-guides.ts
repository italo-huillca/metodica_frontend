// Configuraciones de tutoriales con Driver.js para cada página de Metodika

import { driver, DriveStep, Config } from "driver.js";

// Configuración base del driver
const baseConfig: Config = {
  showProgress: true,
  animate: true,
  showButtons: ["next", "previous", "close"],
  nextBtnText: "Siguiente",
  prevBtnText: "Anterior",
  doneBtnText: "Finalizar",
  progressText: "{{current}} de {{total}}",
  allowClose: true,
  smoothScroll: true,
};

// ============================================
// DASHBOARD PRINCIPAL
// ============================================
export const dashboardTour: DriveStep[] = [
  {
    popover: {
      title: "Bienvenido a Metodika",
      description: "Te mostraré las principales funciones del dashboard para que puedas prevenir la deserción estudiantil de manera efectiva. Este tour te tomará solo 2 minutos.",
    },
  },
  {
    element: '[data-tour="header"]',
    popover: {
      title: "Panel Principal",
      description: "Aquí encontrarás un resumen general del estado de tu salón. Puedes actualizar los datos en cualquier momento con el botón de refrescar.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="stats-total"]',
    popover: {
      title: "Total de Estudiantes",
      description: "Número total de estudiantes en tu salón durante el ciclo actual.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="stats-safe"]',
    popover: {
      title: "Sin Riesgo",
      description: "Estudiantes con buen rendimiento académico y emocional. Estos alumnos tienen bajo riesgo de deserción.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="stats-moderate"]',
    popover: {
      title: "Riesgo Moderado",
      description: "Estudiantes que requieren monitoreo. Aún no están en riesgo crítico, pero necesitan atención preventiva.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="stats-critical"]',
    popover: {
      title: "Riesgo Alto o Critico",
      description: "Estudiantes que REQUIEREN INTERVENCIÓN INMEDIATA. Estos alumnos tienen alta probabilidad de desertar si no se actúa pronto.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="survival-alerts"]',
    popover: {
      title: "Alertas de Supervivencia",
      description: "Sistema predictivo que calcula cuánto tiempo falta para que un estudiante alcance riesgo crítico. Te permite actuar ANTES de que sea demasiado tarde.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="ranking"]',
    popover: {
      title: "Ranking de Riesgo",
      description: "Top 5 estudiantes con mayor riesgo de deserción, ordenados por su score. Haz clic en cualquier nombre para ver su perfil completo.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="recent-alerts"]',
    popover: {
      title: "Alertas Recientes",
      description: "Eventos importantes que requieren tu atención: emociones negativas desde la extensión, cambios de riesgo, y más.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="sidebar"]',
    popover: {
      title: "Navegacion",
      description: "Usa el menú lateral para explorar todas las funcionalidades de Metodika.",
      side: "right",
      align: "start",
    },
  },
];

// ============================================
// ESTUDIANTES
// ============================================
export const estudiantesTour: DriveStep[] = [
  {
    popover: {
      title: "Lista de Estudiantes",
      description: "Aquí puedes ver y filtrar todos los estudiantes de tu salón.",
    },
  },
  {
    element: '[data-tour="search-bar"]',
    popover: {
      title: "Buscar Estudiante",
      description: "Busca por nombre, código de estudiante o email. La búsqueda es instantánea.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="risk-filters"]',
    popover: {
      title: "Filtros de Riesgo",
      description: "Filtra estudiantes por nivel de riesgo: Todos, Crítico, Alto, Moderado, Regular o Bueno. Útil para enfocarte en quienes más necesitan ayuda.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="results-count"]',
    popover: {
      title: "Contador de Resultados",
      description: "Muestra cuántos estudiantes coinciden con tus filtros activos.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="student-card"]',
    popover: {
      title: "Tarjeta de Estudiante",
      description: "Cada tarjeta muestra: nombre, código, nivel de riesgo, score, promedio académico y número de alertas. Haz clic para ver el perfil completo.",
      side: "left",
      align: "start",
    },
  },
];

// ============================================
// PERFIL INDIVIDUAL DE ESTUDIANTE
// ============================================
export const studentProfileTour: DriveStep[] = [
  {
    popover: {
      title: "Perfil del Estudiante",
      description: "Vista detallada de un estudiante específico con toda su información relevante.",
    },
  },
  {
    element: '[data-tour="student-header"]',
    popover: {
      title: "Informacion Basica",
      description: "Nombre completo, código de estudiante, especialidad y periodo académico.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="risk-overview"]',
    popover: {
      title: "Resumen de Riesgo",
      description: "Score de riesgo general y desglose por factores: académico, emocional, asistencia y engagement.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="emotional-timeline"]',
    popover: {
      title: "Timeline Emocional",
      description: "Historial completo de estados emocionales del estudiante. Se actualiza automáticamente cada 10 segundos. Los eventos desde la extensión Chrome aparecen marcados con un indicador especial.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="academic-details"]',
    popover: {
      title: "Detalles Academicos",
      description: "Información detallada de cursos, notas, asistencias y evaluaciones desde el sistema SEVA.",
      side: "top",
      align: "start",
    },
  },
];

// ============================================
// ANÁLISIS
// ============================================
export const analisisTour: DriveStep[] = [
  {
    popover: {
      title: "Analisis del Salon",
      description: "Visualizaciones avanzadas para identificar patrones y tendencias en tu salón.",
    },
  },
  {
    element: '[data-tour="analysis-filters"]',
    popover: {
      title: "Filtros de Analisis",
      description: "Filtra los heatmaps por nivel de riesgo y curso específico para análisis más detallados.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="heatmap-academic"]',
    popover: {
      title: "Heatmap Academico",
      description: "Visualiza las notas de evaluaciones por estudiante y curso. Verde = buenas notas, Rojo = notas bajas o estados críticos (NP, AN, DI).",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="heatmap-emotional"]',
    popover: {
      title: "Heatmap Emocional",
      description: "Estado emocional de estudiantes por día de la semana. Identifica patrones: hay días más estresantes, quiénes están constantemente tristes.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="survival-graph"]',
    popover: {
      title: "Grafico de Supervivencia",
      description: "Curvas que muestran cuánto tiempo le queda a cada estudiante antes de alcanzar riesgo crítico. Puedes ocultar/mostrar estudiantes haciendo clic en la leyenda.",
      side: "top",
      align: "start",
    },
  },
];

// ============================================
// ALERTAS
// ============================================
export const alertasTour: DriveStep[] = [
  {
    popover: {
      title: "Centro de Alertas",
      description: "Todas las notificaciones y alertas del sistema en un solo lugar.",
    },
  },
  {
    element: '[data-tour="alerts-stats"]',
    popover: {
      title: "Estadisticas de Alertas",
      description: "Resumen rápido: alertas de supervivencia (urgentes), sin leer, críticas y total.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="survival-alerts-section"]',
    popover: {
      title: "Alertas de Supervivencia",
      description: "Estudiantes ordenados por urgencia de intervención. Los que tienen menos tiempo antes de alcanzar riesgo crítico aparecen primero.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="alerts-filters"]',
    popover: {
      title: "Filtros de Alertas",
      description: "Filtra por tipo (Académicas, Asistencia, Emocionales) y alterna la visualización de alertas ya leídas.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="alerts-list"]',
    popover: {
      title: "Lista de Alertas",
      description: "Cada alerta muestra: tipo, severidad, mensaje, estudiante afectado y tiempo transcurrido. Haz clic en 'Ver perfil' para más detalles.",
      side: "top",
      align: "start",
    },
  },
];

// ============================================
// CONFIGURACIÓN
// ============================================
export const configuracionTour: DriveStep[] = [
  {
    popover: {
      title: "Configuracion",
      description: "Personaliza la plataforma según tus preferencias.",
    },
  },
  {
    element: '[data-tour="theme-selector"]',
    popover: {
      title: "Tema Visual",
      description: "Cambia entre modo claro, oscuro o automático según tus preferencias.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="notifications-config"]',
    popover: {
      title: "Notificaciones",
      description: "Configura qué tipo de alertas quieres recibir y con qué frecuencia.",
      side: "bottom",
      align: "start",
    },
  },
];

// ============================================
// FUNCIONES PARA INICIAR TOURS
// ============================================
export function startDashboardTour() {
  const driverObj = driver({
    ...baseConfig,
    steps: dashboardTour,
    onDestroyStarted: () => {
      // Guardar que el usuario completó el tour
      localStorage.setItem("metodika_tour_dashboard", "completed");
      driverObj.destroy();
    },
  });
  driverObj.drive();
}

export function startEstudiantesTour() {
  const driverObj = driver({
    ...baseConfig,
    steps: estudiantesTour,
    onDestroyStarted: () => {
      localStorage.setItem("metodika_tour_estudiantes", "completed");
      driverObj.destroy();
    },
  });
  driverObj.drive();
}

export function startStudentProfileTour() {
  const driverObj = driver({
    ...baseConfig,
    steps: studentProfileTour,
    onDestroyStarted: () => {
      localStorage.setItem("metodika_tour_student_profile", "completed");
      driverObj.destroy();
    },
  });
  driverObj.drive();
}

export function startAnalisisTour() {
  const driverObj = driver({
    ...baseConfig,
    steps: analisisTour,
    onDestroyStarted: () => {
      localStorage.setItem("metodika_tour_analisis", "completed");
      driverObj.destroy();
    },
  });
  driverObj.drive();
}

export function startAlertasTour() {
  const driverObj = driver({
    ...baseConfig,
    steps: alertasTour,
    onDestroyStarted: () => {
      localStorage.setItem("metodika_tour_alertas", "completed");
      driverObj.destroy();
    },
  });
  driverObj.drive();
}

export function startConfiguracionTour() {
  const driverObj = driver({
    ...baseConfig,
    steps: configuracionTour,
    onDestroyStarted: () => {
      localStorage.setItem("metodika_tour_configuracion", "completed");
      driverObj.destroy();
    },
  });
  driverObj.drive();
}

// Verificar si el usuario ya completó un tour
export function hasTourCompleted(tourName: string): boolean {
  return localStorage.getItem(`metodika_tour_${tourName}`) === "completed";
}

// Resetear todos los tours (útil para testing)
export function resetAllTours() {
  localStorage.removeItem("metodika_tour_dashboard");
  localStorage.removeItem("metodika_tour_estudiantes");
  localStorage.removeItem("metodika_tour_student_profile");
  localStorage.removeItem("metodika_tour_analisis");
  localStorage.removeItem("metodika_tour_alertas");
  localStorage.removeItem("metodika_tour_configuracion");
}
