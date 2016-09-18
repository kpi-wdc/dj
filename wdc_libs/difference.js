'use strict'

const AdmZip = require('adm-zip')
const Converter = require('csvtojson').Converter
const request = require('sync-request')
const xml2json = require('xml2json')

/**
 * Extract from zip to memory.
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
 * Convert data to JSON.
 * @param {string} srcName - name of source, which is currently being processed.
 * @param {string} srcType - datatype of current source.
 * @param {string} data - link to actual data of source.
 * @returns {JSON} output - One JSON file
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
      const extract = extractZip(data)
      const files = csv2json(extract)
      output = merge(files)
      break
    case 'tsv':
      const extract = extractZip(data)
      const files = tsv2json(extract)
      output = merge(files)
      break
    default:
      console.log(output)
  }

  return output
}

/**
 * @param {Array} extract - array with tsv-files.
 * @returns {Call} csv2json(extract) extract - array with arrays of csv-object for each file.
 */
function tsv2json (extract) {
  let files = [extract.len]

  extract.data.forEach((entry) => {
    files.push(entry.replace(/\t/g, ','))
  })

  return csv2json(files)
}

/**
 * @param {Array} extract - array with csv-files.
 * @returns {Array} files - array with arrays of JSON-object for each file.
 */
function csv2json (extract) {
  let files = []
  extract.data.forEach((entry) => {
    new Converter({'ignoreEmpty': true}).fromString(entry, (err, result) => {
      if (err) throw err
      files.push(JSON.stringify(result))
      if (files.length === extract.len) return files
    })
  })
}

/**
 * Merge some JSON-file into one.
 * @param {Array} files - array with arrays of JSON-files.
 * @returns {JSON} oneFile - json file.
 */
function merge (files) {
  // TODO
  let oneFile = files

  return oneFile
}

/**
 * Find difference between two files.
 * @param {JSON} newData.
 * @param {JSON} oldData.
 * @returns {JSON} diff - return difference. If not found diff - retutn empty object.
 */
function findDiff (newData, oldData) {
  // TODO 
  let diff = {}

  return diff
}

/**
 * Write file to Mongo.
 * @param {JSON} file - JSON file.
 */
function writeToMongo(file) {
  // TODO
}

/**
 * Take info about srcName from Mongo.
 * @param {String} srcName - name of source, which is currently being processed.
 * @returns {Object} Object with {String} srcType, {String} srcLink, {JSON} oldData.
 */
function takeFromMongo(srcName) {
  // TODO
  const srcType = 'csv'
  const srcLink = '/home/vm/Downloads/API_UKR_DS2_en_csv_v2.zip'
  const oldData = 'Need for diff'

  return { srcType, srcLink, oldData }
}




// TODO: Input srcName
const srcName = 'srcName'

{ srcType, srcLink, oldData } = takeFromMongo(srcName)
let newData = srcLink // let newData = getDataFromWeb('srcLink')

newData = getJSON(srcName, srcType, newData) // TODO: merge
const diff = findDiff(newData, oldData) // TODO

if (diff) {
  writeToMongo(diff) // TODO
}
