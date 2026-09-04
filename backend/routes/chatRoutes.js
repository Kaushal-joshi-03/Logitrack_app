const express = require('express');
const router = express.Router();

const SYSTEM_PROMPT = `You are LogiTrack's official AI Support Assistant (like ChatGPT).
Your goal is to provide concise, friendly, intelligent, and highly professional assistance to users.

Guidelines:
- Tone: Professional, warm, helpful, and concise (ChatGPT conversational style).
- Formatting: Use clean short paragraphs, bullet points, or numbered steps. Never produce raw unreadable tables or walls of text.
- Topics:
  • Tracking: Mention using the Tracking tab on LogiTrack or entering their Tracking ID (e.g. LT-1002).
  • Warehouse/Logistics: Guide users through intake scanning, status transitions, and distributor assignments.
  • Account/Shipments: Guide clients on creating shipments or viewing their active packages.
- Escalation: If an issue requires human assistance or manual review, provide support@logitrack.com or +91 1800 123 4567.
- Keep responses within 2-4 clean points so the user can read and act immediately.`;

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send message to LogiTrack AI Support Assistant (Groq API)
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               history:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: AI assistant response
 */
router.post('/', async (req, res) => {
  try {
    const { message, messages, history } = req.body;

    // Validate input
    if (!message && (!messages || !Array.isArray(messages) || messages.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'A message or messages array is required.'
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_key_here' || apiKey.trim() === '') {
      return res.status(503).json({
        success: false,
        message: 'Groq API key is not configured. Please add GROQ_API_KEY to your backend .env file.',
        fallbackReply: "I'm currently unable to connect to the AI engine because the API key is not configured. For immediate help, please email human support at support@logitrack.com."
      });
    }

    // Build message context (system prompt + recent history + current message)
    let formattedMessages = [{ role: 'system', content: SYSTEM_PROMPT }];

    if (Array.isArray(messages) && messages.length > 0) {
      const recent = messages.slice(-8).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: String(m.content || m.text || '')
      }));
      formattedMessages.push(...recent);
    } else if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-8).map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: String(h.content || h.text || '')
      }));
      formattedMessages.push(...recent);
      if (message) {
        formattedMessages.push({ role: 'user', content: String(message) });
      }
    } else if (message) {
      formattedMessages.push({ role: 'user', content: String(message) });
    }

    // Primary and fast fallback models
    const configuredModel = process.env.GROQ_MODEL;
    const fastCandidateModels = [
      'qwen/qwen3.8-27b',
      'groq/compound-mini',
      'openai/gpt-oss-120b'
    ];

    const modelsToTry = configuredModel
      ? [configuredModel, ...fastCandidateModels.filter(m => m !== configuredModel)]
      : fastCandidateModels;

    let aiReply = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: model,
            messages: formattedMessages,
            temperature: 0.6,
            max_tokens: 450
          })
        });

        const data = await response.json();

        if (response.ok && data.choices?.[0]?.message?.content) {
          aiReply = data.choices[0].message.content.trim();
          break; // Success!
        } else {
          lastError = data.error?.message || `Failed with model ${model}`;
          console.warn(`Groq model ${model} attempt failed: ${lastError}. Trying fallback...`);
        }
      } catch (callErr) {
        lastError = callErr.message;
        console.warn(`Groq fetch error with model ${model}:`, callErr);
      }
    }

    if (!aiReply) {
      return res.status(502).json({
        success: false,
        message: lastError || 'Error communicating with Groq API.',
        fallbackReply: "Sorry, I'm having trouble processing your request right now. Please reach out to us at support@logitrack.com for assistance."
      });
    }

    return res.status(200).json({
      success: true,
      reply: aiReply,
      message: aiReply
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process chat request.',
      fallbackReply: "An unexpected error occurred. Please try again or contact human support at support@logitrack.com."
    });
  }
});

module.exports = router;
