-- Add foreign key constraint from groups.created_by to profiles.id
ALTER TABLE groups 
ADD CONSTRAINT groups_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES profiles(id) 
ON DELETE CASCADE;