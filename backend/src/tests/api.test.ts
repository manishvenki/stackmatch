import http from 'http';
import { createApp } from '../app';

const runTests = async () => {
  console.log('--- Starting StackMatch Backend Foundation Tests ---');

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

    // 9. Domain data endpoints
    const reqsRes = await request('GET', '/api/v1/projects/proj_college_food_01/requirements');
    assert(reqsRes.status === 200 && Array.isArray(reqsRes.data?.data) && reqsRes.data?.data.length > 0, 'GET /api/v1/projects/:id/requirements returns requirements list');

    const techRes = await request('GET', '/api/v1/projects/proj_college_food_01/tech-stack');
    assert(techRes.status === 200 && techRes.data?.data?.some((t: any) => t.name === 'React'), 'GET /api/v1/projects/:id/tech-stack returns recommended technologies');

    const archRes = await request('GET', '/api/v1/projects/proj_college_food_01/architecture');
    assert(archRes.status === 200 && archRes.data?.data?.length > 0, 'GET /api/v1/projects/:id/architecture returns architecture nodes');

    const roadRes = await request('GET', '/api/v1/projects/proj_college_food_01/roadmap');
    assert(roadRes.status === 200 && roadRes.data?.data?.length === 4, 'GET /api/v1/projects/:id/roadmap returns 4 development phases');

    const blueprintRes = await request('GET', '/api/v1/projects/proj_college_food_01/blueprint');
    assert(blueprintRes.status === 200 && blueprintRes.data?.data?.sections?.length > 0, 'GET /api/v1/projects/:id/blueprint returns blueprint preview data');

    // 10. Conversation & Message post
    const msgPostRes = await request('POST', `/api/v1/projects/${newProjectId}/messages`, {
      content: 'We need support for both web and mobile apps.'
    });
    assert(msgPostRes.status === 201 && msgPostRes.data?.data?.assistantMessage?.content, 'POST /api/v1/projects/:id/messages generates AI assistant reply and advances stage');

    // 11. Project update
    const updateRes = await request('PATCH', `/api/v1/projects/${newProjectId}`, {
      status: 'in-progress'
    });
    assert(updateRes.status === 200 && updateRes.data?.data?.status === 'in-progress', 'PATCH /api/v1/projects/:id updates project');

    // 12. Project deletion
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
