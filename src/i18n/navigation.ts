import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappers de navegação cientes de locale (Link, useRouter, etc.)
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
