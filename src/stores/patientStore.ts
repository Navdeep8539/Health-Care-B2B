import { create } from "zustand";
import type { Patient } from "@/types/patient";

interface PatientState {
  patients: Patient[];
  searchQuery: string;
  statusFilter: string;
  departmentFilter: string;
  setPatients: (patients: Patient[]) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDepartmentFilter: (department: string) => void;
  filteredPatients: () => Patient[];
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  searchQuery: "",
  statusFilter: "all",
  departmentFilter: "all",
  setPatients: (patients) => set({ patients }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setDepartmentFilter: (departmentFilter) => set({ departmentFilter }),
  filteredPatients: () => {
    const { patients, searchQuery, statusFilter, departmentFilter } = get();
    return patients.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesDept =
        departmentFilter === "all" || p.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  },
}));
