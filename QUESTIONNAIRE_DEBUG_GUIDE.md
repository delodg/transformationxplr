# 🐛 Questionnaire Debug Guide

## 🚨 **Issue**: "Start Project" Button Not Working

After completing the questionnaire and clicking "Start Project", nothing happens. Let's debug this systematically.

---

## 🔍 **Debugging Steps**

### **Step 1: Check Environment Variables**

Verify these environment variables are set in `.env.local`:

```bash
# Database Connection (Turso)
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# AI Integration (Anthropic Claude)
ANTHROPIC_API_KEY=sk-ant-api03-your-api-key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### **Step 2: Check Browser Console**

1. Open browser Developer Tools (F12)
2. Go to the Console tab
3. Fill out questionnaire and click "Start Project"
4. Look for error messages with these prefixes:
   - `🐛 DEBUG:` - Our debug messages
   - `Error:` - JavaScript errors
   - Network errors

### **Step 3: Check Network Tab**

1. Open Developer Tools → Network tab
2. Click "Start Project"
3. Look for these API calls:
   - `/api/debug-questionnaire` (POST) - Should return 200
   - `/api/companies` (POST) - Should return 200
   - `/api/generate-analysis` (POST) - May fail, that's OK

### **Step 4: Test Components**

Debug each part of the flow:

```typescript
// 1. Questionnaire Form Submission
console.log("Form data:", formData);

// 2. AI Analysis Progress Modal
console.log("Show AI Analysis:", showAIAnalysis);

// 3. Database Connection
console.log("Company creation result:", result);
```

---

## 🛠️ **Debug Tools Added**

### **1. Debug API Endpoint**

- **URL**: `/api/debug-questionnaire`
- **Purpose**: Test database connection without AI
- **Returns**: Detailed debug information

### **2. Enhanced Logging**

- Added console logs throughout the flow
- All logs prefixed with `🐛 DEBUG:`
- Shows each step of the process

### **3. Fallback Analysis**

- If AI fails, uses mock data
- If database fails, shows specific error
- Always provides visual feedback

---

## 🎯 **Common Issues & Solutions**

### **Issue 1: Database Connection Failed**

```
🐛 DEBUG: User creation failed: LibsqlError: ...
```

**Solutions:**

- Check `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
- Verify database is accessible
- Run database migrations

### **Issue 2: Authentication Failed**

```
🐛 DEBUG: No user - returning 401
```

**Solutions:**

- Check Clerk configuration
- Verify user is signed in
- Check `CLERK_SECRET_KEY`

### **Issue 3: AI API Failed**

```
Claude API error: 401 - Unauthorized
```

**Solutions:**

- Check `ANTHROPIC_API_KEY`
- Verify API key is valid
- Check model name `claude-sonnet-4-20250514`

### **Issue 4: Form Validation Failed**

```
Button disabled - step not complete
```

**Solutions:**

- Fill all required fields
- Check `isStepComplete()` logic
- Verify form state

---

## 🧪 **Test Scenarios**

### **Test 1: Basic Flow**

1. Sign in to the app
2. Click "Add Company"
3. Fill out all 4 steps of questionnaire
4. Click "Start Project"
5. **Expected**: AI Analysis Progress modal appears

### **Test 2: Database Test**

```typescript
// Add to browser console:
fetch("/api/debug-questionnaire", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    companyName: "Test Company",
    industry: "Technology",
    region: "North America",
    revenue: "$1M-$2M",
    employees: "1,000-5,000",
    currentERP: "SAP S/4HANA",
    timeline: "12-16 weeks",
    budget: "$1M-$2M",
    painPoints: ["Manual processes"],
    objectives: ["Improve efficiency"],
  }),
})
  .then(r => r.json())
  .then(console.log);
```

### **Test 3: Component State**

Check React state in browser dev tools:

- `showOnboarding` should be `false` after submission
- `showAIAnalysis` should be `true` after submission
- `currentOnboardingData` should contain form data

---

## 📋 **Debug Checklist**

### **Environment Setup**

- [ ] `.env.local` file exists
- [ ] All required environment variables set
- [ ] Database connection string valid
- [ ] API keys valid

### **Authentication**

- [ ] User is signed in
- [ ] Clerk middleware working
- [ ] No 401 errors in console

### **Database**

- [ ] Turso database accessible
- [ ] Tables exist (companies, users, etc.)
- [ ] Foreign key constraints working

### **Frontend State**

- [ ] Form validation passing
- [ ] Button not disabled
- [ ] Modal state management working
- [ ] No JavaScript errors

### **API Endpoints**

- [ ] `/api/debug-questionnaire` returns 200
- [ ] `/api/companies` accepts POST requests
- [ ] Error handling working

---

## 🔧 **Quick Fixes**

### **1. Reset Application State**

```typescript
// Clear localStorage
localStorage.clear();

// Refresh page
window.location.reload();
```

### **2. Test with Mock Data**

```typescript
// Force success state
setAnalysisResults({
  estimatedAIAcceleration: 45,
  estimatedCompletion: "2025-12-31",
  hackettMatches: 1200,
  estimatedValue: 2500000,
  recommendations: ["Test recommendation"],
});
setShowAIAnalysis(false);
setActiveTab("command-center");
```

### **3. Check Network Issues**

```bash
# Test database connection
curl -X POST https://your-app.vercel.app/api/debug-questionnaire \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test"}'
```

---

## 📱 **Browser Console Commands**

### **Test Form Submission**

```javascript
// Get current form data
window.formData = {
  companyName: "Debug Test Company",
  industry: "Technology",
  region: "North America",
  revenue: "$1M-$2M",
  employees: "1,000-5,000",
  currentERP: "SAP S/4HANA",
  timeline: "12-16 weeks",
  budget: "$1M-$2M",
  painPoints: ["Manual processes"],
  objectives: ["Improve efficiency"],
};

console.log("Test data ready:", window.formData);
```

### **Force Modal States**

```javascript
// Force show AI analysis modal
// (Run in React DevTools component)
setShowAIAnalysis(true);
setCurrentOnboardingData(window.formData);
```

---

## 🎯 **Expected Debug Output**

When working correctly, you should see:

```
🐛 Testing questionnaire flow with debug endpoint
🐛 DEBUG: Questionnaire submission started
🐛 DEBUG: Auth result: { userId: "user_...", hasUser: true }
🐛 DEBUG: Received questionnaire data: { companyName: "...", ... }
🐛 DEBUG: User exists result: true
🐛 DEBUG: Company created successfully: { id: "...", clientName: "..." }
🐛 Debug test successful: { success: true, company: {...} }
```

---

## 🚀 **Next Steps**

1. **Run the app**: `npm run dev`
2. **Open browser console**
3. **Test questionnaire flow**
4. **Check debug messages**
5. **Report findings**

The debug tools will help us identify exactly where the issue occurs!

---

_Debug guide created: ${new Date().toISOString()}_
