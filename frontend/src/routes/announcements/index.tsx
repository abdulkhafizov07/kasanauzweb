import { AnnouncementsPoster } from "@/components/web/announcements/poster";
import { ServicesAnnouncementWidget } from "@/components/web/announcements/service-card";
import { WorksAnnouncementWidget } from "@/components/web/announcements/work-card";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/announcements/")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    document.title = "E`lonlar - Kasana.UZ.uz";
  });

  return (
    <>
      <AnnouncementsPoster />

      <WorksAnnouncementWidget />
      <ServicesAnnouncementWidget />

      <div className="mb-4"></div>
    </>
  );
}
