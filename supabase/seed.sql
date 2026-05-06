-- ============================================================
-- Seed: Escola Crescer (dados do protótipo)
-- Rodar após a migration e após criar os usuários via Auth
-- ============================================================

-- Substituir estes UUIDs pelos IDs reais criados no Supabase Auth
-- antes de rodar o seed em produção.

do $$
declare
  v_school_id  uuid := gen_random_uuid();
  v_helena     uuid := gen_random_uuid(); -- school_admin
  v_beatriz    uuid := gen_random_uuid();
  v_carlos     uuid := gen_random_uuid();
  v_renata     uuid := gen_random_uuid();
  v_paulo      uuid := gen_random_uuid();
  v_marcos     uuid := gen_random_uuid();
  v_julia      uuid := gen_random_uuid();
  v_task1      uuid := gen_random_uuid();
  v_task2      uuid := gen_random_uuid();
  v_task3      uuid := gen_random_uuid();
  v_task4      uuid := gen_random_uuid();
  v_task5      uuid := gen_random_uuid();
begin

-- School
insert into public.schools (id, name, slug) values
  (v_school_id, 'Escola Crescer', 'escola-crescer');

-- Profiles (fake auth user IDs — replace with real ones)
insert into public.profiles (id, full_name, role, department, avatar_color, school_id) values
  (v_helena,  'Helena Tavares',  'school_admin', 'Coordenação', '#E87A30',  v_school_id),
  (v_beatriz, 'Beatriz Souza',   'staff',        'Pedagógico',  '#3D7A2A',  v_school_id),
  (v_carlos,  'Carlos Mendes',   'staff',        'Coordenação', '#4AABCC',  v_school_id),
  (v_renata,  'Renata Lima',     'staff',        'Secretaria',  '#D94F6A',  v_school_id),
  (v_paulo,   'Paulo Faria',     'staff',        'Secretaria',  '#5A8A3A',  v_school_id),
  (v_marcos,  'Marcos Dias',     'staff',        'Manutenção',  '#B8930C',  v_school_id),
  (v_julia,   'Júlia Oliveira',  'staff',        'Pedagógico',  '#E87A30',  v_school_id);

-- Tasks
insert into public.tasks (id, school_id, title, area, priority, status, progress, due_date, created_by) values
  (v_task1, v_school_id, 'Reunião com pais — caso 7º ano B',     'Coordenação', 'critical', 'in_progress', 70, current_date,          v_helena),
  (v_task2, v_school_id, 'Preparar boletins do 1º bimestre',     'Pedagógico',  'critical', 'overdue',     85, current_date - 2,      v_beatriz),
  (v_task3, v_school_id, 'Revisar contratos de fornecedores 2026','Secretaria',  'high',     'open',        40, current_date + 1,      v_helena),
  (v_task4, v_school_id, 'Plano de aula — Semana da Leitura',    'Pedagógico',  'high',     'in_progress', 30, current_date + 2,      v_beatriz),
  (v_task5, v_school_id, 'Manutenção dos bebedouros — bloco B',  'Manutenção',  'normal',   'open',        10, current_date + 4,      v_marcos);

-- Assignees
insert into public.task_assignees (task_id, user_id) values
  (v_task1, v_carlos), (v_task1, v_helena),
  (v_task2, v_beatriz),
  (v_task3, v_renata),  (v_task3, v_paulo),
  (v_task4, v_beatriz), (v_task4, v_julia),
  (v_task5, v_marcos);

-- Today's events
insert into public.events (school_id, title, starts_at, area, created_by) values
  (v_school_id, 'Reunião pedagógica semanal',        (current_date + interval '9 hours'),  'Coordenação', v_helena),
  (v_school_id, 'Visita técnica — bloco infantil',   (current_date + interval '11.5 hours'),'Manutenção', v_helena),
  (v_school_id, 'Revisão de planos de aula — Fund. I',(current_date + interval '14 hours'), 'Pedagógico', v_helena),
  (v_school_id, 'Atendimento aos pais — 7º B',       (current_date + interval '16 hours'), 'Coordenação', v_helena);

end $$;
