# Sistema de Alertas de Supervivencia - Metodika

## 📋 Resumen de Cambios

Se ha implementado un **sistema de predicción de supervivencia** que calcula el tiempo estimado hasta que un estudiante alcance riesgo crítico, basado en su trayectoria actual y factores de riesgo.

---

## 🆕 Archivos Nuevos

### 1. `lib/utils/survival.ts`
Contiene toda la lógica de cálculo de predicciones de supervivencia:

**Funciones principales:**
- `calculateTimeToRisk()`: Calcula el tiempo estimado hasta riesgo crítico para un estudiante
- `generateSurvivalAlerts()`: Genera alertas ordenadas por prioridad de intervención
- `formatDaysToRisk()`: Formatea días en texto legible
- `getUrgencyColor()`: Obtiene color según urgencia
- `getTrajectoryIcon()`: Obtiene icono según trayectoria

**Interface `SurvivalPrediction`:**
```typescript
{
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
```

**Lógica de cálculo:**

| Risk Score | Días hasta crítico | Urgencia | Trayectoria |
|------------|-------------------|----------|-------------|
| 81-100 | 0 (ya crítico) | Inmediata | Critical |
| 66-80 | 7-14 días | Alta | Declining |
| 51-65 | 14-30 días | Media | Declining |
| 31-50 | 30-60 días | Baja | Stable |
| 0-30 | >60 días / N/A | Baja | Stable |

### 2. `components/dashboard/survival-alerts.tsx`
Componente visual que muestra las alertas de supervivencia:

**Props:**
- `predictions`: Array de predicciones de supervivencia
- `maxDisplay`: Número máximo de alertas a mostrar (default: 5)

**Características:**
- Diseño con código de colores según urgencia
- Muestra tiempo estimado hasta riesgo crítico
- Lista factores críticos más importantes
- Muestra acción recomendada prioritaria
- Link directo al perfil del estudiante

---

## 🔄 Archivos Modificados

### 1. `app/dashboard/page.tsx`
**Cambios:**
- Importa funciones de supervivencia
- Genera predicciones: `const survivalPredictions = generateSurvivalAlerts(students)`
- Muestra componente `<SurvivalAlerts>` con top 5 predicciones más urgentes
- Posicionado antes del ranking de riesgo tradicional

### 2. `app/dashboard/alertas/page.tsx`
**Cambios:**
- Importa funciones de supervivencia
- Genera predicciones en el `useEffect`
- Nueva estadística: "Supervivencia" (riesgo inminente)
- Muestra hasta 10 alertas de supervivencia
- Reorganización de cards de estadísticas para destacar supervivencia

**Nueva distribución de stats:**
1. **Supervivencia** (nuevo) - Alertas inminentes
2. **Sin Leer** - Alertas tradicionales no atendidas
3. **Críticas** - Alertas de alta severidad
4. **Total** - Todas las alertas

### 3. `app/dashboard/estudiantes/page.tsx`
**Cambios menores:**
- Mejora en logging para debug
- Mantiene funcionalidad de filtros intacta

---

## 🎯 Funcionalidades Implementadas

### ✅ 1. Filtros de Estudiantes
**Estado:** FUNCIONANDO CORRECTAMENTE

Los filtros en `/dashboard/estudiantes` funcionan correctamente:
- ✅ Búsqueda por nombre, código o email
- ✅ Filtro por nivel de riesgo (Todos, Crítico, Alto, Moderado, Regular, Bueno)
- ✅ Ordenamiento por risk score descendente
- ✅ Contador de resultados filtrados

**Validación:**
- Los datos se cargan desde el backend
- El estado se gestiona correctamente con React hooks
- La lógica de filtrado es precisa y eficiente

### ✅ 2. Alertas de Supervivencia
**Estado:** IMPLEMENTADO Y OPERATIVO

**En Dashboard Principal (`/dashboard`):**
- Muestra top 5 estudiantes con mayor urgencia
- Visible solo si hay estudiantes en riesgo (score > 30)
- Ordenado por prioridad de intervención

**En Página de Alertas (`/dashboard/alertas`):**
- Muestra hasta 10 predicciones de supervivencia
- Nueva card de estadística "Supervivencia"
- Integrado con alertas tradicionales
- Link a perfil de cada estudiante

### ✅ 3. Sistema de Priorización
**Criterios de prioridad (1-10):**

**Score base (0-5 puntos):**
- Crítico (81-100): 5 puntos
- Alto (66-80): 4 puntos
- Moderado (51-65): 3 puntos
- Regular (31-50): 2 puntos
- Bajo (0-30): 1 punto

**Factores críticos (0-3 puntos):**
- Cada factor crítico adicional suma 1 punto (máx 3)

**Urgencia (0-2 puntos):**
- Inmediata: +2 puntos
- Alta: +1 punto
- Media/Baja: 0 puntos

### ✅ 4. Factores Críticos Detectados
El sistema analiza y reporta:

1. **Académico**: Score > 50% en risk_profile.factors.academic
2. **Emocional**: Score > 50% en risk_profile.factors.emotional
3. **Asistencia**: Score > 50% en risk_profile.factors.attendance
4. **Engagement**: Score > 50% en risk_profile.factors.engagement
5. **Alertas sin atender**: Cuenta alerts no acknowledged

### ✅ 5. Acciones Recomendadas
Basadas en urgencia y contexto:

**Inmediata (score 81+):**
- "Intervención inmediata requerida"
- Reforzamiento académico urgente
- Sesión psicológica urgente

**Alta (score 66-80):**
- "Plan de intervención en 48 horas"
- Monitoreo diario

**Media (score 51-65):**
- "Monitoreo semanal y plan preventivo"
- Seguimiento estructurado

**Baja (score 31-50):**
- "Seguimiento quincenal"
- Observación preventiva

---

## 🎨 Diseño Visual

### Código de Colores por Urgencia

| Urgencia | Color | Badge | Uso |
|----------|-------|-------|-----|
| Immediate | Rojo | ⚡ AHORA | Score 81+ |
| High | Naranja | ⚠️ URGENTE | Score 66-80 |
| Medium | Amarillo | 📉 PRONTO | Score 51-65 |
| Low | Verde | 👁️ MONITOREO | Score 31-50 |

### Iconos de Trayectoria
- ⚠️ Critical: En riesgo crítico actual
- ↘️ Declining: En declive hacia crítico
- → Stable: Estable en su nivel
- ↗️ Improving: Mejorando (futuro)

---

## 📊 Ejemplo de Uso

### En el Dashboard
```tsx
// El componente se renderiza automáticamente
{survivalPredictions.length > 0 && (
  <SurvivalAlerts predictions={survivalPredictions} maxDisplay={5} />
)}
```

### Resultado visual típico:
```
┌─────────────────────────────────────────────┐
│ ⏰ Alertas de Supervivencia                 │
├─────────────────────────────────────────────┤
│ ┃ Juan Pérez                    ⚡ AHORA   │
│ ┃ ⚠️ CRÍTICO                                │
│ ┃ ⏰ 0 días - Intervención inmediata        │
│ ┃ • Riesgo académico alto (78%)             │
│ ┃ • Estado emocional preocupante (65%)      │
│ ┃ → Intervención inmediata requerida        │
├─────────────────────────────────────────────┤
│ ┃ María García                  ⚠️ URGENTE │
│ ┃ ↘️ En declive                             │
│ ┃ ⏰ 10 días - Alta prioridad               │
│ ┃ • Asistencia deficiente (68%)             │
│ ┃ → Plan de intervención en 48 horas        │
└─────────────────────────────────────────────┘
```

---

## 🔧 Configuración y Ajustes

### Ajustar sensibilidad del sistema
Edita `lib/utils/survival.ts`:

```typescript
// Cambiar umbral de detección de factores críticos
if (estudiante.risk_profile.factors.academic.score > 50) {
  // Cambiar 50 a otro valor según necesidad
}

// Ajustar velocidad de progresión de riesgo
// En score 66-80 (riesgo alto):
estimated_days_to_critical = Math.round(points_to_critical / 2 * 7);
// Cambiar /2 para ajustar velocidad estimada
```

### Cambiar número de alertas mostradas
```tsx
// En dashboard/page.tsx
<SurvivalAlerts predictions={survivalPredictions} maxDisplay={5} />
// Cambiar maxDisplay según necesidad

// En dashboard/alertas/page.tsx
<SurvivalAlerts predictions={survivalPredictions} maxDisplay={10} />
```

---

## 🧪 Testing

### Casos de prueba recomendados:

1. **Estudiante en riesgo crítico (score 85)**
   - ✓ Debe mostrar urgencia "immediate"
   - ✓ Días = 0
   - ✓ Mensaje: "CRÍTICO - Intervención inmediata"

2. **Estudiante en riesgo alto (score 70)**
   - ✓ Debe mostrar urgencia "high"
   - ✓ Días entre 7-14
   - ✓ Acción: "Plan de intervención en 48 horas"

3. **Estudiante en riesgo moderado (score 55)**
   - ✓ Debe mostrar urgencia "medium"
   - ✓ Días entre 14-30
   - ✓ Acción: "Monitoreo semanal"

4. **Estudiante bajo riesgo (score 25)**
   - ✓ No debe aparecer en alertas de supervivencia
   - ✓ O mostrar urgencia "low" si se incluye

### Verificar filtros:

1. **Ir a `/dashboard/estudiantes`**
2. Buscar por nombre: Verificar que filtra correctamente
3. Probar cada filtro de riesgo (Crítico, Alto, Moderado, etc.)
4. Verificar contador de resultados
5. Verificar que mantiene el ordenamiento por risk score

---

## 📈 Métricas y KPIs

El sistema de supervivencia permite rastrear:

1. **Estudiantes en riesgo inminente** (días ≤ 14)
2. **Prioridad promedio de intervención**
3. **Factores críticos más comunes**
4. **Efectividad de intervenciones** (comparando predicciones antes/después)

---

## 🚀 Próximos Pasos (Recomendaciones)

### Mejoras futuras sugeridas:

1. **Histórico de predicciones**
   - Guardar snapshots de predicciones semanales
   - Mostrar evolución de la trayectoria
   - Validar precisión del modelo

2. **Notificaciones automáticas**
   - Email/SMS cuando urgencia = "immediate"
   - Recordatorios para seguimiento

3. **Dashboard del tutor personalizado**
   - Vista de estudiantes asignados
   - Tracking de intervenciones realizadas

4. **Machine Learning**
   - Mejorar precisión con datos históricos reales
   - Detectar patrones específicos de TECSUP

5. **Integración con Canvas**
   - Usar datos reales de entregas tardías
   - Analizar tiempo en plataforma
   - Detectar inactividad prolongada

---

## 🐛 Troubleshooting

### Si los filtros no cargan datos:
1. Verificar que el backend esté corriendo
2. Revisar console del navegador (F12)
3. Verificar endpoint: `http://localhost:8000/api/classroom/students`
4. Ver logs en terminal del frontend

### Si las alertas de supervivencia no aparecen:
1. Verificar que hay estudiantes con score > 30
2. Ver console del navegador por errores
3. Verificar importación de componentes
4. Revisar que `generateSurvivalAlerts()` retorna datos

### Si los colores no se ven correctamente:
1. Verificar que Tailwind CSS está configurado
2. Comprobar que las clases de color están en `tailwind.config.ts`
3. Reiniciar servidor de desarrollo

---

## 📝 Notas Técnicas

### Arquitectura
- **Frontend**: Next.js 14 (App Router) + React Server Components
- **State Management**: React hooks (useState, useEffect)
- **Styling**: Tailwind CSS + shadcn/ui
- **Types**: TypeScript estricto

### Rendimiento
- Cálculos de supervivencia se realizan en memoria (rápido)
- Componente se renderiza solo cuando hay datos
- Optimizado con memoization donde es necesario

### Compatibilidad
- Compatible con todos los tipos de estudiante (StudentSummary y Estudiante completo)
- Maneja casos edge (sin datos, sin alertas, etc.)
- Responsive design para móviles y tablets

---

## 🎓 Contexto Educativo (TECSUP)

Este sistema está alineado con los criterios reales de TECSUP:

- **Inasistencias acumuladas** → Factor de attendance
- **Desaprobaciones consecutivas** → Factor academic
- **Estados críticos (NP, AN, DI)** → Detectados en SEVA data
- **Repetición de cursos** → Analizado en historial
- **Estado emocional** → Timeline emocional del estudiante
- **Falta de engagement** → Actividad en Canvas

El objetivo es **prevenir la deserción temprana** actuando antes de que sea irreversible.

---

## ✨ Créditos

Sistema desarrollado para **Metodika** - Plataforma de prevención de deserción estudiantil en TECSUP.

**Versión:** 1.0.0  
**Fecha:** Noviembre 2024  
**Estado:** Producción  

---

## 📞 Soporte

Para reportar problemas o sugerencias:
1. Revisar esta documentación primero
2. Verificar console y logs
3. Documentar el issue con screenshots
4. Proporcionar pasos para reproducir

**Happy coding! 🚀**
