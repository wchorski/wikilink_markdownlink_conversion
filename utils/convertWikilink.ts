import { Link } from "../app";

export function findWililinks(text:string) {
  
  const foundLinks = text.match(/\[\[(.*)\|(.*)\]\]/gm)

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

export function convertWikilinkToMarkdownLink(wikilink:Link) {
  //? if external link, do not convert
  if(wikilink.url.startsWith('http')) return wikilink.input

  // ! encodeURIComponent() converts all special characters which is not what we want
  // const urlEncoded = encodeURIComponent(link.url);  
  const splitURI = wikilink.url.replace(/ /g, '%20').split('/')
  const urlEncoded = splitURI.join('/');
  const markdownlink = `[${wikilink.alias}](${urlEncoded})`

  return markdownlink
  
}

export function findWililinksWithNoAlias(text:string) {
  // regex /\[\[([^|\]]*?)\]\]$/ find links between `[[ ]]` but does not contain `|`
  const foundLinks = text.match(/\[\[([^|\]]*?)\]\]/gm)
  console.log(foundLinks);
  

  const execLinks:(RegExpExecArray | null)[]|undefined = foundLinks?.map(link => {
    // todo
    // if string has `|` then return nothing
    //? had to re establish regex but without `/gm`
    return (/\[\[([^|\]]*?)\]\]$/).exec(link)
  })
  const links = execLinks?.filter(Boolean).map(execLink => {

    if(!execLink) return

    return {
      input: execLink[0],
      url: execLink[1],
      //todo split string by `/`. take last index as Alias
      alias: execLink[1].split('/').slice(-1)[0],
    }
  })
  
  return links as Link[]
}

// wikilinks without alias
// [[developer/developer_box📦]]
// [[developer/Linux/Linux]]
// [[developer/Media Software/Docker Compose Media Containers Arrs]]

export function addWikilinkAlias(link:Link){

  const wikilinkWithAlias = `[[${link.url}|${link.alias}]]`
  return wikilinkWithAlias
}
