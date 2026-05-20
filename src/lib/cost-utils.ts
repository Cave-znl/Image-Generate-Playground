type ApiUsage = {
    input_tokens_details?: {
        text_tokens?: number;
        image_tokens?: number;
    };
    output_tokens?: number;
};

export type CostDetails = {
    estimated_cost_usd: number;
    text_input_tokens: number;
    image_input_tokens: number;
    image_output_tokens: number;
};

const GPT_IMAGE_2_TEXT_INPUT_COST_PER_TOKEN = 0.000005; // $5.00/1M
const GPT_IMAGE_2_IMAGE_INPUT_COST_PER_TOKEN = 0.000008; // $8.00/1M
const GPT_IMAGE_2_IMAGE_OUTPUT_COST_PER_TOKEN = 0.00003; // $30.00/1M

export type GenerateImageModel = 'gpt-image-2' | 'grok-imagine-image';
export type EditImageModel = 'gpt-image-2' | 'grok-imagine-image-edit';
export type GptImageModel = GenerateImageModel | EditImageModel;

export const GENERATE_IMAGE_MODELS: GenerateImageModel[] = ['gpt-image-2', 'grok-imagine-image'];
export const EDIT_IMAGE_MODELS: EditImageModel[] = ['gpt-image-2', 'grok-imagine-image-edit'];

export function isGenerateImageModel(model: string): model is GenerateImageModel {
    return GENERATE_IMAGE_MODELS.includes(model as GenerateImageModel);
}

export function isEditImageModel(model: string): model is EditImageModel {
    return EDIT_IMAGE_MODELS.includes(model as EditImageModel);
}

export type ModelRates = {
    textInputPerToken: number;
    imageInputPerToken: number;
    imageOutputPerToken: number;
    textInputPerMillion: number;
    imageInputPerMillion: number;
    imageOutputPerMillion: number;
};

export function isCostSupportedModel(model: GptImageModel): model is 'gpt-image-2' {
    return model === 'gpt-image-2';
}

export function getModelRates(model: GptImageModel): ModelRates | null {
    if (!isCostSupportedModel(model)) {
        return null;
    }

    return {
        textInputPerToken: GPT_IMAGE_2_TEXT_INPUT_COST_PER_TOKEN,
        imageInputPerToken: GPT_IMAGE_2_IMAGE_INPUT_COST_PER_TOKEN,
        imageOutputPerToken: GPT_IMAGE_2_IMAGE_OUTPUT_COST_PER_TOKEN,
        textInputPerMillion: 5,
        imageInputPerMillion: 8,
        imageOutputPerMillion: 30
    };
}

/**
 * Estimates the cost of a supported image model API call based on token usage.
 * Grok image pricing is not estimated here because this project uses an OpenAI-compatible relay.
 */
export function calculateApiCost(
    usage: ApiUsage | undefined | null,
    model: GptImageModel = 'gpt-image-2'
): CostDetails | null {
    const rates = getModelRates(model);
    if (!rates) {
        return null;
    }

    if (!usage || !usage.input_tokens_details || usage.output_tokens === undefined || usage.output_tokens === null) {
        console.warn('Invalid or missing usage data for cost calculation:', usage);
        return null;
    }

    const textInT = usage.input_tokens_details.text_tokens ?? 0;
    const imgInT = usage.input_tokens_details.image_tokens ?? 0;
    const imgOutT = usage.output_tokens ?? 0;

    if (typeof textInT !== 'number' || typeof imgInT !== 'number' || typeof imgOutT !== 'number') {
        console.error('Invalid token types in usage data:', usage);
        return null;
    }

    const costUSD =
        textInT * rates.textInputPerToken + imgInT * rates.imageInputPerToken + imgOutT * rates.imageOutputPerToken;

    return {
        estimated_cost_usd: Math.round(costUSD * 10000) / 10000,
        text_input_tokens: textInT,
        image_input_tokens: imgInT,
        image_output_tokens: imgOutT
    };
}
