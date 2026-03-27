import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePatientStore } from "@/stores/patientStore";
import { useUIStore } from "@/stores/uiStore";
import { PatientGrid } from "@/components/patients/PatientGrid";
import { PatientList } from "@/components/patients/PatientList";
import { SearchBar } from "@/components/common/SearchBar";
import { ViewToggle } from "@/components/common/ViewToggle";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Patients = () => {
  const {
    setPatients,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    filteredPatients,
    patients,
  } = usePatientStore();
  const { viewMode, setViewMode } = useUIStore();

  const fetchPatients = useCallback(async () => {
    const { data } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });
    setPatients(data ?? []);
  }, [setPatients]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const departments = [...new Set(patients.map((p) => p.department))];
  const filtered = filteredPatients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">Patients</h1>
          <p className="text-muted-foreground text-sm">
            Manage and view all patient records.
          </p>
        </div>
        <AddPatientDialog onPatientAdded={fetchPatients} />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 w-full sm:max-w-sm">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search patients, doctors, conditions..."
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Stable">Stable</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="Recovering">Recovering</SelectItem>
              <SelectItem value="Discharged">Discharged</SelectItem>
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ViewToggle mode={viewMode} onToggle={setViewMode} />
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Showing {filtered.length} of {patients.length} patients
        </p>
        {viewMode === "grid" ? (
          <PatientGrid patients={filtered} onRefresh={fetchPatients} />
        ) : (
          <PatientList patients={filtered} onRefresh={fetchPatients} />
        )}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
