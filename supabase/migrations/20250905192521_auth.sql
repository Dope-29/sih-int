-- Create profiles table to store public user data
CREATE TABLE public.profiles (
    id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add user_id to registrations
ALTER TABLE public.registrations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to teams and link to profiles
ALTER TABLE public.teams ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add user_id to team_members
ALTER TABLE public.team_members ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;


-- Update RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT
USING ( true );

CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
ON public.profiles FOR UPDATE
USING ( auth.uid() = id );

-- Update RLS policies for registrations
ALTER POLICY "Anyone can insert registrations" ON public.registrations
WITH CHECK (auth.uid() = user_id);

ALTER POLICY "Anyone can view registrations" ON public.registrations
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own registration"
ON public.registrations FOR UPDATE
USING (auth.uid() = user_id);


-- Update RLS policies for teams
TRUNCATE public.teams RESTART IDENTITY CASCADE; -- This will remove all existing teams
ALTER POLICY "Anyone can view teams" ON public.teams RENAME TO "Users can view their own teams.";
ALTER POLICY "Users can view their own teams." ON public.teams
USING ( auth.uid() = user_id );

ALTER POLICY "Anyone can insert teams" ON public.teams RENAME TO "Users can create teams for themselves.";
ALTER POLICY "Users can create teams for themselves." ON public.teams
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own teams."
ON public.teams FOR UPDATE
USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own teams."
ON public.teams FOR DELETE
USING ( auth.uid() = user_id );


-- Update RLS policies for team_members
TRUNCATE public.team_members RESTART IDENTITY CASCADE; -- This will remove all existing team members
ALTER POLICY "Anyone can view team members" ON public.team_members RENAME TO "Users can view their own team memberships.";
ALTER POLICY "Users can view their own team memberships." ON public.team_members
USING ( auth.uid() = user_id );

ALTER POLICY "Anyone can join teams" ON public.team_members RENAME TO "Users can add themselves to a team.";
ALTER POLICY "Users can add themselves to a team." ON public.team_members
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own team membership."
ON public.team_members FOR UPDATE
USING ( auth.uid() = user_id );

CREATE POLICY "Users can remove themselves from a team."
ON public.team_members FOR DELETE
USING ( auth.uid() = user_id );

-- Function to create a public profile for each new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- Trigger to create a profile when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();