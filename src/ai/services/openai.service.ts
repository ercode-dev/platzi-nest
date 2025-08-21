import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Env } from 'src/env.model';

@Injectable()
export class OpenaiService {
    private openAi: OpenAI;

    constructor(configService: ConfigService<Env>) {
        const apiKey = configService.get<string>('OPEN_API_KEY');
        if (apiKey) {
            this.openAi = new OpenAI({ apiKey });
        } else {
            throw new Error('OPEN_API_KEY is not defined');
        }
    }

    async generateSummary(content: string): Promise<string | null> {
        if (!this.openAi) {
            throw new Error('OpenAI client is not initialized');
        }

        const response = await this.openAi.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generate summaries for blog posts',
                },
                {
                    role: 'user',
                    content: content,
                },
            ],
        });

        return response?.choices[0]?.message?.content || null;
    }

    async generateImage(text: string): Promise<string | null> {
        if (!this.openAi) {
            throw new Error('OpenAI client is not initialized');
        }

        const response = await this.openAi.images.generate({
            model: 'dall-e-3',
            prompt: 'Generate an image for a blog post about ' + text,
            response_format: 'url',
        });

        if (!response?.data?.[0]?.url) {
            console.error('No image URL found in OpenAI response:', response);
            throw new Error('Failed to generate image');
        }

        return response?.data?.[0]?.url || null;
    }
}
