# Link Flip

A [[developer/NodeJS|NodeJS]] tool that converts markdown links to wikilinks and vice versa. Helpful for note taking apps like [[developer/Home Lab 🏠/Obsidian.md|Obsidian.md]]

I'll be using [[developer/Projects📐/Markdown Wikilink Examples/Markdown Wikilink Example Note|Markdown Wikilink Example Note]] as an example to test this script.

## Features

- Leverage [[developer/Javascript/Javascript|Javascript]] to consistently convert links via `encodeURIComponent()` & `decodeURIComponent()`
- Automatically handle non conventional URLs that may include special characters like `(`, `)`
- Leave external links as markdown links.
- Run on single file, selected directory, or whole vault
- Support for alias on wikilinks or markdown links

> [!note] Usage
> `cp .env.example .env` and edit to desired file or folder

Note apps like [[developer/Home Lab 🏠/Obsidian.md|Obsidian.md]] do not allow characters ` # ^ [ ] |` in their filename. This converter assumes you do not use any of these characters in your filenames

## Conversion Examples

Wikilinks to markdown links is the most stable (because it was simple logic)
### Wikilinks -> Markdown Links

`ExportType = 'markdownLink'`

```md
- [[developer/Projects📐/Markdown Links to Wikilink Converter|Markdown Links to Wikilink Converter]]
- [[developer/Advice/Coder Advice - Working With 'Idea Men'|Coder Advice - Working With 'Idea Men']]
- [[developer/CSS/CSS|CSS]]
- [[developer/Projects📐/Markdown Wikilink Examples/Example * & + = ;|Example * & + = ;]]
- [[developer/Projects📐/Markdown Wikilink Examples/Example @ file|Example @ file]]
- [[developer/Projects📐/Markdown Wikilink Examples/Example File with open ( parentheses|Example File with open ( parentheses]]
```

after conversion

```md
- [Markdown Links to Wikilink Converter](developer/Projects📐/Markdown%20Links%20to%20Wikilink%20Converter.md)
- [Coder Advice - Working With 'Idea Men'](developer/Advice/Coder%20Advice%20-%20Working%20With%20'Idea%20Men'.md)
- [CSS](developer/CSS/CSS.md)
- [Example * & + = ;](developer/Projects📐/Markdown%20Wikilink%20Examples/Example%20*%20&%20+%20=%20;.md)
- [Example @ file](developer/Projects📐/Markdown%20Wikilink%20Examples/Example%20@%20file.md)
- [Example File with open ( parentheses](developer/Projects📐/Markdown%20Wikilink%20Examples/Example%20File%20with%20open%20(%20parentheses.md)
```

### Markdown Links -> Wikilinks

`ExportType = 'wikilink'`

Wikilinks to markdown links is still needs better conversion logic, it just simply converts any  space ` ` in the url to `%20`. Hoping to dig into this more later, but should be good for most cases since [[developer/Home Lab 🏠/Obsidian.md|Obsidian.md]] forces you to create URL friendly filenames. The biggest gotcha right now is filenames that contain  a`%`, which I'll make a big assumption that your vault's filenames won't contain that.

```md
- [Markdown Links to Wikilink Converter](developer/Projects📐/Markdown%20Links%20to%20Wikilink%20Converter.md)
- [Coder Advice - Working With 'Idea Men'](developer/Advice/Coder%20Advice%20-%20Working%20With%20'Idea%20Men'.md)
- [CSS](developer/CSS/CSS.md)
- [Example * & + = ;](developer/Projects📐/Markdown%20Wikilink%20Examples/Example%20*%20&%20+%20=%20;.md)
- [Example @ file](developer/Projects📐/Markdown%20Wikilink%20Examples/Example%20@%20file.md)
- [Example File with open ( parentheses](developer/Projects📐/Markdown%20Wikilink%20Examples/Example%20File%20with%20open%20(%20parentheses.md)
```

### 

after conversion

```md
- [[ developer/Projects📐/Markdown Links to Wikilink Converter | Markdown Links to Wikilink Converter ]]
- [[ developer/Advice/Coder Advice - Working With 'Idea Men' | Coder Advice - Working With 'Idea Men' ]]
- [[ developer/CSS/CSS | CSS ]]
- [[ developer/Projects📐/Markdown Wikilink Examples/Example * & + = ; | Example * & + = ; ]]
- [[ developer/Projects📐/Markdown Wikilink Examples/Example @ file | Example @ file ]]
- [[ developer/Projects📐/Markdown Wikilink Examples/Example File with open ( parentheses | Example File with open ( parentheses ]]
```

### Add Alias to Wikilinks

`ExportType = 'addWikilinkAlias'`

Adds an alias (the last segmant in the link) and shortens an absolute link to match the filename of the note

```md
[[developer/developer_box📦]]
[[developer/Linux/Linux]]
[[developer/Media Software/Docker Compose Media Containers Arrs]]
```

after conversion

```md
[[developer/developer_box📦|developer_box📦]]
[[developer/Linux/Linux|Linux]]
[[developer/Media Software/Docker Compose Media Containers Arrs|Docker Compose Media Containers Arrs]]
```

### Borked External Links

This is a very situational script. But if you have screwed up links from another link converter, you maybe lucky and have all the links screwed up in the same way. With a little bit of Regex tweaking you could fit this script to match your needs. 

For my vault, I was trying to fix external links that half mutated to wiki links. I wanted to set them back to Markdown Links

```md
- [[senate.gov)](https://www.duckworth.senate.gov/|Home | U.S. Senator Tammy Duckworth of Illinois (senate.gov)]] 
- [[senate.gov)](https://www.duckworth.senate.gov/|Home | U.S. Senator Tammy Duckworth of Illinois (senate.gov)]] 
- [[@visionintherhythm) • Instagram photos and videos](https://www.instagram.com/visionintherhythm/|Vision in the Rhythm (@visionintherhythm) • Instagram photos and videos]]
- [[@willia_music) • Instagram photos and videos](https://www.instagram.com/willia_music/|William Chorski (@willia_music) • Instagram photos and videos]]
- [[stackexchange.com)](https://apple.stackexchange.com/questions/121810/waiting-until-a-window-exists-in-applescript|Waiting until a window exists in Applescript? - Ask Different (stackexchange.com)]]
```

converts to

```md
- [Home | U.S. Senator Tammy Duckworth of Illinois (senate.gov)](https://www.duckworth.senate.gov/) 
- [Home | U.S. Senator Tammy Duckworth of Illinois (senate.gov)](https://www.duckworth.senate.gov/) 
- [Vision in the Rhythm (@visionintherhythm) • Instagram photos and videos](https://www.instagram.com/visionintherhythm/)
- [William Chorski (@willia_music) • Instagram photos and videos](https://www.instagram.com/willia_music/)
- [Waiting until a window exists in Applescript? - Ask Different (stackexchange.com)](https://apple.stackexchange.com/questions/121810/waiting-until-a-window-exists-in-applescript)
```

## Development

Run on a file or directory. For now this is the quick and dirty way of running this app on a file or folder
```bash
findUrlsAndWriteToFile('./exampleFolder/note.md', 'wikilink');
# or
readDirectory('./exampleFolder', 'markdownLink')
```

Run Typescript with Node

```bash
npx ts-node app.ts
```

#todo 
- [ ] ignore text between ` " ` " ` or ` "```" `
- [ ] ignore callout blocks like `> [!note]` 

---
## Credits
- https://logfetch.com/vscode-regex-find-and-replace-groups/
- https://stackoverflow.com/questions/43577528/visual-studio-code-search-and-replace-with-regular-expressions
- https://stackoverflow.com/questions/332872/encode-url-in-javascript
- also grabbing checkboxes `- [x]` or `- [ ] note`