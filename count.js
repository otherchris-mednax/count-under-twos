import fs from 'fs'
import { subYears, parseISO } from 'date-fns'

const getDataFromFilename = (filename) => {
  const raw = fs.readFileSync(filename)
  return JSON.parse(raw)
}

// const total = (facId) => getDataFromFilename(`responses/${facId}.json`).total
const total = (path) => getDataFromFilename(path).total

const totalCalculated = (path) => {
  const data = getDataFromFilename(path)
  return data.entry.filter(x => x.resource.resourceType == "Patient").length
}
// const totalUnderTwo = (facId) => {
const totalUnderTwo = (path) => {
  // const data = getDataFromFilename(`responses/${facId}.json`)
  const data = getDataFromFilename(path)
  const today = new Date(Date.now())
  const birthDates = data.entry.filter(x => x.resource.resourceType == "Patient").map(x => x.resource.birthDate).map(parseISO).filter(x => x > subYears(today, 2))
  return birthDates.length
}

// const facId = process.env.FACID
const pathToJSON = process.env.PATH_TO_JSON

// console.log(`facility: ${facId}, total: ${total(facId)}, totalUnderTwo: ${totalUnderTwo(facId)}`)
console.log(`json source: ${pathToJSON}, total: ${total(pathToJSON) || totalCalculated(pathToJSON)}, totalUnderTwo: ${totalUnderTwo(pathToJSON)}`)
