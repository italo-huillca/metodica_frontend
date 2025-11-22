"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { Palette, Bell, Shield, Settings, Database, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function ConfiguracionPage() {
  const [notificaciones, setNotificaciones] = useState({
    alertasAltas: true,
    alertasMedias: true,
    alertasBajas: false,
    reportesSemanales: true,
  });

  const [umbrales, setUmbrales] = useState({
    riesgoAlto: 66,
    riesgoMedio: 31,
    asistenciaMinima: 80,
    notaMinima: 13,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Ajustes y preferencias del sistema
        </p>
      </div>

      {/* Tema de la Aplicación */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Apariencia</CardTitle>
          </div>
          <CardDescription>
            Personaliza el tema visual de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">
              Selecciona el tema de tu preferencia
            </label>
            <ThemeSelector />
          </div>
          <p className="text-xs text-muted-foreground">
            El tema &quot;Sistema&quot; se ajustará automáticamente según las preferencias de tu dispositivo
          </p>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Notificaciones</CardTitle>
          </div>
          <CardDescription>
            Configura qué alertas deseas recibir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium text-sm">Alertas de Riesgo Alto</p>
                <p className="text-xs text-muted-foreground">Estudiantes con riesgo crítico de deserción</p>
              </div>
              <input
                type="checkbox"
                checked={notificaciones.alertasAltas}
                onChange={(e) => setNotificaciones({ ...notificaciones, alertasAltas: e.target.checked })}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium text-sm">Alertas de Riesgo Medio</p>
                <p className="text-xs text-muted-foreground">Estudiantes en zona de precaución</p>
              </div>
              <input
                type="checkbox"
                checked={notificaciones.alertasMedias}
                onChange={(e) => setNotificaciones({ ...notificaciones, alertasMedias: e.target.checked })}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium text-sm">Alertas de Riesgo Bajo</p>
                <p className="text-xs text-muted-foreground">Estudiantes con riesgo mínimo</p>
              </div>
              <input
                type="checkbox"
                checked={notificaciones.alertasBajas}
                onChange={(e) => setNotificaciones({ ...notificaciones, alertasBajas: e.target.checked })}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium text-sm">Reportes Semanales</p>
                <p className="text-xs text-muted-foreground">Resumen semanal del estado del salón</p>
              </div>
              <input
                type="checkbox"
                checked={notificaciones.reportesSemanales}
                onChange={(e) => setNotificaciones({ ...notificaciones, reportesSemanales: e.target.checked })}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Umbrales de Riesgo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Umbrales de Riesgo</CardTitle>
          </div>
          <CardDescription>
            Personaliza los criterios de clasificación de riesgo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Umbral de Riesgo Alto (Score mínimo)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={umbrales.riesgoAlto}
                  onChange={(e) => setUmbrales({ ...umbrales, riesgoAlto: parseInt(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-semibold w-12 text-right">{umbrales.riesgoAlto}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Umbral de Riesgo Medio (Score mínimo)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="20"
                  max="65"
                  value={umbrales.riesgoMedio}
                  onChange={(e) => setUmbrales({ ...umbrales, riesgoMedio: parseInt(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-semibold w-12 text-right">{umbrales.riesgoMedio}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Asistencia Mínima Requerida (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={umbrales.asistenciaMinima}
                  onChange={(e) => setUmbrales({ ...umbrales, asistenciaMinima: parseInt(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-semibold w-12 text-right">{umbrales.asistenciaMinima}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nota Mínima Aprobatoria
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="16"
                  value={umbrales.notaMinima}
                  onChange={(e) => setUmbrales({ ...umbrales, notaMinima: parseInt(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-semibold w-12 text-right">{umbrales.notaMinima}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <Shield className="h-3 w-3 inline mr-1" />
              Los cambios en los umbrales afectarán la clasificación de riesgo de todos los estudiantes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Próximas Configuraciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-muted-foreground">Próximamente</CardTitle>
          </div>
          <CardDescription>
            Funcionalidades adicionales en desarrollo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 bg-muted rounded-lg">
              <Database className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="font-medium text-sm mb-1">Integración con Canvas</p>
              <p className="text-xs text-muted-foreground">
                Sincronización automática de datos académicos
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <Shield className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="font-medium text-sm mb-1">Gestión de Cuenta</p>
              <p className="text-xs text-muted-foreground">
                Actualización de perfil y seguridad
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
