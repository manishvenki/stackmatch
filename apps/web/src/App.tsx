import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DiscussionPage } from './pages/DiscussionPage';
import { ProjectOverviewPage } from './pages/ProjectOverviewPage';
import { DashboardPage } from './pages/DashboardPage';
import { ConnectFreelancersPage } from './pages/ConnectFreelancersPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { OnboardingStepperPage } from './pages/OnboardingStepperPage';
import { WorkspaceSettingsPage } from './pages/WorkspaceSettingsPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SocialShareModal } from './components/domain/SocialShareModal';
import { AuthModal } from './components/auth/AuthModal';
import { ProjectModal } from './components/domain/ProjectModal';
import { DeleteProjectModal } from './components/domain/DeleteProjectModal';
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
  CreateProjectInput,
  UpdateProjectInput,
} from './types';

function AppContent() {
  const { showToast } = useToast();

  // Navigation & View State
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Social Sharing & Blueprint State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [overviewInitialTab, setOverviewInitialTab] = useState<string>('overview');

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Project Management Modal States (Master Prompt 08 CRUD)
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<'create' | 'edit'>('create');
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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
        const urlParams = new URLSearchParams(window.location.search);
        const queryView = urlParams.get('view');
        if (queryView && ['landing', 'blueprint', 'overview', 'dashboard', 'chat', 'features', 'how-it-works'].includes(queryView)) {
          setCurrentView(queryView);
          if (queryView === 'blueprint') {
            setOverviewInitialTab('blueprint');
          }
        }

        let loggedUser: User | null = null;
        if (api.getToken()) {
          try {
            const me = await api.getMe();
            if (me) {
              loggedUser = me;
              setCurrentUser(me);
            }
          } catch (_) {
            api.logout();
          }
        }

        if (loggedUser) {
          if (!loggedUser.onboardingCompleted) {
            setCurrentView('onboarding');
            return;
          }

          const fetchedProjects = await api.getProjects();
          if (fetchedProjects && fetchedProjects.length > 0) {
            setProjects(fetchedProjects);
            const savedProjectId = localStorage.getItem('sm_last_active_project_id');
            const targetProj = fetchedProjects.find((p) => p.id === savedProjectId) || fetchedProjects[0];
            setActiveProject(targetProj);

            const savedView = localStorage.getItem('sm_last_view');
            if (savedView && ['dashboard', 'overview', 'chat', 'connect', 'settings'].includes(savedView)) {
              setCurrentView(savedView);
            } else {
              setCurrentView('dashboard');
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
          } else {
            setCurrentView('dashboard');
          }
        } else {
          const savedView = localStorage.getItem('sm_last_view');
          if (savedView && ['features', 'how-it-works'].includes(savedView)) {
            setCurrentView(savedView);
          } else {
            setCurrentView('landing');
          }
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

  // Project CRUD Handlers (Master Prompt 08)
  const handleOpenCreateProject = () => {
    setProjectToEdit(null);
    setProjectModalMode('create');
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setProjectToEdit(proj);
    setProjectModalMode('edit');
    setProjectModalOpen(true);
  };

  const handleOpenDeleteProject = (proj: Project) => {
    setProjectToDelete(proj);
    setDeleteModalOpen(true);
  };

  const handleSaveProject = async (data: CreateProjectInput | UpdateProjectInput) => {
    try {
      if (projectModalMode === 'create') {
        const created = await api.createProject(data as any);
        setProjects((prev) => [created, ...prev]);
        setActiveProject(created);
        localStorage.setItem('sm_last_active_project_id', created.id);

        try {
          const [plan, msgs] = await Promise.all([
            api.getProjectPlan(created.id).catch(() => null),
            api.getMessages(created.id).catch(() => []),
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
          } else {
            const initialMsg: Message = {
              id: `msg_${Date.now()}`,
              projectId: created.id,
              role: 'assistant',
              content: `Welcome to StackMatch! Let's scope "${created.name}". I've initialized your architectural baseline for ${created.category || 'your project'}. Feel free to explore your dynamic blueprint or refine requirements here.`,
              timestamp: new Date().toISOString(),
              metadata: {
                stage: 'idea',
                suggestedResponses: [
                  'Review Requirements Matrix',
                  'Examine Technology Trade-offs',
                  'View Dynamic Blueprint',
                ],
              },
            };
            setMessages([initialMsg]);
          }
        } catch (_) {}

        setProjectModalOpen(false);
        setCurrentView('overview');
        localStorage.setItem('sm_last_view', 'overview');
        showToast({
          type: 'success',
          title: 'Project Created',
          message: `"${created.name}" is now ready for scoping and blueprint generation.`,
        });
      } else if (projectModalMode === 'edit' && projectToEdit) {
        const updated = await api.updateProject(projectToEdit.id, data as any);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        if (activeProject.id === updated.id) {
          setActiveProject(updated);
          try {
            const plan = await api.getProjectPlan(updated.id);
            if (plan?.blueprint) setBlueprint(plan.blueprint);
          } catch (_) {}
        }
        setProjectModalOpen(false);
        showToast({
          type: 'success',
          title: 'Project Updated',
          message: `Saved changes to "${updated.name}".`,
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error Saving Project',
        message: err.message || 'Failed to save project changes.',
      });
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await api.deleteProject(projectToDelete.id);
      const remaining = projects.filter((p) => p.id !== projectToDelete.id);
      setProjects(remaining);

      if (activeProject.id === projectToDelete.id) {
        if (remaining.length > 0) {
          await handleSelectProject(remaining[0].id);
        } else {
          setActiveProject(fallbackProject);
          setProjects([fallbackProject]);
        }
      }

      showToast({
        type: 'success',
        title: 'Project Deleted',
        message: `"${projectToDelete.name}" was permanently removed.`,
      });
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: err.message || 'Unable to delete project.',
      });
      throw err;
    }
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

  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    if (!user.onboardingCompleted) {
      setCurrentView('onboarding');
      showToast({
        type: 'info',
        title: `Welcome, ${user.name}!`,
        message: 'Please complete your onboarding profile to calibrate your workspace.',
      });
      return;
    }
    try {
      const fetchedProjects = await api.getProjects();
      if (fetchedProjects && fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
        setActiveProject(fetchedProjects[0]);
      } else {
        setProjects([]);
      }
    } catch (_) {}
    setCurrentView('dashboard');
    showToast({
      type: 'success',
      title: 'Welcome Back',
      message: `Signed in as ${user.name}.`,
    });
  };

  const handleOnboardingComplete = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    showToast({
      type: 'success',
      title: 'Workspace Calibrated',
      message: 'Your profile has been saved. Let\'s create your first project!',
    });
    handleOpenCreateProject();
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    api.logout();
    setProjects([]);
    setCurrentView('landing');
    localStorage.removeItem('sm_last_view');
    localStorage.removeItem('sm_last_active_project_id');
    showToast({ type: 'info', title: 'Signed Out', message: 'You have been signed out securely.' });
  };

  const handleStartPlanning = () => {
    if (!currentUser) {
      setCurrentView('signup');
    } else {
      handleOpenCreateProject();
    }
  };

  const navigateTo = (view: string) => {
    if (view === 'workspace') {
      if (!currentUser) {
        setCurrentView('signin');
      } else {
        setCurrentView('dashboard');
      }
      return;
    }
    setCurrentView(view);
    localStorage.setItem('sm_last_view', view);
  };

  const isWorkspaceView = Boolean(
    currentUser && ['dashboard', 'chat', 'overview', 'blueprint', 'projects', 'connect', 'settings'].includes(currentView)
  );

  // Split-screen full-page auth & onboarding views (outside standard shell)
  if (currentView === 'signin') {
    return (
      <SignInPage
        onSuccess={handleAuthSuccess}
        onNavigateSignUp={() => setCurrentView('signup')}
        onNavigateHome={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignUpPage
        onSuccess={handleAuthSuccess}
        onNavigateSignIn={() => setCurrentView('signin')}
        onNavigateHome={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'onboarding') {
    return (
      <OnboardingStepperPage
        currentUser={currentUser}
        onComplete={handleOnboardingComplete}
        onSkip={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        isWorkspace={isWorkspaceView}
        activeProjectName={activeProject?.name}
        onNavigate={navigateTo}
        onNewProject={handleOpenCreateProject}
        onLogout={handleLogout}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onOpenAuth={(mode) => {
          if (mode === 'register') {
            setCurrentView('signup');
          } else {
            setCurrentView('signin');
          }
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
              else if (nav === 'blueprint') {
                setOverviewInitialTab('blueprint');
                navigateTo('blueprint');
              } else if (nav === 'overview') {
                setOverviewInitialTab('overview');
                navigateTo('overview');
              } else if (nav === 'chat') navigateTo('chat');
              else if (nav === 'connect') navigateTo('connect');
              else if (nav === 'settings') navigateTo('settings');
              else navigateTo(nav);
            }}
            onNewProject={handleOpenCreateProject}
            projects={projects}
            activeProjectId={activeProject?.id}
            onSelectProject={handleSelectProject}
            currentUser={currentUser}
            onLogout={handleLogout}
            isOpenMobile={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Content Router */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {currentView === 'landing' && (
            <LandingPage
              onStartPlanning={handleStartPlanning}
              onExploreProject={(id) => {
                handleSelectProject(id);
                setCurrentView('overview');
              }}
              onExploreHowItWorks={() => setCurrentView('how-it-works')}
              onExploreConnect={() => setCurrentView('connect')}
            />
          )}

          {currentView === 'features' && (
            <FeaturesPage
              onStartPlanning={handleStartPlanning}
              onNavigateHome={() => setCurrentView('landing')}
              onNavigateHowItWorks={() => setCurrentView('how-it-works')}
            />
          )}

          {currentView === 'how-it-works' && (
            <HowItWorksPage
              onStartPlanning={handleStartPlanning}
              onNavigateHome={() => setCurrentView('landing')}
              onNavigateFeatures={() => setCurrentView('features')}
            />
          )}

          {currentView === 'settings' && (
            <WorkspaceSettingsPage
              currentUser={currentUser}
              onLogout={handleLogout}
              onRestartOnboarding={() => setCurrentView('onboarding')}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardPage
              currentUser={currentUser}
              projects={projects}
              onSelectProject={handleSelectProject}
              onNewProject={handleOpenCreateProject}
              onEditProject={handleOpenEditProject}
              onDeleteProject={handleOpenDeleteProject}
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
              onViewProjectPlan={() => {
                setOverviewInitialTab('overview');
                setCurrentView('overview');
              }}
              onGeneratePlan={handleGeneratePlan}
              isGeneratingPlan={isGeneratingPlan}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />
          )}

          {(currentView === 'overview' || currentView === 'blueprint') && (
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
              initialTab={currentView === 'blueprint' ? 'blueprint' : overviewInitialTab}
              onOpenChat={() => setCurrentView('chat')}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
              onUpdateRequirement={handleUpdateRequirement}
              onDeleteRequirement={handleDeleteRequirement}
              onAddRequirement={handleAddRequirement as any}
              onEditProject={handleOpenEditProject}
              onDeleteProject={handleOpenDeleteProject}
              onNavigateConnect={() => setCurrentView('connect')}
              onOpenShareModal={() => setShareModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Project Create / Edit Modal (Master Prompt 08 CRUD) */}
      <ProjectModal
        isOpen={projectModalOpen}
        projectToEdit={projectToEdit}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={handleSaveProject}
      />

      {/* Delete Project Confirmation Modal (Master Prompt 08 CRUD) */}
      <DeleteProjectModal
        isOpen={deleteModalOpen}
        project={projectToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Auth Modal (as supplemental dialog if triggered directly) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        project={activeProject}
        blueprint={blueprint}
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
