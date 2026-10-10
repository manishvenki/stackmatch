import { Request, Response } from 'express';
import { store } from '../services/store';
import { aiPlanningService } from '../services/aiPlanningService';

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

    // Retrieve project and conversation history
    const project = await store.getProjectById(id);
    const existingMessages = await store.getMessages(id);
    const projectName = project ? project.name : 'Project';

    // Retrieve user onboarding background if available
    let onboarding = null;
    if ((req as any).user?.id) {
      const user = await store.findUserById((req as any).user.id);
      if (user?.onboardingResponses) {
        onboarding = user.onboardingResponses;
      }
    }

    // Call Google Gemini AI Service (with graceful development fallback)
    const { geminiService } = await import('../services/geminiService');
    const aiResult = await geminiService.generatePlanningChat(
      content.trim(),
      project,
      existingMessages.map(m => ({ role: m.role, content: m.content })),
      onboarding
    );

    const assistantResponseContent = aiResult.content;
    const stage = aiResult.stage;
    const suggestedResponses = aiResult.suggestedResponses;

    // Also run structural idea analysis in background to keep project summary enriched
    const fullPromptContext = existingMessages.map(m => m.content).join(' ') + ' ' + content;
    const analysis = await aiPlanningService.analyzeIdea(fullPromptContext, projectName);

    // Save assistant message with metadata
    const assistantMsg = await store.addMessage(id, 'assistant', assistantResponseContent, {
      stage,
      suggestedResponses,
      isLiveAi: aiResult.isLiveAi,
      model: aiResult.model,
      followUpQuestion: analysis.followUpQuestions[0],
      analysisSummary: {
        problemStatement: analysis.problemStatement,
        targetUsers: analysis.targetUsers,
        mainGoals: analysis.mainGoals,
        platformRequirements: analysis.platformRequirements
      }
    });

    // Automatically update project stage and summary in store
    if (project) {
      await store.updateProject(id, {
        currentStage: stage,
        summary: {
          projectType: analysis.platformRequirements.join(' + ') || 'Web + Mobile Application',
          primaryUsers: analysis.targetUsers,
          industry: 'Software & Technology',
          keyFeatures: ['User Onboarding', 'Core Workflows', 'Role-Based Dashboard'],
          estimatedComplexity: 'Medium',
          estimatedTimeline: '2–4 months',
          goals: analysis.mainGoals,
          targetAudience: analysis.targetUsers,
          constraints: analysis.constraints,
          assumptions: analysis.assumptions,
          userRoles: analysis.targetUsers
        }
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        userMessage: userMsg,
        assistantMessage: assistantMsg,
        analysis
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to process message.'
    });
  }
};
