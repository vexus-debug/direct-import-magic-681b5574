import { createFileRoute } from "@tanstack/react-router";

// The imported app is mounted once in __root so navigation never remounts it.
export const Route = createFileRoute("/")({
  component: () => null,
});
