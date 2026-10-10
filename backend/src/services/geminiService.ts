import { config } from '../config/environment';
import { Project, UserOnboardingData } from '../../../packages/types/src/index';

export interface GeminiPlanningResponse {
  content: string;
  isLiveAi: boolean;
  model: string;
  stage: 'idea' | 'requirements' | 'planning' | 'finalize';
  suggestedResponses: string[];
}

export class GeminiService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = config.geminiApiKey || config.aiApiKey;
    this.model = config.geminiModel || 'gemini-1.5-flash';
  }

  /**
   * Generates a context-aware planning response from Google Gemini AI.
   */
  public async generatePlanningChat(
    userMessage: string,
    project: Project | null,
    history: { role: string; content: string }[] = [],
    onboarding?: UserOnboardingData | null
  ): Promise<GeminiPlanningResponse> {
    const activeKey = this.apiKey || config.geminiApiKey || config.aiApiKey;

    // Build system framing and project context
    const projectName = project?.name || 'New Project';
    const projectCategory = project?.category || project?.summary?.projectType || 'Software Application';
    const problemStatement = project?.problemStatement || 'Not yet defined';
    const targetUsers = project?.summary?.primaryUsers?.join(', ') || 'Not yet defined';
    const goals = project?.summary?.goals?.join(', ') || 'Validate idea and launch production MVP';

    const userProfileSummary = onboarding
      ? `User Profile: Role(s): ${onboarding.roles?.join(', ') || 'Founder'}; Technical Background: ${onboarding.technicalBackground || 'General'}; Experience: ${onboarding.experienceLevel || 'Beginner'}; Goals: ${onboarding.goals?.join(', ') || 'Build project'}.`
      : 'User Profile: Technology founder scoping a software build.';

    const systemPrompt = `You are StackMatch Planning AI — an expert software architect, product strategist, and technical advisor.
Tagline: "Plan smarter. Choose better. Build with confidence."
Your mission: Help technical and non-technical founders turn product concepts into structured, build-ready architecture specifications.

Current Project Context:
- Project Name: "${projectName}"
- Category: ${projectCategory}
- Problem Statement: ${problemStatement}
- Target Audience: ${targetUsers}
- Goals: ${goals}
${userProfileSummary}

Guidelines:
1. Provide actionable, concise, engineering-grade advice (2-3 paragraphs max).
2. Clarify requirements, highlight architectural trade-offs, and recommend realistic technologies.
3. Keep technical tone encouraging, structured, and pragmatic.
4. Conclude with 2-3 concrete follow-up options or questions.`;

    if (!activeKey) {
      // Clear, honest, explicitly labeled development intelligence fallback
      const fallbackAnalysis = this.generateDevelopmentFallback(userMessage, project);
      return {
        content: `[Development Intelligence Mode — GEMINI_API_KEY not configured in .env]\n\n${fallbackAnalysis.content}`,
        isLiveAi: false,
        model: 'stackmatch-local-engine',
        stage: fallbackAnalysis.stage,
        suggestedResponses: fallbackAnalysis.suggestedResponses,
      };
    }

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${activeKey}`;

      // Format conversation contents for Gemini
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nPlease acknowledge and prepare to advise the user on their project.` }]
        },
        {
          role: 'model',
          parts: [{ text: `Understood. I am StackMatch Planning AI. I am ready to advise on "${projectName}" with structured engineering recommendations tailored to your goals.` }]
        }
      ];

      // Append recent conversation turns (up to 8 turns)
      const recentHistory = history.slice(-8);
      for (const turn of recentHistory) {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }]
        });
      }

      // Append current user message
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.95
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const statusMsg = response.status === 400 || response.status === 403
          ? 'Invalid or unauthorized Google AI API key.'
          : response.status === 429
          ? 'Google AI API quota limit reached. Please check your AI Studio quota.'
          : `Google AI API responded with status ${response.status}.`;
        
        console.warn(`[GeminiService] API error: ${statusMsg}`, errorData);
        const fallback = this.generateDevelopmentFallback(userMessage, project);
        return {
          content: `[Notice: ${statusMsg} Falling back to internal engine]\n\n${fallback.content}`,
          isLiveAi: false,
          model: 'gemini-fallback',
          stage: fallback.stage,
          suggestedResponses: fallback.suggestedResponses,
        };
      }

      const data = await response.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!candidateText) {
        throw new Error('Empty response received from Gemini.');
      }

      // Infer current planning stage
      const lower = userMessage.toLowerCase();
      let stage: 'idea' | 'requirements' | 'planning' | 'finalize' = 'requirements';
      if (lower.includes('blueprint') || lower.includes('finalize') || lower.includes('complete plan')) {
        stage = 'finalize';
      } else if (lower.includes('stack') || lower.includes('architecture') || lower.includes('database') || lower.includes('framework')) {
        stage = 'planning';
      } else if (lower.includes('feature') || lower.includes('user') || lower.includes('role') || lower.includes('flow')) {
        stage = 'requirements';
      } else {
        stage = 'idea';
      }

      const suggestedResponses = this.extractSuggestions(candidateText, stage);

      return {
        content: candidateText,
        isLiveAi: true,
        model: this.model,
        stage,
        suggestedResponses,
      };
    } catch (err: any) {
      console.warn(`[GeminiService] Exception during request: ${err.message}`);
      const fallback = this.generateDevelopmentFallback(userMessage, project);
      return {
        content: `[Notice: Live AI connection issue (${err.message}). Using synchronized engine]\n\n${fallback.content}`,
        isLiveAi: false,
        model: 'gemini-fallback',
        stage: fallback.stage,
        suggestedResponses: fallback.suggestedResponses,
      };
    }
  }

  private extractSuggestions(text: string, stage: string): string[] {
    const suggestions: string[] = [];
    if (stage === 'idea') {
      return ['Define Functional Scope', 'Explore Technology Options', 'View Dynamic Blueprint'];
    }
    if (stage === 'requirements') {
      return ['Review Tech Stack Trade-offs', 'Define Role Permissions', 'Synthesize 3-Tier Architecture'];
    }
    if (stage === 'planning') {
      return ['Generate Complete Blueprint', 'Validate Architecture', 'View Roadmap Milestones'];
    }
    return ['Export Project Blueprint', 'Review Acceptance Criteria', 'Connect with Freelancers'];
  }

  private generateDevelopmentFallback(
    message: string,
    project: Project | null
  ): { content: string; stage: 'idea' | 'requirements' | 'planning' | 'finalize'; suggestedResponses: string[] } {
    const lower = message.toLowerCase();
    const projectName = project?.name || 'your project';

    if (lower.includes('student') || lower.includes('restaurant') || lower.includes('admin') || lower.includes('role') || lower.includes('user')) {
      return {
        stage: 'requirements',
        content: `Understanding distinct user roles is fundamental for "${projectName}". Supporting different personas requires clear Role-Based Access Control (RBAC) and tailored user journeys.\n\nKey architectural questions:\n1. Will users authenticate via social OAuth, institutional single-sign-on (SSO), or standard email/password?\n2. What primary data must be strictly isolated between roles?`,
        suggestedResponses: ['Social OAuth + JWT', 'Role-based access matrix', 'Web & mobile parity'],
      };
    }

    if (lower.includes('tech') || lower.includes('stack') || lower.includes('database') || lower.includes('postgres') || lower.includes('mongo') || lower.includes('react')) {
      return {
        stage: 'planning',
        content: `For "${projectName}", selecting technologies with proven production reliability and high community velocity is critical.\n\nRecommended baseline:\n• Frontend: React + TypeScript for deterministic typing and component reusability.\n• Backend: Node.js / Express or Go for lightweight, asynchronous API throughput.\n• Persistence: PostgreSQL for ACID transactions or MongoDB for rapid schema evolution.\n• Infrastructure: Multi-stage Docker containers with automated CI/CD.`,
        suggestedResponses: ['Explore Database Trade-offs', 'Review System Architecture', 'Generate Full Plan'],
      };
    }

    if (lower.includes('plan') || lower.includes('blueprint') || lower.includes('generate') || lower.includes('roadmap')) {
      return {
        stage: 'finalize',
        content: `Your technical blueprint for "${projectName}" is ready for review. It combines your functional specifications, technology justifications with authentic logos, 3-tier architecture topology, and 4 sequential implementation milestones.\n\nOpen the Blueprint tab to inspect or print your engineering specification.`,
        suggestedResponses: ['View Dynamic Blueprint', 'Print Blueprint (PDF)', 'Review Implementation Checklist'],
      };
    }

    return {
      stage: 'idea',
      content: `I've analyzed your input for "${projectName}". To build a realistic implementation plan, we should establish:\n1. The primary end-user problem and target audience.\n2. The MVP non-negotiable features for initial launch.\n3. Target delivery platforms (Web portal, iOS/Android mobile, or both).\n\nTell me which aspect you'd like to dive into first!`,
      suggestedResponses: ['Define Core MVP Features', 'Specify Target Platforms', 'Explore Tech Stack'],
    };
  }
}

export const geminiService = new GeminiService();
