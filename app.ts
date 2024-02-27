import fs from 'fs';
import path from 'path';
import { addWikilinkAlias, convertWikilinkToMarkdownLink, findWililinks, findWililinksWithNoAlias } from './utils/convertWikilink';
import { convertMarkdownToWikilink, findMarkdownLinks } from './utils/convertMarkdownLink';
import { convertBorkedWikilinkToExternalMdLink, findBorkedExternalWililinks } from './utils/convertBorkedExternalWikilinks';
require('dotenv').config()

export type Link = {
  input:string,
  url:string,
  alias:string,
}


type ExportType = 'wikilink'|'markdownLink'|'borkedExternalWiki'|'addWikilinkAlias'

function findUrlsAndWriteToFile(filePath:string, exportType:ExportType) {
  

  fs.readFile(filePath, 'utf8', (err, contents) => {
    if (err) throw err;

    let contentsModified = contents
    const foundLinks = findTypeSelect(contents, exportType)
    
    if (foundLinks && foundLinks.length > 0) {
      console.log('---')
      console.log('## FILE: ', filePath)

      foundLinks.forEach(link => {
        
        const convertedLink = linkTypeSelectConverter(link, exportType)
        console.log('- foundLink: ', link.input)
        console.log('- converted: ', convertedLink)
        contentsModified = contentsModified.replace(link.input, convertedLink)
      });

      fs.writeFile(filePath, contentsModified, 'utf8', err => {
        if (err) throw err;

        console.log('### File Modified: ' + filePath);
      });
    } 
    // do i really care about untouched files?
    //   else {
    //   console.log('No markdown links found in the file: ' + filePath);
    // }
  })
}

function readDirectory(folderPath:string, exportType:ExportType){
  fs.readdir(folderPath, (err, filePaths) => {
    if (err) throw err;

    filePaths.forEach(file => {
      const filePath = path.join(folderPath, file)
      findUrlsAndWriteToFile(filePath, exportType)
    })
  })
}

function findTypeSelect(contents:string, exportType:ExportType){
  switch (exportType) {
    case 'wikilink':
      return findMarkdownLinks(contents)

    case 'markdownLink':
      return findWililinks(contents)
    
    case 'addWikilinkAlias':
      return findWililinksWithNoAlias(contents)

    case 'borkedExternalWiki':
      return findBorkedExternalWililinks(contents)
  
    default:
      throw Error('not supported type')
  }
}

function linkTypeSelectConverter(link:Link, exportType:ExportType){ 
  switch (exportType) {
    case 'wikilink':
      return convertMarkdownToWikilink(link)

    case 'markdownLink':
      return convertWikilinkToMarkdownLink(link)

    case 'addWikilinkAlias':
      return addWikilinkAlias(link)

    case 'borkedExternalWiki':
    return convertBorkedWikilinkToExternalMdLink(link)
  
    default:
      throw Error('not supported type')
  }
} 


if(process.env.DIRECTORY)
  readDirectory(process.env.DIRECTORY, process.env.EXPORTTYPE as ExportType)

if(process.env.FILE)
  findUrlsAndWriteToFile(process.env.FILE, process.env.EXPORTTYPE as ExportType)

if(!process.env.DIRECTORY && !process.env.FILE) console.log('Edit `.env` file to include a FILE or DIRECTORY & EXPORTTYPE');
