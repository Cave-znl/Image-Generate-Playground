'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/lib/i18n';
import {
    PROMPT_TEMPLATE_CATEGORIES,
    PROMPT_TEMPLATES,
    type PromptTemplateCategory,
    type PromptTemplateMode
} from '@/lib/prompt-templates';
import { cn } from '@/lib/utils';
import { BookOpen, CornerDownLeft, Layers3, Plus, Search, WandSparkles } from 'lucide-react';
import * as React from 'react';

type PromptTemplateLibraryProps = {
    mode: PromptTemplateMode;
    prompt: string;
    onApply: (prompt: string) => void;
    disabled?: boolean;
};

const copy = {
    en: {
        trigger: 'Templates',
        title: 'Prompt Template Library',
        description: 'Pick a reusable structure, then customize the bracketed parts before generating.',
        search: 'Search title, tag, or prompt',
        replace: 'Use',
        append: 'Append',
        noResults: 'No templates match this search.',
        categories: 'Categories',
        available: 'available',
        templates: 'templates'
    },
    zh: {
        trigger: '模板',
        title: '提示词模板库',
        description: '选择一个可复用结构，然后把方括号里的内容替换成你的具体需求。',
        search: '搜索标题、标签或提示词',
        replace: '使用',
        append: '追加',
        noResults: '没有匹配的模板。',
        categories: '分类',
        available: '可用',
        templates: '个模板'
    }
} as const;

export function PromptTemplateLibrary({ mode, prompt, onApply, disabled }: PromptTemplateLibraryProps) {
    const { locale } = useI18n();
    const text = copy[locale];
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [category, setCategory] = React.useState<PromptTemplateCategory | 'all'>('all');

    const availableTemplates = React.useMemo(
        () => PROMPT_TEMPLATES.filter((template) => template.mode === mode || template.mode === 'both'),
        [mode]
    );

    const filteredTemplates = React.useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return availableTemplates.filter((template) => {
            const matchesCategory = category === 'all' || template.category === category;
            const matchesQuery =
                !normalizedQuery ||
                [
                    template.title,
                    template.titleZh,
                    template.description,
                    template.descriptionZh,
                    template.prompt,
                    template.promptZh,
                    ...template.tags,
                    ...template.tagsZh
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedQuery);

            return matchesCategory && matchesQuery;
        });
    }, [availableTemplates, category, query]);

    const categoryCounts = React.useMemo(() => {
        return PROMPT_TEMPLATE_CATEGORIES.reduce(
            (counts, item) => {
                counts[item.id] =
                    item.id === 'all'
                        ? availableTemplates.length
                        : availableTemplates.filter((template) => template.category === item.id).length;
                return counts;
            },
            {} as Record<PromptTemplateCategory | 'all', number>
        );
    }, [availableTemplates]);

    const applyTemplate = (templatePrompt: string, behavior: 'replace' | 'append') => {
        const nextPrompt =
            behavior === 'append' && prompt.trim() ? `${prompt.trim()}\n\n${templatePrompt}` : templatePrompt;

        onApply(nextPrompt);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={disabled}
                    className='h-8 border-white/20 px-2.5 text-white/80 hover:bg-white/10 hover:text-white'>
                    <BookOpen className='h-4 w-4' />
                    {text.trigger}
                </Button>
            </DialogTrigger>
            <DialogContent
                className='flex max-h-[88vh] max-w-none grid-rows-none flex-col overflow-hidden border-white/15 bg-black p-0 text-white shadow-2xl'
                style={{ width: 'calc(100vw - 80px)', maxWidth: '1480px' }}>
                <DialogHeader className='border-b border-white/10 px-6 pt-5 pb-4'>
                    <div className='flex items-center gap-3 pr-8'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.12)]'>
                            <WandSparkles className='h-4 w-4' />
                        </div>
                        <div className='min-w-0'>
                            <DialogTitle className='text-base text-white'>{text.title}</DialogTitle>
                            <DialogDescription className='mt-1 text-sm text-white/55'>
                                {text.description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className='grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]'>
                    <aside className='border-b border-white/10 bg-white/[0.025] p-4 lg:border-r lg:border-b-0'>
                        <div className='relative'>
                            <Search className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/40' />
                            <Input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={text.search}
                                className='h-10 rounded-md border-white/20 bg-black pl-9 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:ring-white/50'
                            />
                        </div>

                        <div className='mt-5 flex items-center gap-2 text-xs font-medium text-white/45'>
                            <Layers3 className='h-3.5 w-3.5' />
                            {text.categories}
                        </div>
                        <div className='mt-2 grid grid-cols-2 gap-2 lg:grid-cols-1'>
                            {PROMPT_TEMPLATE_CATEGORIES.map((item) => {
                                const label = locale === 'zh' ? item.labelZh : item.label;
                                const isActive = category === item.id;

                                return (
                                    <Button
                                        key={item.id}
                                        type='button'
                                        variant='ghost'
                                        onClick={() => setCategory(item.id)}
                                        className={cn(
                                            'h-10 justify-between rounded-md border border-white/8 px-3 text-sm text-white/62 hover:border-white/18 hover:bg-white/8 hover:text-white',
                                            isActive &&
                                                'border-white bg-white text-black shadow-sm hover:border-white hover:bg-white hover:text-black'
                                        )}>
                                        <span className='truncate'>{label}</span>
                                        <span
                                            className={cn(
                                                'rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/40',
                                                isActive && 'border-black/10 text-black/55'
                                            )}>
                                            {categoryCounts[item.id]}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </aside>

                    <section className='min-h-0 overflow-y-auto p-5'>
                        <div className='mb-4 flex items-center justify-between gap-3'>
                            <p className='text-sm text-white/55'>
                                {filteredTemplates.length} {locale === 'zh' ? text.templates : text.available}
                            </p>
                            <div className='hidden h-px flex-1 bg-white/10 sm:block' />
                        </div>

                        {filteredTemplates.length > 0 ? (
                            <div className='grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3'>
                                {filteredTemplates.map((template) => {
                                    const title = locale === 'zh' ? template.titleZh : template.title;
                                    const description = locale === 'zh' ? template.descriptionZh : template.description;
                                    const templatePrompt = locale === 'zh' ? template.promptZh : template.prompt;
                                    const tags = locale === 'zh' ? template.tagsZh : template.tags;
                                    const categoryInfo = PROMPT_TEMPLATE_CATEGORIES.find(
                                        (item) => item.id === template.category
                                    );
                                    const categoryLabel =
                                        locale === 'zh'
                                            ? (categoryInfo?.labelZh ?? template.category)
                                            : (categoryInfo?.label ?? template.category);

                                    return (
                                        <article
                                            key={template.id}
                                            className='group flex min-h-[320px] min-w-0 flex-col rounded-md border border-white/10 bg-[#050505] p-4 transition-colors hover:border-white/25 hover:bg-[#090909]'>
                                            <div className='flex min-w-0 items-start justify-between gap-4'>
                                                <div className='min-w-0'>
                                                    <h3 className='text-base font-medium text-white'>{title}</h3>
                                                    <p className='mt-1 text-sm leading-6 text-white/55'>
                                                        {description}
                                                    </p>
                                                </div>
                                                <span className='shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-white/45'>
                                                    {categoryLabel}
                                                </span>
                                            </div>

                                            <div className='mt-4 flex-1 rounded-md border border-white/8 bg-white/[0.025] p-3'>
                                                <p className='line-clamp-7 text-sm leading-6 text-white/72'>
                                                    {templatePrompt}
                                                </p>
                                            </div>

                                            <div className='mt-4 flex flex-wrap gap-1.5'>
                                                {tags.slice(0, 4).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className='rounded-md border border-white/10 px-2 py-1 text-xs text-white/45'>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className='mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4'>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    onClick={() => applyTemplate(templatePrompt, 'append')}
                                                    className='h-10 min-w-0 border-white/15 text-sm text-white/75 hover:bg-white/10 hover:text-white'>
                                                    <Plus className='h-4 w-4' />
                                                    <span className='truncate'>{text.append}</span>
                                                </Button>
                                                <Button
                                                    type='button'
                                                    onClick={() => applyTemplate(templatePrompt, 'replace')}
                                                    className='h-10 min-w-0 bg-white text-sm text-black hover:bg-white/90'>
                                                    <CornerDownLeft className='h-4 w-4' />
                                                    <span className='truncate'>{text.replace}</span>
                                                </Button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className='flex min-h-[360px] items-center justify-center rounded-md border border-dashed border-white/15 text-sm text-white/45'>
                                {text.noResults}
                            </div>
                        )}
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
