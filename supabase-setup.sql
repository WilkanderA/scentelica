-- Database Trigger for User Sync
-- Execute this in Supabase SQL Editor to automatically sync auth.users to public.users

-- Create or replace the function that syncs users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (
    id, email, name, "avatarUrl", role, "createdAt"
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url',
    'user',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    "avatarUrl" = COALESCE(EXCLUDED."avatarUrl", public.users."avatarUrl"),
    "updatedAt" = NOW();
  RETURN NEW;
END;
$$;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';
