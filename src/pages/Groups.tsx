import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Groups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from("groups")
        .select(`
          *,
          profiles:created_by (username),
          group_members (user_id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: formData.name,
          description: formData.description,
          created_by: user.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: "admin",
        });

      if (memberError) throw memberError;

      toast({ title: "Group created successfully!" });
      setOpen(false);
      setFormData({ name: "", description: "" });
      fetchGroups();
    } catch (error: any) {
      toast({
        title: "Error creating group",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchGroups();

    const channel = supabase
      .channel("groups-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groups" },
        () => fetchGroups()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-foreground">Groups</h1>
            {user && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={createGroup} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Group Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Create
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Loading groups...</p>
            ) : groups.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No groups yet. Be the first to create one!</p>
              </div>
            ) : (
              groups.map((group) => (
                <Link key={group.id} to={`/groups/${group.id}`}>
                  <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-1">
                            {group.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {group.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {group.group_members?.length || 0} members
                            </span>
                            <span>•</span>
                            <span>
                              Created by {group.profiles?.username || "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Groups;
