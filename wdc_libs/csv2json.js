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






/**
 * Extract from zip to memory
 * @param {zip} data - zip file.
 * @returns {Array} extractFiles - array with data of file in strings.
 */
const extractZip = (data) => {
  let extractFiles = []

  const zip = new AdmZip(data)
  const zipEntries = zip.getEntries()

  zipEntries.forEach((el) => {
    extractFiles[el] = zip.readAsText(el)
  })

  return extractFiles
}

/**
 * Get data from source.
 * @param {string} srcLink - link to actual data of source.
 * @returns {string}
 */
const getDataFromWeb = (srcLink) => {
  return request('GET', srcLink).getBody()
}

/**
 * Convert data to JSON
 * @param {string} srcName - name of source, which is currently being processed.
 * @param {string} srcType - datatype of current source.
 * @param {string} data - link to actual data of source.
 * @returns {JSON} output - .
 */
const getJSON = (srcName, srcType, data) => {
  let output = `ERROR: NOT FOUND ${srcName} in getJSON`

  switch (srcType) {
    case 'xml':
      output = xml2json.toJson(data, {'sanitize': false})
      break
    case 'json':
      output = data
      break
    case 'csv':
      output = extractZip(data)
      let converter = new Converter({'ignoreEmpty': true})

      converter.fromString(output, (err, result) => {
        if (err) throw err
        output = result
      })
      // TODO: Merge into 1 JSON
      break
    case 'tsv':
      output = extractZip(data)
      // TODO: Convert to JSON
      // TODO: Merge into 1 JSON
      break
    default:
      console.log(output)
  }

  return output
}


// const findDifference

// const writeDiffToDB
// TODO: write to MongoDB






let output = '/home/vm/Downloads/API_UKR_DS2_en_csv_v2.zip'

output = extractZip(output)
let converter = new Converter({'ignoreEmpty': true})
/////////////////////// Ось тут тре  цикл чи щось таке
converter.fromString(output, (err, result) => {
  if (err) throw err
  output = result
  console.log(result)
})
