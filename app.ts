import fs from 'fs';
import path from 'path';

type Link = {
  input:string,
  url:string,
  alias:string,
}

function findMarkdownLinks(text:string) {
  const foundLinks = text.match(/\[(.*)\]\((.*)\)$/gm)

  const execLinks:(RegExpExecArray | null)[]|undefined = foundLinks?.map(link => {
    //? had to re establish regex but without `/gm`
    return (/\[(.*)\]\((.*)\)$/).exec(link)
  })
  const links = execLinks?.filter(Boolean).map(execLink => {

    if(!execLink) return

    return {
      input: execLink[0],
      //? remove `.md` extension 
      url: execLink[2].replace(/\.[^/.]+$/, ''),
      alias: execLink[1],
    }
  })
  
  return links as Link[]
}

function findWililinks(text:string) {
  
  const foundLinks = text.match(/\[\[(.*)\|(.*)\]\]$/gm)

  const execLinks:(RegExpExecArray | null)[]|undefined = foundLinks?.map(link => {
    //? had to re establish regex but without `/gm`
    return (/\[\[(.*)\|(.*)\]\]$/).exec(link)
  })
  const links = execLinks?.filter(Boolean).map(execLink => {

    if(!execLink) return

    return {
      input: execLink[0],
      //? add `.md` extension 
      url: execLink[1] + '.md',
      alias: execLink[2],
    }
  })
  
  return links as Link[]
}

function convertMarkdownToWikilink(mdLink:Link) {
  //? if external link, do not convert. Prob don't need because wikilinks are only internal
  if(mdLink.url.startsWith('http')) return mdLink.input

  const urlDecoded = decodeURIComponent(mdLink.url);
  const wikilink = `[[ ${urlDecoded} | ${mdLink.alias} ]]`

  return wikilink
  
}

function convertWikilinkToMarkdownLink(wikilink:Link) {
  //? if external link, do not convert
  if(wikilink.url.startsWith('http')) return wikilink.input

  // ! encodeURIComponent() converts all special characters which is not what we want
  // const urlEncoded = encodeURIComponent(link.url);  
  const splitURI = wikilink.url.replace(/ /g, '%20').split('/')
  const urlEncoded = splitURI.join('/');
  const markdownlink = `[${wikilink.alias}](${urlEncoded})`

  return markdownlink
  
}

type ExportType = 'wikilink'|'markdownLink'

function findUrlsAndWriteToFile(filePath:string, exportType:ExportType) {
  fs.readFile(filePath, 'utf8', (err, contents) => {
    if (err) throw err;

    let contentsModified = contents
    const foundMarkdownLinks = (exportType === 'wikilink') ?  findMarkdownLinks(contents) : findWililinks(contents)
    
    if (foundMarkdownLinks && foundMarkdownLinks.length > 0) {
      foundMarkdownLinks.forEach(link => {
        const convertedLink = (exportType === 'wikilink') ?  convertMarkdownToWikilink(link) : convertWikilinkToMarkdownLink(link)
        contentsModified = contentsModified.replace(link.input, convertedLink)
      });

      fs.writeFile(filePath, contentsModified, 'utf8', err => {
        if (err) throw err;

        console.log('- File Modified: ' + filePath);
      });
    } else {
      console.log('No markdown links found in the file: ' + filePath);
    }
  })
}

function readDirectory(folderPath:string, exportType:ExportType){
  fs.readdir(folderPath, (err, filePaths) => {
    if (err) throw err;

    // console.log(files);
    filePaths.forEach(file => {
      const filePath = path.join(folderPath, file)
      findUrlsAndWriteToFile(filePath, exportType)
    })
  })
}

// findUrlsAndWriteToFile('./exampleFolder/note.md', 'wikilink');
readDirectory('./exampleFolder', 'markdownLink')