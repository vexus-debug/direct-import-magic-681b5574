import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useOrg } from "@/hooks/useOrg";
import { useSurgeryBookings } from "@/hooks/eye/useEye";
import { useTodayFlow, usePickupOrders, useUnpaidInvoices, useFrames, useLenses, FLOW_STAGES, todayISO } from "@/hooks/eye/useEyeOps";
import { hasPageAccess } from "@/config/roleAccess";
import { Activity, Stethoscope, Glasses, CreditCard, Scissors, Package, ArrowRight } from "lucide-react";

export function EyeTodayScreen() {
  const { basePath, currentOrg } = useOrg();
  const role = currentOrg?.role || "receptionist";
  const can = (p: string) => hasPageAccess(role, p, "eye");
  const { data: flow = [] } = useTodayFlow();
  const { data: pickups = [] } = usePickupOrders();
  const { data: unpaid = [] } = useUnpaidInvoices();
  const { data: surgeries = [] } = useSurgeryBookings();
  const { data: frames = [] } = useFrames();
  const { data: lenses = [] } = useLenses();

  const active = flow.filter((f) => !["completed", "cancelled", "no_show"].includes(f.status));
  const ready = pickups.filter((o) => o.status === "ready");
  const notTold = ready.filter((o) => !o.notified_at);
  const atLab = pickups.filter((o) => o.status !== "ready");
  const todaySurg = surgeries.filter((s) => s.scheduled_date?.slice(0, 10) === todayISO() && s.status !== "cancelled");
  const lowStock = frames.filter((f) => f.quantity <= f.reorder_level).length + lenses.filter((l) => l.quantity <= l.reorder_level).length;
  const unpaidTotal = unpaid.reduce((s, i) => s + Number(i.total || 0), 0);

  const tile = (path: string, title: string, value: number | string, sub: string, Icon: any) =>
    can(path) && (
      <Link to={`${basePath}/${path}`} className="block">
        <Card className="h-full transition-colors hover:border-primary/40">
          <CardContent className="flex items-start justify-between gap-3 p-4">
            <div>
              <p className="text-xs text-muted-foreground">{title}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
            <Icon className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </Link>
    );

  return (
    <div className="space-y-6">
      <PageHeader title="Today" description={new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}>
        {can("eye/flow") && <Button size="sm" asChild><Link to={`${basePath}/eye/flow`}>Check in a patient</Link></Button>}
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tile("eye/flow", "In the clinic now", active.length, `${flow.length - active.length} finished today`, Activity)}
        {tile("eye/pickup", "Glasses ready", ready.length, `${notTold.length} not yet told · ${atLab.length} at lab`, Glasses)}
        {tile("billing", "Unpaid bills", unpaid.length, new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(unpaidTotal), CreditCard)}
        {tile("eye/surgery", "Surgeries today", todaySurg.length, todaySurg.map((s) => s.procedure_name).slice(0, 2).join(", ") || "None booked", Scissors)}
        {tile("eye/stock", "Low stock", lowStock, "Frames and lenses to reorder", Package)}
      </div>

      {can("eye/flow") && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Patient progress</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to={`${basePath}/eye/flow`}>Open board <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-5">
            {FLOW_STAGES.map((st) => {
              const list = active.filter((f) => f.stage === st.key);
              return (
                <div key={st.key} className="rounded-md border border-border/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{st.label}</span>
                    <Badge variant="secondary">{list.length}</Badge>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {list.slice(0, 4).map((f) => (
                      <li key={f.id} className="truncate">
                        {st.key === "doctor" && can("eye/visit") ? (
                          <Link className="hover:underline" to={`${basePath}/eye/visit?patient=${f.patient_id}`}>
                            <Stethoscope className="mr-1 inline h-3 w-3" />{f.patients?.first_name} {f.patients?.last_name}
                          </Link>
                        ) : <>{f.patients?.first_name} {f.patients?.last_name}</>}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
