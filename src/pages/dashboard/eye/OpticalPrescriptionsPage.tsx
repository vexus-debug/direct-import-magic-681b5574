import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PatientPicker } from "@/components/dashboard/eye/PatientPicker";
import {
  useOpticalPrescriptions, useSaveOpticalPrescription, useDeleteOpticalPrescription,
  RX_TYPES, patientName, formatRxEye, type OpticalPrescription,
} from "@/hooks/eye/useEye";
import { Plus, Trash2, Glasses } from "lucide-react";

const today = () => new Date().toISOString().slice(0, 10);
const inTwoYears = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 2);
  return d.toISOString().slice(0, 10);
};

const blank = {
  id: undefined as string | undefined,
  patient_id: "",
  rx_type: "Distance",
  issue_date: today(),
  expiry_date: inTwoYears(),
  sphere_od: "", cylinder_od: "", axis_od: "", add_od: "", prism_od: "",
  sphere_os: "", cylinder_os: "", axis_os: "", add_os: "", prism_os: "",
  pd: "", base_curve: "", diameter: "", lens_brand: "", notes: "",
};

type Form = typeof blank;
const num = (v: string) => (v === "" ? null : Number(v));
const str = (v: string) => (v.trim() === "" ? null : v.trim());

export default function OpticalPrescriptionsPage() {
  const { data: rxs = [], isLoading } = useOpticalPrescriptions();
  const save = useSaveOpticalPrescription();
  const remove = useDeleteOpticalPrescription();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(blank);
  const set = (k: keyof Form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const startNew = () => { setForm({ ...blank }); setOpen(true); };

  const startEdit = (r: OpticalPrescription) => {
    setForm({
      id: r.id,
      patient_id: r.patient_id,
      rx_type: r.rx_type || "Distance",
      issue_date: r.issue_date?.slice(0, 10) || today(),
      expiry_date: r.expiry_date?.slice(0, 10) || "",
      sphere_od: r.sphere_od?.toString() || "", cylinder_od: r.cylinder_od?.toString() || "",
      axis_od: r.axis_od?.toString() || "", add_od: r.add_od?.toString() || "", prism_od: r.prism_od || "",
      sphere_os: r.sphere_os?.toString() || "", cylinder_os: r.cylinder_os?.toString() || "",
      axis_os: r.axis_os?.toString() || "", add_os: r.add_os?.toString() || "", prism_os: r.prism_os || "",
      pd: r.pd?.toString() || "", base_curve: r.base_curve?.toString() || "",
      diameter: r.diameter?.toString() || "", lens_brand: r.lens_brand || "", notes: r.notes || "",
    });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.patient_id) return;
    await save.mutateAsync({
      id: form.id,
      patient_id: form.patient_id,
      rx_type: form.rx_type,
      issue_date: form.issue_date,
      expiry_date: form.expiry_date || null,
      sphere_od: num(form.sphere_od), cylinder_od: num(form.cylinder_od), axis_od: num(form.axis_od),
      add_od: num(form.add_od), prism_od: str(form.prism_od),
      sphere_os: num(form.sphere_os), cylinder_os: num(form.cylinder_os), axis_os: num(form.axis_os),
      add_os: num(form.add_os), prism_os: str(form.prism_os),
      pd: num(form.pd), base_curve: num(form.base_curve), diameter: num(form.diameter),
      lens_brand: str(form.lens_brand), notes: str(form.notes),
    });
    setOpen(false);
  };

  const eyeFields = (side: "od" | "os", title: string) => (
    <div className="rounded-md border border-border/40 p-3">
      <p className="mb-2 text-sm font-medium">{title}</p>
      <div className="grid gap-2 sm:grid-cols-5">
        {(["sphere", "cylinder", "axis", "add"] as const).map((f) => (
          <div key={f}>
            <Label className="capitalize">{f}</Label>
            <Input
              type="number"
              step="0.25"
              value={form[`${f}_${side}` as keyof Form] as string}
              onChange={(e) => set(`${f}_${side}` as keyof Form, e.target.value)}
            />
          </div>
        ))}
        <div>
          <Label>Prism</Label>
          <Input
            value={form[`prism_${side}` as keyof Form] as string}
            onChange={(e) => set(`prism_${side}` as keyof Form, e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Optical Prescriptions" description="Issue and track spectacle prescriptions">
        <Button size="sm" onClick={startNew}><Plus className="mr-2 h-4 w-4" /> New Prescription</Button>
      </PageHeader>

      <Card className="glass-card">
        <CardHeader><CardTitle className="text-base">Prescriptions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && rxs.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">No prescriptions issued yet.</p>
          )}
          {rxs.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/40 px-3 py-2">
              <button className="flex-1 text-left" onClick={() => startEdit(r)}>
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Glasses className="h-3.5 w-3.5 text-muted-foreground" /> {patientName(r)}
                </p>
                <p className="text-xs text-muted-foreground">
                  OD {formatRxEye(r.sphere_od, r.cylinder_od, r.axis_od, r.add_od)} · OS {formatRxEye(r.sphere_os, r.cylinder_os, r.axis_os, r.add_os)}
                </p>
              </button>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{r.rx_type || "Distance"}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(r.issue_date).toLocaleDateString()}</span>
                <Button size="icon" variant="ghost" onClick={() => remove.mutate(r.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit prescription" : "New prescription"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {!form.id && <PatientPicker value={form.patient_id} onChange={(id) => set("patient_id", id)} />}
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <Label>Type</Label>
                <Select value={form.rx_type} onValueChange={(v) => set("rx_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{RX_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Issued</Label>
                <Input type="date" value={form.issue_date} onChange={(e) => set("issue_date", e.target.value)} />
              </div>
              <div>
                <Label>Expires</Label>
                <Input type="date" value={form.expiry_date} onChange={(e) => set("expiry_date", e.target.value)} />
              </div>
            </div>
            {eyeFields("od", "Right eye (OD)")}
            {eyeFields("os", "Left eye (OS)")}
            <div className="grid gap-2 sm:grid-cols-4">
              <div><Label>PD (mm)</Label><Input type="number" step="0.5" value={form.pd} onChange={(e) => set("pd", e.target.value)} /></div>
              <div><Label>Base curve</Label><Input type="number" step="0.1" value={form.base_curve} onChange={(e) => set("base_curve", e.target.value)} /></div>
              <div><Label>Diameter</Label><Input type="number" step="0.1" value={form.diameter} onChange={(e) => set("diameter", e.target.value)} /></div>
              <div><Label>Lens brand</Label><Input value={form.lens_brand} onChange={(e) => set("lens_brand", e.target.value)} /></div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={save.isPending || !form.patient_id}>Save prescription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
