import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DiscussionPage } from './pages/DiscussionPage';
import { ProjectOverviewPage } from './pages/ProjectOverviewPage';
import { AuthModal } from './components/auth/AuthModal';
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
} from './services/mockData';
import {
  User,
  Project,
  Message,
  Requirement,
  Technology,
  TechComparisonGroup,
  ArchitectureNode,
  RoadmapPhase,
  ResourceItem,
  ProjectBlueprint,
} from './types';

export function App() {
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

  // Domain Data State
  const [requirements, setRequirements] = useState<Requirement[]>(fallbackRequirements);
  const [technologies, setTechnologies] = useState<Technology[]>(fallbackTechnologies);
  const [comparisons, setComparisons] = useState<TechComparisonGroup>(fallbackComparisons);
  const [architecture, setArchitecture] = useState<ArchitectureNode[]>(fallbackArchitecture);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>(fallbackRoadmap);
  const [resources, setResources] = useState<ResourceItem[]>(fallbackResources);
  const [blueprint, setBlueprint] = useState<ProjectBlueprint>(fallbackBlueprint);

  // Attempt to load from API backend on mount, falling back smoothly if offline
  useEffect(() => {
    const initData = async () => {
      try {
        const fetchedProjects = await api.getProjects();
        if (fetchedProjects && fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
          setActiveProject(fetchedProjects[0]);
        }
      } catch (_) {
        // Fallback remains active
      }
    };
    initData();
  }, []);

  // Handle Project Selection
  const handleSelectProject = async (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setActiveProject(found);
      setCurrentView('overview');
    }
  };

  // Create New Project Flow
  const handleNewProject = () => {
    const newId = `proj_${Date.now()}`;
    const newProj: Project = {
      id: newId,
      userId: currentUser?.id || 'usr_demo_01',
      name: 'New SaaS Project',
      description: 'Describe your concept to start scoping requirements and architecture.',
      status: 'draft',
      currentStage: 'idea',
      summary: {
        projectType: 'Web & Mobile Application',
        primaryUsers: ['Customers', 'Admins'],
        industry: 'Software & Technology',
        keyFeatures: ['User Onboarding', 'Core Dashboard', 'Payment Gateway'],
        estimatedComplexity: 'Medium',
        estimatedTimeline: '2–4 months',
        goals: ['Validate customer demand', 'Launch MVP'],
        targetAudience: ['Early Adopters', 'Enterprise Clients'],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects([newProj, ...projects]);
    setActiveProject(newProj);

    const initialMsg: Message = {
      id: `msg_${Date.now()}`,
      projectId: newId,
      role: 'assistant',
      content: `Hi! I'm StackMatch. Tell me about "${newProj.name}". You can describe it in simple words — I'll take care of the technical details.`,
      timestamp: new Date().toISOString(),
      metadata: {
        stage: 'idea',
        suggestedResponses: [
          'A web platform for customer appointments',
          'A marketplace app with instant checkout',
          'An internal operations dashboard',
        ],
      },
    };

    setMessages([initialMsg]);
    setCurrentView('chat');
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
      // Attempt backend API call
      const res = await api.sendMessage(activeProject.id, content);
      if (res && res.assistantMessage) {
        setMessages((prev) => [...prev, res.assistantMessage]);
        if (res.assistantMessage.metadata?.stage) {
          setActiveProject((prev) => ({
            ...prev,
            currentStage: res.assistantMessage.metadata?.stage as any,
          }));
        }
      }
    } catch (_) {
      // Local intelligent response simulation
      setTimeout(() => {
        const lower = content.toLowerCase();
        let reply = '';
        let nextStage: 'idea' | 'requirements' | 'planning' | 'finalize' = 'requirements';
        let suggestions: string[] = [];

        if (lower.includes('student') || lower.includes('restaurant') || lower.includes('admin') || lower.includes('user')) {
          nextStage = 'requirements';
          reply = `Got it. Catering to multiple user roles requires clear role-based authentication and separate dashboards.\n\nFor platform delivery:\n1. Do you need a website, mobile apps, or both?\n2. Should users be able to make instant online payments?`;
          suggestions = ['Both web and mobile', 'Online payments', 'Web only for MVP'];
        } else if (lower.includes('both') || lower.includes('mobile') || lower.includes('payment') || lower.includes('online')) {
          nextStage = 'planning';
          reply = `Excellent. Having both web and mobile access with instant payment processing provides a smooth user experience.\n\nI have generated:\n• 8 Detailed Requirements (Functional & Security)\n• Recommended Stack (React, Node.js, PostgreSQL, Razorpay, Docker)\n• Tiered Architecture & 4-Phase Delivery Roadmap.\n\nWould you like to review the complete Project Plan now?`;
          suggestions = ['View Project Overview', 'Explore Tech Stack', 'Review Architecture'];
        } else {
          nextStage = 'requirements';
          reply = `That makes total sense. To clarify the technical scope:\n\n1. Who are the primary target users?\n2. What is the most critical feature needed on day one?`;
          suggestions = ['Customers and Admins', 'Instant search & booking', 'Secure payments'];
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
        setActiveProject((prev) => ({ ...prev, currentStage: nextStage }));
        setIsAiLoading(false);
      }, 700);
      return;
    }

    setIsAiLoading(false);
  };

  const isWorkspaceView = ['workspace', 'chat', 'overview', 'projects'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'workspace') {
            setCurrentView('overview');
          } else {
            setCurrentView(view);
          }
        }}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
      />

      {/* Main View Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Sidebar (active when in studio/workspace views) */}
        {isWorkspaceView && (
          <Sidebar
            currentNav={currentView}
            onSelectNav={(nav) => {
              if (nav === 'projects') setCurrentView('overview');
              else if (nav === 'resources') setCurrentView('resources');
              else setCurrentView(nav);
            }}
            onNewProject={handleNewProject}
            projects={projects}
            activeProjectId={activeProject.id}
            onSelectProject={handleSelectProject}
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              api.logout();
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
            />
          )}

          {currentView === 'chat' && (
            <DiscussionPage
              project={activeProject}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isAiLoading}
              onViewProjectPlan={() => setCurrentView('overview')}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />
          )}

          {currentView === 'overview' && (
            <ProjectOverviewPage
              project={activeProject}
              requirements={requirements}
              technologies={technologies}
              comparisonGroup={comparisons}
              architectureNodes={architecture}
              roadmapPhases={roadmap}
              resources={resources}
              blueprint={blueprint}
              onOpenChat={() => setCurrentView('chat')}
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />
          )}

          {(currentView === 'features' || currentView === 'how-it-works' || currentView === 'resources') && (
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              <div className="border-b border-[#E5E7EB] pb-4">
                <h2 className="text-2xl font-bold text-[#111827] capitalize">
                  {currentView.replace('-', ' ')}
                </h2>
                <p className="text-xs text-[#687280] mt-1">
                  StackMatch Platform Guidance & Specifications
                </p>
              </div>

              {currentView === 'resources' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {resources.map((res) => (
                    <div key={res.id} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-subtle">
                      <span className="text-[10px] font-semibold text-[#687280] bg-[#F3F4F6] px-2 py-0.5 rounded">
                        {res.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#111827] mt-2">{res.title}</h4>
                      <p className="text-xs text-[#687280] mt-1 leading-relaxed">{res.description}</p>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-3 text-xs font-semibold text-[#111827] hover:underline"
                      >
                        Read Documentation →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-4 text-xs text-[#374151]">
                  <p>
                    StackMatch helps technical and non-technical people turn a simple product idea into a structured, understandable, build-ready project plan.
                  </p>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <span className="font-bold text-[#111827] block mb-1">Central Planning Philosophy:</span>
                    Idea → Discussion → Requirements → Features → Project Plan → Technology → Architecture → Roadmap → Knowledge → Project Blueprint.
                  </div>
                </div>
              )}
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
          setCurrentView('overview');
        }}
      />
    </div>
  );
}

export default App;
