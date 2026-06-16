"use client";

import { useEffect, useState } from "react";
import { getProjetos, fetchProjetos, type Projeto } from "@/lib/content";

/**
 * Projetos para a galeria pública. Começa com os mocks (render no servidor),
 * e troca pelos dados reais do Firestore assim que chegam — sem flash de vazio.
 */
export function useProjetos(): Projeto[] {
  const [projetos, setProjetos] = useState<Projeto[]>(getProjetos());

  useEffect(() => {
    let alive = true;
    fetchProjetos().then((list) => {
      if (alive) setProjetos(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  return projetos;
}
