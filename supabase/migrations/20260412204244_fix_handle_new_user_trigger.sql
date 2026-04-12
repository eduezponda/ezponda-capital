-- Fix handle_new_user to populate profiles correctly for OAuth users.
-- Google OAuth stores the email and name under raw_user_meta_data, which
-- the previous version did not account for. Trigger is left in place.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, new.raw_user_meta_data->>'email'),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    'free'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
