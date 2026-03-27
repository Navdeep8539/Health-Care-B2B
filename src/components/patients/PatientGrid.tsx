import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Patient, PatientStatus } from "@/types/patient";
import { Calendar, Phone, Stethoscope, User, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditPatientDialog } from "./EditPatientDialog";
import { DeletePatientDialog } from "./DeletePatientDialog";

interface PatientGridProps {
  patients: Patient[];
  onRefresh: () => void;
}

export const PatientGrid = ({ patients, onRefresh }: PatientGridProps) => {
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {patient.age}y • {patient.gender}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={patient.status as PatientStatus} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditPatient(patient)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeletePatient(patient)} className="text-destructive focus:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium text-primary">{patient.condition}</p>
              <div className="space-y-1.5 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-3.5 w-3.5" />
                  <span>Dr. {patient.doctor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(patient.admission_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{patient.contact}</span>
                </div>
              </div>
              <div className="pt-1">
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                  {patient.department}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editPatient && (
        <EditPatientDialog
          patient={editPatient}
          open={!!editPatient}
          onOpenChange={(open) => !open && setEditPatient(null)}
          onPatientUpdated={onRefresh}
        />
      )}
      {deletePatient && (
        <DeletePatientDialog
          patient={deletePatient}
          open={!!deletePatient}
          onOpenChange={(open) => !open && setDeletePatient(null)}
          onPatientDeleted={onRefresh}
        />
      )}
    </>
  );
};
