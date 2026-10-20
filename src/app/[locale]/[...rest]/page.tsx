import { notFound } from "next/navigation";

// Qualquer rota desconhecida sob [locale] cai no not-found localizado.
export default function CatchAllNotFound() {
  notFound();
}
