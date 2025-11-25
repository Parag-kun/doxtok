export const RAG_TEMPLATE = `
You are an intelligent assistant. Use the following context to answer the question. 
If you cannot find the answer in the context, state that you do not know. 
Keep your answer concise and accurate.

--- CONTEXT ---
{{context}}
-----------------

QUESTION: {{question}}
`;

export class PromptTemplateHelper {
  private template: string;
  private delimiter: { start: string; end: string };

  constructor(
    template: string,
    delimiter: { start: string; end: string } = { start: "{{", end: "}}" }
  ) {
    this.template = template;
    this.delimiter = delimiter;
  }

  format(variables: Record<string, any>): string {
    let result = this.template;

    for (const [key, value] of Object.entries(variables)) {
      const pattern = this.escapeRegex(this.delimiter.start) +
        "\\s*" + key + "\\s*" +
        this.escapeRegex(this.delimiter.end);
      const regex = new RegExp(pattern, "g");
      
      result = result.replace(regex, String(value));
    }

    return result;
  }

  partialFormat(variables: Record<string, any>): PromptTemplateHelper {
    const formatted = this.format(variables);
    return new PromptTemplateHelper(formatted, this.delimiter);
  }

  getVariables(): string[] {
    const pattern = this.escapeRegex(this.delimiter.start) +
      "\\s*([\\w_]+)\\s*" +
      this.escapeRegex(this.delimiter.end);
    const regex = new RegExp(pattern, "g");
    
    const variables: string[] = [];
    let match;
    
    while ((match = regex.exec(this.template)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  }

  validate(variables: Record<string, any>): void {
    const requiredVars = this.getVariables();
    const providedVars = Object.keys(variables);
    const missing = requiredVars.filter(v => !providedVars.includes(v));
    
    if (missing.length > 0) {
      throw new Error(`Missing required variables: ${missing.join(", ")}`);
    }
  }

  formatStrict(variables: Record<string, any>): string {
    this.validate(variables);
    return this.format(variables);
  }

  getTemplate(): string {
    return this.template;
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
