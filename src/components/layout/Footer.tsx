"use client";

import { useState, useEffect } from "react";

export function Footer() {
  const [year, setYear] = useState(2024);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-border bg-card py-10 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {year} LexBlue. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
