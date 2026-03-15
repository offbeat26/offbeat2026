import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { vibes } = req.query;

    let query = supabase.from('places').select('*');

    if (vibes) {
        const vibeList = vibes.split(',');
        query = query.overlaps('vibe_ids', vibeList);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
}
