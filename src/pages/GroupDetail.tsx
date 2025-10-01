import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, Send, Image, Video, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GroupDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchGroup = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*, profiles:created_by (username)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching group:", error);
      return;
    }
    setGroup(data);
  };

  const checkMembership = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("group_members")
      .select()
      .eq("group_id", id)
      .eq("user_id", user.id)
      .single();

    setIsMember(!!data);
  };

  const joinGroup = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("group_members")
      .insert({ group_id: id, user_id: user.id });

    if (error) {
      toast({ title: "Error joining group", variant: "destructive" });
      return;
    }
    setIsMember(true);
    toast({ title: "Joined group successfully!" });
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:user_id (username),
        post_likes (user_id)
      `)
      .eq("group_id", id)
      .order("created_at", { ascending: false });

    if (!error) setPosts(data || []);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*, profiles:user_id (username)")
      .eq("group_id", id)
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const createPost = async () => {
    if (!user || (!postContent.trim() && selectedFiles.length === 0)) return;

    try {
      setUploading(true);
      const mediaUrls: string[] = [];
      const mediaTypes: string[] = [];

      for (const file of selectedFiles) {
        const url = await uploadFile(file, 'post-media');
        mediaUrls.push(url);
        mediaTypes.push(file.type.startsWith('video/') ? 'video' : 'image');
      }

      const { error } = await supabase.from("posts").insert({
        group_id: id,
        user_id: user.id,
        content: postContent,
        media_urls: mediaUrls,
        media_types: mediaTypes,
      });

      if (error) throw error;

      setPostContent("");
      setSelectedFiles([]);
      toast({ title: "Post created!" });
    } catch (error: any) {
      toast({ title: "Error creating post", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async () => {
    if (!user || !messageContent.trim()) return;

    const { error } = await supabase.from("group_messages").insert({
      group_id: id,
      user_id: user.id,
      content: messageContent,
    });

    if (!error) setMessageContent("");
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    if (isLiked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });
    }
    fetchPosts();
  };

  useEffect(() => {
    fetchGroup();
    checkMembership();
    fetchPosts();
    fetchMessages();

    const postsChannel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts", filter: `group_id=eq.${id}` },
        () => fetchPosts()
      )
      .subscribe();

    const messagesChannel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_messages", filter: `group_id=eq.${id}` },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [id, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!group) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">{group.name}</h1>
              <p className="text-muted-foreground mb-4">{group.description}</p>
              {!isMember && user && (
                <Button onClick={joinGroup}>Join Group</Button>
              )}
            </CardContent>
          </Card>

          {isMember && (
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <Textarea
                      placeholder="What's on your mind?"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="mb-4"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                        className="flex-1"
                      />
                      <Button onClick={createPost} disabled={uploading}>
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                      </Button>
                    </div>
                    {selectedFiles.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedFiles.length} file(s) selected
                      </p>
                    )}
                  </CardContent>
                </Card>

                {posts.map((post) => {
                  const isLiked = post.post_likes?.some((like: any) => like.user_id === user?.id);
                  return (
                    <Card key={post.id}>
                      <CardContent className="pt-6">
                        <div className="mb-4">
                          <p className="font-semibold text-foreground">{post.profiles?.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleString()}
                          </p>
                        </div>
                        {post.content && <p className="text-foreground mb-4">{post.content}</p>}
                        
                        {post.media_urls && post.media_urls.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {post.media_urls.map((url: string, idx: number) => (
                              post.media_types[idx] === 'video' ? (
                                <video key={idx} src={url} controls className="w-full rounded-lg" />
                              ) : (
                                <img key={idx} src={url} alt="" className="w-full rounded-lg" />
                              )
                            ))}
                          </div>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(post.id, isLiked)}
                        >
                          <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          {post.post_likes?.length || 0}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="chat">
                <Card className="h-[600px] flex flex-col">
                  <CardContent className="flex-1 overflow-y-auto pt-6">
                    {messages.map((msg) => (
                      <div key={msg.id} className="mb-4">
                        <p className="font-semibold text-sm text-foreground">
                          {msg.profiles?.username}
                        </p>
                        <p className="text-foreground">{msg.content}</p>
                        {msg.media_url && (
                          msg.media_type === 'video' ? (
                            <video src={msg.media_url} controls className="mt-2 max-w-xs rounded-lg" />
                          ) : (
                            <img src={msg.media_url} alt="" className="mt-2 max-w-xs rounded-lg" />
                          )
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </CardContent>
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupDetail;
