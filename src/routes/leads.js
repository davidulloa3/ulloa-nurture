const express  = require('express');
const router   = express.Router();
const supabase = require('../db/supabase');

// GET /api/leads — list all leads with nurture progress
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = supabase
      .from('leads')
      .select('*, nurture_log(*), inbound_messages(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ leads: data, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leads/:id — single lead with full history
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, nurture_log(*), inbound_messages(*)')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Lead not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leads — manually add a lead
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service_type, message, source } = req.body;

    if (!name || (!email && !phone)) {
      return res.status(400).json({ error: 'Name and email or phone are required' });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({ name, email, phone, service_type, message, source: source || 'manual' })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/leads/:id/takeover — resume or pause automation
router.patch('/:id/takeover', async (req, res) => {
  try {
    const { owner_takeover } = req.body;

    const { data, error } = await supabase
      .from('leads')
      .update({ owner_takeover: Boolean(owner_takeover) })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/leads/:id/status — update lead status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['active', 'completed', 'unqualified'];

    if (!valid.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });
    }

    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/leads/:id/notes — save notes for a lead
router.patch('/:id/notes', async (req, res) => {
  try {
    const { notes } = req.body;

    const { data, error } = await supabase
      .from('leads')
      .update({ notes })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/leads/:id — delete a lead and all related records
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/settings — get AI tone settings
router.get('/settings/ai', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/settings — update AI tone settings
router.patch('/settings/ai', async (req, res) => {
  try {
    const { tone, extra_context, sms_signature } = req.body;

    const { data, error } = await supabase
      .from('ai_settings')
      .upsert({ id: 1, tone, extra_context, sms_signature, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;