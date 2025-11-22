"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle className="h-6 w-6" />
            <CardTitle>Algo salió mal</CardTitle>
          </div>
          <CardDescription>
            Ocurrió un error inesperado al cargar esta página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-mono">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="flex-1 gap-2"
              variant="default"
            >
              <RefreshCcw className="h-4 w-4" />
              Intentar de nuevo
            </Button>
            <Button
              onClick={() => window.location.href = "/dashboard"}
              variant="outline"
              className="flex-1"
            >
              Ir al Dashboard
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Si el problema persiste, por favor contacta al administrador
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
