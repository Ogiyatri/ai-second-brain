import { Injectable } from '@nestjs/common';
import { OpenAIClient } from './openai.client';

@Injectable()
export class CompletionService {
  constructor(private readonly openai: OpenAIClient) {}

  async chat(systemPrompt: string, userMessage: string): Promise<string> {
    const response = await this.openai.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });
    return response.choices[0].message.content || '';
  }
}
