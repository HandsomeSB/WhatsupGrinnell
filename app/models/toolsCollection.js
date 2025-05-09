class ToolsCollection {
  constructor() {
    this.tools = [];
  }

  /**
   * Adds a tool function that can be called by the OpenAI API
   * @param {string} name - The name of the tool function
   * @param {string} description - Description of what the tool does
   * @param {Object} parameters - JSON Schema object describing the parameters
   * @param {Function} handler - The actual function to execute
   * @param {boolean} strict - Whether the tool is strict
   * 
   * @example
   * addTool("get_current_weather", "Get the current weather", {
   *   type: "object",
   *   properties: {
   *     location: { type: "string", description: "The location to get the weather for" }
   *   }
   * }, async (args) => {
   *   // Your tool logic here
   *   return "The current weather in " + args.location + " is sunny with a temperature of 70 degrees.";
   * })
   */
  addTool(name, description, parameters, handler, strict = true) {
    this.tools.push({
      name,
      description,
      parameters,
      handler,
      strict
    });
  }

  /**
   * Returns the tools in the format expected by OpenAI API
   * @returns {Array} Array of tool definitions
   */
  getTools() {
    return this.tools.map(tool => ({
      type: "function",
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
      strict: tool.strict ? tool.strict : true
    }));
  }

  /**
   * Executes a tool by name with given arguments
   * @param {string} name - Name of the tool to execute
   * @param {Object} args - Arguments to pass to the tool in JSON format
   * @returns {Promise} Result of the tool execution
   */
  async executeTool(name, args) {
    const tool = this.tools.find(t => t.name === name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }

    const result = await tool.handler(...args);
    return result;
  }
}

export { ToolsCollection };


