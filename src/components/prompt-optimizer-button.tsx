'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { Loader2, WandSparkles } from 'lucide-react';
import * as React from 'react';

type PromptOptimizerButtonProps = {
    prompt: string;
    onOptimizedPrompt: (prompt: string) => void;
    isPasswordRequiredByBackend: boolean | null;
    clientPasswordHash: string | null;
    onPasswordRequired: (retry: (passwordHash: string) => Promise<void>) => void;
    disabled?: boolean;
};

const copy = {
    en: {
        optimize: 'Optimize',
        optimizing: 'Optimizing',
        emptyPrompt: 'Please enter a prompt before optimizing.',
        failed: 'Failed to optimize prompt.'
    },
    zh: {
        optimize: 'AI 优化',
        optimizing: '优化中',
        emptyPrompt: '请先输入提示词再进行优化。',
        failed: '提示词优化失败。'
    }
} as const;

export function PromptOptimizerButton({
    prompt,
    onOptimizedPrompt,
    isPasswordRequiredByBackend,
    clientPasswordHash,
    onPasswordRequired,
    disabled
}: PromptOptimizerButtonProps) {
    const { locale } = useI18n();
    const text = copy[locale];
    const [isOptimizing, setIsOptimizing] = React.useState(false);

    const handleOptimize = React.useCallback(async (passwordHashOverride?: string) => {
        if (isOptimizing) return;

        const currentPrompt = prompt.trim();
        if (!currentPrompt) {
            alert(text.emptyPrompt);
            return;
        }

        const effectivePasswordHash = passwordHashOverride ?? clientPasswordHash;

        if (isPasswordRequiredByBackend && !effectivePasswordHash) {
            onPasswordRequired(handleOptimize);
            return;
        }

        setIsOptimizing(true);
        try {
            const payload: { prompt: string; locale: typeof locale; passwordHash?: string } = {
                prompt: currentPrompt,
                locale
            };

            if (isPasswordRequiredByBackend && effectivePasswordHash) {
                payload.passwordHash = effectivePasswordHash;
            }

            const response = await fetch('/api/prompt-optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = (await response.json()) as { prompt?: string; error?: string };

            if (response.status === 401 && isPasswordRequiredByBackend) {
                onPasswordRequired(handleOptimize);
                return;
            }

            if (!response.ok || !result.prompt) {
                throw new Error(result.error || text.failed);
            }

            onOptimizedPrompt(result.prompt);
        } catch (error) {
            console.error('Prompt optimization failed:', error);
            alert(error instanceof Error ? error.message : text.failed);
        } finally {
            setIsOptimizing(false);
        }
    }, [
        clientPasswordHash,
        isOptimizing,
        isPasswordRequiredByBackend,
        locale,
        onOptimizedPrompt,
        onPasswordRequired,
        prompt,
        text.emptyPrompt,
        text.failed
    ]);

    return (
        <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={disabled || isOptimizing || !prompt.trim()}
            onClick={() => handleOptimize()}
            className='h-8 border-white/20 px-2.5 text-white/80 hover:bg-white/10 hover:text-white disabled:border-white/10 disabled:text-white/35'>
            {isOptimizing ? <Loader2 className='h-4 w-4 animate-spin' /> : <WandSparkles className='h-4 w-4' />}
            <span className='hidden sm:inline'>{isOptimizing ? text.optimizing : text.optimize}</span>
        </Button>
    );
}
