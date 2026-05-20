'use client';

import * as React from 'react';

export type Locale = 'en' | 'zh';

const dictionaries = {
    en: {
        appTitle: 'Image Generate Playground',
        appSubtitle: 'Generate, edit, compare, and reuse GPT image outputs.',
        language: 'Language',
        english: 'EN',
        chinese: 'ZH',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        generate: 'Generate',
        edit: 'Edit',
        generateImage: 'Generate Image',
        generateDescription: 'Create a new image from a text prompt.',
        editImage: 'Edit Image',
        editDescription: 'Modify an existing image with a text prompt.',
        configurePassword: 'Configure Password',
        passwordRequired: 'Password Required',
        passwordRetryDescription:
            'The server requires a password, or the previous one was incorrect. Please enter it to continue.',
        passwordInitialDescription: 'Set a password to use for API requests.',
        passwordPlaceholder: 'Enter your password',
        save: 'Save',
        model: 'Model',
        selectModel: 'Select model',
        enableStreaming: 'Enable Streaming',
        streamingSingleOnly: 'Streaming is only supported when generating a single image (n=1).',
        streamingHelp: 'Shows partial preview images as they are generated, providing a more interactive experience.',
        previewImages: 'Preview Images',
        previewCostHelp: 'Each preview image adds ~$0.003 to the cost (100 additional output tokens).',
        prompt: 'Prompt',
        generatePromptPlaceholder: 'e.g., A photorealistic cat astronaut floating in space',
        editPromptPlaceholder: 'e.g., Add a party hat to the main subject',
        numberOfImages: 'Number of Images',
        size: 'Size',
        auto: 'Auto',
        custom: 'Custom',
        square: 'Square',
        landscape: 'Landscape',
        portrait: 'Portrait',
        width: 'Width (px)',
        height: 'Height (px)',
        pixels: 'pixels',
        ofMax: 'of max',
        ratio: 'ratio',
        constraints: 'Constraints: multiples of 16, max edge 3840px, aspect ratio <= 3:1, 655,360 to 8,294,400 total pixels.',
        quality: 'Quality',
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        background: 'Background',
        opaque: 'Opaque',
        transparent: 'Transparent',
        outputFormat: 'Output Format',
        compression: 'Compression',
        moderationLevel: 'Moderation Level',
        generating: 'Generating...',
        editing: 'Editing...',
        sourceImages: 'Source Image(s) [Max: 10]',
        noFileSelected: 'No file selected.',
        filesSelected: 'files selected',
        browse: 'Browse...',
        mask: 'Mask',
        closeMaskEditor: 'Close Mask Editor',
        editSavedMask: 'Edit Saved Mask',
        createMask: 'Create Mask',
        saved: 'Saved',
        maskInstruction: 'Draw on the image below to mark areas for editing (drawn areas become transparent in the mask).',
        brushSize: 'Brush Size',
        uploadMask: 'Upload Mask',
        clear: 'Clear',
        saveMask: 'Save Mask',
        generatedMaskPreview: 'Generated Mask Preview:',
        generatingMaskPreview: 'Generating mask preview...',
        maskSaved: 'Mask saved successfully!',
        maskApplied: 'Mask applied',
        gptImage2EditInfo:
            "gpt-image-2 always processes reference images at high fidelity. This improves edit quality but uses more input image tokens per request than gpt-image-1.5's default fidelity.",
        streaming: 'Streaming...',
        editingImage: 'Editing image...',
        generatingImage: 'Generating image...',
        imageOutputEmpty: 'Your generated image will appear here.',
        displayError: 'Error displaying image.',
        sendToEdit: 'Send to Edit',
        showGridView: 'Show grid view',
        selectImage: 'Select image',
        generatedImage: 'Generated image',
        thumbnail: 'Thumbnail',
        history: 'History',
        totalCost: 'Total Cost',
        totalCostSummary: 'Total Cost Summary',
        totalCostDescription: 'A summary of the total estimated cost for all generated images in the history.',
        totalImagesGenerated: 'Total Images Generated:',
        averageCostPerImage: 'Average Cost Per Image:',
        totalEstimatedCost: 'Total Estimated Cost:',
        close: 'Close',
        historyEmpty: 'Generated images will appear here.',
        viewImageBatch: 'View image batch from',
        copyPrompt: 'Copy prompt',
        copied: 'Copied',
        viewPrompt: 'View prompt',
        costDetails: 'Cost Details',
        deleteItem: 'Delete item',
        deleteConfirmTitle: 'Delete this history item?',
        deleteConfirmDescription: 'This removes the selected history entry and its stored images when possible.',
        dontAskAgain: "Don't ask again",
        cancel: 'Cancel',
        delete: 'Delete',
        clearHistoryConfirm:
            'Are you sure you want to clear the entire image history? This cannot be undone.',
        clearHistoryIndexedDbConfirm:
            'Are you sure you want to clear the entire image history? In IndexedDB mode, this will also permanently delete all stored images. This cannot be undone.',
        alertError: 'Error',
        clearHistory: 'Clear'
    },
    zh: {
        appTitle: '图像生成工作台',
        appSubtitle: '生成、编辑、对比并复用 GPT 图像结果。',
        language: '语言',
        english: 'EN',
        chinese: '中',
        theme: '主题',
        light: '浅色',
        dark: '深色',
        generate: '生成',
        edit: '编辑',
        generateImage: '生成图片',
        generateDescription: '通过文本提示词创建一张新图片。',
        editImage: '编辑图片',
        editDescription: '上传图片，并用提示词修改它。',
        configurePassword: '配置访问密码',
        passwordRequired: '需要访问密码',
        passwordRetryDescription: '服务端要求输入密码，或上一次密码不正确。请输入密码后继续。',
        passwordInitialDescription: '设置用于 API 请求的访问密码。',
        passwordPlaceholder: '请输入访问密码',
        save: '保存',
        model: '模型',
        selectModel: '选择模型',
        enableStreaming: '启用流式预览',
        streamingSingleOnly: '流式预览仅支持一次生成 1 张图片。',
        streamingHelp: '生成过程中显示局部预览图，便于更快观察效果。',
        previewImages: '预览图数量',
        previewCostHelp: '每张预览图约增加 $0.003 成本（额外 100 个输出 token）。',
        prompt: '提示词',
        generatePromptPlaceholder: '例如：一只写实风格的宇航猫漂浮在太空中',
        editPromptPlaceholder: '例如：给主体加上一顶派对帽',
        numberOfImages: '图片数量',
        size: '尺寸',
        auto: '自动',
        custom: '自定义',
        square: '方图',
        landscape: '横图',
        portrait: '竖图',
        width: '宽度（px）',
        height: '高度（px）',
        pixels: '像素',
        ofMax: '最大值',
        ratio: '比例',
        constraints: '约束：16 的倍数，单边最大 3840px，宽高比 <= 3:1，总像素 655,360 到 8,294,400。',
        quality: '质量',
        low: '低',
        medium: '中',
        high: '高',
        background: '背景',
        opaque: '不透明',
        transparent: '透明',
        outputFormat: '输出格式',
        compression: '压缩率',
        moderationLevel: '审核级别',
        generating: '生成中...',
        editing: '编辑中...',
        sourceImages: '源图片（最多 10 张）',
        noFileSelected: '未选择文件。',
        filesSelected: '个文件已选择',
        browse: '浏览...',
        mask: '蒙版',
        closeMaskEditor: '关闭蒙版编辑器',
        editSavedMask: '编辑已保存蒙版',
        createMask: '创建蒙版',
        saved: '已保存',
        maskInstruction: '在下方图片上涂抹需要编辑的区域（涂抹区域会在蒙版中变为透明）。',
        brushSize: '画笔大小',
        uploadMask: '上传蒙版',
        clear: '清除',
        saveMask: '保存蒙版',
        generatedMaskPreview: '生成的蒙版预览：',
        generatingMaskPreview: '正在生成蒙版预览...',
        maskSaved: '蒙版保存成功！',
        maskApplied: '已应用蒙版',
        gptImage2EditInfo:
            'gpt-image-2 会以高保真方式处理参考图。编辑质量更好，但相比 gpt-image-1.5 默认保真度会使用更多图片输入 token。',
        streaming: '流式生成中...',
        editingImage: '正在编辑图片...',
        generatingImage: '正在生成图片...',
        imageOutputEmpty: '生成的图片会显示在这里。',
        displayError: '图片显示出错。',
        sendToEdit: '发送到编辑',
        showGridView: '显示网格视图',
        selectImage: '选择图片',
        generatedImage: '生成图片',
        thumbnail: '缩略图',
        history: '历史记录',
        totalCost: '总成本',
        totalCostSummary: '总成本摘要',
        totalCostDescription: '历史记录中所有生成图片的预估总成本摘要。',
        totalImagesGenerated: '生成图片总数：',
        averageCostPerImage: '单张平均成本：',
        totalEstimatedCost: '预估总成本：',
        close: '关闭',
        historyEmpty: '生成的图片会出现在这里。',
        viewImageBatch: '查看图片批次',
        copyPrompt: '复制提示词',
        copied: '已复制',
        viewPrompt: '查看提示词',
        costDetails: '费用详情',
        deleteItem: '删除项目',
        deleteConfirmTitle: '删除这条历史记录？',
        deleteConfirmDescription: '这会移除选中的历史记录，并尽可能删除对应存储图片。',
        dontAskAgain: '不再询问',
        cancel: '取消',
        delete: '删除',
        clearHistoryConfirm: '确定要清空全部图片历史吗？此操作不可撤销。',
        clearHistoryIndexedDbConfirm:
            '确定要清空全部图片历史吗？在 IndexedDB 模式下，这也会永久删除所有本地存储图片。此操作不可撤销。',
        alertError: '错误',
        clearHistory: '清空'
    }
} as const;

type I18nContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: keyof typeof dictionaries.en) => string;
};

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = React.useState<Locale>('zh');

    React.useEffect(() => {
        const stored = localStorage.getItem('imageGenLocale');
        if (stored === 'en' || stored === 'zh') {
            setLocaleState(stored);
        }
    }, []);

    const setLocale = React.useCallback((nextLocale: Locale) => {
        setLocaleState(nextLocale);
        localStorage.setItem('imageGenLocale', nextLocale);
        document.documentElement.lang = nextLocale === 'zh' ? 'zh-CN' : 'en';
    }, []);

    React.useEffect(() => {
        document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    }, [locale]);

    const value = React.useMemo<I18nContextValue>(
        () => ({
            locale,
            setLocale,
            t: (key) => dictionaries[locale][key] ?? dictionaries.en[key]
        }),
        [locale, setLocale]
    );

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const value = React.useContext(I18nContext);
    if (!value) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return value;
}
