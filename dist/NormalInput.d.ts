export declare class NormalInput extends HTMLElement {
    private input;
    private button;
    private label;
    constructor();
    private setupComponent;
    private applyStyles;
    private attachEventListeners;
    private handleSubmit;
    getValue(): string;
    setValue(value: string): void;
    focus(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
