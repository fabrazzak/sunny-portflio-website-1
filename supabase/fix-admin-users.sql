-- Run this in Supabase Dashboard → SQL Editor.
-- Fixes: admin_users UUID mismatch + creates lead-photos storage bucket.

-- ── 1. Create the lead-photos storage bucket ─────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-photos', 'lead-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow service role (used by the upload API) to do everything — no extra
-- policy needed since service role bypasses RLS.
-- Allow anyone to read public URLs:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename  = 'objects'
      AND policyname = 'Public read lead-photos'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Public read lead-photos"
        ON storage.objects FOR SELECT TO public
        USING (bucket_id = 'lead-photos');
    $policy$;
  END IF;
END $$;

-- ── 2. Fix admin_users: look up real UUIDs from auth.users by email ──────────

INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email IN (
  'abrazzak6980@gmail.com',
  'freelancerabdurrazzak47@gmail.com'
)
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, role = 'admin';

-- Also add a policy so authenticated users can read their own row
-- (needed if you ever use the anon client to check admin status).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_users'
      AND policyname = 'Users can read own admin status'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users can read own admin status"
        ON admin_users FOR SELECT TO authenticated
        USING (id = auth.uid());
    $policy$;
  END IF;
END $$;
