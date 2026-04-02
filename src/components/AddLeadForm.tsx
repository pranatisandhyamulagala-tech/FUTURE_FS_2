import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface AddLeadFormProps {
  onAdd: (data: { name: string; email: string; source: string }) => void;
}

const SOURCES = ["Website", "Referral", "LinkedIn", "Google Ads", "Facebook", "Other"];

const AddLeadForm = ({ onAdd }: AddLeadFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !source) return;
    onAdd({ name: name.trim(), email: email.trim(), source });
    setName("");
    setEmail("");
    setSource("");
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Add New Lead
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="name" className="sr-only">Name</Label>
            <Input id="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
          </div>
          <div className="flex-1">
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input id="email" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
          </div>
          <div className="w-full sm:w-44">
            <Select value={source} onValueChange={setSource} required>
              <SelectTrigger>
                <SelectValue placeholder="Lead source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={!name.trim() || !email.trim() || !source}>
            Add Lead
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddLeadForm;
