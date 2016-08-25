'use strict'

const AdmZip = require('adm-zip')
const Converter = require('csvtojson').Converter
const request = require('sync-request')
const xml2json = require('xml2json')

/*
let data = getDataFromWeb('srcLink')

data = getJSON('srcName', 'srcType', data)
*/

// extractZip('/home/vm/Downloads/API_UKR_DS2_en_csv_v2.zip')


let start = getJSON('srcName', 'csv', '/home/vm/Downloads/API_UKR_DS2_en_csv_v2.zip') 


/**
 * Extract from zip to memory
 * @param {zip} data - zip file.
 * @returns {Array} fileData, len - array with quantity of files and data of files in strings.
 */
function extractZip (data) {
  let fileData = []
  const zip = new AdmZip(data)
  const files = zip.getEntries().length

  zip.getEntries().forEach((entry) => {
    fileData.push(zip.readAsText(entry)) // decompressed content of the entry
  })

  return {len: files, data: fileData}
}

/**
 * Get data from source.
 * @param {string} srcLink - link to actual data of source.
 * @returns {string}
 */
function getDataFromWeb (srcLink) {
  return request('GET', srcLink).getBody()
}

/**
 * Convert data to JSON
 * @param {string} srcName - name of source, which is currently being processed.
 * @param {string} srcType - datatype of current source.
 * @param {string} data - link to actual data of source.
 * @returns {JSON} output - .
 */
function getJSON (srcName, srcType, data) {
  let output = `ERROR: NOT FOUND ${srcName} in getJSON`

  switch (srcType) {
    case 'xml':
      output = xml2json.toJson(data, {'sanitize': false})
      break
    case 'json':
      output = data
      break
    case 'csv':
      let extract = extractZip(data)
      output = csv2json(extract)
      // TODO: Merge into 1 JSON -->f unction merge(files) {}
      break
    case 'tsv':
      let extract = extractZip(data)
      output = tsv2json(extract)
      // TODO: Merge into 1 JSON --> function merge(files) {}
      break
    default:
      console.log(output)
  }

  return output
}


// const findDifference

// const writeDiffToDB
// TODO: write to MongoDB

/**
 * @param {Array} extract - array with tsv-files
 * @returns {Call} csv2json(extract) extract - array with arrays of csv-object for each file.
 */
function tsv2json (extract) {
  let files = [extract.len]

  extract.data.forEach((entry) => {
    files.push(entry.replace(/\t/g, ','))
  })

  csv2json(files)
}

/**
 * @param {Array} extract - array with csv-files
 * @returns {Call} merge(files) files - array with arrays of JSON-object for each file.
 */
function csv2json (extract) {
  let files = []
  extract.data.forEach((entry) => {
    new Converter({'ignoreEmpty': true}).fromString(entry, (err, result) => {
      if (err) throw err
      files.push(JSON.stringify(result))
      if (files.length === extract.len) merge(files)
    })
  })
}
/**
 * @param {Array} files - array with arrays of 
 * @returns {Call} csv2json(extract) extract - array with csv-files
 */
function merge (files) {}
