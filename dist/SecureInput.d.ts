export declare class SecureInput extends HTMLElement {
    private shadowRootRef;
    private input;
    private button;
    private label;
    constructor();
    private setupShadowDOM;
    private attachEventListeners;
    private handleSecureSubmit;
    private showSecureAlert;
    hasValue(): boolean;
    getValueLength(): number;
    focus(): void;
    clear(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
