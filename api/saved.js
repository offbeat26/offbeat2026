import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
    const userId = req.headers['x-user-id'] || 'anonymous';

    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('saved_places')
            .select('place_id')
            .eq('user_id', userId);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data.map(d => d.place_id));
    }

    if (req.method === 'POST') {
        const { placeId } = req.body;
        if (!placeId) return res.status(400).json({ error: 'placeId required' });

        const { error } = await supabase
            .from('saved_places')
            .insert({ user_id: userId, place_id: placeId });

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json({ saved: true });
    }

    if (req.method === 'DELETE') {
        const { placeId } = req.body;
        if (!placeId) return res.status(400).json({ error: 'placeId required' });

        const { error } = await supabase
            .from('saved_places')
            .delete()
            .eq('user_id', userId)
            .eq('place_id', placeId);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ saved: false });
    }

    res.status(405).json({ error: 'Method not allowed' });
}
