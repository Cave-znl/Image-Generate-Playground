'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { ImageUp, Loader2 } from 'lucide-react';
import * as React from 'react';

type ImagePromptButtonProps = {
    onPromptGenerated: (prompt: string) => void;
    isPasswordRequiredByBackend: boolean | null;
    clientPasswordHash: string | null;
    onPasswordRequired: (retry: (passwordHash: string) => Promise<void>) => void;
    disabled?: boolean;
};

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

const copy = {
    en: {
        infer: 'Image',
        inferring: 'Reading',
        invalidType: 'Please upload a JPEG, PNG, or WebP image.',
        tooLarge: 'Image is too large. Maximum size is 10MB.',
        failed: 'Failed to create prompt from image.'
    },
    zh: {
        infer: '\u56fe\u7247\u53cd\u63a8',
        inferring: '\u53cd\u63a8\u4e2d',
        invalidType: '\u8bf7\u4e0a\u4f20 JPEG\u3001PNG \u6216 WebP \u56fe\u7247\u3002',
        tooLarge: '\u56fe\u7247\u8fc7\u5927\uff0c\u6700\u5927\u652f\u6301 10MB\u3002',
        failed: '\u56fe\u7247\u53cd\u63a8\u63d0\u793a\u8bcd\u5931\u8d25\u3002'
    }
} as const;

export function ImagePromptButton({
    onPromptGenerated,
    isPasswordRequiredByBackend,
    clientPasswordHash,
    onPasswordRequired,
    disabled
}: ImagePromptButtonProps) {
    const { locale } = useI18n();
    const text = copy[locale];
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [isInferring, setIsInferring] = React.useState(false);

    const inferPromptFromImage = React.useCallback(
        async (file: File, passwordHashOverride?: string) => {
            if (isInferring) return;

            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                alert(text.invalidType);
                return;
            }

            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                alert(text.tooLarge);
                return;
            }

            const effectivePasswordHash = passwordHashOverride ?? clientPasswordHash;
            if (isPasswordRequiredByBackend && !effectivePasswordHash) {
                onPasswordRequired((passwordHash) => inferPromptFromImage(file, passwordHash));
                return;
            }

            setIsInferring(true);
            try {
                const formData = new FormData();
                formData.append('image', file, file.name);
                formData.append('locale', locale);

                if (isPasswordRequiredByBackend && effectivePasswordHash) {
                    formData.append('passwordHash', effectivePasswordHash);
                }

                const response = await fetch('/api/prompt-from-image', {
                    method: 'POST',
                    body: formData
                });
                const result = (await response.json()) as { prompt?: string; error?: string };

                if (response.status === 401 && isPasswordRequiredByBackend) {
                    onPasswordRequired((passwordHash) => inferPromptFromImage(file, passwordHash));
                    return;
                }

                if (!response.ok || !result.prompt) {
                    throw new Error(result.error || text.failed);
                }

                onPromptGenerated(result.prompt);
            } catch (error) {
                console.error('Image prompt extraction failed:', error);
                alert(error instanceof Error ? error.message : text.failed);
            } finally {
                setIsInferring(false);
            }
        },
        [
            clientPasswordHash,
            isInferring,
            isPasswordRequiredByBackend,
            locale,
            onPasswordRequired,
            onPromptGenerated,
            text.failed,
            text.invalidType,
            text.tooLarge
        ]
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (file) {
            void inferPromptFromImage(file);
        }
    };

    return (
        <>
            <input
                ref={inputRef}
                type='file'
                accept='image/png,image/jpeg,image/webp'
                onChange={handleFileChange}
                className='hidden'
            />
            <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={disabled || isInferring}
                onClick={() => inputRef.current?.click()}
                className='h-8 border-white/20 px-2.5 text-white/80 hover:bg-white/10 hover:text-white disabled:border-white/10 disabled:text-white/35'>
                {isInferring ? <Loader2 className='h-4 w-4 animate-spin' /> : <ImageUp className='h-4 w-4' />}
                <span className='hidden sm:inline'>{isInferring ? text.inferring : text.infer}</span>
            </Button>
        </>
    );
}
