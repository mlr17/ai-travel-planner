import { Anthropic } from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import type { Tool } from "@anthropic-ai/sdk/resources/messages";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export class MCPClient {
  private mcp: Client;
  private anthropic: Anthropic;
  private transport: StdioClientTransport | null = null;
  private tools: any[] = [];
  private config: {
    apiKey: string;
    baseURL: string;
    amapApiKey?: string;
  };
  private isConnected: boolean = false;

  constructor(config: {
    apiKey: string;
    baseURL: string;
    amapApiKey?: string;
  }) {
    this.config = config;
    this.anthropic = new Anthropic({
      baseURL: config.baseURL,
      apiKey: config.apiKey,
    });
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }

  /**
   * 获取 Anthropic 客户端实例
   * @returns Anthropic 客户端实例
   */
  getAnthropicClient(): Anthropic {
    return this.anthropic;
  }

  /**
   * 连接到 MCP 服务器
   * @param serverScriptPath - MCP 服务器脚本路径
   */
  async connectToServer(serverScriptPath: string): Promise<string[]> {
    try {
      if (this.isConnected) {
        return this.tools.map(tool => tool.name);
      }

      // 确定脚本类型和适当的命令
      const isJs = serverScriptPath.endsWith(".js");
      const isPy = serverScriptPath.endsWith(".py");
      if (!isJs && !isPy) {
        throw new Error("Server script must be a .js or .py file");
      }
      const command = isPy
        ? process.platform === "win32"
          ? "python"
          : "python3"
        : process.execPath;

      // 初始化运输并连接到服务器
      this.transport = new StdioClientTransport({
        command,
        args: [serverScriptPath],
        env: {
          ...process.env,
          AMAP_MAPS_API_KEY: this.config.amapApiKey || '',
        },
      });
      this.mcp.connect(this.transport);

      // 列出可用工具
      const toolsResult = await this.mcp.listTools();
      
      // 使用 as any 转换类型以避免类型冲突
      this.tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
        };
      }) as any;

      const toolNames = this.tools.map(({ name }) => name);
      console.log("已连接到 MCP 服务器，可用工具:", toolNames);
      
      this.isConnected = true;
      return toolNames;
    } catch (e) {
      console.error("无法连接到 MCP 服务器:", e);
      throw e;
    }
  }

  /**
   * 处理查询并生成旅行计划
   * @param query - 用户查询
   * @returns 生成的旅行计划响应
   */
  async processQuery(query: string): Promise<string> {
    if (!this.isConnected) {
      throw new Error("MCP 客户端尚未连接到服务器");
    }

    const messages: MessageParam[] = [
      {
        role: "user",
        content: query,
      },
    ];

    try {
      // 初始 Claude API 调用
      const res :string= await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 4000, // 增加 token 限制，确保完整的响应
        messages,
        tools: this.tools,
        temperature: 0.7, // 添加温度参数，使生成更稳定
      }) as any;
      const response = JSON.parse(res);
      console.log("Claude API 调用响应:", response);
      // 处理响应和工具调用
      const finalText = [];
      const toolResults = [];
      let maxToolCalls = 5; // 限制工具调用次数，防止无限循环
      let toolCallCount = 0;

      for (const content of response.content) {
        console.log("Claude API 调用响应内容:", content);
        if (content.type === "text") {
          finalText.push(content.text);
        } else if (content.type === "tool_use" && toolCallCount < maxToolCalls) {
          toolCallCount++;
          // 执行工具调用
          const toolName = content.name;
          const toolArgs = content.input as { [x: string]: unknown } | undefined;

          console.log(`调用工具 ${toolName} 参数:`, toolArgs);

          try {
            const result = await this.mcp.callTool({
              name: toolName,
              arguments: toolArgs,
            });
            
            toolResults.push(result);
            finalText.push(`[调用工具 ${toolName}]`);

            // 继续与工具结果的对话
            messages.push({
              role: "user",
              content: result.content as string,
            });

            // 获取 Claude 的下一个响应
            try {
              const followupResponse = JSON.parse(await this.anthropic.messages.create({
                model: "claude-3-5-sonnet-latest",
                max_tokens: 4000,
                messages,
                temperature: 0.7,
              }) as any);

              finalText.push(
                followupResponse.content[0].type === "text" 
                  ? followupResponse.content[0].text 
                  : ""
              );
            } catch (followupError) {
              console.error("获取后续响应时出错:", followupError);
              finalText.push("获取后续响应失败，请检查日志了解详情。");
            }
          } catch (toolError) {
            console.error(`调用工具 ${toolName} 时出错:`, toolError);
            finalText.push(`[调用工具 ${toolName} 失败: ${toolError.message}]`);
            
            // 通知 Claude 工具调用失败
            messages.push({
              role: "user",
              content: `工具 ${toolName} 调用失败: ${toolError.message}。请继续生成行程规划，不再使用该工具。`,
            });
            
            // 获取 Claude 的恢复响应
            try {
              const recoveryResponse = JSON.parse(await this.anthropic.messages.create({
                model: "claude-3-5-sonnet-latest",
                max_tokens: 4000,
                messages,
                temperature: 0.7,
              }) as any);
              
              finalText.push(
                recoveryResponse.content[0].type === "text" 
                  ? recoveryResponse.content[0].text 
                  : ""
              );
            } catch (recoveryError) {
              console.error("获取恢复响应时出错:", recoveryError);
            }
          }
        }
      }

      // 添加最终指令，确保返回有效的 JSON
      messages.push({
        role: "user",
        content: "请确保你的最终回答是一个有效的 JSON 格式的行程规划，包含所有必要的字段，如标题、天数、晚数、目的地、行程安排和摘要。",
      });
      
      try {
        const finalResponse = JSON.parse(await this.anthropic.messages.create({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 4000,
          messages,
          temperature: 0.7,
        }) as any);
        
        if (finalResponse.content[0].type === "text") {
          finalText.push(finalResponse.content[0].text);
        }
      } catch (finalError) {
        console.error("获取最终响应时出错:", finalError);
      }

      return finalText?.join("\n");
    } catch (error) {
      console.error("处理查询时出错:", error);
      throw error;
    }
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.mcp.close();
        this.isConnected = false;
        console.log("MCP 客户端已断开连接");
      } catch (error) {
        console.error("清理 MCP 客户端资源时出错:", error);
      }
    }
  }
}

/**
 * 创建 MCP 客户端实例
 */
export const createMCPClient = (config: {
  apiKey: string;
  baseURL: string;
  amapApiKey?: string;
}): MCPClient => {
  return new MCPClient(config);
}; 