import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
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

async function processFile(filePath:string, exportType:ExportType) {

  try {
    let contents = await readFile(filePath, 'utf8')
    let contentsModified = contents
    const foundLinks = findTypeSelect(contents, exportType)

    if (foundLinks && foundLinks.length > 0) {
      console.log('---')
      console.log('## FILE: ', filePath)      

      for(const link of foundLinks) {
        const convertedLink = linkTypeSelectConverter(link, exportType)
        console.log('- foundLink: ', link.input)
        console.log('- converted: ', convertedLink)
        contentsModified = contentsModified.replace(link.input, convertedLink)
      }

      await writeFile(filePath, contentsModified, 'utf8')
      console.log('### File Modified: ' + filePath)
    }
    
  } catch (err) {
    console.log(err);
    
  }
}

async function findAllFilePaths(folderPath:string, fileList:string[] = [],  exportType:ExportType){

  try {
    const items = await readdir(folderPath)    
    
    for(const itemName of items) {
      
      const itemPath = `${folderPath}/${itemName}`
      const stats = await stat(itemPath)
      
      if(stats.isFile()) 
        fileList.push(itemPath)
      else 
        if(stats.isDirectory()) 
          await findAllFilePaths(itemPath, fileList, exportType);
    }

  } catch (err) { console.error(err) }

  
  return fileList

  
  // fs.readdir(folderPath, (err, filePaths) => {
  //   if (err) throw err;

  //   // filePaths.forEach(file => {
  //   //   const filePath = path.join(folderPath, file)
  //   //   processFile(filePath, exportType)
  //   // })
  // })
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

async function app(){

  if(process.env.DIRECTORY){
    const files = await findAllFilePaths(process.env.DIRECTORY, [], process.env.EXPORTTYPE as ExportType)
    files.map(file => processFile(file, process.env.EXPORTTYPE as ExportType))
  }
  
  if(process.env.FILE)
    processFile(process.env.FILE, process.env.EXPORTTYPE as ExportType)
  
  if(!process.env.DIRECTORY && !process.env.FILE) console.log('Edit `.env` file to include a FILE or DIRECTORY & EXPORTTYPE');
}

app()
