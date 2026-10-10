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

    // Compile cumulative context
    const fullPromptContext = existingMessages.map(m => m.content).join(' ');

    // Invoke AI Planning Service
    const analysis = await aiPlanningService.analyzeIdea(fullPromptContext, projectName);

    let assistantResponseContent = '';
    let stage: 'idea' | 'requirements' | 'planning' | 'finalize' = 'requirements';
    let suggestedResponses: string[] = [];

    const lower = content.toLowerCase();

    // Contextual intelligent conversational branching
    if (lower.includes('student') || lower.includes('restaurant') || lower.includes('admin') || lower.includes('user') || lower.includes('role')) {
      stage = 'requirements';
      assistantResponseContent = `Got it. Supporting ${analysis.targetUsers.join(', ')} requires clear role-based access control (RBAC) and dedicated portal views.

For primary product delivery:
1. Will your users access this via a web portal, native mobile app, or both?
2. Do you require online payment collection (UPI, Cards), or will transactions be settled externally?`;
      suggestedResponses = ['Both web and mobile', 'Online payments (UPI/Card)', 'Web only for MVP'];
    } else if (lower.includes('mobile') || lower.includes('web') || lower.includes('payment') || lower.includes('online')) {
      stage = 'planning';
      assistantResponseContent = `Understood! Having ${analysis.platformRequirements.join(' and ')} with instant payment processing gives users maximum convenience.

Based on this scope, I've outlined:
• Functional Requirements (${analysis.targetUsers[0]} flows, Catalog, Checkout, and Operations)
• Non-Functional Requirements (High concurrency spikes, Sub-500ms latency, Tokenized security)
• Recommended Stack: React + React Native, Node.js API Gateway, and PostgreSQL for ACID transactional integrity.

Would you like to generate the complete technical plan and review the architecture?`;
      suggestedResponses = ['Generate Complete Plan', 'Explore Tech Stack', 'Review Architecture'];
    } else if (lower.includes('generate') || lower.includes('complete plan') || lower.includes('architecture') || lower.includes('tech stack')) {
      stage = 'finalize';
      assistantResponseContent = `I have compiled your complete build-ready blueprint for "${projectName}":
✓ Requirements & User Stories synthesized
✓ Recommended Tech Stack with suitability scoring
✓ 3-Tier System Architecture Diagram generated
✓ 4-Phase Delivery Roadmap structured

You can click "View Project Plan" above or the buttons below to explore the specifications.`;
      suggestedResponses = ['View Project Plan', 'Inspect Requirements', 'Explore Tech Stack'];
    } else {
      stage = 'idea';
      assistantResponseContent = `That's a great project direction. I've extracted the initial concept:
• Problem: ${analysis.problemStatement}
• Target Users: ${analysis.targetUsers.join(', ')}

To refine the technology selection and architecture:
1. What is the most critical core feature needed on day one?
2. Which platform do you want to prioritize first (Web or Mobile)?`;
      suggestedResponses = [
        'Both web and mobile',
        'Simple web MVP first',
        'Mobile app first'
      ];
    }

    // Save assistant message with metadata
    const assistantMsg = await store.addMessage(id, 'assistant', assistantResponseContent, {
      stage,
      suggestedResponses,
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
