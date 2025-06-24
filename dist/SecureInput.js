/* ===================================================================
   SECURE INPUT COMPONENT - SHADOW DOM IMPLEMENTATION
   
   PRESENTER: This component demonstrates TRUE encapsulation using
   Shadow DOM. Notice how:
   
   1. Internal DOM structure is hidden from parent page
   2. Styles are completely encapsulated and protected
   3. External JavaScript cannot access internal elements
   4. Component logic is isolated and secure
   
   This is the "protected" component in our security demonstration.
   =================================================================== */
export class SecureInput extends HTMLElement {
    constructor() {
        super();
        // PRESENTER: This is the KEY difference - creating a Shadow DOM
        // 'closed' mode prevents external access to shadowRoot
        this.shadowRootRef = this.attachShadow({ mode: 'closed' });
        this.setupShadowDOM();
        this.attachEventListeners();
    }
    setupShadowDOM() {
        // PRESENTER: Everything created here is encapsulated within Shadow DOM
        // External scripts cannot access these elements
        // Create the component HTML structure
        this.shadowRootRef.innerHTML = `
            <style>
                /* PRESENTER: These styles are COMPLETELY ISOLATED */
                /* Global CSS cannot override these styles */
                :host {
                    display: block;
                    margin: 1rem 0;
                }
                
                .secure-input-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    padding: 1rem;
                    border: 2px solid #2ed573;
                    border-radius: 8px;
                    background: #fff;
                    box-shadow: 0 2px 10px rgba(46, 213, 115, 0.1);
                }
                
                .secure-input-label {
                    font-weight: 600;
                    color: #2ed573;
                    margin-bottom: 0.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .secure-input-label::before {
                    content: '🛡️';
                    font-size: 1.2em;
                }
                
                .secure-input-field {
                    padding: 0.75rem;
                    border: 2px solid #2ed573;
                    border-radius: 4px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: #f8fff8;
                }
                
                .secure-input-field:focus {
                    outline: none;
                    border-color: #20bf6b;
                    box-shadow: 0 0 0 3px rgba(46, 213, 115, 0.2);
                    background: #fff;
                }
                
                .secure-input-field::placeholder {
                    color: #999;
                    font-style: italic;
                }
                
                .secure-input-button {
                    padding: 0.75rem 1rem;
                    background: linear-gradient(135deg, #2ed573, #20bf6b);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .secure-input-button:hover {
                    background: linear-gradient(135deg, #20bf6b, #26d0ce);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(46, 213, 115, 0.3);
                }
                
                .secure-input-button:active {
                    transform: translateY(0);
                }
                
                .secure-input-button::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition: width 0.3s, height 0.3s;
                }
                
                .secure-input-button:active::before {
                    width: 100px;
                    height: 100px;
                }
                
                .security-indicator {
                    font-size: 0.8rem;
                    color: #20bf6b;
                    text-align: center;
                    margin-top: 0.5rem;
                    font-weight: 500;
                }
                
                /* PRESENTER: These styles cannot be overridden from outside */
                /* Try this in global CSS - it won't work! */
                /* secure-input input { background: red !important; } */
            </style>
            
            <div class="secure-input-wrapper">
                <label class="secure-input-label">
                    ${this.getAttribute('label') || 'Secure Input:'}
                </label>
                <input 
                    type="text" 
                    class="secure-input-field"
                    placeholder="Protected by Shadow DOM..."
                />
                <button class="secure-input-button">
                    🔒 Submit (Shadow DOM)
                </button>
                <div class="security-indicator">
                    🛡️ Protected by Shadow DOM Encapsulation
                </div>
            </div>
        `;
        // PRESENTER: Get references to Shadow DOM elements
        // These are completely hidden from external access
        this.label = this.shadowRootRef.querySelector('.secure-input-label');
        this.input = this.shadowRootRef.querySelector('.secure-input-field');
        this.button = this.shadowRootRef.querySelector('.secure-input-button');
    }
    attachEventListeners() {
        // PRESENTER: These event listeners are attached to Shadow DOM elements
        // External scripts cannot interfere with these events
        this.button.addEventListener('click', () => {
            this.handleSecureSubmit();
        });
        // PRESENTER: Even though events bubble up, the internal structure is protected
        this.input.addEventListener('input', (event) => {
            // Dispatch a custom event to the host element
            // This allows controlled communication with the parent
            this.dispatchEvent(new CustomEvent('secure-input-change', {
                detail: {
                    hasValue: this.input.value.length > 0,
                    // PRESENTER: Notice we don't expose the actual value
                    // Only metadata about the value
                    length: this.input.value.length
                },
                bubbles: true
            }));
        });
        // PRESENTER: Add some visual feedback that's completely protected
        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.handleSecureSubmit();
            }
        });
    }
    handleSecureSubmit() {
        const value = this.input.value.trim();
        if (!value) {
            this.showSecureAlert('Please enter some text in the Shadow DOM input!');
            return;
        }
        // PRESENTER: This log is the only way to see the value
        // The input itself cannot be accessed from outside
        console.log('🔒 Shadow DOM Input Submitted:', value);
        this.showSecureAlert(`Shadow DOM Value: "${value}"\n\n` +
            `🔒 This value was NOT accessible via:\n` +
            `document.querySelector('secure-input input').value\n\n` +
            `🛡️ Shadow DOM protected the internal structure!`);
        // Clear the input
        this.input.value = '';
        // Dispatch a secure submission event
        this.dispatchEvent(new CustomEvent('secure-submit', {
            detail: { submitted: true, timestamp: Date.now() },
            bubbles: true
        }));
    }
    showSecureAlert(message) {
        // PRESENTER: Even our alert method is encapsulated
        alert(message);
    }
    // PRESENTER: Limited public API - only controlled access
    hasValue() {
        return this.input.value.length > 0;
    }
    getValueLength() {
        // PRESENTER: We expose metadata but not the actual value
        return this.input.value.length;
    }
    focus() {
        this.input.focus();
    }
    clear() {
        this.input.value = '';
    }
    // PRESENTER: We deliberately DO NOT expose getValue() or setValue()
    // This maintains the security boundary
    // PRESENTER: Lifecycle methods
    connectedCallback() {
        console.log('🔒 Secure Input connected to DOM - Shadow DOM protected');
    }
    disconnectedCallback() {
        console.log('🔒 Secure Input disconnected from DOM');
    }
    // PRESENTER: Attribute observation with controlled updates
    static get observedAttributes() {
        return ['label'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'label' && this.label) {
            this.label.textContent = newValue;
        }
    }
}
/* ===================================================================
   SECURITY ANALYSIS FOR PRESENTER:
   
   PROTECTIONS PROVIDED BY THIS COMPONENT:
   
   1. DOM ISOLATION:
      - document.querySelector('secure-input input') ❌ FAILS
      - Cannot access internal elements from outside
      - Shadow DOM creates a security boundary
   
   2. STYLE ENCAPSULATION:
      - Global CSS cannot override Shadow DOM styles
      - Component styles are completely isolated
      - :host pseudo-class controls external styling
   
   3. EVENT PROTECTION:
      - Internal event handling is protected
      - External scripts cannot modify event listeners
      - Controlled communication via custom events
   
   4. STATE PROTECTION:
      - No direct access to internal state
      - Controlled public API with limited methods
      - Value is not exposed directly
   
   ATTACK RESISTANCE EXAMPLES:
   
   // These will all FAIL:
   document.querySelector('secure-input input') // null
   document.querySelector('secure-input').shadowRoot // null (closed mode)
   document.querySelector('secure-input input').value // Error!
   
   // Style injection fails:
   const style = document.createElement('style');
   style.textContent = 'secure-input input { background: red !important; }';
   document.head.appendChild(style); // No effect!
   
   // Event hijacking fails:
   document.querySelector('secure-input input').addEventListener(...) // Error!
   
   LIMITATIONS TO DISCUSS:
   
   1. JavaScript in the same origin can still:
      - Access the host element
      - Modify attributes
      - Listen to bubbled events
   
   2. Shadow DOM is NOT a security boundary against:
      - XSS attacks in the same origin
      - Malicious scripts with full page access
      - Network-level attacks
   
   3. It's about ENCAPSULATION, not SANDBOXING
   
   =================================================================== */
// Register the custom element
if (!customElements.get('secure-input')) {
    customElements.define('secure-input', SecureInput);
}
//# sourceMappingURL=SecureInput.js.map