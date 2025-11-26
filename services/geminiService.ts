
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { EditorActionType, UserProfile } from "../types";

// Initialize the client. API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models configuration
const CHAT_MODEL = 'gemini-3-pro-preview'; // Complex reasoning
const EDITOR_MODEL = 'gemini-2.5-flash'; // Fast tasks

export const streamChatResponse = async function* (
  history: { role: string; parts: { text: string }[] }[],
  currentMessage: string,
  profile?: UserProfile
) {
  try {
    let systemInstruction = "You are a helpful, intelligent AI assistant in a productivity workspace. Be concise, accurate, and professional.";

    if (profile) {
      const parts = [];
      if (profile.name) parts.push(`Address the user as "${profile.name}".`);
      if (profile.language) parts.push(`Always respond in ${profile.language}.`);
      
      switch (profile.responseStyle) {
        case 'Formal':
          parts.push("Maintain a highly professional, corporate, and formal tone.");
          break;
        case 'Casual':
          parts.push("Keep the tone friendly, conversational, and casual.");
          break;
        case 'Concise':
          parts.push("Be extremely concise. Give short, direct answers without fluff.");
          break;
      }

      if (profile.customInstructions) {
        parts.push(`\nUser's Custom Context/Instructions: ${profile.customInstructions}`);
      }

      if (parts.length > 0) {
        systemInstruction += `\n\n[User Profile Settings]:\n${parts.join(' ')}`;
      }
    }

    const chat: Chat = ai.chats.create({
      model: CHAT_MODEL,
      history: history,
      config: {
        temperature: 0.7,
        systemInstruction: systemInstruction,
      }
    });

    const result = await chat.sendMessageStream({ message: currentMessage });

    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error: any) {
    console.error("Chat Error:", error);
    throw new Error(error.message || "Failed to generate chat response");
  }
};

export const processDocumentAction = async (
  action: EditorActionType,
  content: string
): Promise<string> => {
  try {
    let prompt = "";
    const systemBase = "You are an expert editor.";

    switch (action) {
      case EditorActionType.SUMMARIZE:
        prompt = `Summarize the following text concisely in bullet points:\n\n${content}`;
        break;
      case EditorActionType.FIX_GRAMMAR:
        prompt = `Fix the grammar and spelling of the following text. Do not change the meaning or tone, just correct errors:\n\n${content}`;
        break;
      case EditorActionType.EXPAND:
        prompt = `Expand on the ideas in the following text, adding more detail and depth:\n\n${content}`;
        break;
      case EditorActionType.MAKE_PROFESSIONAL:
        prompt = `Rewrite the following text to sound more professional, corporate, and polished:\n\n${content}`;
        break;
        case EditorActionType.TRANSLATE_ES:
        prompt = `Translate the following text into Spanish:\n\n${content}`;
        break;
      default:
        return content;
    }

    const response = await ai.models.generateContent({
      model: EDITOR_MODEL,
      contents: prompt,
      config: {
        temperature: 0.3, // Lower temperature for deterministic editing
        systemInstruction: systemBase
      }
    });

    return response.text || "";
  } catch (error: any) {
    console.error("Editor Action Error:", error);
    throw new Error(error.message || "Failed to process document");
  }
};
