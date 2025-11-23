# Metodika Frontend

Panel del tutor para la plataforma Metodika - Sistema de prevención de deserción estudiantil temprana.

## Estructura del Proyecto

```
metodica_frontend/
├── app/                          # App Router de Next.js
│   ├── dashboard/               # Dashboard principal del tutor
│   ├── estudiante/              # Vista individual del estudiante
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout raíz
│   └── page.tsx                 # Página de inicio
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes UI base
│   ├── dashboard/               # Componentes específicos del dashboard
│   └── estudiante/              # Componentes específicos del estudiante
├── lib/                         # Utilidades y configuraciones
│   ├── api/                     # Servicios de API (mock)
│   ├── supabase/                # Cliente Supabase (mock)
│   └── utils/                   # Funciones auxiliares
├── types/                       # Definiciones de TypeScript
├── hooks/                       # Custom React hooks
└── public/                      # Archivos estáticos

```

## Tecnologías

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (componentes)
- **Supabase** (autenticación y base de datos)
- **React Query** (gestión de estado asíncrono)
- **Recharts/Plotly** (visualizaciones)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Build de Producción

```bash
npm run build
npm run start
```

## Variables de Entorno

### Desarrollo Local
Crear un archivo `.env.local` copiando `.env.example`:

```bash
cp .env.example .env.local
```

Editar `.env.local` según tu entorno:

```env
# Backend API
# Producción (Railway):
NEXT_PUBLIC_API_URL=https://metodicabackend-production.up.railway.app
# Desarrollo local (descomenta la siguiente línea):
# NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Producción (Vercel)
Configurar las siguientes variables en el dashboard de Vercel:

- `NEXT_PUBLIC_API_URL`: `https://metodicabackend-production.up.railway.app`
- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima de Supabase
- `NEXT_PUBLIC_APP_URL`: URL de tu aplicación en Vercel

## Deploy en Vercel

### Opción 1: Deploy desde GitHub

1. Subir el código a GitHub
2. Ir a [Vercel](https://vercel.com)
3. Hacer clic en "New Project"
4. Importar el repositorio de GitHub
5. Configurar las variables de entorno
6. Hacer clic en "Deploy"

### Opción 2: Deploy con Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Seguir las instrucciones y configurar las variables de entorno cuando se soliciten.

## Características

### Dashboard del Tutor
- Estado emocional/académico general del salón
- Ranking de riesgo de estudiantes
- Heatmaps académicos y emocionales
- Gráficos de supervivencia
- Alertas tempranas

### Vista Individual del Estudiante
- Perfil completo
- Histórico de emociones
- Reporte académico
- Tendencia de asistencias
- Recomendaciones personalizadas

## Integración

### Backend y Servicios
- **Backend FastAPI** (Railway): Predicción de riesgo y APIs
  - Producción: https://metodicabackend-production.up.railway.app
  - Endpoints: `/api/student/emotion`, `/api/classroom/*`, `/api/canvas/*`
- **Supabase**: Base de datos y autenticación
- **Canvas LMS**: Datos académicos sincronizados

### Extensión de Chrome + n8n (Captura de Emociones)

El sistema captura emociones de estudiantes en tiempo real mediante:

**1. Extensión de Chrome**
- Se instala en el navegador del estudiante
- Aparece como widget en Canvas LMS
- Captura 6 emociones: 😊 Feliz, 😐 Normal, 😰 Estresado, 😢 Triste, 😟 Ansioso, 😤 Molesto
- Envía datos a webhook de n8n

**2. Webhook n8n**
- URL: `https://ggpacheco.app.n8n.cloud/webhook/metodika/emotion`
- Procesa y normaliza los datos
- Reenvía al backend de Railway

**3. Flujo de datos**
```
Estudiante en Canvas → Extensión Chrome → n8n Webhook → Backend Railway → Base de datos
                                                                          ↓
                                                        Dashboard del Tutor (actualización)
```

**4. Configuración n8n**
El workflow debe incluir:
- Webhook trigger (POST)
- Nodo JavaScript para normalizar datos
- HTTP Request al backend: `POST /api/student/emotion`
- Payload: `{ student_id, emotion, source, context }`

Ver documentación completa en `/docs/extension-integration.md`
