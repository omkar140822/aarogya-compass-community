-- Fix the group_members INSERT policy to allow group creators to add themselves
DROP POLICY IF EXISTS "Group admins can add members" ON group_members;

-- Allow users to add themselves when creating a group, or admins to add others
CREATE POLICY "Users can join groups or admins can add members" 
ON group_members 
FOR INSERT 
WITH CHECK (
  -- Allow users to add themselves
  auth.uid() = user_id
  OR
  -- Or allow existing group admins to add others
  EXISTS (
    SELECT 1 
    FROM group_members 
    WHERE group_id = group_members.group_id 
    AND user_id = auth.uid() 
    AND role = 'admin'
  )
);