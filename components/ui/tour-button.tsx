"use client";

import { HelpCircle, BookOpen, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  startDashboardTour,
  startEstudiantesTour,
  startStudentProfileTour,
  startAnalisisTour,
  startAlertasTour,
  startConfiguracionTour,
  resetAllTours,
} from "@/lib/utils/tour-guides";

interface TourButtonProps {
  page: "dashboard" | "estudiantes" | "student-profile" | "analisis" | "alertas" | "configuracion";
}

export function TourButton({ page }: TourButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleStartTour = () => {
    setShowMenu(false);
    switch (page) {
      case "dashboard":
        startDashboardTour();
        break;
      case "estudiantes":
        startEstudiantesTour();
        break;
      case "student-profile":
        startStudentProfileTour();
        break;
      case "analisis":
        startAnalisisTour();
        break;
      case "alertas":
        startAlertasTour();
        break;
      case "configuracion":
        startConfiguracionTour();
        break;
    }
  };

  const tourTitles = {
    dashboard: "Dashboard Principal",
    estudiantes: "Lista de Estudiantes",
    "student-profile": "Perfil del Estudiante",
    analisis: "Análisis y Heatmaps",
    alertas: "Centro de Alertas",
    configuracion: "Configuración",
  };

  return (
    <>
      {/* Botón flotante de ayuda */}
      <div className="fixed bottom-6 right-6 z-50">
        {showMenu && (
          <div className="absolute bottom-16 right-0 bg-card border rounded-lg shadow-xl p-4 w-72 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Tutorial Interactivo
              </h3>
              <button
                onClick={() => setShowMenu(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              ¿Primera vez en {tourTitles[page]}? Te mostramos cómo funciona.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleStartTour}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                🚀 Iniciar Tutorial
              </button>
              <button
                onClick={() => {
                  resetAllTours();
                  setShowMenu(false);
                  setTimeout(() => {
                    alert("Todos los tutoriales se han reiniciado. ¡Puedes verlos de nuevo!");
                  }, 100);
                }}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
              >
                🔄 Reiniciar Todos los Tutoriales
              </button>
            </div>
            <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
              💡 Presiona ESC en cualquier momento para salir del tutorial
            </div>
          </div>
        )}
        
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all hover:scale-110",
            showMenu 
              ? "bg-secondary text-secondary-foreground" 
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          title="Ayuda y Tutorial"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
