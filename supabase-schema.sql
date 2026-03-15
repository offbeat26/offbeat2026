-- ============================================
-- Supabase 테이블 스키마
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. 바이브 데이터 테이블
CREATE TABLE vibes (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    emoji TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 테이스트 데이터 테이블
CREATE TABLE tastes (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    emoji TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 장소 데이터 테이블
CREATE TABLE places (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    rating NUMERIC(2,1) DEFAULT 0.0,
    address TEXT,
    emoji TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    tags TEXT[] DEFAULT '{}',
    vibe_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 사용자 저장 장소 테이블
CREATE TABLE saved_places (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, place_id)
);

-- ============================================
-- 초기 데이터 삽입
-- ============================================

-- 바이브 데이터
INSERT INTO vibes (id, label, emoji, sort_order) VALUES
    ('romantic', '로맨틱', '💕', 1),
    ('hip', '힙한', '🔥', 2),
    ('cozy', '아늑한', '🛋️', 3),
    ('energetic', '활기찬', '⚡', 4),
    ('calm', '조용한', '🌿', 5),
    ('vintage', '빈티지', '📷', 6),
    ('modern', '모던', '🏙️', 7),
    ('natural', '자연친화', '🌳', 8),
    ('artistic', '예술적', '🎨', 9),
    ('luxury', '럭셔리', '✨', 10);

-- 테이스트 데이터
INSERT INTO tastes (id, label, emoji, sort_order) VALUES
    ('coffee', '커피', '☕', 1),
    ('dessert', '디저트', '🍰', 2),
    ('brunch', '브런치', '🥞', 3),
    ('wine', '와인/바', '🍷', 4),
    ('korean', '한식', '🍚', 5),
    ('japanese', '일식', '🍣', 6),
    ('italian', '양식', '🍝', 7),
    ('street', '스트릿푸드', '🌮', 8),
    ('vegan', '비건', '🥗', 9),
    ('bakery', '베이커리', '🥐', 10);

-- 장소 데이터
INSERT INTO places (name, category, rating, address, emoji, lat, lng, tags, vibe_ids) VALUES
    ('달빛정원 카페', '카페', 4.7, '서울 성수동 12-3', '🌙', 37.5445, 127.0567, ARRAY['로맨틱', '야경'], ARRAY['romantic']),
    ('로즈가든', '레스토랑', 4.5, '서울 한남동 45-6', '🌹', 37.5340, 127.0026, ARRAY['로맨틱', '데이트'], ARRAY['romantic']),
    ('루프탑 329', '바', 4.6, '서울 이태원 32-9', '🏙️', 37.5345, 126.9940, ARRAY['힙한', '루프탑'], ARRAY['hip']),
    ('언더그라운드', '카페', 4.4, '서울 연남동 78-1', '🎵', 37.5660, 126.9245, ARRAY['힙한', '인디'], ARRAY['hip']),
    ('책방 이웃', '북카페', 4.8, '서울 망원동 34-5', '📚', 37.5560, 126.9105, ARRAY['아늑한', '독서'], ARRAY['cozy']),
    ('솜사탕 하우스', '카페', 4.3, '서울 연희동 56-7', '☁️', 37.5680, 126.9290, ARRAY['아늑한', '소규모'], ARRAY['cozy']),
    ('비트클럽', '클럽', 4.2, '서울 홍대 12-8', '🎶', 37.5563, 126.9237, ARRAY['활기찬', '음악'], ARRAY['energetic']),
    ('스포츠펍 에이스', '펍', 4.5, '서울 강남 89-2', '⚽', 37.4979, 127.0276, ARRAY['활기찬', '스포츠'], ARRAY['energetic']),
    ('선재 찻집', '찻집', 4.9, '서울 북촌 23-4', '🍵', 37.5826, 126.9831, ARRAY['조용한', '전통'], ARRAY['calm']),
    ('명상 카페 고요', '카페', 4.6, '서울 삼청동 67-8', '🧘', 37.5850, 126.9817, ARRAY['조용한', '명상'], ARRAY['calm']),
    ('서울숲 브런치', '브런치', 4.5, '서울 성수동 45-1', '🌿', 37.5445, 127.0370, ARRAY['인기', '브런치'], ARRAY['natural']),
    ('하이드아웃', '카페', 4.4, '서울 합정동 23-7', '🏡', 37.5496, 126.9136, ARRAY['분위기', '카페'], ARRAY['vintage']),
    ('어반가든', '레스토랑', 4.6, '서울 이태원 56-3', '🌿', 37.5340, 126.9940, ARRAY['맛집', '양식'], ARRAY['modern']);

-- ============================================
-- RLS (Row Level Security) 설정
-- ============================================

-- vibes, tastes, places는 누구나 읽기 가능
ALTER TABLE vibes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vibes_read" ON vibes FOR SELECT USING (true);

ALTER TABLE tastes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tastes_read" ON tastes FOR SELECT USING (true);

ALTER TABLE places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "places_read" ON places FOR SELECT USING (true);

-- saved_places는 본인 데이터만 접근
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saved_read" ON saved_places FOR SELECT USING (true);
CREATE POLICY "saved_insert" ON saved_places FOR INSERT WITH CHECK (true);
CREATE POLICY "saved_delete" ON saved_places FOR DELETE USING (true);
