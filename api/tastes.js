import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { data, error } = await supabase
        .from('tastes')
        .select('*')
        .order('sort_order');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
}
