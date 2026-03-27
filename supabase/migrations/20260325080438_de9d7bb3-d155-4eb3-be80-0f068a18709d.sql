
DROP POLICY IF EXISTS "Authenticated users can view patients" ON public.patients;
DROP POLICY IF EXISTS "Authenticated users can insert patients" ON public.patients;
DROP POLICY IF EXISTS "Authenticated users can update patients" ON public.patients;

CREATE POLICY "Anyone can view patients" ON public.patients FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert patients" ON public.patients FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update patients" ON public.patients FOR UPDATE TO anon, authenticated USING (true);
