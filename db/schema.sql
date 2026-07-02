create type lead_status as enum ('new', 'qualified', 'meeting', 'proposal', 'won', 'lost');
create type lead_priority as enum ('alta', 'media', 'baja');
create type event_phase as enum ('descubrimiento', 'diseno', 'proveedores', 'produccion', 'semana-boda');
create type service_status as enum ('pendiente', 'propuesto', 'reservado', 'contratado');
create type task_status as enum ('pendiente', 'en-curso', 'bloqueada', 'hecha');
create type calendar_kind as enum ('reunion', 'visita-tecnica', 'pago', 'deadline', 'dia-b');
create type user_role as enum ('admin', 'colaborador', 'lectura');

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role user_role not null default 'colaborador',
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('web', 'email', 'manual')),
  couple_name text not null,
  phone text not null,
  email text not null,
  event_date date not null,
  location text not null,
  budget numeric(12,2) not null check (budget >= 0),
  guests integer not null check (guests > 0),
  requested_service text not null,
  status lead_status not null default 'new',
  priority lead_priority not null default 'media',
  summary text not null default '',
  next_action text not null default '',
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  couple_name text not null,
  contacts jsonb not null default '[]',
  preferences text[] not null default '{}',
  notes text not null default '',
  rgpd_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  date date not null,
  location text not null,
  region text not null,
  guests integer not null check (guests > 0),
  style text not null default '',
  total_budget numeric(12,2) not null check (total_budget >= 0),
  phase event_phase not null default 'descubrimiento',
  risks text[] not null default '{}',
  dietary_needs text[] not null default '{}',
  accommodation_needs text not null default '',
  payment_status text not null default '',
  created_at timestamptz not null default now()
);

create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  region text not null,
  province text,
  city text,
  service_area text,
  phone text not null default '',
  email text not null default '',
  website text not null default '',
  contact_url text,
  source_url text,
  instagram_url text,
  google_maps_url text,
  capacity integer not null default 0,
  style_tags text[] not null default '{}',
  languages text[] not null default '{}',
  availability_type text not null default 'local' check (availability_type in ('local', 'se-desplaza', 'remoto')),
  packages jsonb not null default '[]'::jsonb,
  price_from numeric(12,2),
  price_range text,
  price_confidence text not null default 'baja' check (price_confidence in ('alta', 'media', 'baja')),
  reliability integer not null default 0 check (reliability between 0 and 10),
  response_time_hours integer not null default 0,
  previous_experience integer not null default 0,
  quality_score integer not null default 0 check (quality_score between 0 and 10),
  commission_free boolean not null default true,
  notes text not null default '',
  reviews_summary text,
  notes_internal text,
  status text not null default 'draft' check (status in ('draft', 'reviewed', 'verified', 'outdated')),
  last_checked_at date,
  lat numeric(10,7),
  lng numeric(10,7),
  google_place_id text,
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table vendor_prices (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendors(id) on delete cascade,
  service_name text not null,
  season text not null check (season in ('baja', 'media', 'alta')),
  region text not null,
  min_price numeric(12,2) not null check (min_price >= 0),
  max_price numeric(12,2) not null check (max_price >= min_price),
  conditions text not null default '',
  historical boolean not null default false,
  updated_at timestamptz not null default now()
);

create table event_services (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  category text not null,
  vendor_id uuid references vendors(id) on delete set null,
  estimated_cost numeric(12,2) not null default 0,
  margin numeric(12,2) not null default 0,
  status service_status not null default 'pendiente'
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  title text not null,
  owner_user_id uuid references users(id) on delete set null,
  owner_label text not null default '',
  due_date date not null,
  dependency text,
  status task_status not null default 'pendiente'
);

create table calendar_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  title text not null,
  kind calendar_kind not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  owner_user_id uuid references users(id) on delete set null,
  owner_label text not null default '',
  check (ends_at > starts_at)
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  type text not null check (type in ('contrato', 'presupuesto', 'factura', 'brief', 'guion', 'email')),
  title text not null,
  storage_url text,
  status text not null check (status in ('borrador', 'pendiente-firma', 'aprobado', 'archivado')),
  updated_at timestamptz not null default now()
);

create table communications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  channel text not null check (channel in ('email', 'nota-llamada', 'resumen-reunion')),
  subject text not null,
  body text not null,
  summary text not null default '',
  created_at timestamptz not null default now()
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_leads_status_priority on leads(status, priority);
create index idx_events_date on events(date);
create index idx_vendors_category_region on vendors(category, region);
create index idx_vendors_status_checked on vendors(status, last_checked_at);
create index idx_vendors_province_city on vendors(province, city);
create index idx_vendors_price_confidence on vendors(price_confidence, price_from);
create index idx_calendar_owner_time on calendar_items(owner_user_id, starts_at, ends_at);
create index idx_tasks_event_status on tasks(event_id, status);
