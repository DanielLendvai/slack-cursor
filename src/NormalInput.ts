/* ===================================================================
   NORMAL INPUT COMPONENT - LIGHT DOM IMPLEMENTATION
   
   PRESENTER: This component demonstrates the LACK of encapsulation
   in traditional Light DOM components. Notice how:
   
   1. All DOM elements are directly accessible from the parent page
   2. Global CSS can override component styles
   3. JavaScript can easily read/modify internal state
   4. No security boundaries exist
   
   This is the "vulnerable" component in our security demonstration.
   =================================================================== */

export class NormalInput extends HTMLElement {
    private input!: HTMLInputElement;
    private button!: HTMLButtonElement;
    private label!: HTMLLabelElement;

    constructor() {
        super();
        
        // PRESENTER: Notice we're NOT creating a Shadow DOM
        // Everything goes directly into the Light DOM
        this.setupComponent();
        this.attachEventListeners();
    }

    private setupComponent(): void {
        // PRESENTER: This creates the component structure in Light DOM
        // All elements will be directly accessible via document.querySelector()
        
        const wrapper = document.createElement('div');
        wrapper.className = 'normal-input-wrapper';
        
        // Create label element
        this.label = document.createElement('label');
        this.label.textContent = this.getAttribute('label') || 'Normal Input:';
        this.label.className = 'normal-input-label';
        
        // Create input element - COMPLETELY EXPOSED to parent page
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Type something... (vulnerable to attacks)';
        this.input.className = 'normal-input-field';
        // PRESENTER: This input can be accessed via document.querySelector('normal-input input')
        
        // Create button element
        this.button = document.createElement('button');
        this.button.textContent = '🔓 Submit (Light DOM)';
        this.button.className = 'normal-input-button';
        
        // Apply inline styles - these can be overridden by global CSS
        this.applyStyles(wrapper);
        
        // Build the DOM structure
        wrapper.appendChild(this.label);
        wrapper.appendChild(this.input);
        wrapper.appendChild(this.button);
        
        // PRESENTER: appendChild adds to Light DOM, not Shadow DOM
        this.appendChild(wrapper);
    }

    private applyStyles(wrapper: HTMLDivElement): void {
        // PRESENTER: These styles are applied inline but can still be
        // overridden by global CSS with sufficient specificity
        
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin: 1rem 0;
            padding: 1rem;
            border: 2px solid #ddd;
            border-radius: 8px;
            background: #fff;
        `;
        
        this.label.style.cssText = `
            font-weight: 600;
            color: #333;
            margin-bottom: 0.25rem;
        `;
        
        this.input.style.cssText = `
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        `;
        
        this.button.style.cssText = `
            padding: 0.75rem 1rem;
            background: #ff4757;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            transition: background-color 0.3s ease;
        `;
    }

    private attachEventListeners(): void {
        // PRESENTER: Event handlers are attached to exposed DOM elements
        
        this.input.addEventListener('focus', () => {
            // PRESENTER: This styling change can be observed and hijacked
            this.input.style.borderColor = '#5352ed';
            this.input.style.boxShadow = '0 0 0 3px rgba(83, 82, 237, 0.1)';
        });

        this.input.addEventListener('blur', () => {
            this.input.style.borderColor = '#ddd';
            this.input.style.boxShadow = 'none';
        });

        this.button.addEventListener('mouseenter', () => {
            this.button.style.backgroundColor = '#ff3838';
        });

        this.button.addEventListener('mouseleave', () => {
            this.button.style.backgroundColor = '#ff4757';
        });

        this.button.addEventListener('click', () => {
            this.handleSubmit();
        });

        // PRESENTER: Input events bubble up and can be intercepted
        this.input.addEventListener('input', (event) => {
            // Dispatch a custom event that bubbles up
            this.dispatchEvent(new CustomEvent('normal-input-change', {
                detail: { value: this.input.value },
                bubbles: true
            }));
        });
    }

    private handleSubmit(): void {
        const value = this.input.value.trim();
        
        if (!value) {
            alert('Please enter some text in the Light DOM input!');
            return;
        }

        // PRESENTER: This log can be monitored by malicious scripts
        console.log('🔓 Light DOM Input Submitted:', value);
        
        // PRESENTER: Value is easily accessible and modifiable
        alert(`Light DOM Value: "${value}"\n\n⚠️ This value was easily accessible via:\ndocument.querySelector('normal-input input').value`);
        
        // Clear the input
        this.input.value = '';
    }

    // PRESENTER: Public methods that expose internal state
    public getValue(): string {
        return this.input.value;
    }

    public setValue(value: string): void {
        this.input.value = value;
    }

    public focus(): void {
        this.input.focus();
    }

    // PRESENTER: Lifecycle methods for demo purposes
    connectedCallback(): void {
        console.log('🔓 Normal Input connected to DOM - fully exposed');
    }

    disconnectedCallback(): void {
        console.log('🔓 Normal Input disconnected from DOM');
    }

    // PRESENTER: Attribute observation (still vulnerable to manipulation)
    static get observedAttributes(): string[] {
        return ['label'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === 'label' && this.label) {
            this.label.textContent = newValue;
        }
    }
}

/* ===================================================================
   SECURITY ANALYSIS FOR PRESENTER:
   
   VULNERABILITIES DEMONSTRATED BY THIS COMPONENT:
   
   1. DOM ACCESS:
      - document.querySelector('normal-input input') ✅ WORKS
      - Can read: input.value, input.placeholder, etc.
      - Can modify: All properties and attributes
   
   2. STYLE OVERRIDE:
      - Global CSS can override all styles
      - Inline styles can be overridden with !important
      - Component styling is not protected
   
   3. EVENT HIJACKING:
      - External scripts can add event listeners
      - Can intercept user input in real-time
      - No event isolation
   
   4. STATE MANIPULATION:
      - Public methods expose internal state
      - No encapsulation of component logic
      - Easy to modify behavior from outside
   
   ATTACK EXAMPLES TO DEMONSTRATE:
   
   // Read input value
   document.querySelector('normal-input input').value
   
   // Modify input styling
   document.querySelector('normal-input input').style.background = 'red'
   
   // Add keylogger
   document.querySelector('normal-input input').addEventListener('input', 
     e => console.log('Stolen:', e.target.value))
   
   // Override button behavior
   document.querySelector('normal-input button').onclick = 
     () => alert('Button hijacked!')
   
   =================================================================== */

// Register the custom element
if (!customElements.get('normal-input')) {
    customElements.define('normal-input', NormalInput);
}