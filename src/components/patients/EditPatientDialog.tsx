import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Patient } from "@/types/patient";

interface EditPatientDialogProps {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientUpdated: () => void;
}

export const EditPatientDialog = ({ patient, open, onOpenChange, onPatientUpdated }: EditPatientDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: patient.name,
    age: String(patient.age),
    gender: patient.gender,
    condition: patient.condition,
    status: patient.status,
    doctor: patient.doctor,
    department: patient.department,
    contact: patient.contact,
  });

  useEffect(() => {
    setForm({
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender,
      condition: patient.condition,
      status: patient.status,
      doctor: patient.doctor,
      department: patient.department,
      contact: patient.contact,
    });
  }, [patient]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.age || !form.condition || !form.doctor || !form.contact) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("patients")
      .update({
        name: form.name,
        age: parseInt(form.age, 10),
        gender: form.gender,
        condition: form.condition,
        status: form.status,
        doctor: form.doctor,
        department: form.department,
        contact: form.contact,
      })
      .eq("id", patient.id);

    setLoading(false);

    if (error) {
      toast.error("Failed to update patient: " + error.message);
      return;
    }

    toast.success(`Patient "${form.name}" updated successfully.`);
    onOpenChange(false);
    onPatientUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>Update the patient details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="edit-name">Name *</Label>
              <Input id="edit-name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-age">Age *</Label>
              <Input id="edit-age" type="number" value={form.age} onChange={(e) => handleChange("age", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => handleChange("gender", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stable">Stable</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Recovering">Recovering</SelectItem>
                  <SelectItem value="Discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-condition">Condition *</Label>
            <Input id="edit-condition" value={form.condition} onChange={(e) => handleChange("condition", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="edit-doctor">Doctor *</Label>
              <Input id="edit-doctor" value={form.doctor} onChange={(e) => handleChange("doctor", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Department</Label>
              <Select value={form.department} onValueChange={(v) => handleChange("department", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["General", "Cardiology", "Neurology", "Oncology", "Orthopedics", "Pulmonology", "Surgery", "Endocrinology", "Gastroenterology", "Nephrology", "Psychiatry", "Rheumatology", "Urology"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-contact">Contact *</Label>
            <Input id="edit-contact" value={form.contact} onChange={(e) => handleChange("contact", e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
