"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
        <div className="w-20 h-9 bg-muted-foreground/10 rounded animate-pulse" />
        <div className="w-20 h-9 bg-muted-foreground/10 rounded animate-pulse" />
        <div className="w-20 h-9 bg-muted-foreground/10 rounded animate-pulse" />
      </div>
    );
  }

  const themes = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${
              theme === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
            }
          `}
          aria-label={`Cambiar a tema ${label.toLowerCase()}`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
