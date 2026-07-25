
-- 1) workout_days
CREATE TABLE public.workout_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_index SMALLINT NOT NULL CHECK (day_index BETWEEN 0 AND 6),
  focus TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, day_index)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_days TO authenticated;
GRANT ALL ON public.workout_days TO service_role;
ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own workout_days" ON public.workout_days FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2) exercises
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_id UUID NOT NULL REFERENCES public.workout_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets TEXT NOT NULL,
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercises TO authenticated;
GRANT ALL ON public.exercises TO service_role;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own exercises" ON public.exercises FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX exercises_day_idx ON public.exercises(day_id, sort_order);

-- 3) workout_logs
CREATE TABLE public.workout_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  day_index SMALLINT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_logs TO authenticated;
GRANT ALL ON public.workout_logs TO service_role;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own workout_logs" ON public.workout_logs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX workout_logs_user_date_idx ON public.workout_logs(user_id, log_date DESC);

-- 4) exercise_logs
CREATE TABLE public.exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_id UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL,
  set_number SMALLINT NOT NULL DEFAULT 1,
  reps SMALLINT,
  weight NUMERIC(6,2),
  rpe NUMERIC(3,1),
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercise_logs TO authenticated;
GRANT ALL ON public.exercise_logs TO service_role;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own exercise_logs" ON public.exercise_logs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX exercise_logs_user_name_idx ON public.exercise_logs(user_id, exercise_name, logged_at DESC);

-- 5) private_items (meds/supplements)
CREATE TABLE public.private_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dose TEXT NOT NULL,
  time_of_day TEXT NOT NULL,
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.private_items TO authenticated;
GRANT ALL ON public.private_items TO service_role;
ALTER TABLE public.private_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own private_items" ON public.private_items FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6) threads
CREATE TABLE public.threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.threads TO authenticated;
GRANT ALL ON public.threads TO service_role;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own threads" ON public.threads FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX threads_user_updated_idx ON public.threads(user_id, updated_at DESC);

-- 7) messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  parts JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON public.messages FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX messages_thread_time_idx ON public.messages(thread_id, created_at);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_workout_days_updated BEFORE UPDATE ON public.workout_days
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_exercises_updated BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_private_items_updated BEFORE UPDATE ON public.private_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_threads_updated BEFORE UPDATE ON public.threads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed a new user's data on signup
CREATE OR REPLACE FUNCTION public.seed_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  d0 UUID; d1 UUID; d2 UUID; d3 UUID; d4 UUID; d5 UUID; d6 UUID;
BEGIN
  INSERT INTO public.workout_days (user_id, day_index, focus) VALUES
    (NEW.id, 0, 'Push — Chest, Shoulders, Triceps') RETURNING id INTO d0;
  INSERT INTO public.workout_days (user_id, day_index, focus) VALUES
    (NEW.id, 1, 'Pull — Back & Biceps') RETURNING id INTO d1;
  INSERT INTO public.workout_days (user_id, day_index, focus) VALUES
    (NEW.id, 2, 'Legs — Quad emphasis') RETURNING id INTO d2;
  INSERT INTO public.workout_days (user_id, day_index, focus) VALUES
    (NEW.id, 3, 'Active recovery — Zone 2 + mobility') RETURNING id INTO d3;
  INSERT INTO public.workout_days (user_id, day_index, focus) VALUES
    (NEW.id, 4, 'Push — Hypertrophy') RETURNING id INTO d4;
  INSERT INTO public.workout_days (user_id, day_index, focus) VALUES
    (NEW.id, 5, 'Pull + Posterior chain') RETURNING id INTO d5;
  INSERT INTO public.workout_days (user_id, day_index, focus) VALUES
    (NEW.id, 6, 'Rest — walk, stretch, sleep') RETURNING id INTO d6;

  INSERT INTO public.exercises (user_id, day_id, name, sets, sort_order) VALUES
    (NEW.id, d0, 'Barbell bench press', '4 × 6–8', 1),
    (NEW.id, d0, 'Overhead press', '3 × 8', 2),
    (NEW.id, d0, 'Incline dumbbell press', '3 × 10', 3),
    (NEW.id, d0, 'Lateral raises', '3 × 12', 4),
    (NEW.id, d0, 'Rope pushdowns', '3 × 12', 5),
    (NEW.id, d1, 'Deadlift', '4 × 5', 1),
    (NEW.id, d1, 'Pull-ups', '4 × AMRAP', 2),
    (NEW.id, d1, 'Barbell row', '3 × 8', 3),
    (NEW.id, d1, 'Face pulls', '3 × 15', 4),
    (NEW.id, d1, 'Hammer curls', '3 × 10', 5),
    (NEW.id, d2, 'Back squat', '5 × 5', 1),
    (NEW.id, d2, 'Bulgarian split squat', '3 × 10 / leg', 2),
    (NEW.id, d2, 'Leg press', '3 × 12', 3),
    (NEW.id, d2, 'Standing calf raise', '4 × 12', 4),
    (NEW.id, d3, 'Zone 2 cardio', '40 min', 1),
    (NEW.id, d3, 'Mobility flow', '15 min', 2),
    (NEW.id, d4, 'Incline barbell press', '4 × 8', 1),
    (NEW.id, d4, 'Seated DB shoulder press', '3 × 10', 2),
    (NEW.id, d4, 'Cable fly', '3 × 12', 3),
    (NEW.id, d4, 'Skullcrushers', '3 × 10', 4),
    (NEW.id, d5, 'Romanian deadlift', '4 × 8', 1),
    (NEW.id, d5, 'Chest-supported row', '4 × 10', 2),
    (NEW.id, d5, 'Lat pulldown', '3 × 12', 3),
    (NEW.id, d5, 'Rear delt fly', '3 × 15', 4),
    (NEW.id, d5, 'Preacher curl', '3 × 10', 5),
    (NEW.id, d6, 'Easy walk', '30–45 min', 1),
    (NEW.id, d6, 'Foam roll + stretch', '15 min', 2);

  INSERT INTO public.private_items (user_id, name, dose, time_of_day, sort_order) VALUES
    (NEW.id, 'Vitamin D3', '2000 IU', 'morning', 1),
    (NEW.id, 'Omega-3', '1g', 'morning', 2),
    (NEW.id, 'Creatine monohydrate', '5g', 'afternoon', 3),
    (NEW.id, 'Magnesium glycinate', '400mg', 'bedtime', 4),
    (NEW.id, 'Multivitamin', '1 tablet', 'morning', 5);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.seed_new_user();
