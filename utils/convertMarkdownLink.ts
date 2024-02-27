import { Link } from "../app";

export function findMarkdownLinks(text:string) {
  const foundLinks = text.match(/\[(.*)\]\((.*)\)/gm)

  const execLinks:(RegExpExecArray | null)[]|undefined = foundLinks?.map(link => {
    //? had to re establish regex but without `/gm`
    return (/\[(.*)\]\((.*)\)$/).exec(link)
  })
  const links = execLinks?.filter(Boolean).map(execLink => {

    // if(!execLink) return
    if(execLink && !execLink[0].includes('(https://') && !execLink[0].includes('(http://')){

      return {
        input: execLink[0],
        //? remove `.md` extension 
        url: execLink[2].replace(/\.[^/.]+$/, ''),
        alias: execLink[1],
      }
    } 

  })
  
  return links ? links.filter(Boolean) as Link[] : [];
}

export function convertMarkdownToWikilink(mdLink:Link) {
  //? if external link, do not convert. Prob don't need because wikilinks are only internal
  // if(mdLink.url.startsWith('http')) return mdLink.input

  const urlDecoded = decodeURIComponent(mdLink.url);
  const wikilink = `[[ ${urlDecoded} | ${mdLink.alias} ]]`

  return wikilink
  
}