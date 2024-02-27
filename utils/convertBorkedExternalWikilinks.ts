// borked external links examples
// seems like external links were turned into wikilinks and attempted to be turned back to markdownlinks
// [[senate.gov)](https://www.duckworth.senate.gov/|Home | U.S. Senator Tammy Duckworth of Illinois (senate.gov)]] 
// [[senate.gov)](https://www.duckworth.senate.gov/|Home | U.S. Senator Tammy Duckworth of Illinois (senate.gov)]] 
// [[@visionintherhythm) • Instagram photos and videos](https://www.instagram.com/visionintherhythm/|Vision in the Rhythm (@visionintherhythm) • Instagram photos and videos]]
// [[@willia_music) • Instagram photos and videos](https://www.instagram.com/willia_music/|William Chorski (@willia_music) • Instagram photos and videos]]
// [[stackexchange.com)](https://apple.stackexchange.com/questions/121810/waiting-until-a-window-exists-in-applescript|Waiting until a window exists in Applescript? - Ask Different (stackexchange.com)]]
// [[atlassian.net)](https://synodicarc.atlassian.net/jira/software/projects/BC/boards/3|BC board - Agile board - Jira (atlassian.net)]]

import { Link } from "../app"

export function findBorkedExternalWililinks(text:string) {
  
  // just find stuff between "[[ * ]]"
  const foundLinks = text.match(/\[\[(.*?)\]\]/gm)

  //@ts-ignore
  const execLinks:(RegExpExecArray | null)[]|undefined = foundLinks?.map(link => {
    //? filename could have 'http' in it
    // if(!link.includes('http')) return
    //? had to re establish regex but without `/gm`
    return (/\[\[(.*?)\]\((.*?)\|(.*?)\]\]/).exec(link)
  })
  
  const links = execLinks?.filter(Boolean).map(execLink => {

    if(!execLink) return

    // exectLink[1] is the broken alias that we can throw away
    return {
      input: execLink[0],
      //? remove `.md` extension 
      url: execLink[2],
      alias: execLink[3],
    }
  })

  
  return links as Link[]
}

export function convertBorkedWikilinkToExternalMdLink(wikilink:Link) {
  //? if external link, do not convert
  if(!wikilink.url.startsWith('https://')) return wikilink.input

  const markdownlink = `[${wikilink.alias}](${wikilink.url})`

  return markdownlink
  
}