import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const defaultSystemInstruction = "You are a helpful and creative AI assistant named Gemini. Your responses should be in Markdown format, especially for code snippets which you should wrap in triple backticks with the language name.";

class ChatService {
    private chat: Chat | null = null;

    constructor() {
        this.startNewChat();
    }

    public startNewChat(): void {
        this.chat = ai.chats.create({
            model: 'gemini-2.5-flash-preview-04-17',
            config: {
                systemInstruction: defaultSystemInstruction,
            },
        });
    }
    
    public async* sendMessageStream(
        message: string
    ): AsyncGenerator<string, void, unknown> {
        if (!this.chat) {
            this.startNewChat();
        }
        
        try {
            const result = await this.chat!.sendMessageStream({ message });

            for await (const chunk of result) {
                if (chunk && typeof chunk.text === 'string') {
                    yield chunk.text;
                }
            }
        } catch (error) {
            console.error("Error streaming message:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            throw new Error(`An error occurred while communicating with the AI: ${errorMessage}.`);
        }
    }
}

export const chatService = new ChatService();
