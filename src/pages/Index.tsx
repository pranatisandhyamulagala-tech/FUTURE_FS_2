import { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getLeads, addLead, updateLead, deleteLead } from "@/lib/leads";
import type { Lead, LeadStatus } from "@/lib/leads";
import { useAuth } from "@/contexts/AuthContext";
import AddLeadForm from "@/components/AddLeadForm";
import LeadTable from "@/components/LeadTable";
import LeadNotesDialog from "@/components/LeadNotesDialog";
import StatusBadge from "@/components/StatusBadge";
import { Search, Users, LogOut } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [notesLead, setNotesLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err: any) {
      toast({ title: "Error loading leads", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleAdd = async (data: { name: string; email: string; source: string }) => {
    try {
      await addLead(data);
      await refresh();
      toast({ title: "Lead added", description: `${data.name} has been added.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    try {
      await updateLead(id, { status });
      await refresh();
      toast({ title: "Status updated" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    try {
      await updateLead(id, { notes });
      await refresh();
      toast({ title: "Notes saved" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      await refresh();
      toast({ title: "Lead deleted", variant: "destructive" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const counts = useMemo(() => ({
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
  }), [leads]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">LeadFlow CRM</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["all", "new", "contacted", "converted"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`rounded-lg border p-3 text-left transition-colors ${statusFilter === key ? "border-primary bg-primary/5" : "bg-card hover:bg-accent"}`}
            >
              <div className="text-2xl font-bold text-foreground">{counts[key]}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                {key === "all" ? "Total Leads" : <StatusBadge status={key} />}
              </div>
            </button>
          ))}
        </div>

        <AddLeadForm onAdd={handleAdd} />

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading leads...</div>
        ) : (
          <LeadTable leads={filtered} onUpdateStatus={handleUpdateStatus} onOpenNotes={setNotesLead} onDelete={handleDelete} />
        )}
      </main>

      <LeadNotesDialog lead={notesLead} open={!!notesLead} onClose={() => setNotesLead(null)} onSave={handleSaveNotes} />
    </div>
  );
};

export default Index;
