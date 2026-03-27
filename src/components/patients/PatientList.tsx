import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Patient, PatientStatus } from "@/types/patient";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditPatientDialog } from "./EditPatientDialog";
import { DeletePatientDialog } from "./DeletePatientDialog";

interface PatientListProps {
  patients: Patient[];
  onRefresh: () => void;
}

export const PatientList = ({ patients, onRefresh }: PatientListProps) => {
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);

  return (
    <>
      <div className="rounded-lg border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Admitted</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell>
                  <StatusBadge status={patient.status as PatientStatus} />
                </TableCell>
                <TableCell>Dr. {patient.doctor}</TableCell>
                <TableCell>
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                    {patient.department}
                  </span>
                </TableCell>
                <TableCell>{new Date(patient.admission_date).toLocaleDateString()}</TableCell>
                <TableCell>{patient.contact}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
