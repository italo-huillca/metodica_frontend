"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { Palette, Bell, Shield, Settings, Database, TrendingUp, Loader2, CheckCircle2, XCircle, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { canvasService } from "@/lib/api/services";

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

  // Estados para Canvas
  const [canvasToken, setCanvasToken] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<{
    authenticated: boolean;
    user_id?: string;
    name?: string;
    email?: string;
    last_sync?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verificar si ya hay una sesión activa
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const userId = localStorage.getItem("canvas_user_id");
    if (!userId) {
      setAuthStatus({ authenticated: false });
      return;
    }

    try {
      const status = await canvasService.getStatus(userId);
      setAuthStatus(status);
    } catch (error) {
      console.error("Error verificando estado de Canvas:", error);
      setAuthStatus({ authenticated: false });
    }
  };

  const handleAuthenticate = async () => {
    if (!canvasToken.trim()) {
      setError("Por favor ingresa tu token de Canvas");
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      const response = await canvasService.authenticate(canvasToken);
      
      // Guardar user_id en localStorage
      localStorage.setItem("canvas_user_id", response.user_id);
      localStorage.setItem("canvas_user_name", response.name);
      localStorage.setItem("canvas_user_email", response.email);

      setAuthStatus({
        authenticated: true,
        user_id: response.user_id,
        name: response.name,
        email: response.email,
      });

      setCanvasToken(""); // Limpiar el input
    } catch (error: any) {
      console.error("Error autenticando con Canvas:", error);
      setError(error.message || "Error al autenticar con Canvas. Verifica tu token.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    const userId = localStorage.getItem("canvas_user_id");
    if (userId) {
      try {
        await canvasService.logout(userId);
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }
    localStorage.removeItem("canvas_user_id");
    localStorage.removeItem("canvas_user_name");
    localStorage.removeItem("canvas_user_email");
    setAuthStatus({ authenticated: false });
  };

  const handleSync = async () => {
    const userId = localStorage.getItem("canvas_user_id");
    if (!userId) return;

    try {
      await canvasService.sync(userId);
      await checkAuthStatus();
      alert("Datos sincronizados correctamente");
    } catch (error) {
      console.error("Error sincronizando datos:", error);
      alert("Error al sincronizar datos de Canvas");
    }
  };

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

      {/* Integración con Canvas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <CardTitle>Integración con Canvas</CardTitle>
          </div>
          <CardDescription>
            Conecta tu cuenta de Canvas LMS para obtener datos académicos en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authStatus?.authenticated ? (
            // Usuario autenticado
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-100">Conectado a Canvas</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {authStatus.name} ({authStatus.email})
                  </p>
                  {authStatus.last_sync && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Última sincronización: {new Date(authStatus.last_sync).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSync} variant="outline">
                  Sincronizar Datos
                </Button>
                <Button onClick={handleLogout} variant="destructive">
                  Desconectar
                </Button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Nota:</strong> Tus datos reales de Canvas están siendo utilizados 
                  para el cálculo de riesgo. El sistema analizará tus tareas pendientes, 
                  participación en cursos y otros indicadores académicos.
                </p>
              </div>
            </div>
          ) : (
            // Usuario no autenticado
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="canvas-token" className="text-sm font-medium">
                  Token de Canvas
                </label>
                <input
                  id="canvas-token"
                  type="password"
                  value={canvasToken}
                  onChange={(e) => setCanvasToken(e.target.value)}
                  placeholder="Ingresa tu token de Canvas"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  disabled={isAuthenticating}
                  onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()}
                />
                <p className="text-xs text-muted-foreground">
                  Para obtener tu token: Canvas → Account → Settings → New Access Token
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
                </div>
              )}

              <Button 
                onClick={handleAuthenticate} 
                disabled={isAuthenticating}
                className="w-full"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  "Conectar con Canvas"
                )}
              </Button>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-semibold mb-2">¿Cómo obtener mi token?</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Inicia sesión en Canvas (tecsup.instructure.com)</li>
                  <li>Ve a Account → Settings</li>
                  <li>Busca la sección &quot;Approved Integrations&quot;</li>
                  <li>Haz clic en &quot;+ New Access Token&quot;</li>
                  <li>Dale un nombre (ej: &quot;Metodica&quot;) y genera el token</li>
                  <li>Copia el token y pégalo aquí</li>
                </ol>
              </div>
            </div>
          )}
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
              <Shield className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="font-medium text-sm mb-1">Gestión de Cuenta</p>
              <p className="text-xs text-muted-foreground">
                Actualización de perfil y seguridad
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <Database className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="font-medium text-sm mb-1">Exportar Datos</p>
              <p className="text-xs text-muted-foreground">
                Descarga reportes en PDF y Excel
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
