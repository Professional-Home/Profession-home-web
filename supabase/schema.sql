-- =============================================================================
-- PROFESSIONAL HOME — FULL DATABASE SCHEMA
-- Run this entire file once in Supabase → SQL Editor
-- =============================================================================

-- ─── ENUMS ───────────────────────────────────────────────────────────────────
DO $$ BEGIN CREATE TYPE public.user_role AS ENUM ('student','researcher','founder','admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.mission_status AS ENUM ('active','completed','expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.application_status AS ENUM ('saved','applied','review','interview','offer','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.booking_status AS ENUM ('pending','confirmed','completed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE public.difficulty_level AS ENUM ('easy','medium','hard');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── CORE: PROFILES ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL DEFAULT '',
  role          public.user_role NOT NULL DEFAULT 'student',
  avatar_url    TEXT,
  bio           TEXT,
  location      TEXT,
  linkedin_url  TEXT,
  github_url    TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: HOME ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_profiles (
  user_id         UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  level           INT NOT NULL DEFAULT 1,
  xp              INT NOT NULL DEFAULT 0,
  xp_to_next      INT NOT NULL DEFAULT 1000,
  success_score   INT NOT NULL DEFAULT 0 CHECK (success_score BETWEEN 0 AND 100),
  career_goal     TEXT,
  degree          TEXT,
  year_of_study   TEXT,
  missing_skills  TEXT,
  streak_count    INT NOT NULL DEFAULT 0,
  streak_claimed_today BOOLEAN NOT NULL DEFAULT FALSE,
  coins           INT NOT NULL DEFAULT 0,
  arena_rank      INT,
  cohort_percentile INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_missions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  difficulty  public.difficulty_level DEFAULT 'medium',
  reward_xp   INT NOT NULL DEFAULT 0,
  progress    INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  deadline    TIMESTAMPTZ,
  tag         TEXT,
  status      public.mission_status NOT NULL DEFAULT 'active',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: CAREER ARENA ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.arena_stats (
  user_id       UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  rank_title    TEXT DEFAULT 'Specialist',
  rank_number   INT DEFAULT 0,
  win_rate      NUMERIC(5,2) DEFAULT 0,
  total_battles INT DEFAULT 0,
  research_score INT DEFAULT 0,
  startup_score  INT DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.arena_path_decisions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  path_chosen TEXT NOT NULL CHECK (path_chosen IN ('research','startup')),
  ai_result   TEXT,
  decided_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: CHALLENGES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_challenges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT,
  difficulty    public.difficulty_level DEFAULT 'medium',
  reward_xp     INT DEFAULT 0,
  reward_coins  INT DEFAULT 0,
  progress      INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  deadline      TIMESTAMPTZ,
  completed     BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: AI ASSESSMENT ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_assessments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  overall_score   INT NOT NULL DEFAULT 0 CHECK (overall_score BETWEEN 0 AND 100),
  academic        INT DEFAULT 0 CHECK (academic BETWEEN 0 AND 100),
  technical       INT DEFAULT 0 CHECK (technical BETWEEN 0 AND 100),
  communication   INT DEFAULT 0 CHECK (communication BETWEEN 0 AND 100),
  research        INT DEFAULT 0 CHECK (research BETWEEN 0 AND 100),
  career_ready    INT DEFAULT 0 CHECK (career_ready BETWEEN 0 AND 100),
  leadership      INT DEFAULT 0 CHECK (leadership BETWEEN 0 AND 100),
  networking      INT DEFAULT 0 CHECK (networking BETWEEN 0 AND 100),
  diagnosis       TEXT,
  recommendations JSONB DEFAULT '[]',
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: CAREER ROADMAP ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.career_roadmap_phases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  phase_number  INT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  target_weeks  TEXT,
  progress      INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  is_active     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, phase_number)
);

CREATE TABLE IF NOT EXISTS public.career_roadmap_milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id    UUID NOT NULL REFERENCES public.career_roadmap_phases(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  locked      BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INT DEFAULT 0
);

-- ─── STUDENT OS: SKILL BUILDER ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_name  TEXT NOT NULL,
  category    TEXT,
  level       INT DEFAULT 0 CHECK (level BETWEEN 0 AND 100),
  target_level INT DEFAULT 100,
  is_gap      BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

CREATE TABLE IF NOT EXISTS public.skill_courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_name  TEXT NOT NULL,
  course_title TEXT NOT NULL,
  provider    TEXT,
  url         TEXT,
  progress    INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: PROJECTS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  short_description TEXT,
  tech_stack      TEXT[] DEFAULT '{}',
  category        TEXT,
  github_url      TEXT,
  live_url        TEXT,
  image_url       TEXT,
  progress        INT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status          TEXT NOT NULL DEFAULT 'In Progress',
  commits         INT DEFAULT 0,
  tests_passing   TEXT,
  is_published    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: INTERNSHIPS & JOBS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.internship_listings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company     TEXT NOT NULL,
  role_title  TEXT NOT NULL,
  location    TEXT,
  type        TEXT DEFAULT 'Summer',
  match_min   INT DEFAULT 70,
  description TEXT,
  apply_url   TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  posted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.internship_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id    UUID NOT NULL REFERENCES public.internship_listings(id) ON DELETE CASCADE,
  match_score   INT,
  status        public.application_status DEFAULT 'applied',
  applied_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes         TEXT,
  UNIQUE(user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS public.job_listings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company     TEXT NOT NULL,
  role_title  TEXT NOT NULL,
  location    TEXT,
  salary_range TEXT,
  match_min   INT DEFAULT 75,
  description TEXT,
  apply_url   TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  posted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id    UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  match_score   INT,
  status        public.application_status DEFAULT 'applied',
  applied_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes         TEXT,
  UNIQUE(user_id, listing_id)
);

-- ─── STUDENT OS: MENTORS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mentors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     TEXT NOT NULL,
  domain        TEXT NOT NULL,
  bio           TEXT,
  experience    TEXT,
  rating        NUMERIC(2,1) DEFAULT 5.0,
  success_rate  INT DEFAULT 90,
  hourly_rate   TEXT,
  tags          TEXT[] DEFAULT '{}',
  avatar_url    TEXT,
  is_available  BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mentor_bookings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id   UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  slot_time   TIMESTAMPTZ NOT NULL,
  status      public.booking_status DEFAULT 'pending',
  redeem_code TEXT,
  notes       TEXT,
  booked_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: AI COPILOT ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.copilot_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dashboard   TEXT NOT NULL DEFAULT 'student',
  title       TEXT DEFAULT 'New Session',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.copilot_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES public.copilot_sessions(id) ON DELETE CASCADE,
  sender      TEXT NOT NULL CHECK (sender IN ('user','assistant')),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: ACHIEVEMENTS & REWARDS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.achievements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT,
  icon        TEXT,
  points      INT DEFAULT 100,
  category    TEXT,
  dashboard   TEXT DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id  UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.rewards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT,
  coin_cost   INT NOT NULL DEFAULT 0,
  reward_type TEXT,
  is_active   BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.user_rewards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_id   UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ticket_code TEXT
);

CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount      INT NOT NULL,
  reason      TEXT,
  balance_after INT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── STUDENT OS: COMMUNITY ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.community_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  event_date  TIMESTAMPTZ NOT NULL,
  tag         TEXT DEFAULT 'Open',
  max_attendees INT,
  is_live     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_registrations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id    UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

CREATE TABLE IF NOT EXISTS public.community_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT,
  likes       INT DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── FOUNDER OS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.startup_profiles (
  user_id       UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name  TEXT,
  overall_score INT NOT NULL DEFAULT 0,
  stage         TEXT DEFAULT 'idea',
  runway_months INT,
  team_size     INT DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.startup_assessments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  overall_score       INT DEFAULT 0,
  problem_validation  INT DEFAULT 0,
  customer_validation INT DEFAULT 0,
  product_readiness   INT DEFAULT 0,
  market_opportunity  INT DEFAULT 0,
  business_model      INT DEFAULT 0,
  team_strength       INT DEFAULT 0,
  financial_health    INT DEFAULT 0,
  execution_growth    INT DEFAULT 0,
  diagnosis           TEXT,
  recommendations     JSONB DEFAULT '[]',
  completed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.startup_tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT DEFAULT 'To Do',
  priority    TEXT DEFAULT 'Medium',
  assigned_to TEXT,
  deadline    DATE,
  progress    INT DEFAULT 0,
  category    TEXT,
  ai_suggestion TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.startup_documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doc_type    TEXT NOT NULL,
  file_name   TEXT,
  file_url    TEXT,
  status      TEXT DEFAULT 'Empty',
  score       INT,
  file_size   TEXT,
  general_feedback TEXT,
  slide_feedback   JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── FOUNDER OS: STARTUP ROADMAP ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.startup_roadmap_phases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  phase_number    INT NOT NULL,
  phase_name      TEXT NOT NULL,
  target_duration TEXT,
  icon_name       TEXT,
  progress        INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  is_active       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, phase_number)
);

CREATE TABLE IF NOT EXISTS public.startup_roadmap_milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id    UUID NOT NULL REFERENCES public.startup_roadmap_phases(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  locked      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT DEFAULT 0
);

-- ─── RESEARCHER OS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.researcher_profiles (
  user_id         UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  field           TEXT,
  institution     TEXT,
  papers_count    INT NOT NULL DEFAULT 0,
  citations_count INT NOT NULL DEFAULT 0,
  h_index         INT DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.research_projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  abstract    TEXT,
  status      TEXT DEFAULT 'active',
  progress    INT DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.research_publications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  journal     TEXT,
  citations   INT DEFAULT 0,
  published_at DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ADMIN OS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  target_type TEXT,
  target_id   TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject     TEXT NOT NULL,
  body        TEXT,
  status      TEXT DEFAULT 'open',
  priority    TEXT DEFAULT 'normal',
  assigned_to UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount      NUMERIC(12,2) NOT NULL,
  currency    TEXT DEFAULT 'INR',
  status      TEXT DEFAULT 'pending',
  provider    TEXT,
  reference   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── TRIGGERS ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER student_profiles_updated_at BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS startup_profiles_updated_at ON public.startup_profiles;
CREATE TRIGGER startup_profiles_updated_at BEFORE UPDATE ON public.startup_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS startup_roadmap_phases_updated_at ON public.startup_roadmap_phases;
CREATE TRIGGER startup_roadmap_phases_updated_at BEFORE UPDATE ON public.startup_roadmap_phases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS researcher_profiles_updated_at ON public.researcher_profiles;
CREATE TRIGGER researcher_profiles_updated_at BEFORE UPDATE ON public.researcher_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE user_role public.user_role;
BEGIN
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student');
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), user_role);
  IF user_role = 'student' THEN
    INSERT INTO public.student_profiles (user_id) VALUES (NEW.id);
    INSERT INTO public.arena_stats (user_id) VALUES (NEW.id);
  ELSIF user_role = 'founder' THEN
    INSERT INTO public.startup_profiles (user_id) VALUES (NEW.id);
  ELSIF user_role = 'researcher' THEN
    INSERT INTO public.researcher_profiles (user_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_path_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.researcher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Public read catalogs
ALTER TABLE public.internship_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_internships" ON public.internship_listings FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_jobs" ON public.job_listings FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_mentors" ON public.mentors FOR SELECT USING (is_available = TRUE);
CREATE POLICY "public_read_achievements" ON public.achievements FOR SELECT USING (TRUE);
CREATE POLICY "public_read_rewards" ON public.rewards FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_events" ON public.community_events FOR SELECT USING (TRUE);

-- Own-data policies (student)
CREATE POLICY "own_profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_student_profile" ON public.student_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_missions" ON public.student_missions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_arena" ON public.arena_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_arena_decisions" ON public.arena_path_decisions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_challenges" ON public.student_challenges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_assessments" ON public.student_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_roadmap_phases" ON public.career_roadmap_phases FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_skills" ON public.student_skills FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_courses" ON public.skill_courses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_projects" ON public.student_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_intern_apps" ON public.internship_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_job_apps" ON public.job_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_bookings" ON public.mentor_bookings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_copilot_sessions" ON public.copilot_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_user_achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_user_rewards" ON public.user_rewards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_coins" ON public.coin_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_registrations" ON public.community_registrations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_posts" ON public.community_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_startup" ON public.startup_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_startup_assess" ON public.startup_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_startup_tasks" ON public.startup_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_startup_docs" ON public.startup_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_startup_roadmap_phases" ON public.startup_roadmap_phases FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_startup_milestones" ON public.startup_roadmap_milestones FOR ALL USING (
  EXISTS (SELECT 1 FROM public.startup_roadmap_phases p WHERE p.id = phase_id AND p.user_id = auth.uid())
);
CREATE POLICY "own_researcher" ON public.researcher_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_research_projects" ON public.research_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_publications" ON public.research_publications FOR ALL USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "admin_read_profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY "admin_audit" ON public.admin_audit_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY "admin_tickets" ON public.support_tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY "admin_payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Copilot messages via session ownership
CREATE POLICY "own_copilot_messages" ON public.copilot_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.copilot_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));

-- Roadmap milestones via phase ownership
CREATE POLICY "own_milestones" ON public.career_roadmap_milestones FOR ALL USING (
  EXISTS (SELECT 1 FROM public.career_roadmap_phases p WHERE p.id = phase_id AND p.user_id = auth.uid()));

-- User tickets
CREATE POLICY "own_tickets" ON public.support_tickets FOR ALL USING (auth.uid() = user_id);
