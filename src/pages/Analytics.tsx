import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Patient } from "@/types/patient";
import { DataCard } from "@/components/common/DataCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Heart, Stethoscope } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(168, 76%, 42%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(262, 52%, 47%)",
];

const Analytics = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("patients").select("*");
      setPatients(data ?? []);
    };
    fetch();
  }, []);

  // Department distribution
  const deptData = Object.entries(
    patients.reduce<Record<string, number>>((acc, p) => {
      acc[p.department] = (acc[p.department] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Status distribution
  const statusData = Object.entries(
    patients.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Gender distribution
  const genderData = Object.entries(
    patients.reduce<Record<string, number>>((acc, p) => {
      acc[p.gender] = (acc[p.gender] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Age distribution
  const ageGroups = patients.reduce<Record<string, number>>((acc, p) => {
    const group =
      p.age < 20 ? "0-19" : p.age < 40 ? "20-39" : p.age < 60 ? "40-59" : "60+";
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});
  const ageData = ["0-19", "20-39", "40-59", "60+"].map((name) => ({
    name,
    patients: ageGroups[name] || 0,
  }));

  // Monthly trend (mock based on admission dates)
  const monthlyTrend = patients.reduce<Record<string, number>>((acc, p) => {
    const month = new Date(p.admission_date).toLocaleDateString("en-US", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const trendData = Object.entries(monthlyTrend).map(([month, count]) => ({
    month,
    admissions: count,
  }));

  const avgAge = patients.length
    ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Patient demographics, visits, and health metrics overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard title="Total Patients" value={patients.length} icon={Users} />
        <DataCard title="Avg Age" value={avgAge} icon={Activity} />
        <DataCard
          title="Departments"
          value={deptData.length}
          icon={Stethoscope}
        />
        <DataCard
          title="Critical"
          value={patients.filter((p) => p.status === "Critical").length}
          icon={Heart}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Patients by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="patients" fill="hsl(168, 76%, 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Admission Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="admissions"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {genderData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
