module.exports = {
    base: '/blog/',
    title: 'blog',
    description: 'Vuepress blog demo',
    themeConfig: {
        head: [
            ['link', { rel: 'icon', href: '/logo.jpg' }]
        ],
        // 你的GitHub仓库，请正确填写
        repo: 'https://github.com/hhpp33/blog',
        // 自定义仓库链接文字。
        repoLabel: 'My GitHub',
        sidebar: [
            ['/', '首页'],
            ['/blog/collection.md', 'Laravel 集合(Collection)源代码分析']
        ]
    }
}
