import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StatusBadge from "./StatusBadge";
import { ChevronDown, StickyNote, Trash2 } from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/leads";

const STATUSES: LeadStatus[] = ["new", "contacted", "converted"];

interface LeadTableProps {
  leads: Lead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onOpenNotes: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const LeadTable = ({ leads, onUpdateStatus, onOpenNotes, onDelete }: LeadTableProps) => {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No leads found. Add your first lead above!
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">
                {lead.name}
                <div className="sm:hidden text-xs text-muted-foreground">{lead.email}</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">{lead.email}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{lead.source}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 cursor-pointer">
                      <StatusBadge status={lead.status as LeadStatus} />
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {STATUSES.map((s) => (
                      <DropdownMenuItem key={s} onClick={() => onUpdateStatus(lead.id, s)} disabled={s === lead.status}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                {new Date(lead.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onOpenNotes(lead)} title="Notes">
                    <StickyNote className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(lead.id)} title="Delete" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTable;
