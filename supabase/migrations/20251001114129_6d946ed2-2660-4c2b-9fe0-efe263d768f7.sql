-- Create storage buckets for media
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('post-media', 'post-media', true),
  ('chat-media', 'chat-media', true);

-- Create groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_members table
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create posts table (with media support)
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT,
  media_urls TEXT[],
  media_types TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create post_likes table
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create group_messages table (chat)
CREATE TABLE public.group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT,
  media_url TEXT,
  media_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
CREATE POLICY "Groups are viewable by everyone"
  ON public.groups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups"
  ON public.groups FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete their groups"
  ON public.groups FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for group_members
CREATE POLICY "Group members are viewable by everyone"
  ON public.group_members FOR SELECT
  USING (true);

CREATE POLICY "Group admins can add members"
  ON public.group_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_members.group_id
      AND user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for posts
CREATE POLICY "Posts are viewable by group members"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = posts.group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = posts.group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for post_likes
CREATE POLICY "Post likes are viewable by group members"
  ON public.post_likes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      JOIN public.group_members ON posts.group_id = group_members.group_id
      WHERE posts.id = post_likes.post_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.posts
      JOIN public.group_members ON posts.group_id = group_members.group_id
      WHERE posts.id = post_likes.post_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for group_messages
CREATE POLICY "Messages are viewable by group members"
  ON public.group_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_messages.group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Group members can send messages"
  ON public.group_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_messages.group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own messages"
  ON public.group_messages FOR DELETE
  USING (auth.uid() = user_id);

-- Storage policies for post-media bucket
CREATE POLICY "Post media is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-media');

CREATE POLICY "Authenticated users can upload post media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own post media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'post-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for chat-media bucket
CREATE POLICY "Chat media is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-media');

CREATE POLICY "Authenticated users can upload chat media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own chat media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'chat-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for groups, posts, and messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;

-- Create indexes for better performance
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_posts_group_id ON public.posts(group_id);
CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_group_messages_group_id ON public.group_messages(group_id);
CREATE INDEX idx_group_messages_created_at ON public.group_messages(created_at);