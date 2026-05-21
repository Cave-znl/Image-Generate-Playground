export type PromptTemplateMode = 'generate' | 'edit';

export type PromptTemplateCategory = 'product' | 'portrait' | 'scene' | 'style' | 'edit' | 'utility';

export type PromptTemplate = {
    id: string;
    mode: PromptTemplateMode | 'both';
    category: PromptTemplateCategory;
    title: string;
    titleZh: string;
    description: string;
    descriptionZh: string;
    prompt: string;
    promptZh: string;
    tags: string[];
    tagsZh: string[];
};

export const PROMPT_TEMPLATE_CATEGORIES: { id: PromptTemplateCategory | 'all'; label: string; labelZh: string }[] = [
    { id: 'all', label: 'All', labelZh: '全部' },
    { id: 'product', label: 'Product', labelZh: '产品' },
    { id: 'portrait', label: 'Portrait', labelZh: '人像' },
    { id: 'scene', label: 'Scene', labelZh: '场景' },
    { id: 'style', label: 'Style', labelZh: '风格' },
    { id: 'edit', label: 'Edit', labelZh: '编辑' },
    { id: 'utility', label: 'Utility', labelZh: '工具' }
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
    {
        id: 'premium-product-shot',
        mode: 'generate',
        category: 'product',
        title: 'Premium product shot',
        titleZh: '高级产品棚拍',
        description: 'Clean commercial product image with controlled lighting.',
        descriptionZh: '适合商业展示的干净产品图，强调布光与材质。',
        prompt: 'Create a premium studio product photograph of [product]. Place it on a simple sculptural surface with soft directional lighting, realistic shadows, crisp material detail, and a refined editorial composition. Avoid text, logos, watermarks, extra props, and distorted geometry.',
        promptZh:
            '生成一张高级影棚产品摄影图，主体是[产品]。将它放在简洁、有雕塑感的台面上，使用柔和的定向光、真实阴影、清晰材质细节和精致的编辑式构图。避免文字、Logo、水印、多余道具和扭曲的几何形状。',
        tags: ['studio', 'commerce', 'lighting'],
        tagsZh: ['影棚', '商业', '布光']
    },
    {
        id: 'marketplace-listing',
        mode: 'generate',
        category: 'product',
        title: 'Marketplace listing',
        titleZh: '电商商品图',
        description: 'Neutral e-commerce image for catalog pages.',
        descriptionZh: '适合列表页和商品详情页的中性电商图。',
        prompt: 'Generate a clean marketplace listing image of [product] on a neutral background. Use accurate proportions, sharp edges, true-to-life materials, even lighting, and a centered composition with enough negative space around the object. No text, no labels, no watermark.',
        promptZh:
            '生成一张干净的电商商品图，主体是[产品]，背景保持中性。使用准确比例、清晰边缘、真实材质、均匀光线和居中构图，并在物体周围保留足够留白。不要出现文字、标签或水印。',
        tags: ['catalog', 'neutral', 'accurate'],
        tagsZh: ['目录', '中性', '准确']
    },
    {
        id: 'cinematic-portrait',
        mode: 'generate',
        category: 'portrait',
        title: 'Cinematic portrait',
        titleZh: '电影感人像',
        description: 'Character-led portrait with mood and depth.',
        descriptionZh: '突出人物情绪、光影层次和场景氛围的人像。',
        prompt: 'Create a cinematic portrait of [subject] in [setting]. Use expressive natural posture, layered lighting, shallow depth of field, realistic skin texture, detailed clothing, and a strong color story. Keep the face anatomically accurate and avoid text or artificial-looking features.',
        promptZh:
            '生成一张电影感人像，人物是[主体]，场景为[环境]。使用自然且有表现力的姿态、分层光线、浅景深、真实皮肤质感、细致服装和明确的色彩叙事。保持面部结构准确，避免文字和人工感过强的特征。',
        tags: ['person', 'cinematic', 'realistic'],
        tagsZh: ['人物', '电影感', '真实']
    },
    {
        id: 'brand-avatar',
        mode: 'generate',
        category: 'portrait',
        title: 'Brand avatar',
        titleZh: '品牌头像',
        description: 'Polished profile image for a professional identity.',
        descriptionZh: '适合个人品牌或职业身份的精致头像。',
        prompt: 'Create a polished profile avatar of [subject] for [brand or role]. Use a confident expression, clean background, balanced head-and-shoulders framing, refined lighting, and subtle brand-colored accents. Make it professional, approachable, and free of text.',
        promptZh:
            '为[品牌或角色]生成一张精致头像，主体是[人物]。使用自信的表情、干净背景、均衡的半身构图、精致光线和轻微的品牌色点缀。整体要专业、亲和，并且不要出现文字。',
        tags: ['avatar', 'profile', 'brand'],
        tagsZh: ['头像', '资料页', '品牌']
    },
    {
        id: 'environment-concept',
        mode: 'generate',
        category: 'scene',
        title: 'Environment concept',
        titleZh: '环境概念图',
        description: 'Atmospheric place design with production detail.',
        descriptionZh: '用于世界观、空间或场景设计的氛围概念图。',
        prompt: 'Design an atmospheric environment concept of [place]. Emphasize spatial depth, believable architecture, material texture, foreground-midground-background layering, and a clear time of day. Make the scene visually rich but readable, with no text or signage as the focus.',
        promptZh:
            '设计一张有氛围感的环境概念图，地点是[场所]。强调空间纵深、可信的建筑结构、材质纹理、前景中景背景层次，以及明确的时间光线。画面要丰富但易读，不要让文字或标牌成为视觉重点。',
        tags: ['environment', 'concept', 'worldbuilding'],
        tagsZh: ['环境', '概念', '世界观']
    },
    {
        id: 'social-key-visual',
        mode: 'generate',
        category: 'scene',
        title: 'Social key visual',
        titleZh: '社媒主视觉',
        description: 'Bold campaign visual with safe space for copy.',
        descriptionZh: '适合活动、内容封面或社媒海报的强视觉图。',
        prompt: 'Create a bold social media key visual for [topic or campaign]. Use a striking central subject, dynamic composition, high contrast, and intentional blank space for later text placement. Do not include any words in the image.',
        promptZh:
            '为[主题或活动]生成一张醒目的社媒主视觉。使用强烈的中心主体、动态构图、高对比度，并预留可后期排版的空白区域。图像中不要包含任何文字。',
        tags: ['campaign', 'social', 'composition'],
        tagsZh: ['活动', '社媒', '构图']
    },
    {
        id: 'editorial-illustration',
        mode: 'generate',
        category: 'style',
        title: 'Editorial illustration',
        titleZh: '杂志插画',
        description: 'Magazine-like image with a clear visual metaphor.',
        descriptionZh: '带有清晰视觉隐喻的编辑类插画。',
        prompt: 'Create an editorial illustration about [topic]. Use a clear visual metaphor, sophisticated composition, tactile textures, and a restrained but memorable color palette. The image should feel suitable for a modern magazine feature and contain no readable text.',
        promptZh:
            '生成一张关于[主题]的编辑类插画。使用清晰的视觉隐喻、成熟的构图、有触感的纹理，以及克制但有记忆点的色彩。画面应适合现代杂志专题，不包含可读文字。',
        tags: ['editorial', 'illustration', 'metaphor'],
        tagsZh: ['编辑', '插画', '隐喻']
    },
    {
        id: 'isometric-system',
        mode: 'generate',
        category: 'style',
        title: 'Isometric system',
        titleZh: '等距系统图',
        description: 'Structured diagram-like visual without labels.',
        descriptionZh: '适合表达流程、产品结构或系统关系的等距视觉。',
        prompt: 'Create an isometric visual system showing [process, product, or workflow]. Use clean geometry, consistent perspective, organized modules, subtle shadows, and a polished technical aesthetic. Keep it understandable visually without using text labels.',
        promptZh:
            '生成一张展示[流程、产品或工作流]的等距系统视觉图。使用干净几何、一致透视、有组织的模块、细腻阴影和精致的技术美学。即使不使用文字标签，也要让画面关系清晰可懂。',
        tags: ['isometric', 'system', 'technical'],
        tagsZh: ['等距', '系统', '技术']
    },
    {
        id: 'change-background',
        mode: 'edit',
        category: 'edit',
        title: 'Replace background',
        titleZh: '替换背景',
        description: 'Keep the subject while changing the scene.',
        descriptionZh: '保留主体，只替换周围环境。',
        prompt: 'Keep the main subject unchanged and replace the background with [new background]. Preserve realistic lighting direction, contact shadows, edge detail, scale, and perspective so the result looks like a single natural photograph.',
        promptZh:
            '保持主主体不变，将背景替换为[新背景]。保留真实的光线方向、接触阴影、边缘细节、比例和透视，让结果看起来像一张自然拍摄的照片。',
        tags: ['background', 'composite', 'realism'],
        tagsZh: ['背景', '合成', '真实']
    },
    {
        id: 'remove-object',
        mode: 'edit',
        category: 'edit',
        title: 'Remove object',
        titleZh: '移除物体',
        description: 'Delete distractions and reconstruct the area.',
        descriptionZh: '删除干扰物，并自然补全被遮挡区域。',
        prompt: 'Remove [object or distraction] from the image. Reconstruct the area behind it naturally, matching surrounding texture, lighting, perspective, and shadows. Do not alter the rest of the image.',
        promptZh:
            '从图像中移除[物体或干扰元素]。自然重建其背后的区域，匹配周围纹理、光线、透视和阴影。不要改变图像的其他部分。',
        tags: ['cleanup', 'retouch', 'remove'],
        tagsZh: ['清理', '修图', '移除']
    },
    {
        id: 'outfit-material-change',
        mode: 'edit',
        category: 'edit',
        title: 'Change material',
        titleZh: '更换材质',
        description: 'Transform a visible material while preserving form.',
        descriptionZh: '保留形状结构，只改变物体或服装材质。',
        prompt: 'Change the material of [object or clothing] to [new material]. Preserve the original shape, seams, folds, shadows, and perspective, while making the new surface physically believable and consistent with the scene lighting.',
        promptZh:
            '将[物体或服装]的材质改为[新材质]。保留原始形状、接缝、褶皱、阴影和透视，同时让新表面在物理上可信，并与场景光线一致。',
        tags: ['material', 'fashion', 'product'],
        tagsZh: ['材质', '服装', '产品']
    },
    {
        id: 'prompt-refiner',
        mode: 'both',
        category: 'utility',
        title: 'Prompt refiner',
        titleZh: '提示词骨架',
        description: 'A structured prompt skeleton for precise results.',
        descriptionZh: '用于把想法整理成更可控提示词的结构模板。',
        prompt: 'Subject: [main subject]. Context: [where it is / what it is doing]. Style: [visual style]. Composition: [camera angle, framing, focal length]. Lighting: [time of day and light quality]. Details to preserve: [important details]. Avoid: text, watermark, distorted anatomy, extra limbs, duplicated objects.',
        promptZh:
            '主体：[主要对象]。情境：[它在哪里 / 正在做什么]。风格：[视觉风格]。构图：[视角、取景、焦段]。光线：[时间与光质]。需要保留的细节：[重要细节]。避免：文字、水印、扭曲结构、多余肢体、重复物体。',
        tags: ['structure', 'starter', 'control'],
        tagsZh: ['结构', '起稿', '控制']
    }
];
