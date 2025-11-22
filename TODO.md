# METODICA_FRONTEND

## 1. Contexto general del sistema
Metodika es una plataforma que busca reducir la deserción temprana en estudiantes de primeros ciclos en institutos y universidades. Su enfoque está alineado con los criterios reales utilizados por TECSUP para evaluar el avance del estudiante, como:

- Cantidad de inasistencias.
- Desaprobaciones consecutivas.
- Estados académicos críticos (NP, AN, DI).
- Reprobación de una misma unidad didáctica hasta tres veces.
- Falta de matrícula o reincorporación.
- Reportes emocionales o conductuales.

El sistema combina estos indicadores institucionales con datos emocionales y comportamiento en Canvas para detectar riesgo antes de que sea irreversible. El frontend es el centro visual donde el tutor ve todo procesado y listo para actuar.

---

## 2. Contexto específico del proyecto (metodica_frontend)
Este proyecto implementa el panel del tutor en Next.js + React. Su función es presentar:

- Estado emocional/académico general del salón.
- Gráficas de supervivencia que muestran cuánto tiempo puede pasar antes de que un estudiante alcance riesgo crítico.
- Heatmaps de entregas tardías, asistencias y notas.
- Alertas tempranas generadas por el backend.
- Perfiles individuales con trayectoria emocional (timeline).

Además, refleja reglas institucionales —como las de TECSUP— que influyen en el nivel de riesgo:

### Ejemplos de señales de riesgo integradas:
- Varias inasistencias consecutivas (SEVA/API simulada).
- Notas menores a 13 o tendencia descendente.
- Aparición de “NP” o “AN”.
- Expresión emocional: tristeza, desmotivación, estrés.
- Interacciones de poco compromiso dentro de Canvas.
- Dificultades mencionadas en el chat del avatar.

Toda esta información es presentada visualmente para permitir intervención rápida y humanizada.

---

## 3. TODO — Lista de tareas

### 🟦 Setup del proyecto
- [ ] Crear app Next.js con TypeScript y Tailwind.
- [ ] Configurar layout principal (sidebar y vista central).
- [ ] Preparar componentización del dashboard.
- [ ] Integrar autenticación de tutor con Supabase Auth.
- [ ] Configurar cliente Supabase en Next.js.
- [ ] Integrar API del backend (FastAPI).
- [ ] Configurar variables de entorno para Supabase y backend API.

### 🟩 Dashboards y visualizaciones
- [ ] Dashboard general con:
  - Estado del salón (riesgo global).
  - Tarjetas de riesgo (bajo, medio, alto).
- [ ] Heatmap académico (notas x semanas x cursos).
- [ ] Heatmap emocional (emociones por fecha).
- [ ] Gráfico de supervivencia (D3/Recharts).
- [ ] Timeline de eventos por estudiante (entregas, asistencias, emociones).
- [ ] Ranking de riesgo (ascendente/descendente).

### 🟧 Vista individual del estudiante
- [ ] Perfil completo del estudiante.
- [ ] Registro de emociones (histórico).
- [ ] Reporte académico (notas, NP, AN).
- [ ] Tendencia de asistencias.
- [ ] Recomendaciones para el tutor.

### 🟥 Integración con el backend y Supabase
- [ ] Obtener la predicción de riesgo en tiempo real desde FastAPI.
- [ ] Leer alertas automáticas generadas por el backend.
- [ ] Obtener datos del salón desde Supabase (simulados y reales).
- [ ] Suscribirse a cambios en tiempo real con Supabase Realtime.
- [ ] Conectar con APIs de comportamiento (extensión).
- [ ] Mostrar datos sincronizados de Canvas LMS API.

### 🟨 Optimización y deploy
- [ ] Carga progresiva (skeletons).
- [ ] Diseño responsivo.
- [ ] Deploy en Vercel (opcional para demo).
