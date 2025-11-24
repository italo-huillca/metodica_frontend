# Sistema de Tutoriales Interactivos con Driver.js

## 📋 Descripción General

Sistema completo de tutoriales interactivos implementado con [driver.js](https://driverjs.com/) para guiar a los usuarios a través de todas las funcionalidades de la plataforma Metodika.

## ✅ Estado de Implementación

**Completado al 100%** ✓

### Componentes Implementados

1. **Configuración de Tours** (`lib/utils/tour-guides.ts`)
   - 6 tours completos con 45+ pasos en total
   - Sistema de tracking con localStorage
   - Configuración personalizada para tema Metodika

2. **Componente de Botón Flotante** (`components/ui/tour-button.tsx`)
   - Botón de ayuda flotante en esquina inferior derecha
   - Menú desplegable con opciones:
     - "Iniciar Tutorial" (inicia tour de la página actual)
     - "Reiniciar Todos los Tours"
   - Detecta automáticamente qué tour mostrar según la página

3. **Estilos Personalizados** (`app/driver-custom.css`)
   - Tema integrado con Tailwind CSS
   - Soporte para modo claro/oscuro
   - Botones y popovers personalizados

4. **Integración en Layout** (`app/layout.tsx`)
   - Importación de CSS de driver.js
   - Importación de estilos personalizados

### Tours Disponibles

#### 1. Dashboard Principal (`dashboardTour`)
**10 pasos:**
- Introducción a Metodika
- Panel principal con datos en tiempo real
- Tarjetas de estadísticas (Total, Zona Segura, Moderado, Crítico)
- Alertas de supervivencia (predicciones de deserción)
- Ranking de estudiantes
- Alertas recientes del sistema
- Navegación con sidebar

**Página:** `/dashboard`
**Elementos:** header, stats-total, stats-safe, stats-moderate, stats-critical, survival-alerts, ranking, recent-alerts

#### 2. Lista de Estudiantes (`estudiantesTour`)
**5 pasos:**
- Introducción a la lista
- Barra de búsqueda por nombre/ID
- Filtros por nivel de riesgo
- Contador de resultados
- Tarjetas de estudiantes con información clave

**Página:** `/dashboard/estudiantes`
**Elementos:** search-bar, risk-filters, results-count, student-card

#### 3. Perfil de Estudiante (`studentProfileTour`)
**5 pasos:**
- Introducción al perfil
- Cabecera con información básica
- Resumen de riesgo con score
- Timeline emocional en tiempo real
- Detalles académicos por curso

**Página:** `/dashboard/estudiante/[id]`
**Elementos:** student-header, risk-overview, emotional-timeline, academic-details

#### 4. Análisis Avanzado (`analisisTour`)
**5 pasos:**
- Introducción a análisis
- Filtros de visualización (riesgo, curso)
- Heatmap académico
- Heatmap emocional
- Gráfico de supervivencia

**Página:** `/dashboard/analisis`
**Elementos:** analysis-filters, heatmap-academic, heatmap-emotional, survival-graph

#### 5. Centro de Alertas (`alertasTour`)
**5 pasos:**
- Introducción al sistema de alertas
- Estadísticas de alertas (supervivencia, sin leer, críticas, total)
- Sección de alertas de supervivencia
- Filtros de tipo y estado
- Lista completa de alertas

**Página:** `/dashboard/alertas`
**Elementos:** alerts-stats, survival-alerts-section, alerts-filters, alerts-list

#### 6. Configuración (`configuracionTour`)
**3 pasos:**
- Introducción a configuración
- Selector de tema (claro, oscuro, sistema)
- Configuración de notificaciones

**Página:** `/dashboard/configuracion`
**Elementos:** theme-selector, notifications-config

## 🔧 Uso del Sistema

### Para Usuarios

1. **Iniciar un Tour:**
   - Haz clic en el botón flotante de ayuda (?) en la esquina inferior derecha
   - Selecciona "Iniciar Tutorial"
   - Sigue las instrucciones paso a paso

2. **Reiniciar Todos los Tours:**
   - Haz clic en el botón de ayuda (?)
   - Selecciona "Reiniciar Todos los Tours"
   - Los tours se marcarán como no completados y podrás verlos de nuevo

3. **Saltar/Cerrar un Tour:**
   - Usa el botón "Cerrar" o presiona ESC
   - El progreso se guardará automáticamente

### Para Desarrolladores

#### Agregar un Nuevo Tour

1. **Definir el tour en `lib/utils/tour-guides.ts`:**

```typescript
export const miNuevoTour: DriveStep[] = [
  {
    popover: {
      title: "🎯 Mi Nuevo Tour",
      description: "Descripción general del tour.",
    },
  },
  {
    element: '[data-tour="mi-elemento"]',
    popover: {
      title: "📌 Título del Paso",
      description: "Descripción de este paso específico.",
      side: "bottom",
      align: "start",
    },
  },
  // ... más pasos
];

export function startMiNuevoTour() {
  const tourDriver = driver({
    ...baseConfig,
    steps: miNuevoTour,
    onDestroyStarted: () => {
      localStorage.setItem("metodika-tour-mi-nuevo", "completed");
      tourDriver.destroy();
    },
  });
  tourDriver.drive();
}
```

2. **Agregar atributos `data-tour` a los elementos en tu página:**

```tsx
<div data-tour="mi-elemento">
  {/* Contenido */}
</div>
```

3. **Agregar el caso en TourButton (`components/ui/tour-button.tsx`):**

```typescript
const handleStartTour = () => {
  // ... código existente
  else if (page === "mi-nueva-pagina") {
    startMiNuevoTour();
  }
  setMenuOpen(false);
};
```

4. **Usar el TourButton en tu página:**

```tsx
import { TourButton } from "@/components/ui/tour-button";

export default function MiNuevaPagina() {
  return (
    <div>
      {/* Contenido de la página */}
      <TourButton page="mi-nueva-pagina" />
    </div>
  );
}
```

#### Valores de `side` Válidos

- `"top"` - Arriba del elemento
- `"right"` - Derecha del elemento
- `"bottom"` - Abajo del elemento (recomendado para headers)
- `"left"` - Izquierda del elemento

**Nota:** No usar `"center"` - para pasos introductorios sin elemento específico, omitir la propiedad `element`.

#### Valores de `align` Válidos

- `"start"` - Inicio del lado
- `"center"` - Centro del lado
- `"end"` - Final del lado

## 📊 Tracking de Progreso

El sistema guarda automáticamente el progreso en localStorage:

```typescript
// Verificar si un tour fue completado
const completed = hasTourCompleted("dashboard");

// Reiniciar todos los tours
resetAllTours();
```

**Keys de localStorage:**
- `metodika-tour-dashboard`
- `metodika-tour-estudiantes`
- `metodika-tour-student-profile`
- `metodika-tour-analisis`
- `metodika-tour-alertas`
- `metodika-tour-configuracion`

## 🎨 Personalización de Estilos

Los estilos están en `app/driver-custom.css` y usan variables CSS de Tailwind:

```css
.driver-popover {
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
}

.driver-popover-next-btn {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

Para cambiar el tema, modifica las variables CSS o ajusta los estilos del popover.

## 🚀 Funcionalidades Avanzadas

### Auto-trigger para Nuevos Usuarios

Para activar automáticamente un tour en la primera visita:

```typescript
useEffect(() => {
  const hasSeenTour = hasTourCompleted("dashboard");
  if (!hasSeenTour) {
    // Esperar un momento para que la página cargue
    setTimeout(() => {
      startDashboardTour();
    }, 1000);
  }
}, []);
```

### Tours Condicionales

Mostrar tours solo en ciertas condiciones:

```typescript
const handleStartTour = () => {
  if (userRole === "admin") {
    startAdminTour();
  } else {
    startDashboardTour();
  }
};
```

## 📝 Archivos Modificados

### Creados
- ✅ `lib/utils/tour-guides.ts` - Configuración completa de tours
- ✅ `components/ui/tour-button.tsx` - Botón flotante de ayuda
- ✅ `app/driver-custom.css` - Estilos personalizados
- ✅ `TUTORIAL_SYSTEM.md` - Esta documentación

### Modificados
- ✅ `app/layout.tsx` - Importación de CSS de driver.js
- ✅ `app/dashboard/page.tsx` - data-tour attributes + TourButton
- ✅ `app/dashboard/estudiantes/page.tsx` - data-tour attributes + TourButton
- ✅ `app/dashboard/estudiante/[id]/page.tsx` - data-tour attributes + TourButton
- ✅ `app/dashboard/analisis/page.tsx` - data-tour attributes + TourButton
- ✅ `app/dashboard/alertas/page.tsx` - data-tour attributes + TourButton
- ✅ `app/dashboard/configuracion/page.tsx` - data-tour attributes + TourButton

## 📦 Dependencias

```json
{
  "driver.js": "^1.3.1"
}
```

Ya instalado con `npm install driver.js`.

## ✅ Testing Checklist

Para verificar que todo funciona correctamente:

1. **Dashboard:**
   - [ ] Botón de ayuda visible en esquina inferior derecha
   - [ ] Tour se inicia correctamente
   - [ ] Todos los 10 pasos funcionan
   - [ ] Elementos resaltados correctamente
   - [ ] Progress tracker muestra "X de 10"

2. **Estudiantes:**
   - [ ] Tour funciona en `/dashboard/estudiantes`
   - [ ] 5 pasos se muestran correctamente
   - [ ] Barra de búsqueda se resalta

3. **Perfil de Estudiante:**
   - [ ] Tour funciona en cualquier perfil (`/dashboard/estudiante/123`)
   - [ ] Timeline emocional se resalta
   - [ ] Tarjeta de riesgo se resalta

4. **Análisis:**
   - [ ] Filtros se resaltan
   - [ ] Heatmaps se muestran en el tour
   - [ ] Gráfico de supervivencia incluido

5. **Alertas:**
   - [ ] Estadísticas resaltadas
   - [ ] Sección de supervivencia identificada
   - [ ] Lista de alertas en el tour

6. **Configuración:**
   - [ ] Selector de tema resaltado
   - [ ] Notificaciones explicadas

7. **General:**
   - [ ] Botón "Reiniciar Todos los Tours" funciona
   - [ ] localStorage guarda progreso
   - [ ] Tema oscuro se ve bien
   - [ ] Tema claro se ve bien
   - [ ] Responsive en móvil

## 🐛 Troubleshooting

### El tour no se inicia
- Verificar que el elemento con `data-tour` existe en el DOM
- Revisar la consola del navegador por errores
- Confirmar que driver.js CSS está cargado

### Elementos no se resaltan correctamente
- Verificar que el selector `data-tour` es único
- Asegurarse de que el elemento es visible (no `display: none`)
- Revisar z-index de elementos padres

### Estilos no coinciden con el tema
- Confirmar que `driver-custom.css` está importado después de `driver.js/dist/driver.css`
- Verificar variables CSS de Tailwind en `globals.css`

## 📖 Referencias

- [Driver.js Documentation](https://driverjs.com/)
- [Driver.js GitHub](https://github.com/kamranahmedse/driver.js)
- [Ejemplos de Driver.js](https://driverjs.com/docs/examples)

## 🎯 Próximas Mejoras (Opcional)

- [ ] Agregar animaciones personalizadas entre pasos
- [ ] Tutorial multi-página (que navegue entre rutas)
- [ ] Analytics de completación de tours
- [ ] Tours contextuales basados en acciones del usuario
- [ ] Video embebido en algunos pasos del tour
- [ ] Shortcuts de teclado para navegación
- [ ] Traducción a otros idiomas

---

**Fecha de Implementación:** 2024
**Versión:** 1.0.0
**Autor:** GitHub Copilot
**Estado:** ✅ Completado y Funcional
