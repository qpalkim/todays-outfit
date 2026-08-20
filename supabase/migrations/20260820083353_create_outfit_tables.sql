-- category CHECK 제약 값은 lib/constants/category.ts의 CLOTHING_CATEGORIES와
-- 반드시 동일하게 유지해야 합니다. 상수 배열을 수정하면 이 CHECK도 함께 수정하세요.

create table public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  record_date date not null,
  photo_url text not null,
  memo text,
  created_at timestamptz not null default now(),
  constraint outfits_user_id_record_date_key unique (user_id, record_date)
);

create table public.clothing_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category = any (array['top', 'bottom', 'shoes', 'outer', 'etc'])),
  name text not null,
  photo_url text not null,
  created_at timestamptz not null default now()
);

create index clothing_items_user_id_category_idx
  on public.clothing_items (user_id, category);

create table public.outfit_items (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid not null references public.outfits(id) on delete cascade,
  clothing_item_id uuid not null references public.clothing_items(id) on delete cascade,
  constraint outfit_items_outfit_id_clothing_item_id_key unique (outfit_id, clothing_item_id)
);

create index outfit_items_clothing_item_id_idx
  on public.outfit_items (clothing_item_id);

-- RLS 활성화
alter table public.outfits enable row level security;
alter table public.clothing_items enable row level security;
alter table public.outfit_items enable row level security;

-- outfits 정책 (4종)
create policy "Users can view own outfits"
  on public.outfits for select
  using (auth.uid() = user_id);

create policy "Users can insert own outfits"
  on public.outfits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own outfits"
  on public.outfits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own outfits"
  on public.outfits for delete
  using (auth.uid() = user_id);

-- clothing_items 정책 (4종)
create policy "Users can view own clothing items"
  on public.clothing_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own clothing items"
  on public.clothing_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own clothing items"
  on public.clothing_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own clothing items"
  on public.clothing_items for delete
  using (auth.uid() = user_id);

-- outfit_items 정책 (4종) — 상위 outfit 소유권 EXISTS 검사
create policy "Users can view own outfit items"
  on public.outfit_items for select
  using (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.user_id = auth.uid()
    )
  );

create policy "Users can insert own outfit items"
  on public.outfit_items for insert
  with check (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.user_id = auth.uid()
    )
    and exists (
      select 1 from public.clothing_items c
      where c.id = outfit_items.clothing_item_id and c.user_id = auth.uid()
    )
  );

create policy "Users can update own outfit items"
  on public.outfit_items for update
  using (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.user_id = auth.uid()
    )
  );

create policy "Users can delete own outfit items"
  on public.outfit_items for delete
  using (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.user_id = auth.uid()
    )
  );
