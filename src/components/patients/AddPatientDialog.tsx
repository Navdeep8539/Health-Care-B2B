import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddPatientDialogProps {
  onPatientAdded: () => void;
}

export const AddPatientDialog = ({ onPatientAdded }: AddPatientDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    condition: "",
    status: "Stable",
    doctor: "",
    department: "General",
    contact: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.age || !form.condition || !form.doctor || !form.contact) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("patients").insert({
      name: form.name,
      age: parseInt(form.age, 10),
      gender: form.gender,
      condition: form.condition,
      status: form.status,
      doctor: form.doctor,
      department: form.department,
      contact: form.contact,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to add patient: " + error.message);
      return;
    }

    toast.success(`Patient "${form.name}" added successfully.`);
    setForm({ name: "", age: "", gender: "Male", condition: "", status: "Stable", doctor: "", department: "General", contact: "" });
    setOpen(false);
    onPatientAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Fill in the patient details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Full name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="age">Age *</Label>
              <Input id="age" type="number" value={form.age} onChange={(e) => handleChange("age", e.target.value)} placeholder="Age" />
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
            <Label htmlFor="condition">Condition *</Label>
            <Input id="condition" value={form.condition} onChange={(e) => handleChange("condition", e.target.value)} placeholder="Medical condition" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="doctor">Doctor *</Label>
              <Input id="doctor" value={form.doctor} onChange={(e) => handleChange("doctor", e.target.value)} placeholder="Attending doctor" />
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
            <Label htmlFor="contact">Contact *</Label>
            <Input id="contact" value={form.contact} onChange={(e) => handleChange("contact", e.target.value)} placeholder="+1-555-0000" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Patient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
