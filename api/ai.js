export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, vibes, places, currentPlace } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const placesContext = places && places.length > 0
        ? places.map(p => `- ${p.name} (${p.category}, ⭐${p.rating}, ${p.address})`).join('\n')
        : '추천 장소 없음';

    const systemPrompt = `당신은 장소 추천 앱 "Vibe Spot"의 AI 어시스턴트입니다.
사용자가 선택한 바이브: ${vibes || '없음'}
현재 보고 있는 장소: ${currentPlace ? `${currentPlace.name} (${currentPlace.category}, ${currentPlace.address})` : '없음'}
추천된 장소 목록:
${placesContext}

위 정보를 바탕으로 사용자의 질문에 친근하고 도움이 되는 한국어로 답변해주세요. 답변은 2-3문장으로 간결하게 해주세요.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ parts: [{ text: message }] }],
                }),
            }
        );

        if (!response.ok) {
            const err = await response.json();
            return res.status(500).json({ error: err.error?.message || 'Gemini API error' });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '답변을 가져오지 못했어요.';
        res.status(200).json({ reply: text });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
