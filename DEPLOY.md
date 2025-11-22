# Guía de Deploy - Metodika Frontend

## Pre-requisitos

Antes de desplegar a producción, asegúrate de tener:

- [ ] Cuenta en Vercel (https://vercel.com)
- [ ] Proyecto Supabase configurado (opcional si usarás el backend real)
- [ ] Backend FastAPI desplegado (o URLs de mock para testing)
- [ ] Repositorio Git (GitHub, GitLab, o Bitbucket)

## Checklist Pre-Deploy

### 1. Verificar Build Local

```bash
npm run build
```

Asegúrate de que no haya errores de compilación.

### 2. Configurar Variables de Entorno

Crear archivo `.env.production` o configurarlas en Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
NEXT_PUBLIC_API_URL=https://tu-backend.com
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

### 3. Revisar `.gitignore`

Asegúrate de que estos archivos NO se suban a Git:

```
node_modules/
.next/
.env
.env.local
.env*.local
```

## Despliegue en Vercel

### Método 1: Desde el Dashboard de Vercel (Recomendado)

1. **Subir código a GitHub**
   ```bash
   git add .
   git commit -m "feat: deploy to production"
   git push origin main
   ```

2. **Importar en Vercel**
   - Ir a https://vercel.com/new
   - Seleccionar el repositorio
   - Framework Preset: Next.js (auto-detectado)
   - Root Directory: `./` (dejar por defecto)

3. **Configurar Variables de Entorno**
   - En "Environment Variables", agregar:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_API_URL`
     - `NEXT_PUBLIC_APP_URL`

4. **Deploy**
   - Click en "Deploy"
   - Esperar 2-3 minutos
   - Obtener URL de producción

### Método 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy a producción
vercel --prod

# Configurar variables (primera vez)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_APP_URL production
```

## Post-Deploy

### 1. Verificar Funcionalidad

- [ ] Dashboard carga correctamente
- [ ] Navegación entre páginas funciona
- [ ] Visualizaciones se renderizan
- [ ] Responsive funciona en móvil
- [ ] No hay errores en consola del navegador

### 2. Configurar Dominio Personalizado (Opcional)

En Vercel:
1. Ir a Project Settings > Domains
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones

### 3. Monitoreo

Vercel proporciona:
- Analytics de performance
- Logs de errores
- Web Vitals

Acceder desde: Project > Analytics

## Actualizaciones Continuas

### Desarrollo → Producción

Vercel hace deploy automático cuando pushes a `main`:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

### Preview Deployments

Cada Pull Request crea un preview deployment automático.

## Troubleshooting

### Error: Build Failed

1. Verificar que `npm run build` funcione localmente
2. Revisar logs en Vercel dashboard
3. Verificar versiones de Node.js (usar Node 18+)

### Error: Variables de Entorno No Funcionan

1. Verificar que tengan el prefijo `NEXT_PUBLIC_`
2. Re-deploy después de agregar variables:
   ```bash
   vercel --prod
   ```

### Error: 404 en Rutas

1. Verificar que los archivos estén en `app/` directory
2. Next.js App Router requiere estructura específica

## Optimizaciones Adicionales

### 1. Configurar Caché

Crear `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Habilitar Analytics

En Vercel dashboard:
- Settings > Analytics > Enable

### 3. Configurar CORS (si es necesario)

Para el backend FastAPI, agregar el dominio de Vercel a CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tu-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Seguridad

- [ ] No incluir secrets en el código
- [ ] Usar variables de entorno para todas las URLs
- [ ] Habilitar HTTPS (automático en Vercel)
- [ ] Configurar CSP headers si es necesario

## Soporte

Para problemas con el deploy:
- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Next.js Docs: https://nextjs.org/docs
