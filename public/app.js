// ============================================
// 하드코딩된 폴백 데이터 (Supabase 연결 실패 시 사용)
// ============================================
const FALLBACK_VIBES = [
    { id: 'romantic', label: '로맨틱', emoji: '💕' },
    { id: 'hip', label: '힙한', emoji: '🔥' },
    { id: 'cozy', label: '아늑한', emoji: '🛋️' },
    { id: 'energetic', label: '활기찬', emoji: '⚡' },
    { id: 'calm', label: '조용한', emoji: '🌿' },
    { id: 'vintage', label: '빈티지', emoji: '📷' },
    { id: 'modern', label: '모던', emoji: '🏙️' },
    { id: 'natural', label: '자연친화', emoji: '🌳' },
    { id: 'artistic', label: '예술적', emoji: '🎨' },
    { id: 'luxury', label: '럭셔리', emoji: '✨' },
];

const FALLBACK_TASTES = [
    { id: 'coffee', label: '커피', emoji: '☕' },
    { id: 'dessert', label: '디저트', emoji: '🍰' },
    { id: 'brunch', label: '브런치', emoji: '🥞' },
    { id: 'wine', label: '와인/바', emoji: '🍷' },
    { id: 'korean', label: '한식', emoji: '🍚' },
    { id: 'japanese', label: '일식', emoji: '🍣' },
    { id: 'italian', label: '양식', emoji: '🍝' },
    { id: 'street', label: '스트릿푸드', emoji: '🌮' },
    { id: 'vegan', label: '비건', emoji: '🥗' },
    { id: 'bakery', label: '베이커리', emoji: '🥐' },
];

const FALLBACK_PLACES = [
    { id: '1', name: '달빛정원 카페', category: '카페', rating: 4.7, address: '서울 성수동 12-3', tags: ['로맨틱', '야경'], emoji: '🌙', lat: 37.5445, lng: 127.0567, vibe_ids: ['romantic'] },
    { id: '2', name: '로즈가든', category: '레스토랑', rating: 4.5, address: '서울 한남동 45-6', tags: ['로맨틱', '데이트'], emoji: '🌹', lat: 37.5340, lng: 127.0026, vibe_ids: ['romantic'] },
    { id: '3', name: '루프탑 329', category: '바', rating: 4.6, address: '서울 이태원 32-9', tags: ['힙한', '루프탑'], emoji: '🏙️', lat: 37.5345, lng: 126.9940, vibe_ids: ['hip'] },
    { id: '4', name: '언더그라운드', category: '카페', rating: 4.4, address: '서울 연남동 78-1', tags: ['힙한', '인디'], emoji: '🎵', lat: 37.5660, lng: 126.9245, vibe_ids: ['hip'] },
    { id: '5', name: '책방 이웃', category: '북카페', rating: 4.8, address: '서울 망원동 34-5', tags: ['아늑한', '독서'], emoji: '📚', lat: 37.5560, lng: 126.9105, vibe_ids: ['cozy'] },
    { id: '6', name: '솜사탕 하우스', category: '카페', rating: 4.3, address: '서울 연희동 56-7', tags: ['아늑한', '소규모'], emoji: '☁️', lat: 37.5680, lng: 126.9290, vibe_ids: ['cozy'] },
    { id: '7', name: '비트클럽', category: '클럽', rating: 4.2, address: '서울 홍대 12-8', tags: ['활기찬', '음악'], emoji: '🎶', lat: 37.5563, lng: 126.9237, vibe_ids: ['energetic'] },
    { id: '8', name: '스포츠펍 에이스', category: '펍', rating: 4.5, address: '서울 강남 89-2', tags: ['활기찬', '스포츠'], emoji: '⚽', lat: 37.4979, lng: 127.0276, vibe_ids: ['energetic'] },
    { id: '9', name: '선재 찻집', category: '찻집', rating: 4.9, address: '서울 북촌 23-4', tags: ['조용한', '전통'], emoji: '🍵', lat: 37.5826, lng: 126.9831, vibe_ids: ['calm'] },
    { id: '10', name: '명상 카페 고요', category: '카페', rating: 4.6, address: '서울 삼청동 67-8', tags: ['조용한', '명상'], emoji: '🧘', lat: 37.5850, lng: 126.9817, vibe_ids: ['calm'] },
    { id: '11', name: '서울숲 브런치', category: '브런치', rating: 4.5, address: '서울 성수동 45-1', tags: ['인기', '브런치'], emoji: '🌿', lat: 37.5445, lng: 127.0370, vibe_ids: ['natural'] },
    { id: '12', name: '하이드아웃', category: '카페', rating: 4.4, address: '서울 합정동 23-7', tags: ['분위기', '카페'], emoji: '🏡', lat: 37.5496, lng: 126.9136, vibe_ids: ['vintage'] },
    { id: '13', name: '어반가든', category: '레스토랑', rating: 4.6, address: '서울 이태원 56-3', tags: ['맛집', '양식'], emoji: '🌿', lat: 37.5340, lng: 126.9940, vibe_ids: ['modern'] },
];

// ============================================
// API 호출 헬퍼
// ============================================
async function apiFetch(url, options = {}) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn(`API 호출 실패 (${url}):`, err.message);
        return null;
    }
}

// 간단한 user ID (익명)
function getUserId() {
    let uid = localStorage.getItem('vibe_user_id');
    if (!uid) {
        uid = 'user_' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem('vibe_user_id', uid);
    }
    return uid;
}

// ============================================
// 앱 상태
// ============================================
const DARK_MAP_STYLES = [
    { elementType: 'geometry', stylers: [{ color: '#0f0f1a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#a0a0c0' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f1a' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#2a2a4a' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#242444' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0a1a' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6c6c8a' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#2a2a4a' }] },
];

const state = {
    selectedVibes: new Set(),
    selectedTastes: new Set(),
    userLocation: null,
    recommendedPlaces: [],
    savedPlaceIds: new Set(),
    currentSpotIndex: 0,
    allPlaces: [],
    map: null,
    markers: [],
};

// ============================================
// DOM 요소
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================
// 초기화
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    bindEvents();
});

async function loadData() {
    // Supabase API에서 데이터 로드, 실패 시 폴백
    const [vibes, tastes] = await Promise.all([
        apiFetch('/api/vibes'),
        apiFetch('/api/tastes'),
    ]);

    renderVibeButtons(vibes || FALLBACK_VIBES);
    renderTasteButtons(tastes || FALLBACK_TASTES);
}

// ============================================
// 바이브/테이스트 버튼 렌더링
// ============================================
function renderVibeButtons(data) {
    const container = $('#vibe-buttons');
    container.innerHTML = data.map(v =>
        `<button class="tag-btn" data-type="vibe" data-id="${v.id}">${v.emoji} ${v.label}</button>`
    ).join('');
}

function renderTasteButtons(data) {
    const container = $('#taste-buttons');
    container.innerHTML = data.map(t =>
        `<button class="tag-btn" data-type="taste" data-id="${t.id}">${t.emoji} ${t.label}</button>`
    ).join('');
}

// ============================================
// 이벤트 바인딩
// ============================================
function bindEvents() {
    // 바이브/테이스트 태그 클릭
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.tag-btn');
        if (!btn) return;

        const type = btn.dataset.type;
        const id = btn.dataset.id;
        const set = type === 'vibe' ? state.selectedVibes : state.selectedTastes;

        if (set.has(id)) {
            set.delete(id);
            btn.classList.remove('selected');
        } else {
            set.add(id);
            btn.classList.add('selected');
        }

        updateApplyButton();
    });

    // Apply 버튼
    $('#apply-btn').addEventListener('click', () => {
        if (state.selectedVibes.size === 0 && state.selectedTastes.size === 0) return;
        showLocationPopup();
    });

    // 위치 승인 팝업
    $('#location-allow').addEventListener('click', () => {
        hideLocationPopup();
        requestLocation();
    });

    $('#location-deny').addEventListener('click', () => {
        hideLocationPopup();
        state.userLocation = { lat: 37.5665, lng: 126.9780 };
        transitionToMainView();
    });

    // Personal AI 버튼
    $('#personal-ai-btn').addEventListener('click', () => {
        toggleAIPanel(true);
    });

    $('#ai-close-btn').addEventListener('click', () => {
        toggleAIPanel(false);
    });

    // AI 채팅 입력
    $('#ai-send-btn').addEventListener('click', sendAIMessage);
    $('#ai-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendAIMessage();
    });

    // Making yours 버튼
    $('#making-yours-btn').addEventListener('click', toggleSaveSpot);

    // 뒤로가기
    $('#back-to-vibe-btn').addEventListener('click', () => {
        state.map = null;
        state.markers = [];
        switchScreen('vibe-selection-view');
    });

    // 업체 카드 클릭
    $('#business-list').addEventListener('click', (e) => {
        const card = e.target.closest('.business-card');
        if (!card) return;
        const idx = parseInt(card.dataset.index);
        selectPlace(idx);
    });
}

// ============================================
// Apply 버튼 상태 업데이트
// ============================================
function updateApplyButton() {
    const btn = $('#apply-btn');
    const hasSelection = state.selectedVibes.size > 0 || state.selectedTastes.size > 0;
    btn.classList.toggle('enabled', hasSelection);
    btn.disabled = !hasSelection;
}

// ============================================
// 위치 팝업
// ============================================
function showLocationPopup() {
    $('#location-popup').classList.remove('hidden');
}

function hideLocationPopup() {
    $('#location-popup').classList.add('hidden');
}

// ============================================
// 위치 요청
// ============================================
function requestLocation() {
    if (!navigator.geolocation) {
        state.userLocation = { lat: 37.5665, lng: 126.9780 };
        transitionToMainView();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            state.userLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            };
            transitionToMainView();
        },
        () => {
            state.userLocation = { lat: 37.5665, lng: 126.9780 };
            transitionToMainView();
        },
        { timeout: 5000 }
    );
}

// ============================================
// 메인 화면 전환
// ============================================
async function loadMapsAPI() {
    if (window.google?.maps) return;
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAlqPIt-KhWqCZg78mcu_haU9-GGEBHfLE';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

async function transitionToMainView() {
    await Promise.all([loadMapsAPI(), fetchRecommendations(), fetchSavedPlaces()]);
    renderMainView();
    switchScreen('main-view');
}

function switchScreen(screenId) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    $(`#${screenId}`).classList.add('active');
}

// ============================================
// Supabase에서 장소 추천 가져오기
// ============================================
async function fetchRecommendations() {
    const vibeList = [...state.selectedVibes].join(',');
    const data = await apiFetch(`/api/places?vibes=${encodeURIComponent(vibeList)}`);

    if (data && data.length > 0) {
        state.recommendedPlaces = data;
    } else {
        // 폴백: 로컬 데이터에서 필터링
        const vibes = [...state.selectedVibes];
        if (vibes.length === 0) {
            state.recommendedPlaces = FALLBACK_PLACES;
        } else {
            const filtered = FALLBACK_PLACES.filter(p =>
                p.vibe_ids.some(v => vibes.includes(v))
            );
            state.recommendedPlaces = filtered.length > 0 ? filtered : FALLBACK_PLACES;
        }
    }
}

// ============================================
// 저장된 장소 가져오기
// ============================================
async function fetchSavedPlaces() {
    const data = await apiFetch('/api/saved', {
        headers: { 'X-User-Id': getUserId() },
    });
    state.savedPlaceIds = new Set(data || []);
}

// ============================================
// 메인 화면 렌더링
// ============================================
function renderMainView() {
    renderMap();
    renderBusinessList();
    if (state.recommendedPlaces.length > 0) {
        selectPlace(0);
    }
}

function makeMarkerIcon(emoji, selected) {
    const fill = selected ? '#6C5CE7' : '#1A1A2E';
    const stroke = selected ? '#A29BFE' : '#2A2A4A';
    const size = selected ? 48 : 40;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.3}" viewBox="0 0 40 52">
        <path d="M20 0 C9 0 0 9 0 20 C0 34 20 52 20 52 C20 52 40 34 40 20 C40 9 31 0 20 0 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
        <text x="20" y="24" text-anchor="middle" dominant-baseline="middle" font-size="18">${emoji}</text>
    </svg>`;
    return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        scaledSize: new google.maps.Size(size, size * 1.3),
        anchor: new google.maps.Point(size / 2, size * 1.3),
    };
}

function renderMap() {
    const container = $('#map-display');
    const place = state.recommendedPlaces[state.currentSpotIndex];
    const center = place
        ? { lat: place.lat, lng: place.lng }
        : state.userLocation || { lat: 37.5665, lng: 126.9780 };

    if (!state.map) {
        container.innerHTML = '<div id="map-canvas" style="width:100%;height:100%;"></div>';
        state.map = new google.maps.Map($('#map-canvas'), {
            center,
            zoom: 15,
            styles: DARK_MAP_STYLES,
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            zoomControl: true,
            zoomControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
        });

        state.markers = state.recommendedPlaces.map((p, i) => {
            const marker = new google.maps.Marker({
                position: { lat: p.lat, lng: p.lng },
                map: state.map,
                title: p.name,
                icon: makeMarkerIcon(p.emoji, i === state.currentSpotIndex),
                zIndex: i === state.currentSpotIndex ? 10 : 1,
            });
            marker.addListener('click', () => selectPlace(i));
            return marker;
        });
    } else {
        state.markers.forEach((marker, i) => {
            const p = state.recommendedPlaces[i];
            marker.setIcon(makeMarkerIcon(p.emoji, i === state.currentSpotIndex));
            marker.setZIndex(i === state.currentSpotIndex ? 10 : 1);
        });
        state.map.panTo(center);
    }
}

function renderBusinessList() {
    const container = $('#business-list');
    container.innerHTML = state.recommendedPlaces.map((place, i) => `
        <div class="business-card ${i === 0 ? 'active' : ''}" data-index="${i}">
            <div class="business-thumb">${place.emoji}</div>
            <div class="business-info">
                <div class="business-name">${place.name}</div>
                <div class="business-detail">
                    ${place.category} · ⭐ ${place.rating} · ${place.address}
                </div>
                <div class="business-tags">
                    ${place.tags.map(t => `<span class="business-tag">#${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// 장소 선택
// ============================================
function selectPlace(index) {
    state.currentSpotIndex = index;
    const place = state.recommendedPlaces[index];
    if (!place) return;

    $('#spot-name').textContent = place.name;
    $('#spot-description').textContent = `${place.category} · ⭐ ${place.rating} · ${place.address}`;

    // Making yours 버튼 상태
    const btn = $('#making-yours-btn');
    if (state.savedPlaceIds.has(place.id)) {
        btn.textContent = '♥ Saved';
        btn.classList.add('saved');
    } else {
        btn.textContent = '♡ Making yours';
        btn.classList.remove('saved');
    }

    $$('.business-card').forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });

    renderMap();
}

// ============================================
// 저장 토글 (Supabase 연동)
// ============================================
async function toggleSaveSpot() {
    const place = state.recommendedPlaces[state.currentSpotIndex];
    if (!place) return;

    const btn = $('#making-yours-btn');
    const userId = getUserId();

    if (state.savedPlaceIds.has(place.id)) {
        // 삭제
        state.savedPlaceIds.delete(place.id);
        btn.textContent = '♡ Making yours';
        btn.classList.remove('saved');

        await apiFetch('/api/saved', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': userId,
            },
            body: JSON.stringify({ placeId: place.id }),
        });
    } else {
        // 저장
        state.savedPlaceIds.add(place.id);
        btn.textContent = '♥ Saved';
        btn.classList.add('saved');

        await apiFetch('/api/saved', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': userId,
            },
            body: JSON.stringify({ placeId: place.id }),
        });
    }
}

// ============================================
// AI 패널
// ============================================
function toggleAIPanel(show) {
    const panel = $('#ai-panel');
    if (show) {
        panel.classList.remove('hidden');
        panel.style.display = 'flex';
        $('#ai-input').focus();
    } else {
        panel.classList.add('hidden');
    }
}

async function sendAIMessage() {
    const input = $('#ai-input');
    const text = input.value.trim();
    if (!text) return;

    const chat = $('#ai-chat');
    const sendBtn = $('#ai-send-btn');

    chat.innerHTML += `<div class="ai-message user">${escapeHtml(text)}</div>`;
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    // 로딩 표시
    const loadingId = 'ai-loading-' + Date.now();
    chat.innerHTML += `<div class="ai-message" id="${loadingId}">...</div>`;
    sendBtn.disabled = true;
    chat.scrollTop = chat.scrollHeight;

    try {
        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                vibes: [...state.selectedVibes].join(', ') || '없음',
                places: state.recommendedPlaces,
                currentPlace: state.recommendedPlaces[state.currentSpotIndex] || null,
            }),
        });

        const data = await res.json();
        const reply = data.reply || '답변을 가져오지 못했어요.';
        document.getElementById(loadingId).textContent = reply;
    } catch (err) {
        document.getElementById(loadingId).textContent = '오류가 발생했어요. 다시 시도해주세요.';
    } finally {
        sendBtn.disabled = false;
        chat.scrollTop = chat.scrollHeight;
    }
}

// ============================================
// 유틸리티
// ============================================
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
