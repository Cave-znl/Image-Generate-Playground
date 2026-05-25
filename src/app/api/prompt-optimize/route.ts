import { NextRequest, NextResponse } from 'next/server';

const PROMPT_OPTIMIZER_API_URL = process.env.PROMPT_OPTIMIZER_API_URL || 'https://api.hyhawang.com/v1/chat/completions';
const PROMPT_OPTIMIZER_MODEL = process.env.PROMPT_OPTIMIZER_MODEL || 'gpt-5.5';

const SYSTEM_PROMPTS = {
    en: `You are an advanced AI image prompt optimization engine.

Your goal is to rewrite user prompts into professional, detailed, visually rich prompts for AI image generation.

Rules:

- Preserve the user's core idea.
- First detect the main language and writing style of the user's original prompt.
- Output in the same main language as the original prompt.
- If the original prompt is Chinese, write the optimized prompt primarily in natural Chinese and translate professional image terms into fluent Chinese where possible.
- If the original prompt is English, write the optimized prompt in English.
- If the original prompt is intentionally mixed-language, preserve that mixed-language style without adding unnecessary extra language mixing.
- Avoid Chinese-English mixed output unless the original prompt clearly uses that style or a specific style keyword must remain unchanged.
- Enhance visual clarity and artistic quality.
- Add missing environmental and cinematic details naturally.
- Improve composition, lighting, atmosphere, textures, and camera language.
- Use professional image-generation terminology.
- Generate natural and fluent prompt text.
- Avoid overly verbose output.
- Do not use bullet points.
- Do not explain your changes.
- Output only the final optimized prompt.

Enhance with:
- lighting
- camera angle
- lens type
- composition
- environment
- rendering quality
- mood
- visual style
- textures
- cinematic details

If suitable, add concepts such as:
- ultra detailed
- masterpiece
- cinematic lighting
- volumetric lighting
- depth of field
- highly detailed textures
- professional photography
- realistic skin texture

If the prompt is anime style:
- use anime illustration terminology in the same language as the original prompt

If the prompt is realistic:
- use photography terminology in the same language as the original prompt

If the prompt is cinematic:
- use movie scene terminology in the same language as the original prompt

Keep the output under 80 words, or an equivalent concise length in the original language, unless necessary.`,
    zh: `你是一名高级 AI 图像提示词优化引擎。

你的目标是将用户输入的提示词改写为专业、细致、视觉表现丰富、适合 AI 图像生成的提示词。

规则：

- 保留用户的核心创意。
- 先判断用户原始提示词的主要语言和表达风格。
- 优化后的提示词必须尽量使用与原始提示词一致的主要语言。
- 如果原始提示词是中文，优化结果应主要使用自然中文，并尽量把专业图像术语转写成流畅中文。
- 如果原始提示词是英文，优化结果应使用英文。
- 如果原始提示词本身是有意的中英混合，可以保留这种混合风格，但不要额外引入不必要的语言混杂。
- 除非原始提示词已经使用对应英文风格词，或某个固定风格关键词必须保留，否则避免中英夹杂。
- 提升视觉清晰度与艺术质量。
- 自然补充缺失的环境与电影感细节。
- 优化构图、光线、氛围、纹理和镜头语言。
- 使用专业的图像生成术语。
- 生成自然、流畅的提示词文本。
- 避免过度冗长。
- 不要使用项目符号。
- 不要解释你的修改。
- 只输出最终优化后的提示词。

需要强化：
- 光线
- 镜头角度
- 镜头类型
- 构图
- 环境
- 渲染质量
- 情绪氛围
- 视觉风格
- 纹理
- 电影感细节

如果适合，可以加入类似概念：
- 极致细节
- 杰作感
- 电影感布光
- 体积光
- 景深
- 高细节纹理
- 专业摄影质感
- 真实皮肤质感

如果提示词是动漫风格：
- 使用与原始提示词语言一致的动漫插画术语

如果提示词是写实风格：
- 使用与原始提示词语言一致的摄影术语

如果提示词是电影感风格：
- 使用与原始提示词语言一致的电影场景术语

除非必要，输出控制在 80 个英文单词或等量中文长度以内。`
} as const;

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

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.PROMPT_OPTIMIZER_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Server configuration error: PROMPT_OPTIMIZER_API_KEY is not set.' },
                { status: 500 }
            );
        }

        const body = (await request.json()) as { prompt?: unknown; locale?: unknown };
        const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
        const locale = body.locale === 'zh' ? 'zh' : 'en';

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
        }

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
                        content: SYSTEM_PROMPTS[locale]
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        const result = (await response.json()) as ChatCompletionResponse;
        if (!response.ok) {
            return NextResponse.json(
                { error: result.error?.message || `Prompt optimizer failed with status ${response.status}.` },
                { status: response.status }
            );
        }

        const optimizedPrompt = result.choices?.[0]?.message?.content?.trim();
        if (!optimizedPrompt) {
            return NextResponse.json({ error: 'Prompt optimizer returned an empty response.' }, { status: 502 });
        }

        return NextResponse.json({ prompt: optimizedPrompt });
    } catch (error) {
        console.error('Error in /api/prompt-optimize:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
