'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Languages, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

export function AppControls() {
    const { locale, setLocale, t } = useI18n();
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = mounted ? resolvedTheme : 'dark';

    return (
        <div className='flex flex-wrap items-center gap-2'>
            <div
                className='flex items-center gap-1 rounded-md border border-border bg-card p-1 text-card-foreground'
                aria-label={t('language')}>
                <Languages className='ml-1 h-4 w-4 text-muted-foreground' />
                {(['zh', 'en'] as const).map((item) => (
                    <Button
                        key={item}
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => setLocale(item)}
                        className={cn(
                            'h-7 px-2 text-xs',
                            locale === item
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}>
                        {item === 'zh' ? t('chinese') : t('english')}
                    </Button>
                ))}
            </div>

            <div
                className='flex items-center gap-1 rounded-md border border-border bg-card p-1 text-card-foreground'
                aria-label={t('theme')}>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => setTheme('light')}
                    className={cn(
                        'h-7 px-2 text-xs',
                        currentTheme === 'light'
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}>
                    <Sun className='mr-1 h-3.5 w-3.5' />
                    {t('light')}
                </Button>
                <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => setTheme('dark')}
                    className={cn(
                        'h-7 px-2 text-xs',
                        currentTheme === 'dark'
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}>
                    <Moon className='mr-1 h-3.5 w-3.5' />
                    {t('dark')}
                </Button>
            </div>
        </div>
    );
}
