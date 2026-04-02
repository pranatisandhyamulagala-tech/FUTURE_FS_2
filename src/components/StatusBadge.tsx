import { Badge } from "@/components/ui/badge";
import type { LeadStatus } from "@/lib/leads";

const config: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" },
  contacted: { label: "Contacted", className: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20" },
  converted: { label: "Converted", className: "bg-success/10 text-success border-success/20 hover:bg-success/20" },
};

const StatusBadge = ({ status }: { status: LeadStatus }) => {
  const { label, className } = config[status];
  return <Badge variant="outline" className={className}>{label}</Badge>;
};

export default StatusBadge;
