import { createFileRoute } from "@tanstack/react-router";

// Catch-all: every path is handled by the imported app's own router, which is
// mounted once in __root so navigation never remounts it.
export const Route = createFileRoute("/$")({
  component: () => null,
});
