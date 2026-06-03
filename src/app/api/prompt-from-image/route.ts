import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const PROMPT_OPTIMIZER_API_URL = process.env.PROMPT_OPTIMIZER_API_URL || 'https://api.hyhawang.com/v1/chat/completions';
const PROMPT_OPTIMIZER_MODEL = process.env.PROMPT_OPTIMIZER_MODEL || 'gpt-5.5';
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const SYSTEM_PROMPT = `You are an expert image-to-prompt analyst for AI image generation.

Analyze the uploaded image and convert only the visible content into a polished prompt that can recreate a similar image.

Rules:
- Do not claim to know the original prompt.
- Describe the main subject, setting, composition, camera angle, framing, lighting, color palette, textures, materials, mood, and visual style.
- If it looks photographic, use concise photography language such as lens feel, depth of field, exposure, lighting direction, and color grading.
- If it looks like illustration, anime, UI, product render, or concept art, use the matching style, rendering, line, material, and composition language.
- Avoid identifying private people. Describe appearance and pose instead.
- Avoid adding brand names, artist names, copyrighted character names, logos, or text unless they are essential visible content.
- Do not invent hidden context outside the image.
- Output one final image-generation prompt only. No explanations, no bullet points, no markdown.
- Keep the prompt concise but visually rich, around 80 to 140 words unless the image requires less.
- Output in Simplified Chinese when locale is zh; otherwise output in English.`;

type ChatCompletionResponse = {
    choices?: Array<{
        message?: {
            content?: string | null;
        };
    }>;
    error?: {
        message?: string;
    };
};

function sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

function validatePassword(passwordHash: FormDataEntryValue | null): NextResponse | null {
    if (!process.env.APP_PASSWORD) {
        return null;
    }

    if (typeof passwordHash !== 'string' || !passwordHash) {
        console.error('Missing password hash for image prompt extraction.');
        return NextResponse.json({ error: 'Unauthorized: Missing password hash.' }, { status: 401 });
    }

    const serverPasswordHash = sha256(process.env.APP_PASSWORD);
    if (passwordHash !== serverPasswordHash) {
        console.error('Invalid password hash for image prompt extraction.');
        return NextResponse.json({ error: 'Unauthorized: Invalid password.' }, { status: 401 });
    }

    return null;
}

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.PROMPT_OPTIMIZER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Server configuration error: PROMPT_OPTIMIZER_API_KEY is not set.' },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const authError = validatePassword(formData.get('passwordHash'));
        if (authError) {
            return authError;
        }

        const image = formData.get('image');
        const locale = formData.get('locale') === 'zh' ? 'zh' : 'en';

        if (!(image instanceof File)) {
            return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
        }

        if (!SUPPORTED_IMAGE_TYPES.has(image.type)) {
            return NextResponse.json(
                { error: 'Unsupported image type. Please upload a JPEG, PNG, or WebP image.' },
                { status: 400 }
            );
        }

        if (image.size > MAX_IMAGE_SIZE_BYTES) {
            return NextResponse.json({ error: 'Image is too large. Maximum size is 10MB.' }, { status: 400 });
        }

        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const dataUrl = `data:${image.type};base64,${imageBuffer.toString('base64')}`;

        const response = await fetch(PROMPT_OPTIMIZER_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify({
                model: PROMPT_OPTIMIZER_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text:
                                    locale === 'zh'
                                        ? 'Analyze this image and write a polished AI image-generation prompt in Simplified Chinese.'
                                        : 'Analyze this image and write a polished AI image-generation prompt in English.'
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: dataUrl,
                                    detail: 'high'
                                }
                            }
                        ]
                    }
                ]
            })
        });

        const result = (await response.json()) as ChatCompletionResponse;
        if (!response.ok) {
            return NextResponse.json(
                { error: result.error?.message || `Image prompt extraction failed with status ${response.status}.` },
                { status: response.status }
            );
        }

        const prompt = result.choices?.[0]?.message?.content?.trim();
        if (!prompt) {
            return NextResponse.json({ error: 'Image prompt extraction returned an empty response.' }, { status: 502 });
        }

        return NextResponse.json({ prompt });
    } catch (error) {
        console.error('Error in /api/prompt-from-image:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
