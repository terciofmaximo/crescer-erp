-- ============================================================
-- Crescer ERP — Schema inicial
-- ============================================================

-- Schools
create table public.schools (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  created_by   uuid,
  created_at   timestamptz not null default now()
);

-- Profiles (extends auth.users 1:1)
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text not null,
  role         text not null check (role in ('platform_admin', 'school_admin', 'staff')),
  department   text check (department in ('Pedagógico', 'Coordenação', 'Secretaria', 'Manutenção', 'Eventos')),
  avatar_color text not null default '#3D7A2A',
  school_id    uuid references public.schools(id),
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Invitations
create table public.invitations (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid not null references public.schools(id) on delete cascade,
  role         text not null check (role in ('school_admin', 'staff')),
  department   text check (department in ('Pedagógico', 'Coordenação', 'Secretaria', 'Manutenção', 'Eventos')),
  label        text,
  token        text not null unique default gen_random_uuid()::text,
  invited_by   uuid references public.profiles(id),
  expires_at   timestamptz not null default now() + interval '30 days',
  accepted_at  timestamptz,
  created_at   timestamptz not null default now()
);

-- Tasks
create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid not null references public.schools(id) on delete cascade,
  title        text not null,
  area         text not null check (area in ('Pedagógico', 'Coordenação', 'Secretaria', 'Manutenção', 'Eventos')),
  priority     text not null check (priority in ('critical', 'high', 'normal')),
  status       text not null default 'open' check (status in ('open', 'in_progress', 'done', 'overdue')),
  progress     int not null default 0 check (progress between 0 and 100),
  due_date     date,
  created_by   uuid references public.profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table public.task_assignees (
  task_id      uuid not null references public.tasks(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  primary key (task_id, user_id)
);

-- Events / Agenda
create table public.events (
  id           uuid primary key default gen_random_uuid(),
  school_id    uuid not null references public.schools(id) on delete cascade,
  title        text not null,
  starts_at    timestamptz not null,
  area         text check (area in ('Pedagógico', 'Coordenação', 'Secretaria', 'Manutenção', 'Eventos')),
  created_by   uuid references public.profiles(id),
  created_at   timestamptz not null default now()
);

create table public.event_attendees (
  event_id     uuid not null references public.events(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  primary key (event_id, user_id)
);

-- ============================================================
-- Trigger: create profile on auth.user insert
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  -- Profile row created by the join flow (via service role), not here.
  -- This trigger exists only as a safety net.
  return new;
end;
$$;

-- auto-update updated_at on tasks
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.schools        enable row level security;
alter table public.profiles       enable row level security;
alter table public.invitations    enable row level security;
alter table public.tasks          enable row level security;
alter table public.task_assignees enable row level security;
alter table public.events         enable row level security;
alter table public.event_attendees enable row level security;

-- Helper: get current user's role
create or replace function public.my_role()
returns text language sql security definer stable as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Helper: get current user's school_id
create or replace function public.my_school()
returns uuid language sql security definer stable as $$
  select school_id from public.profiles where id = auth.uid()
$$;

-- Schools
create policy "platform_admin can do anything"
  on public.schools for all
  using (public.my_role() = 'platform_admin');

create policy "school members can read own school"
  on public.schools for select
  using (id = public.my_school());

-- Profiles
create policy "platform_admin can do anything"
  on public.profiles for all
  using (public.my_role() = 'platform_admin');

create policy "school members can read profiles in same school"
  on public.profiles for select
  using (school_id = public.my_school());

create policy "users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

-- Invitations (token must be readable without auth for /join page)
create policy "platform_admin can do anything"
  on public.invitations for all
  using (public.my_role() = 'platform_admin');

create policy "school_admin can manage own school invitations"
  on public.invitations for all
  using (school_id = public.my_school() and public.my_role() = 'school_admin');

create policy "anyone can read invitation by token"
  on public.invitations for select
  using (true);

-- Tasks
create policy "platform_admin can do anything"
  on public.tasks for all
  using (public.my_role() = 'platform_admin');

create policy "school members can read own school tasks"
  on public.tasks for select
  using (school_id = public.my_school());

create policy "school_admin can insert/update/delete tasks"
  on public.tasks for all
  using (school_id = public.my_school() and public.my_role() in ('school_admin'));

create policy "staff can update assigned tasks"
  on public.tasks for update
  using (
    school_id = public.my_school()
    and exists (
      select 1 from public.task_assignees
      where task_id = tasks.id and user_id = auth.uid()
    )
  );

-- Task assignees
create policy "school members can read"
  on public.task_assignees for select
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and t.school_id = public.my_school()
    )
  );

create policy "school_admin can manage"
  on public.task_assignees for all
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and t.school_id = public.my_school()
    )
    and public.my_role() in ('platform_admin', 'school_admin')
  );

-- Events
create policy "school members can read own school events"
  on public.events for select
  using (school_id = public.my_school());

create policy "school_admin can manage events"
  on public.events for all
  using (school_id = public.my_school() and public.my_role() in ('platform_admin', 'school_admin'));

-- Event attendees
create policy "school members can read"
  on public.event_attendees for select
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.school_id = public.my_school()
    )
  );

create policy "school_admin can manage"
  on public.event_attendees for all
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id and e.school_id = public.my_school()
    )
    and public.my_role() in ('platform_admin', 'school_admin')
  );
