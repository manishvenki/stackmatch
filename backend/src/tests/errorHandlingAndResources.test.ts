import { mapError } from '../../../apps/web/src/services/errorMapper';
import { CURATED_RESOURCES, RESOURCE_CATEGORIES } from '../../../apps/web/src/data/curatedResources';

const runTests = () => {
  console.log('--- Running StackMatch Error Domain Separation & Resources Verification Tests ---');

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

  // ==========================================
  // PART 1: RESOURCES PAGE CONTENT TESTS
  // ==========================================
  assert(CURATED_RESOURCES.length >= 24, `Curated resources count is at least 24 (found ${CURATED_RESOURCES.length})`);
  assert(RESOURCE_CATEGORIES.length === 8, `Curated categories count is 8 (found ${RESOURCE_CATEGORIES.length})`);

  // Verify all 8 categories exist in data
  RESOURCE_CATEGORIES.forEach((cat) => {
    const itemsInCat = CURATED_RESOURCES.filter((r) => r.category === cat);
    assert(
      itemsInCat.length >= 3,
      `Category '${cat}' has at least 3 high-quality resources (found ${itemsInCat.length})`
    );
  });

  // Verify all resources have valid links, learning outcomes, and types
  const allHaveValidUrls = CURATED_RESOURCES.every(
    (r) => r.url.startsWith('http://') || r.url.startsWith('https://')
  );
  assert(allHaveValidUrls, 'All curated resources contain valid http/https URLs');

  const allHaveOutcomes = CURATED_RESOURCES.every(
    (r) => Array.isArray(r.learningOutcomes) && r.learningOutcomes.length > 0
  );
  assert(allHaveOutcomes, 'All curated resources contain distinct learning outcomes');

  const officialDocs = CURATED_RESOURCES.filter((r) => r.isOfficialDoc);
  const stackMatchGuides = CURATED_RESOURCES.filter((r) => !r.isOfficialDoc);
  assert(
    officialDocs.length >= 10 && stackMatchGuides.length >= 10,
    `Clean distinction between official documentation (${officialDocs.length}) and StackMatch guides (${stackMatchGuides.length})`
  );

  // ==========================================
  // PART 2: AUTHENTICATION ERROR TESTS (THE LOGIN BUG FIX)
  // ==========================================

  // Test: Login with non-existent user should produce AUTH_USER_NOT_FOUND, NOT AI error
  const userNotFoundErr = mapError(
    { message: 'No account was found for this email. Please sign up first.', statusCode: 404, code: 'USER_NOT_FOUND' },
    'auth-login'
  );
  assert(
    userNotFoundErr.category === 'AUTH_USER_NOT_FOUND' &&
    userNotFoundErr.message.includes('No account was found') &&
    !userNotFoundErr.message.toLowerCase().includes('ai assistant') &&
    !userNotFoundErr.title.toLowerCase().includes('working on it'),
    'Login with non-existent email maps to AUTH_USER_NOT_FOUND (not AI error)'
  );

  // Test: "Invalid email or password" (contains word "email", which previously triggered substring "ai" match!)
  const invalidPasswordErr = mapError(
    { message: 'Invalid email or password.', statusCode: 401 },
    'auth-login'
  );
  assert(
    invalidPasswordErr.category === 'AUTH_INVALID_CREDENTIALS' &&
    !invalidPasswordErr.category.startsWith('AI_'),
    'Credentials failure with word "email" does NOT trigger AI error mapping'
  );

  // Test: Incorrect password with code INVALID_PASSWORD
  const wrongPasswordErr = mapError(
    { message: 'Incorrect password. Please verify your credentials and try again.', statusCode: 401, code: 'INVALID_PASSWORD' },
    'auth-login'
  );
  assert(
    wrongPasswordErr.category === 'AUTH_INVALID_PASSWORD' &&
    wrongPasswordErr.title === 'Incorrect Password',
    'Incorrect password maps accurately to AUTH_INVALID_PASSWORD'
  );

  // Test: Registration duplicate email
  const duplicateEmailErr = mapError(
    { message: 'An account with this email address already exists. Please sign in instead.', statusCode: 409, code: 'EMAIL_ALREADY_EXISTS' },
    'auth-register'
  );
  assert(
    duplicateEmailErr.category === 'AUTH_EMAIL_EXISTS' &&
    duplicateEmailErr.title === 'Account Already Exists',
    'Registration with existing email maps to AUTH_EMAIL_EXISTS (not AI error)'
  );

  // Test: Password validation failure
  const validationErr = mapError(
    { message: 'Password must be at least 6 characters long.', statusCode: 400 },
    'auth-register'
  );
  assert(
    validationErr.category === 'VALIDATION_ERROR',
    'Registration short password maps to VALIDATION_ERROR'
  );

  // Test: Expired session on protected /auth/me or /projects
  const sessionExpiredErr = mapError(
    { message: 'jwt expired', statusCode: 401 },
    'auth-session'
  );
  assert(
    sessionExpiredErr.category === 'AUTH_EXPIRED',
    'Expired JWT session maps to AUTH_EXPIRED'
  );

  // ==========================================
  // PART 3: AI ERROR ISOLATION TESTS
  // ==========================================

  // Test: AI Quota Exceeded in AI Chat
  const aiQuotaErr = mapError(
    { message: 'Resource has been exhausted (e.g. check quota)', statusCode: 429 },
    'ai-chat'
  );
  assert(
    aiQuotaErr.category === 'AI_QUOTA_EXCEEDED' &&
    aiQuotaErr.title === 'AI Usage Limit Reached',
    'AI quota exhaustion maps strictly to AI_QUOTA_EXCEEDED'
  );

  // Test: AI Service Unavailable in AI Planning
  const aiUnavailableErr = mapError(
    { message: 'Model is currently overloaded', statusCode: 503 },
    'ai-planning'
  );
  assert(
    aiUnavailableErr.category === 'AI_SERVICE_UNAVAILABLE',
    'Overloaded Gemini model maps to AI_SERVICE_UNAVAILABLE'
  );

  // Test: AI Misconfigured in AI Planning
  const aiMisconfigErr = mapError(
    { message: 'API key not valid. Please pass a valid API key.', statusCode: 400 },
    'ai-planning'
  );
  assert(
    aiMisconfigErr.category === 'AI_MISCONFIGURED',
    'Invalid Gemini API key maps to AI_MISCONFIGURED'
  );

  // ==========================================
  // PART 4: INFRASTRUCTURE & NETWORK TESTS
  // ==========================================

  // Test: Network offline
  const offlineErr = mapError(new Error('Failed to fetch'), '/projects');
  assert(
    offlineErr.category === 'OFFLINE' &&
    offlineErr.title === "You're Offline",
    'Fetch failure maps to OFFLINE error'
  );

  // Test: Request timeout
  const timeoutErr = mapError(new Error('AbortError: The operation was aborted due to timeout'), '/projects');
  assert(
    timeoutErr.category === 'NETWORK_TIMEOUT',
    'Abort timeout maps to NETWORK_TIMEOUT'
  );

  // Test: Server 500 on projects endpoint
  const serverErr = mapError(
    { message: 'Internal Server Error', statusCode: 500 },
    '/projects'
  );
  assert(
    serverErr.category === 'SERVER_ERROR' &&
    serverErr.title === 'Temporary Server Issue',
    'Backend 500 on /projects maps to SERVER_ERROR'
  );

  // Test: 404 on project resource
  const notFoundErr = mapError(
    { message: 'Project not found', statusCode: 404 },
    '/projects/unknown_id'
  );
  assert(
    notFoundErr.category === 'NOT_FOUND' &&
    notFoundErr.title === 'Resource Not Found',
    'Missing project maps to NOT_FOUND'
  );

  // Test: 403 Forbidden
  const forbiddenErr = mapError(
    { message: 'Access denied', statusCode: 403 },
    '/projects/secret'
  );
  assert(
    forbiddenErr.category === 'UNAUTHORIZED',
    'HTTP 403 maps to UNAUTHORIZED'
  );

  console.log(`\nVerification Complete: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
};

runTests();
