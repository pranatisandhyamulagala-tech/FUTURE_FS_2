import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Lead } from "@/lib/leads";

interface LeadNotesDialogProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, notes: string) => void;
}

const LeadNotesDialog = ({ lead, open, onClose, onSave }: LeadNotesDialogProps) => {
  const [notes, setNotes] = useState(lead?.notes ?? "");

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) onClose();
    else if (lead) setNotes(lead.notes);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notes for {lead?.name}</DialogTitle>
        </DialogHeader>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this lead..."
          rows={5}
          maxLength={1000}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (lead) onSave(lead.id, notes); onClose(); }}>Save Notes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadNotesDialog;
