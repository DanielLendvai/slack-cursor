// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.vulnerability-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation buttons
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// ========================================
// PROTOTYPE POLLUTION DEMONSTRATIONS
// ========================================

// Vulnerable merge function
function merge(target, source) {
    for (let key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            merge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

// Safe merge function
function safeMerge(target, source) {
    for (let key in source) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue; // Skip dangerous keys
        }
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            safeMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

function testPrototypePollution() {
    const resultDiv = document.getElementById('pp-result');
    const payload = document.getElementById('pp-payload').value;
    
    try {
        const maliciousInput = JSON.parse(payload);
        const target = {};
        
        // Show before state
        const beforePollution = ({}).polluted;
        
        // Execute vulnerable merge
        merge(target, maliciousInput);
        
        // Check if prototype was polluted
        const afterPollution = ({}).polluted;
        
        let resultHTML = `<strong>Prototype Pollution Test Results:</strong><br>`;
        resultHTML += `Before merge: ({}).polluted = ${beforePollution}<br>`;
        resultHTML += `After merge: ({}).polluted = ${afterPollution}<br>`;
        resultHTML += `Target object: ${JSON.stringify(target, null, 2)}<br>`;
        
        if (afterPollution !== undefined) {
            resultHTML += `<br><span style="color: red; font-weight: bold;">🚨 PROTOTYPE POLLUTION SUCCESSFUL!</span><br>`;
            resultHTML += `All new objects now have the 'polluted' property!`;
            resultDiv.className = 'result error';
        } else {
            resultHTML += `<br><span style="color: green;">✅ No pollution detected</span>`;
            resultDiv.className = 'result success';
        }
        
        resultDiv.innerHTML = resultHTML;
        
    } catch (e) {
        resultDiv.innerHTML = `<strong>Error:</strong> ${e.message}`;
        resultDiv.className = 'result error';
    }
}

function testSafePrototypePollution() {
    const resultDiv = document.getElementById('safe-pp-result');
    const payload = document.getElementById('safe-pp-payload').value;
    
    try {
        const maliciousInput = JSON.parse(payload);
        const target = {};
        
        // Show before state
        const beforeMerge = ({}).polluted;
        
        // Execute safe merge
        safeMerge(target, maliciousInput);
        
        // Check if prototype was polluted
        const afterMerge = ({}).polluted;
        
        let resultHTML = `<strong>Safe Merge Test Results:</strong><br>`;
        resultHTML += `Before merge: ({}).polluted = ${beforeMerge}<br>`;
        resultHTML += `After merge: ({}).polluted = ${afterMerge}<br>`;
        resultHTML += `Target object: ${JSON.stringify(target, null, 2)}<br>`;
        
        if (afterMerge !== undefined) {
            resultHTML += `<br><span style="color: red;">⚠️ Unexpected pollution detected!</span>`;
            resultDiv.className = 'result error';
        } else {
            resultHTML += `<br><span style="color: green; font-weight: bold;">✅ SAFE MERGE SUCCESSFUL!</span><br>`;
            resultHTML += `Prototype pollution was prevented by filtering dangerous keys.`;
            resultDiv.className = 'result success';
        }
        
        resultDiv.innerHTML = resultHTML;
        
    } catch (e) {
        resultDiv.innerHTML = `<strong>Error:</strong> ${e.message}`;
        resultDiv.className = 'result error';
    }
}

// ========================================
// CLICKJACKING DEMONSTRATIONS
// ========================================

function demonstrateClickjacking() {
    const resultDiv = document.getElementById('clickjacking-result');
    const iframe = document.querySelector('.hidden-iframe');
    
    // Make the iframe interactive
    iframe.classList.add('active');
    iframe.style.opacity = '0.5';
    
    let resultHTML = `<strong>Clickjacking Attack Simulated:</strong><br>`;
    resultHTML += `The red-bordered iframe is now positioned over the "Like" button.<br>`;
    resultHTML += `Users think they're clicking "Like" but actually interact with the hidden content.<br>`;
    resultHTML += `<br><span style="color: red; font-weight: bold;">🚨 CLICKJACKING VULNERABILITY ACTIVE!</span><br>`;
    resultHTML += `In a real attack, this iframe would contain a malicious page.`;
    
    resultDiv.innerHTML = resultHTML;
    resultDiv.className = 'result error';
    
    // Reset after 5 seconds
    setTimeout(() => {
        iframe.classList.remove('active');
        iframe.style.opacity = '0.3';
        resultDiv.innerHTML += `<br><br><em>Demo reset after 5 seconds.</em>`;
    }, 5000);
}

function demonstrateProtectedFrame() {
    const resultDiv = document.getElementById('protected-frame-result');
    
    // Simulate attempting to load a protected page
    const protectedContent = document.createElement('iframe');
    protectedContent.style.width = '100%';
    protectedContent.style.height = '200px';
    protectedContent.style.border = '2px solid green';
    
    // Create protected page content
    const protectedHTML = `
        <html>
        <head>
            <style>
                body { font-family: Arial; padding: 20px; background: #f0f8ff; }
                .warning { color: red; font-weight: bold; }
            </style>
        </head>
        <body>
            <h3>Protected Banking Page</h3>
            <p class="warning">This page cannot be framed due to X-Frame-Options: DENY</p>
            <button>Transfer $1000</button>
        </body>
        </html>
    `;
    
    protectedContent.srcdoc = protectedHTML;
    
    let resultHTML = `<strong>Frame Protection Test:</strong><br>`;
    resultHTML += `This simulates a page with proper frame protection headers.<br>`;
    resultHTML += `<span style="color: green; font-weight: bold;">✅ CLICKJACKING PREVENTED!</span><br>`;
    resultHTML += `Real browsers would refuse to load this page in a frame.<br><br>`;
    
    resultDiv.innerHTML = resultHTML;
    resultDiv.appendChild(protectedContent);
    resultDiv.className = 'result success';
}

// ========================================
// DOM CLOBBERING DEMONSTRATIONS
// ========================================

// Vulnerable function that uses global variables
function processConfig() {
    const resultDiv = document.getElementById('dom-clobber-result');
    
    try {
        if (window.config && window.config.apiUrl) {
            let resultHTML = `<strong>Config Processing Results:</strong><br>`;
            resultHTML += `Found config.apiUrl: ${window.config.apiUrl}<br>`;
            resultHTML += `Type of config: ${typeof window.config}<br>`;
            resultHTML += `Config constructor: ${window.config.constructor.name}<br>`;
            
            // Simulate API call
            if (typeof window.config.apiUrl === 'string') {
                if (window.config.apiUrl.includes('evil.com')) {
                    resultHTML += `<br><span style="color: red; font-weight: bold;">🚨 DOM CLOBBERING ATTACK DETECTED!</span><br>`;
                    resultHTML += `The global 'config' variable was clobbered by HTML elements!<br>`;
                    resultHTML += `Malicious API URL would be used: ${window.config.apiUrl}`;
                    resultDiv.className = 'result error';
                } else {
                    resultHTML += `<br>✅ Making API call to: ${window.config.apiUrl}`;
                    resultDiv.className = 'result success';
                }
            } else {
                resultHTML += `<br>⚠️ apiUrl is not a string, DOM clobbering likely occurred`;
                resultDiv.className = 'result warning';
            }
            
            resultDiv.innerHTML = resultHTML;
        } else {
            resultDiv.innerHTML = `<strong>No config found</strong> - Try injecting HTML first`;
            resultDiv.className = 'result warning';
        }
    } catch (e) {
        resultDiv.innerHTML = `<strong>Error:</strong> ${e.message}`;
        resultDiv.className = 'result error';
    }
}

function testDOMClobbering() {
    const htmlInput = document.getElementById('dom-clobber-html').value;
    const resultDiv = document.getElementById('dom-clobber-result');
    
    try {
        // Remove any existing injected content
        const existing = document.getElementById('injected-dom-content');
        if (existing) {
            existing.remove();
        }
        
        // Create container for injected HTML
        const container = document.createElement('div');
        container.id = 'injected-dom-content';
        container.className = 'injected-content';
        container.innerHTML = '<strong>Injected HTML:</strong><br>' + htmlInput;
        
        // Insert the HTML (simulating XSS or content injection)
        document.body.appendChild(container);
        
        // Check if DOM clobbering occurred
        let resultHTML = `<strong>DOM Clobbering Test:</strong><br>`;
        resultHTML += `HTML injected successfully!<br>`;
        
        if (window.config) {
            resultHTML += `Global 'config' variable now exists!<br>`;
            resultHTML += `Type: ${typeof window.config}<br>`;
            resultHTML += `Constructor: ${window.config.constructor.name}<br>`;
            
            if (window.config.apiUrl) {
                resultHTML += `config.apiUrl = "${window.config.apiUrl}"<br>`;
                resultHTML += `<br><span style="color: red; font-weight: bold;">🚨 DOM CLOBBERING SUCCESSFUL!</span><br>`;
                resultHTML += `The injected HTML has clobbered the global namespace!`;
                resultDiv.className = 'result error';
            }
        } else {
            resultHTML += `No DOM clobbering detected with this payload.`;
            resultDiv.className = 'result warning';
        }
        
        resultDiv.innerHTML = resultHTML;
        
    } catch (e) {
        resultDiv.innerHTML = `<strong>Error:</strong> ${e.message}`;
        resultDiv.className = 'result error';
    }
}

// Safe configuration object
const AppConfig = {
    config: null,
    setConfig(newConfig) {
        this.config = newConfig;
    },
    processConfig() {
        const resultDiv = document.getElementById('safe-config-result');
        
        try {
            if (this.config && typeof this.config.apiUrl === 'string') {
                let resultHTML = `<strong>Safe Config Processing:</strong><br>`;
                resultHTML += `Using namespaced config object<br>`;
                resultHTML += `API URL: ${this.config.apiUrl}<br>`;
                resultHTML += `<br><span style="color: green; font-weight: bold;">✅ SAFE CONFIGURATION!</span><br>`;
                resultHTML += `Using proper object encapsulation prevents DOM clobbering.`;
                
                resultDiv.innerHTML = resultHTML;
                resultDiv.className = 'result success';
            } else {
                resultDiv.innerHTML = `<strong>No valid config set</strong> - Use "Set Safe Config" first`;
                resultDiv.className = 'result warning';
            }
        } catch (e) {
            resultDiv.innerHTML = `<strong>Error:</strong> ${e.message}`;
            resultDiv.className = 'result error';
        }
    }
};

function setSafeConfig() {
    const configInput = document.getElementById('safe-config').value;
    const resultDiv = document.getElementById('safe-config-result');
    
    try {
        const newConfig = JSON.parse(configInput);
        AppConfig.setConfig(newConfig);
        
        let resultHTML = `<strong>Configuration Set:</strong><br>`;
        resultHTML += `Config: ${JSON.stringify(newConfig, null, 2)}<br>`;
        resultHTML += `✅ Safe configuration stored in namespaced object`;
        
        resultDiv.innerHTML = resultHTML;
        resultDiv.className = 'result success';
        
    } catch (e) {
        resultDiv.innerHTML = `<strong>Error:</strong> ${e.message}`;
        resultDiv.className = 'result error';
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function displayData(data) {
    console.log('API Response:', data);
    return data;
}

// Initialize default values
document.addEventListener('DOMContentLoaded', function() {
    // Set default payloads
    document.getElementById('pp-payload').value = '{"__proto__": {"polluted": "This prototype was polluted!"}}';
    document.getElementById('safe-pp-payload').value = '{"__proto__": {"polluted": "This should not pollute"}}';
    document.getElementById('dom-clobber-html').value = '<form id="config"><input name="apiUrl" value="https://evil.com"></form>';
    document.getElementById('safe-config').value = '{"apiUrl": "https://api.example.com"}';
});