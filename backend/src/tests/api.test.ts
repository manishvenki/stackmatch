import http from 'http';
import { createApp } from '../app';

const runTests = async () => {
  console.log('--- Starting StackMatch Backend Foundation & Phase 2 AI Tests ---');

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const port = (server.address() as any).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const request = async (method: string, path: string, body?: any, token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  };

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('GET', '/api/v1/health');
    assert(health.status === 200 && health.data?.status === 'ok', 'GET /api/v1/health returns 200 OK');

    // 2. Register user
    const registerRes = await request('POST', '/api/v1/auth/register', {
      name: 'Test Founder',
      email: `founder_${Date.now()}@example.com`,
      password: 'securepassword123'
    });
    assert(registerRes.status === 201 && registerRes.data?.data?.token, 'POST /api/v1/auth/register creates user and returns JWT');
    const authToken = registerRes.data?.data?.token;

    // 3. Login with credentials
    const loginRes = await request('POST', '/api/v1/auth/login', {
      email: registerRes.data?.data?.user?.email,
      password: 'securepassword123'
    });
    assert(loginRes.status === 200 && loginRes.data?.data?.user?.name === 'Test Founder', 'POST /api/v1/auth/login returns user info');

    // 4. Protected route /auth/me
    const meRes = await request('GET', '/api/v1/auth/me', undefined, authToken);
    assert(meRes.status === 200 && meRes.data?.data?.email === registerRes.data?.data?.user?.email, 'GET /api/v1/auth/me verifies JWT authorization');

    // 5. Protected route rejection without token
    const unauthRes = await request('GET', '/api/v1/auth/me');
    assert(unauthRes.status === 401, 'GET /api/v1/auth/me rejects unauthenticated request with 401');

    // 6. Project creation
    const createProjectRes = await request('POST', '/api/v1/projects', {
      name: 'Smart Campus Shuttle',
      description: 'Real-time campus transit tracker for university students.'
    }, authToken);
    assert(createProjectRes.status === 201 && createProjectRes.data?.data?.name === 'Smart Campus Shuttle', 'POST /api/v1/projects creates a new project');
    const newProjectId = createProjectRes.data?.data?.id;

    // 7. Project retrieval
    const getProjectRes = await request('GET', `/api/v1/projects/${newProjectId}`);
    assert(getProjectRes.status === 200 && getProjectRes.data?.data?.id === newProjectId, 'GET /api/v1/projects/:id retrieves created project');

    // 8. Sample project retrieval
    const sampleProjectRes = await request('GET', '/api/v1/projects/proj_college_food_01');
    assert(sampleProjectRes.status === 200 && sampleProjectRes.data?.data?.name === 'College Food Ordering Platform', 'GET /api/v1/projects/:id retrieves seeded sample project');

    // 9. Phase 2 AI Idea Analysis
    const ideaAnalysisRes = await request('POST', `/api/v1/projects/${newProjectId}/analyze-idea`, {
      prompt: 'A mobile food ordering app with campus cafeteria pickup and UPI payment'
    });
    assert(
      ideaAnalysisRes.status === 200 &&
      ideaAnalysisRes.data?.data?.problemStatement &&
      ideaAnalysisRes.data?.data?.followUpQuestions?.length > 0,
      'POST /api/v1/projects/:id/analyze-idea extracts structured problem statement & follow-up questions'
    );

    // 10. Phase 2 AI Full Plan Generation
    const planGenRes = await request('POST', `/api/v1/projects/${newProjectId}/generate-plan`, {});
    assert(
      planGenRes.status === 200 &&
      planGenRes.data?.data?.requirements?.length > 0 &&
      planGenRes.data?.data?.techStack?.length > 0 &&
      planGenRes.data?.data?.architecture?.length > 0 &&
      planGenRes.data?.data?.roadmap?.length > 0,
      'POST /api/v1/projects/:id/generate-plan synthesizes complete requirements, tech stack, architecture, and roadmap'
    );

    // 11. Domain data endpoints
    const reqsRes = await request('GET', `/api/v1/projects/${newProjectId}/requirements`);
    assert(reqsRes.status === 200 && Array.isArray(reqsRes.data?.data) && reqsRes.data?.data.length > 0, 'GET /api/v1/projects/:id/requirements returns requirements list');

    // 12. Update requirement
    const firstReqId = reqsRes.data?.data[0].id;
    const updateReqRes = await request('PUT', `/api/v1/projects/${newProjectId}/requirements/${firstReqId}`, {
      title: 'Enhanced Authentication with Passkeys',
      priority: 'high'
    });
    assert(updateReqRes.status === 200 && updateReqRes.data?.data?.title === 'Enhanced Authentication with Passkeys', 'PUT /api/v1/projects/:id/requirements/:reqId updates requirement');

    // 13. Delete requirement
    const deleteReqRes = await request('DELETE', `/api/v1/projects/${newProjectId}/requirements/${firstReqId}`);
    assert(deleteReqRes.status === 200 && deleteReqRes.data?.success === true, 'DELETE /api/v1/projects/:id/requirements/:reqId deletes requirement');

    const techRes = await request('GET', `/api/v1/projects/${newProjectId}/tech-stack`);
    assert(techRes.status === 200 && techRes.data?.data?.some((t: any) => t.name === 'React'), 'GET /api/v1/projects/:id/tech-stack returns recommended technologies');

    const archRes = await request('GET', `/api/v1/projects/${newProjectId}/architecture`);
    assert(archRes.status === 200 && archRes.data?.data?.length > 0, 'GET /api/v1/projects/:id/architecture returns architecture nodes');

    const roadRes = await request('GET', `/api/v1/projects/${newProjectId}/roadmap`);
    assert(roadRes.status === 200 && roadRes.data?.data?.length === 4, 'GET /api/v1/projects/:id/roadmap returns 4 development phases');

    const blueprintRes = await request('GET', `/api/v1/projects/${newProjectId}/blueprint`);
    assert(blueprintRes.status === 200 && blueprintRes.data?.data?.sections?.length > 0, 'GET /api/v1/projects/:id/blueprint returns blueprint preview data');

    // 14. Phase 5 Project Context Engine test
    const contextRes = await request('GET', `/api/v1/projects/${newProjectId}/context`);
    assert(
      contextRes.status === 200 &&
      contextRes.data?.data?.problemStatement &&
      contextRes.data?.data?.complexityFactors?.length > 0 &&
      Array.isArray(contextRes.data?.data?.selectedTechnologies),
      'GET /api/v1/projects/:id/context synthesizes structured project context and complexity factors'
    );

    // 15. Phase 5 Architecture Consistency Validation test
    const validationRes = await request('GET', `/api/v1/projects/${newProjectId}/architecture/validate`);
    assert(
      validationRes.status === 200 &&
      typeof validationRes.data?.data?.score === 'number' &&
      Array.isArray(validationRes.data?.data?.findings),
      'GET /api/v1/projects/:id/architecture/validate returns architecture health score and findings'
    );

    // 16. Phase 5 Complexity and Technical Risk Insights test
    const risksRes = await request('GET', `/api/v1/projects/${newProjectId}/insights/risks`);
    assert(
      risksRes.status === 200 &&
      risksRes.data?.data?.overallComplexity &&
      Array.isArray(risksRes.data?.data?.risks) &&
      risksRes.data?.data?.risks.length > 0,
      'GET /api/v1/projects/:id/insights/risks identifies bottlenecks and practical mitigations'
    );

    // 17. Phase 5 Multi-Category Comparison Filtering test
    const frontendCompRes = await request('GET', `/api/v1/projects/${newProjectId}/comparisons?category=frontend`);
    assert(
      frontendCompRes.status === 200 &&
      frontendCompRes.data?.data?.category.includes('Frontend') &&
      frontendCompRes.data?.data?.availableCategories?.length >= 5,
      'GET /api/v1/projects/:id/comparisons?category=frontend filters matrix by category'
    );

    // 14. Conversation & Message post with AI intelligence
    const msgPostRes = await request('POST', `/api/v1/projects/${newProjectId}/messages`, {
      content: 'We need support for both web and mobile apps with UPI payments.'
    });
    assert(
      msgPostRes.status === 201 &&
      msgPostRes.data?.data?.assistantMessage?.content &&
      msgPostRes.data?.data?.assistantMessage?.metadata?.stage,
      'POST /api/v1/projects/:id/messages generates AI assistant reply, suggestions, and updates stage'
    );

    // 15. Project update
    const updateRes = await request('PATCH', `/api/v1/projects/${newProjectId}`, {
      status: 'in-progress'
    });
    assert(updateRes.status === 200 && updateRes.data?.data?.status === 'in-progress', 'PATCH /api/v1/projects/:id updates project');

    // 16. Project deletion
    const deleteRes = await request('DELETE', `/api/v1/projects/${newProjectId}`);
    assert(deleteRes.status === 200, 'DELETE /api/v1/projects/:id deletes project');

    console.log(`\nTests Completed: ${passed} passed, ${failed} failed`);
  } catch (err) {
    console.error('Test execution failed with error:', err);
    failed++;
  } finally {
    server.close();
  }

  if (failed > 0) {
    process.exit(1);
  }
};

runTests();
