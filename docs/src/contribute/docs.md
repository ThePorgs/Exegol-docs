# Contributing to the documentation

The Exegol documentation is built using VitePress. This guide will help you contribute to the documentation.

## Getting started

1. Fork the [Exegol-docs](https://github.com/ThePorgs/Exegol-docs) repository
2. Checkout the `dev` branch
3. (optional) create a new branch in your fork, if you plan on working on different topics
4. Create your content using this guide
5. Make sure the content builds fine with `npm install && npm run docs:dev`
6. Stage, Commit, and Push your changes
7. Submit a Pull Request (https://github.com/ThePorgs/Exegol-docs/compare)

## Documentation structure

The documentation is organized into several sections:

- **General**
    - About Exegol
    - First install
    - Specific install guides (accessible only through direct links in /first-install)
        - Arch
        - Fedora
        - Gentoo
        - ...
    - Frequently asked questions
    - Troubleshooting
    - Tips & tricks
- **Exegol images**
    - Images
    - Tools list
    - My resources
    - Exegol history
    - Credentials
    - Services
- **Exegol wrapper**
    - Features
    - Command-line actions (info, start, exec, ...)
    - Advanced configuration
- **Exegol resources**
    - Resources list
- **Dashboard**
- **Blog** (accessible from navigation menu)
- **Contributing** (accessible from navigation menu)
    - About contributions
    - Components (Images, Wrapper, Resources, My-resources, Exegol history, Docs)
    - Miscellaneous (Source install, Signing commits, Maintainers notes)
- **Legal** (accessible from navigation menu)

All documentation files are stored in the `/docs/src` folder.

## Writing style

When writing documentation, maintain the following tone & voice:

* **Professional and Authoritative**: Content should maintain a professional tone, suitable for a technical audience.
* **Instructional and Informative**: Writing should aim to educate the reader, with clear instructions and explanations.
* **Impersonal and Objective**: Avoid directly addressing the reader or using personal pronouns. Use passive constructions or neutral phrasing.

## Markdown features

The documentation supports several markdown features:

### Code blocks

Use triple backticks to delimit code blocks, specifying the language after the first set of backticks:

```python
print('hello world')
```

### Tabs

```markdown
::: tabs
== Tab 1
Content for tab 1

== Tab 2
Content for tab 2
:::
```

### Callouts

The documentation uses GitHub-flavored alerts for callouts:

> [!NOTE]
> Additional information that can almost be ignored, but may be interesting to know.

> [!TIP]
> Useful suggestions and recommended practices. Something you'd tell a friend.

> [!INFO]
> A thing that should probably be told users.

> [!IMPORTANT]
> Essential information that requires attention. An emphasized note.

> [!WARNING]
> Potential risks or issues to be aware of. Moderate risk.

> [!CAUTION]
> Important considerations that need careful attention. High risk.

> [!DANGER]
> Critical warnings about potentially harmful situations. Critical information.

> [!SUCCESS]
> Indicates a positive outcome or achievement.

```markdown
> [!NOTE/TIP/INFO/...] (Optional) title
> Content
```

### Images and links

- Links: `[title](link)`
- Images: `![](path/to/image)`
- Images with caption:

```markdown
![](path/to/image)
Some caption{.caption}
```

### Theme-specific images

You can specify different images for light and dark themes using the `data-theme` attribute:

```markdown
<!-- Image for both themes -->
![Description](./image.png)

<!-- Image for light theme only -->
![Description](./image.png){data-theme="light"}

<!-- Image for dark theme only -->
![Description](./image.png){data-theme="dark"}
```

> [!TIP]
> If there are spaces in the image path, either spaces need to be URL-encded (`%20`), or the following structure can be used (recommended): `![](<path/to/some image>)`

### YouTube videos

To embed a YouTube video:

```markdown
<YouTubeVideo videoId="dQw4w9WgXcQ" />
```


### Quotes

> "Someone said something important and it should be highlighted in the article? Please quote it and attribute it to the initial author."
>  
> _(Author, date, [source](#))_

```markdown
> "Someone said something important and it should be highlighted in the article? Please quote it and attribute it to the initial author."
>  
> _(Author, date, [source](#))_
```

### Others

| Block                                                              | Description                                             |
|--------------------------------------------------------------------|---------------------------------------------------------|
| [Links](https://vitepress.dev/guide/markdown#links)                | Internal links (to other articles, or to anchor points) |
| [Tables](https://vitepress.dev/guide/markdown#github-style-tables) | Tables (like this one)                                  |
| [Emojis](https://vitepress.dev/guide/markdown#emoji)               | Emojis :tada:                                           |

