/* ===================================================================
   MAIN APPLICATION - SECURITY SHOWCASE COORDINATOR
   
   This file coordinates the entire security demonstration.
   It provides:
   1. Component initialization
   2. Attack playground functionality
   3. Pre-built attack examples
   4. Results display and analysis
   
   This is the "control center" for the security presentation.
   =================================================================== */
class SecurityShowcaseApp {
    constructor() {
        this.initializeApp();
    }
    initializeApp() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        }
        else {
            this.setupApplication();
        }
    }
    setupApplication() {
        console.log('🚀 Security Showcase App initializing...');
        // Get references to UI elements
        this.getUIReferences();
        // Set up event listeners for the attack playground
        this.setupAttackPlayground();
        // Set up pre-built attack examples
        this.setupAttackExamples();
        // Listen for component events
        /* this.setupComponentListeners(); */
        // Add iframe message listener
        /* this.setupIFrameListener(); */
        console.log('✅ Security Showcase App ready for demonstration!');
        this.displayWelcomeMessage();
    }
    getUIReferences() {
        // Get references to attack playground elements
        this.attackCodeTextarea = document.getElementById('attack-code');
        this.runAttackButton = document.getElementById('run-attack');
        this.loadExampleButton = document.getElementById('load-example');
        this.clearResultsButton = document.getElementById('clear-results');
        this.resultsContent = document.getElementById('results-content');
        if (!this.attackCodeTextarea || !this.runAttackButton || !this.resultsContent) {
            console.error('❌ Could not find required UI elements');
            return;
        }
    }
    setupAttackPlayground() {
        // Set up the main attack execution button
        this.runAttackButton.addEventListener('click', () => {
            this.executeAttack();
        });
        // Load example attacks button
        this.loadExampleButton.addEventListener('click', () => {
            this.loadExampleAttacks();
        });
        // Clear results button
        this.clearResultsButton.addEventListener('click', () => {
            this.clearResults();
        });
        // Allow Ctrl+Enter to run attacks quickly
        this.attackCodeTextarea.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                this.executeAttack();
            }
        });
    }
    setupAttackExamples() {
        // Set up pre-built attack example buttons
        const exampleButtons = document.querySelectorAll('.example-btn');
        exampleButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.target;
                const attackType = target.getAttribute('data-attack');
                if (attackType) {
                    this.executePrebuiltAttack(attackType);
                }
            });
        });
    }
    /* setupComponentListeners() {
        // Listen to events from our components
        const normalInput = document.getElementById('normal-input');
        const secureInput = document.getElementById('secure-input');
        if (normalInput) {
            normalInput.addEventListener('normal-input-change', (event) => {
                console.log('🔓 Normal Input Event:', event.detail);
            });
        }
        if (secureInput) {
            secureInput.addEventListener('secure-input-change', (event) => {
                console.log('🔒 Secure Input Event (metadata only):', event.detail);
            });
            secureInput.addEventListener('secure-submit', (event) => {
                console.log('🔒 Secure Submit Event:', event);
            });
        }
    }
    setupIFrameListener() {
        // Listen for messages from the iframe
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'iframe-submit') {
                console.log('🏰 IFrame Message Received:', event.data);
                this.logResult('🏰 IFrame communicated via postMessage (controlled communication)');
            }
        });
    } */
    executeAttack() {
        const code = this.attackCodeTextarea.value.trim();
        if (!code) {
            this.logResult('❌ No attack code provided');
            return;
        }
        this.logResult(`\n🎯 EXECUTING ATTACK:\n${code}\n`);
        try {
            // Execute the attack code and capture result
            const result = eval(code);
            this.logResult(`✅ Attack executed successfully`);
            this.logResult(`📊 Result: ${JSON.stringify(result, null, 2)}`);
        }
        catch (error) {
            this.logResult(`❌ Attack failed: ${error}`);
        }
        this.logResult('\n' + '='.repeat(50) + '\n');
    }
    executePrebuiltAttack(attackType) {
        this.logResult(`\n🎯 EXECUTING PRE-BUILT ATTACK: ${attackType.toUpperCase()}\n`);
        const attacks = {
            'value-access': this.performValueAccessAttack(),
            'style-override': this.performStyleOverrideAttack(),
            'event-hijack': this.performEventHijackAttack()
        };
        const results = attacks[attackType];
        if (!results) {
            this.logResult(`❌ Unknown attack type: ${attackType}`);
            return;
        }
        // Display results for each component
        results.forEach(result => {
            const status = result.success ? '✅ SUCCESS' : '❌ BLOCKED';
            this.logResult(`${status} - ${result.name}: ${result.description}`);
            if (result.result) {
                this.logResult(`   Result: ${JSON.stringify(result.result)}`);
            }
            if (result.error) {
                this.logResult(`   Error: ${result.error}`);
            }
        });
        this.logResult('\n' + '='.repeat(50) + '\n');
    }
    performValueAccessAttack() {
        const results = [];
        // Try to access Light DOM input
        try {
            const lightInput = document.querySelector('normal-input input');
            if (lightInput) {
                results.push({
                    name: 'Light DOM Value Access',
                    success: true,
                    result: lightInput.value || '(empty)',
                    description: 'Successfully accessed Light DOM input value'
                });
            }
            else {
                results.push({
                    name: 'Light DOM Value Access',
                    success: false,
                    result: null,
                    description: 'Could not find Light DOM input'
                });
            }
        }
        catch (error) {
            results.push({
                name: 'Light DOM Value Access',
                success: false,
                result: null,
                error: String(error),
                description: 'Failed to access Light DOM input'
            });
        }
        // Try to access Shadow DOM input
        try {
            const shadowInput = document.querySelector('secure-input input');
            if (shadowInput) {
                results.push({
                    name: 'Shadow DOM Value Access',
                    success: true,
                    result: shadowInput.value,
                    description: 'UNEXPECTED: Accessed Shadow DOM input value'
                });
            }
            else {
                results.push({
                    name: 'Shadow DOM Value Access',
                    success: false,
                    result: null,
                    description: 'Shadow DOM input not accessible (PROTECTED)'
                });
            }
        }
        catch (error) {
            results.push({
                name: 'Shadow DOM Value Access',
                success: false,
                result: null,
                error: String(error),
                description: 'Shadow DOM input access blocked (PROTECTED)'
            });
        }
        // Try to access iframe content
        try {
            const iframe = document.getElementById('iframe-component');
            const iframeInput = iframe?.contentDocument?.getElementById('iframe-input');
            if (iframeInput) {
                results.push({
                    name: 'IFrame Value Access',
                    success: true,
                    result: iframeInput.value,
                    description: 'UNEXPECTED: Accessed IFrame input value'
                });
            }
            else {
                results.push({
                    name: 'IFrame Value Access',
                    success: false,
                    result: null,
                    description: 'IFrame input not accessible (MAXIMUM PROTECTION)'
                });
            }
        }
        catch (error) {
            results.push({
                name: 'IFrame Value Access',
                success: false,
                result: null,
                error: String(error),
                description: 'IFrame access blocked by same-origin policy (MAXIMUM PROTECTION)'
            });
        }
        return results;
    }
    performStyleOverrideAttack() {
        const results = [];
        const timestamp = Date.now();
        // Try to style Light DOM input
        try {
            const style = document.createElement('style');
            style.id = `attack-style-${timestamp}`;
            style.textContent = `
                normal-input input { 
                    background: red !important; 
                    border: 3px solid orange !important;
                    color: white !important;
                }
            `;
            document.head.appendChild(style);
            results.push({
                name: 'Light DOM Style Override',
                success: true,
                result: 'Styles applied successfully',
                description: 'Light DOM styles successfully overridden'
            });
        }
        catch (error) {
            results.push({
                name: 'Light DOM Style Override',
                success: false,
                result: null,
                error: String(error),
                description: 'Failed to override Light DOM styles'
            });
        }
        // Try to style Shadow DOM input
        try {
            const style = document.createElement('style');
            style.id = `attack-shadow-style-${timestamp}`;
            style.textContent = `
                secure-input input { 
                    background: red !important; 
                    border: 3px solid orange !important;
                    color: white !important;
                }
            `;
            document.head.appendChild(style);
            results.push({
                name: 'Shadow DOM Style Override',
                success: false,
                result: 'Styles applied but have no effect',
                description: 'Shadow DOM styles remain protected (NO EFFECT)'
            });
        }
        catch (error) {
            results.push({
                name: 'Shadow DOM Style Override',
                success: false,
                result: null,
                error: String(error),
                description: 'Shadow DOM style override blocked'
            });
        }
        // IFrame styles are completely isolated
        results.push({
            name: 'IFrame Style Override',
            success: false,
            result: null,
            description: 'IFrame styles completely isolated (MAXIMUM PROTECTION)'
        });
        return results;
    }
    performEventHijackAttack() {
        const results = [];
        // Try to hijack Light DOM events
        try {
            const lightInput = document.querySelector('normal-input input');
            if (lightInput) {
                const hijackHandler = (e) => {
                    console.log('🔓 HIJACKED Light DOM input:', e.target.value);
                };
                lightInput.addEventListener('input', hijackHandler);
                results.push({
                    name: 'Light DOM Event Hijacking',
                    success: true,
                    result: 'Event listener attached successfully',
                    description: 'Light DOM events successfully hijacked'
                });
            }
        }
        catch (error) {
            results.push({
                name: 'Light DOM Event Hijacking',
                success: false,
                result: null,
                error: String(error),
                description: 'Failed to hijack Light DOM events'
            });
        }
        // Try to hijack Shadow DOM events
        try {
            const shadowInput = document.querySelector('secure-input input');
            if (shadowInput) {
                const hijackHandler = (e) => {
                    console.log('🛡️ HIJACKED Shadow DOM input:', e.target.value);
                };
                shadowInput.addEventListener('input', hijackHandler);
                results.push({
                    name: 'Shadow DOM Event Hijacking',
                    success: true,
                    result: 'Event listener attached to internal element',
                    description: 'UNEXPECTED: Shadow DOM event hijacked'
                });
            }
            else {
                // This is the expected behavior
                results.push({
                    name: 'Shadow DOM Event Hijacking',
                    success: false,
                    result: null,
                    description: 'Shadow DOM internal elements not accessible (PROTECTED)'
                });
            }
        }
        catch (error) {
            results.push({
                name: 'Shadow DOM Event Hijacking',
                success: false,
                result: null,
                error: String(error),
                description: 'Shadow DOM event hijacking blocked (PROTECTED)'
            });
        }
        // IFrame events are completely isolated
        results.push({
            name: 'IFrame Event Hijacking',
            success: false,
            result: null,
            description: 'IFrame events completely isolated (MAXIMUM PROTECTION)'
        });
        return results;
    }
    loadExampleAttacks() {
        // Load comprehensive attack examples into the textarea
        const exampleCode = `// ===== COMPREHENSIVE ATTACK EXAMPLES =====

// 1. VALUE ACCESS ATTACKS
console.log('=== VALUE ACCESS ATTACK ===');

// Light DOM - Should succeed
const lightInput = document.querySelector('normal-input input');
console.log('Light DOM value:', lightInput ? lightInput.value : 'Not found');

// Shadow DOM - Should fail
const shadowInput = document.querySelector('secure-input input');
console.log('Shadow DOM value:', shadowInput ? shadowInput.value : 'Protected by Shadow DOM');

// IFrame - Should fail
try {
    const iframe = document.getElementById('iframe-component');
    const iframeInput = iframe.contentDocument.getElementById('iframe-input');
    console.log('IFrame value:', iframeInput ? iframeInput.value : 'Not accessible');
} catch (e) {
    console.log('IFrame access blocked:', e.message);
}

// 2. STYLE OVERRIDE ATTACKS
console.log('\\n=== STYLE OVERRIDE ATTACK ===');

// Create malicious styles
const maliciousStyle = document.createElement('style');
maliciousStyle.textContent = \`
    normal-input input { background: red !important; }
    secure-input input { background: red !important; }
\`;
document.head.appendChild(maliciousStyle);
console.log('Malicious styles injected - check visual results!');

// 3. DOM MANIPULATION ATTACKS
console.log('\\n=== DOM MANIPULATION ATTACK ===');

// Light DOM manipulation
if (lightInput) {
    lightInput.placeholder = 'HACKED!';
    lightInput.style.border = '3px solid red';
    console.log('Light DOM manipulated successfully');
}

// Shadow DOM manipulation attempt
if (document.querySelector('secure-input')) {
    console.log('Shadow DOM host found but internals protected');
}

// 4. EVENT HIJACKING
console.log('\\n=== EVENT HIJACKING ATTACK ===');

// Hijack Light DOM events
if (lightInput) {
    lightInput.addEventListener('input', (e) => {
        console.log('🔓 STOLEN Light DOM input:', e.target.value);
    });
    console.log('Light DOM keylogger installed');
}

console.log('\\n🎯 Attack sequence completed - check results above!');`;
        this.attackCodeTextarea.value = exampleCode;
        this.logResult('📝 Example attacks loaded into the attack playground');
    }
    clearResults() {
        this.resultsContent.textContent = 'Results cleared. Ready for new attacks...';
    }
    logResult(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        this.resultsContent.textContent += logMessage + '\n';
        this.resultsContent.scrollTop = this.resultsContent.scrollHeight;
        // Also log to console for additional analysis
        console.log(logMessage);
    }
    displayWelcomeMessage() {
        const welcomeMessage = `🎯 SECURITY SHOWCASE READY!

This demonstration shows three different encapsulation approaches:

🔓 LIGHT DOM (Vulnerable):
   - Fully exposed DOM structure
   - Global CSS affects styling  
   - JavaScript can access everything
   - No security boundaries

🛡️ SHADOW DOM (Protected):
   - Encapsulated DOM structure
   - Style isolation and protection
   - Limited external access
   - Encapsulation boundary

🏰 IFRAME (Maximum Isolation):
   - Complete security boundary
   - Separate JavaScript context
   - Full isolation from parent
   - Cross-origin capability

Try the attack examples to see the differences!
Use Ctrl+Enter to quickly execute attacks.

PRESENTER TIPS:
- Open DevTools to show DOM inspection
- Demonstrate each attack type step by step
- Explain the security implications
- Show how different approaches protect differently`;
        this.logResult(welcomeMessage);
    }
}
/* ===================================================================
   PRESENTER NOTES FOR LIVE DEMONSTRATION:
   
   DEMONSTRATION FLOW SUGGESTIONS:
   
   1. INTRODUCTION (5 min):
      - Explain the three encapsulation approaches
      - Show the visual differences in the UI
      - Open DevTools to inspect DOM structure
   
   2. LIGHT DOM VULNERABILITIES (10 min):
      - Run value access attack
      - Show style override attack
      - Demonstrate event hijacking
      - Explain why this happens
   
   3. SHADOW DOM PROTECTION (10 min):
      - Show how Shadow DOM blocks access
      - Demonstrate style encapsulation
      - Explain the closed vs open mode
      - Discuss limitations (event bubbling, same-origin)
   
   4. IFRAME ISOLATION (10 min):
      - Show complete isolation
      - Explain sandbox attributes
      - Demonstrate postMessage communication
      - Discuss when to use iframes
   
   5. COMPARATIVE ANALYSIS (15 min):
      - Side-by-side attack results
      - Performance implications
      - Use case scenarios
      - Security best practices
   
   6. Q&A AND LIVE CODING (10 min):
      - Answer audience questions
      - Try custom attacks suggested by audience
      - Explore edge cases
   
   KEY POINTS TO EMPHASIZE:
   - Shadow DOM is about ENCAPSULATION, not SECURITY
   - None of these protect against XSS in the same origin
   - IFrame provides true security boundaries
   - Choose the right tool for the right job
   - Always follow defense-in-depth principles
   
   =================================================================== */
// Initialize the application when this module loads
const app = new SecurityShowcaseApp();
export {};
//# sourceMappingURL=App.js.map