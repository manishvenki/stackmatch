import { Request, Response } from 'express';
import { store } from '../services/store';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messages = await store.getMessages(id);
    return res.json({
      success: true,
      data: messages
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch messages.'
    });
  }
};

export const postMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required.'
      });
    }

    // Record user message
    const userMsg = await store.addMessage(id, 'user', content.trim());

    // Generate intelligent contextual response (Architecture prepared for Master Prompt 02 AI LLM integration)
    const existingMessages = await store.getMessages(id);
    const msgCount = existingMessages.length;

    let assistantResponseContent = '';
    let stage: 'idea' | 'requirements' | 'planning' | 'finalize' = 'requirements';
    let suggestedResponses: string[] = [];

    const lower = content.toLowerCase();

    if (lower.includes('student') || lower.includes('restaurant') || lower.includes('admin') || lower.includes('user')) {
      stage = 'requirements';
      assistantResponseContent = `Got it. Catering to students, restaurant vendors, and campus admins requires a clear multi-role architecture.

For the platform access:
1. Would you like a responsive web application, mobile apps (iOS & Android), or both?
2. Do you require online payment collection (UPI, cards), or will students pay at pickup counters?`;
      suggestedResponses = ['Both web and mobile', 'Web only for MVP', 'Online payments (UPI/Card)'];
    } else if (lower.includes('mobile') || lower.includes('web') || lower.includes('payment') || lower.includes('online')) {
      stage = 'planning';
      assistantResponseContent = `Understood! Having both web and mobile access with instant payment processing gives students maximum convenience during lunch rushes.

Based on this scope, I've outlined:
- Functional Requirements (User accounts, Menu browsing, Live orders, Payments)
- Non-Functional Requirements (High concurrency lunch spikes, Tokenized security)
- Recommended Tech Stack: React + React Native, Node.js API, and PostgreSQL for transactional integrity.

Would you like to review the generated project requirements and architecture now?`;
      suggestedResponses = ['View Project Overview', 'Explore Tech Stack', 'Review Architecture'];
    } else {
      stage = 'idea';
      assistantResponseContent = `That's a great project direction. To help structure the best technology recommendations and timeline:

1. Who are the primary target users for this product?
2. What are the key features needed for your minimum viable version (MVP)?
3. What platforms should we target first (Web, Mobile, or Both)?`;
      suggestedResponses = [
        'Students and campus merchants',
        'Both web and mobile',
        'Simple web MVP first'
      ];
    }

    // Save assistant message
    const assistantMsg = await store.addMessage(id, 'assistant', assistantResponseContent, {
      stage,
      suggestedResponses
    });

    // Update project stage
    await store.updateProject(id, { currentStage: stage });

    return res.status(201).json({
      success: true,
      data: {
        userMessage: userMsg,
        assistantMessage: assistantMsg
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to process message.'
    });
  }
};
