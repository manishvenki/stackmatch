import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DiscussionPage } from './pages/DiscussionPage';
import { ProjectOverviewPage } from './pages/ProjectOverviewPage';
import { DashboardPage } from './pages/DashboardPage';
import { ConnectFreelancersPage } from './pages/ConnectFreelancersPage';
import { AuthModal } from './components/auth/AuthModal';
import { ToastProvider, useToast } from './components/ui/Toast';
import { api } from './services/api';
import {
  fallbackProject,
  fallbackRequirements,
  fallbackTechnologies,
  fallbackComparisons,
  fallbackArchitecture,
  fallbackRoadmap,
  fallbackResources,
  fallbackBlueprint,
  fallbackInitialMessages,
  fallbackContext,
  fallbackValidationReport,
  fallbackComplexityInsight,
} from './services/mockData';
import {
  User,
  Project,
  Message,
  Requirement,
  Technology,
  TechComparisonGroup,
  ArchitectureNode,
  ArchitectureValidationReport,
  RoadmapPhase,
  ResourceItem,
  ProjectBlueprint,
  ProjectContext,
  ProjectComplexityInsight,
} from './types';

function AppContent() {
  const { showToast } = useToast();

  // Navigation & View State
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_demo_01',
    name: 'Alex Rivera',
    email: 'demo@stackmatch.dev',
    role: 'founder',
    createdAt: new Date().toISOString(),
  });

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Mobile Sidebar State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([fallbackProject]);
  const [activeProject, setActiveProject] = useState<Project>(fallbackProject);

  // Conversation State
  const [messages, setMessages] = useState<Message[]>(fallbackInitialMessages);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Domain Data State
  const [requirements, setRequirements] = useState<Requirement[]>(fallbackRequirements);
  const [technologies, setTechnologies] = useState<Technology[]>(fallbackTechnologies);
  const [comparisons, setComparisons] = useState<TechComparisonGroup>(fallbackComparisons);
  const [activeComparisonCategory, setActiveComparisonCategory] = useState<string>('Databases');
  const [architecture, setArchitecture] = useState<ArchitectureNode[]>(fallbackArchitecture);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>(fallbackRoadmap);
  const [resources, setResources] = useState<ResourceItem[]>(fallbackResources);
  const [blueprint, setBlueprint] = useState<ProjectBlueprint>(fallbackBlueprint);
  const [projectContext, setProjectContext] = useState<ProjectContext>(fallbackContext);
  const [validationReport, setValidationReport] = useState<ArchitectureValidationReport>(fallbackValidationReport);
  const [complexityInsight, setComplexityInsight] = useState<ProjectComplexityInsight>(fallbackComplexityInsight);

  // Attempt to load from API backend on mount with workflow continuity
  useEffect(() => {
    const initData = async () => {
      try {
        if (api.getToken()) {
          try {
            const me = await api.getMe();
            if (me) setCurrentUser(me);
          } catch (_) {}
        }

        const fetchedProjects = await api.getProjects();
        if (fetchedProjects && fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
          const savedProjectId = localStorage.getItem('sm_last_active_project_id');
          const targetProj = fetchedProjects.find((p) => p.id === savedProjectId) || fetchedProjects[0];
          setActiveProject(targetProj);

          const savedView = localStorage.getItem('sm_last_view');
          if (savedView && ['dashboard', 'overview', 'chat', 'connect', 'resources'].includes(savedView)) {
            setCurrentView(savedView);
          }

          // Hydrate plan and conversation for active project
          try {
            const [plan, msgs] = await Promise.all([
              api.getProjectPlan(targetProj.id).catch(() => null),
              api.getMessages(targetProj.id).catch(() => []),
            ]);
            if (plan) {
              if (plan.requirements?.length) setRequirements(plan.requirements);
              const techs = plan.technologies || (plan as any).techStack;
              if (techs?.length) setTechnologies(techs);
              if (plan.comparisons) setComparisons(plan.comparisons);
              if (plan.architecture?.length) setArchitecture(plan.architecture);
              if (plan.roadmap?.length) setRoadmap(plan.roadmap);
              if (plan.blueprint) setBlueprint(plan.blueprint);
              if (plan.context) setProjectContext(plan.context);
              if (plan.validation) setValidationReport(plan.validation);
              if (plan.risks) setComplexityInsight(plan.risks);
            }
            if (msgs && msgs.length > 0) {
              setMessages(msgs);
            }
          } catch (_) {}
        }
      } catch (_) {
        // Fallback initialized
      }
    };
    initData();
  }, []);

  // Handle Project Selection with full plan and message hydration
  const handleSelectProject = async (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setActiveProject(found);
      localStorage.setItem('sm_last_active_project_id', projectId);
      try {
        const [plan, msgs] = await Promise.all([
          api.getProjectPlan(projectId).catch(() => null),
          api.getMessages(projectId).catch(() => []),
        ]);
        if (plan) {
          if (plan.requirements?.length) setRequirements(plan.requirements);
          const techs = plan.technologies || (plan as any).techStack;
          if (techs?.length) setTechnologies(techs);
          if (plan.comparisons) setComparisons(plan.comparisons);
          if (plan.architecture?.length) setArchitecture(plan.architecture);
          if (plan.roadmap?.length) setRoadmap(plan.roadmap);
          if (plan.blueprint) setBlueprint(plan.blueprint);
          if (plan.context) setProjectContext(plan.context);
          if (plan.validation) setValidationReport(plan.validation);
          if (plan.risks) setComplexityInsight(plan.risks);
        }
        if (msgs && msgs.length > 0) {
          setMessages(msgs);
        }
      } catch (_) {
        // Maintained
      }
      setCurrentView('overview');
      localStorage.setItem('sm_last_view', 'overview');
    }
  };

  // Create New Project Flow with backend persistence
  const handleNewProject = async () => {
    let newProj: Project;
    try {
      newProj = await api.createProject(
        'New Product Concept',
        'Describe your concept to start scoping requirements and architecture.'
      );
    } catch (_) {
      const newId = `proj_${Date.now()}`;
      newProj = {
        id: newId,
        userId: currentUser?.id || 'usr_demo_01',
        name: 'New Product Concept',
        description: 'Describe your concept to start scoping requirements and architecture.',
        status: 'draft',
        currentStage: 'idea',
        summary: {
          projectType: 'Web & Mobile Application',
          primaryUsers: ['End Users', 'Administrators'],
          industry: 'Software & Technology',
          keyFeatures: ['User Onboarding', 'Core Dashboard', 'Secure API'],
          estimatedComplexity: 'Medium',
          estimatedTimeline: '2–4 months',
          goals: ['Validate market demand', 'Launch production MVP'],
          targetAudience: ['Target Users', 'Operations Team'],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    setProjects([newProj, ...projects]);
    setActiveProject(newProj);
    localStorage.setItem('sm_last_active_project_id', newProj.id);

    const initialMsg: Message = {
      id: `msg_${Date.now()}`,
      projectId: newProj.id,
      role: 'assistant',
      content: `Welcome to StackMatch! Tell me about "${newProj.name}" in your own words. Who is it for, and what problem does it solve?`,
      timestamp: new Date().toISOString(),
      metadata: {
        stage: 'idea',
        suggestedResponses: [
          'An on-demand booking platform with online payments',
          'A SaaS collaborative dashboard for distributed teams',
          'A marketplace connecting buyers and local sellers',
        ],
      },
    };

    setMessages([initialMsg]);
    setCurrentView('chat');
    localStorage.setItem('sm_last_view', 'chat');
    showToast({
      type: 'info',
      title: 'Scoping Session Started',
      message: 'Describe your idea naturally — AI will extract requirements.',
    });
  };

  // Handle AI Chat Messages
  const handleSendMessage = async (content: string) => {
    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      projectId: activeProject.id,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const res = await api.sendMessage(activeProject.id, content);
      if (res && res.assistantMessage) {
        setMessages((prev) => [...prev, res.assistantMessage]);
        if (res.assistantMessage.metadata?.stage) {
          const newStage = res.assistantMessage.metadata.stage as any;
          setActiveProject((prev) => ({
            ...prev,
            currentStage: newStage,
            updatedAt: new Date().toISOString(),
          }));
        }
      }
    } catch (_) {
      // Local intelligent response fallback
      setTimeout(() => {
        const lower = content.toLowerCase();
        let reply = '';
        let nextStage: 'idea' | 'requirements' | 'planning' | 'finalize' = 'requirements';
        let suggestions: string[] = [];

        if (lower.includes('student') || lower.includes('restaurant') || lower.includes('admin') || lower.includes('user')) {
          nextStage = 'requirements';
          reply = `Understood. Supporting distinct roles requires granular access control and tailored user journeys.\n\nFor platform delivery:\n1. Should this be a responsive web application, native mobile apps, or cross-platform?\n2. Will the MVP require automated payment processing?`;
          suggestions = ['Cross-platform mobile and web', 'Require payment gateway', 'Web application first'];
        } else if (lower.includes('payment') || lower.includes('mobile') || lower.includes('web') || lower.includes('both')) {
          nextStage = 'planning';
          reply = `Terrific. Based on your constraints, I have identified the functional specifications and candidate tech stack.\n\nClick "Generate Complete Plan" above or view your project plan anytime to explore suitability scores, 3-tier architecture, and development roadmap.`;
          suggestions = ['Generate Complete Plan', 'View Project Plan', 'Explore Tech Stack'];
        } else {
          nextStage = 'requirements';
          reply = `That provides great context. To refine technical scope:\n\n1. Who are the primary end users?\n2. What is the most critical feature needed for day one MVP?`;
          suggestions = ['End users and operations team', 'Real-time ordering & notifications', 'Fast checkout with authentication'];
        }

        const assistantMsg: Message = {
          id: `msg_asst_${Date.now()}`,
          projectId: activeProject.id,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toISOString(),
          metadata: {
            stage: nextStage,
            suggestedResponses: suggestions,
          },
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setActiveProject((prev) => ({
          ...prev,
          currentStage: nextStage,
          updatedAt: new Date().toISOString(),
        }));
        setIsAiLoading(false);
      }, 600);
      return;
    }

    setIsAiLoading(false);
  };

  // Generate Complete Plan Action
  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const plan = await api.generatePlan(activeProject.id);
      if (plan) {
        if (plan.requirements?.length) setRequirements(plan.requirements);
        const techs = plan.technologies || plan.techStack;
        if (techs?.length) setTechnologies(techs);
        if (plan.comparisons) setComparisons(plan.comparisons);
        if (plan.architecture?.length) setArchitecture(plan.architecture);
        if (plan.roadmap?.length) setRoadmap(plan.roadmap);
        if (plan.blueprint) setBlueprint(plan.blueprint);
        if (plan.context) setProjectContext(plan.context);
        if (plan.validation) setValidationReport(plan.validation);
        if (plan.risks) setComplexityInsight(plan.risks);
      }

      // Update active project stage
      const updatedProj: Project = {
        ...activeProject,
        currentStage: 'planning',
        updatedAt: new Date().toISOString(),
      };
      setActiveProject(updatedProj);
      setProjects((prev) => prev.map((p) => (p.id === updatedProj.id ? updatedProj : p)));

      // Add assistant confirmation message
      const confirmMsg: Message = {
        id: `msg_${Date.now()}`,
        projectId: activeProject.id,
        role: 'assistant',
        content: `🎉 Engineering plan successfully synthesized!\n\n• Project Context Engine initialized with verified problem & audience models\n• Stack recommendations updated with architectural role & integration notes\n• Architecture consistency check: Health Score calculated\n• Technical risk assessment & practical mitigations ready.\n\nOpening your Project Overview now...`,
        timestamp: new Date().toISOString(),
        metadata: {
          stage: 'planning',
        },
      };
      setMessages((prev) => [...prev, confirmMsg]);

      showToast({
        type: 'success',
        title: 'Complete Plan Synthesized',
        message: 'Context engine, architecture validation, and tech recommendations are ready.',
      });

      setTimeout(() => {
        setCurrentView('overview');
      }, 500);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Plan Generation Failed',
        message: err?.message || 'Unable to generate plan. Please try again.',
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Handle Multi-Category Comparison Switcher
  const handleSelectComparisonCategory = async (category: string) => {
    setActiveComparisonCategory(category);
    try {
      const data = await api.getComparisons(activeProject.id, category);
      if (data && data.technologies?.length) {
        setComparisons(data);
      }
    } catch (_) {
      // Graceful fallback to existing state
    }
  };

  // Requirement Update & Delete Handlers
  const handleUpdateRequirement = async (updatedReq: Partial<Requirement> & { id: string }) => {
    try {
      const saved = await api.updateRequirement(activeProject.id, updatedReq.id, updatedReq);
      setRequirements((prev) =>
        prev.map((r) => (r.id === updatedReq.id ? { ...r, ...saved } : r))
      );
      showToast({
        type: 'success',
        title: 'Requirement Updated',
        message: `Saved changes to "${updatedReq.title || 'Requirement'}".`,
      });
    } catch (_) {
      // Local optimistic update
      setRequirements((prev) =>
        prev.map((r) => (r.id === updatedReq.id ? ({ ...r, ...updatedReq } as Requirement) : r))
      );
      showToast({
        type: 'success',
        title: 'Requirement Updated',
        message: `Saved changes to "${updatedReq.title || 'Requirement'}".`,
      });
    }
  };

  const handleDeleteRequirement = async (reqId: string) => {
    try {
      await api.deleteRequirement(activeProject.id, reqId);
    } catch (_) {
      // Handled optimistically
    }
    setRequirements((prev) => prev.filter((r) => r.id !== reqId));
    showToast({
      type: 'info',
      title: 'Requirement Removed',
      message: 'The requirement was deleted from the plan.',
    });
  };

  const handleAddRequirement = async (newReq: Partial<Requirement>) => {
    const fullReq: Requirement = {
      id: `req_${Date.now()}`,
      projectId: activeProject.id,
      title: newReq.title || 'New Requirement',
      description: newReq.description || '',
      type: newReq.type || 'functional',
      priority: newReq.priority || 'medium',
      category: newReq.category || 'Core Features',
      isMvpScope: newReq.isMvpScope !== undefined ? newReq.isMvpScope : true,
    };
    setRequirements((prev) => [...prev, fullReq]);
    showToast({
      type: 'success',
      title: 'Requirement Added',
      message: `Added "${fullReq.title}" to project plan.`,
    });
  };

  const navigateTo = (view: string) => {
    const target = view === 'workspace' ? 'dashboard' : view;
    setCurrentView(target);
    localStorage.setItem('sm_last_view', target);
  };

  const isWorkspaceView = ['workspace', 'chat', 'overview', 'projects', 'dashboard', 'connect'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        isWorkspace={isWorkspaceView}
        activeProjectName={activeProject?.name}
        onNavigate={navigateTo}
        onNewProject={handleNewProject}
        onLogout={() => {
          setCurrentUser(null);
          api.logout();
          showToast({ type: 'info', title: 'Signed Out', message: 'You have been signed out.' });
        }}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
      />

      {/* Main View Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Sidebar */}
        {isWorkspaceView && (
          <Sidebar
            currentNav={currentView}
            onSelectNav={(nav) => {
              if (nav === 'dashboard' || nav === 'projects') navigateTo('dashboard');
              else if (nav === 'overview') navigateTo('overview');
              else if (nav === 'chat') navigateTo('chat');
              else if (nav === 'connect') navigateTo('connect');
              else if (nav === 'resources') navigateTo('resources');
              else navigateTo(nav);
            }}
            onNewProject={handleNewProject}
            projects={projects}
            activeProjectId={activeProject.id}
            onSelectProject={handleSelectProject}
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              api.logout();
              showToast({ type: 'info', title: 'Signed Out', message: 'You have been signed out.' });
            }}
            isOpenMobile={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Content Router */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {currentView === 'landing' && (
            <LandingPage
              onStartPlanning={handleNewProject}
              onExploreProject={(id) => {
                handleSelectProject(id);
                setCurrentView('overview');
              }}
              onExploreConnect={() => setCurrentView('connect')}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardPage
              currentUser={currentUser}
              projects={projects}
              onSelectProject={handleSelectProject}
              onNewProject={handleNewProject}
              onContinueChat={(proj) => {
                setActiveProject(proj);
                setCurrentView('chat');
              }}
              onNavigateConnect={() => setCurrentView('connect')}
            />
          )}

          {currentView === 'connect' && (
            <ConnectFreelancersPage
              activeProject={activeProject}
              onNavigateToDashboard={() => setCurrentView('dashboard')}
              onNavigateToProject={() => setCurrentView('overview')}
              onNavigateToChat={() => setCurrentView('chat')}
            />
          )}

          {currentView === 'chat' && (
            <DiscussionPage
              project={activeProject}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isAiLoading}
              onViewProjectPlan={() => setCurrentView('overview')}
              onGeneratePlan={handleGeneratePlan}
              isGeneratingPlan={isGeneratingPlan}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />
          )}

          {currentView === 'overview' && (
            <ProjectOverviewPage
              project={activeProject}
              projectContext={projectContext}
              requirements={requirements}
              technologies={technologies}
              comparisonGroup={comparisons}
              activeComparisonCategory={activeComparisonCategory}
              onSelectComparisonCategory={handleSelectComparisonCategory}
              architectureNodes={architecture}
              validationReport={validationReport}
              complexityInsight={complexityInsight}
              roadmapPhases={roadmap}
              resources={resources}
              blueprint={blueprint}
              onOpenChat={() => setCurrentView('chat')}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
              onUpdateRequirement={handleUpdateRequirement}
              onDeleteRequirement={handleDeleteRequirement}
              onAddRequirement={handleAddRequirement as any}
              onNavigateConnect={() => setCurrentView('connect')}
            />
          )}

          {currentView === 'resources' && (
            <div className="p-8 max-w-6xl mx-auto space-y-6">
              <div className="border-b border-[#E5E7EB] pb-4">
                <h2 className="text-2xl font-bold text-[#111827]">Learning Resources</h2>
                <p className="text-xs text-[#687280] mt-1">
                  Official engineering documentation and verified implementation guides.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resources.map((res) => (
                  <div key={res.id} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-[#687280] bg-[#F3F4F6] px-2 py-0.5 rounded">
                        {res.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#111827] mt-2">{res.title}</h4>
                      <p className="text-xs text-[#687280] mt-1 leading-relaxed">{res.description}</p>
                    </div>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-4 text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      Read Documentation →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(currentView === 'features' || currentView === 'how-it-works') && (
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              <div className="border-b border-[#E5E7EB] pb-4">
                <h2 className="text-2xl font-bold text-[#111827] capitalize">
                  {currentView.replace('-', ' ')}
                </h2>
                <p className="text-xs text-[#687280] mt-1">
                  StackMatch Platform Guidance & Specifications
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4 text-xs text-[#374151]">
                <p>
                  StackMatch helps technical and non-technical people turn a simple product idea into a structured, understandable, build-ready project plan.
                </p>
                <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <span className="font-bold text-[#111827] block mb-1">Central Planning Philosophy:</span>
                  Idea → Discussion → Requirements → Features → Technology Stack → Architecture → Roadmap → Blueprint.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView('dashboard');
          showToast({
            type: 'success',
            title: 'Welcome Back',
            message: `Signed in as ${user.name}.`,
          });
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
