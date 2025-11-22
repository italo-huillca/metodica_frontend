import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-background">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <FileQuestion className="h-6 w-6" />
            <CardTitle>Página no encontrada</CardTitle>
          </div>
          <CardDescription>
            La página que buscas no existe o ha sido movida
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <p className="text-6xl font-bold text-muted-foreground">404</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full gap-2" variant="default">
                <Home className="h-4 w-4" />
                Ir al Dashboard
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Ir al Inicio
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Verifica que la URL sea correcta o navega desde el menú principal
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
