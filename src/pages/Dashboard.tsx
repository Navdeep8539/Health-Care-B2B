import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Activity, AlertTriangle, CalendarCheck } from "lucide-react";
import { DataCard } from "@/components/common/DataCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import type { Patient, PatientStatus } from "@/types/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requestNotificationPermission, showNotification } from "@/services/notifications";
import { Bell } from "lucide-react";

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });
      setPatients(data ?? []);
      setLoading(false);
    };
    fetchPatients();
  }, []);

  const totalPatients = patients.length;
  const criticalCount = patients.filter((p) => p.status === "Critical").length;
  const recentAdmissions = patients.filter((p) => {
    const d = new Date(p.admission_date);
    const now = new Date();
    return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 7;
  }).length;
  const dischargedCount = patients.filter((p) => p.status === "Discharged").length;

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      showNotification("MedCore Alert", {
        body: "New patient admission requires your attention.",
        tag: "test-notification",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's what's happening at the hospital today.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleTestNotification} className="gap-2">
          <Bell className="h-4 w-4" />
          Test Notification
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard
          title="Total Patients"
          value={totalPatients}
          icon={Users}
          trend={{ value: 12, label: "this month" }}
        />
        <DataCard
          title="Critical Cases"
          value={criticalCount}
          icon={AlertTriangle}
          trend={{ value: -3, label: "vs last week" }}
        />
        <DataCard
          title="Recent Admissions"
          value={recentAdmissions}
          icon={Activity}
          trend={{ value: 8, label: "this week" }}
        />
        <DataCard
          title="Discharged"
          value={dischargedCount}
          icon={CalendarCheck}
          trend={{ value: 15, label: "this month" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-3">
                {patients.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.condition}</p>
                    </div>
                    <StatusBadge status={p.status as PatientStatus} />
                  </div>
                ))}
                {patients.length === 0 && (
                  <p className="text-sm text-muted-foreground">No patients found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/patients")}>
              <Users className="mr-2 h-4 w-4" />
              View All Patients
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/analytics")}>
              <Activity className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
