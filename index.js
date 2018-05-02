const sanitizeHtml = require("sanitize-html");
const fs = require("fs");
const csv = require('fast-csv')

function sanitize(data) {
  const options = {
    allowedTags: ['h2', 'h3', 'table', 'th', 'tr', 'td', 'br'],
    textFilter: function(text) {
      return text.replace(/\n/, '')
    }
  }
  return sanitizeHtml(data, options)
}

csv
  .fromPath('./export.csv', { headers: true })
  .transform(function(obj) {
    const fieldToSanitize = 'Body (HTML)'
    const sanitizedBody = sanitize(obj[fieldToSanitize])
    return {
      ...obj,
      [fieldToSanitize]: sanitizedBody,
    }
  })
  .pipe(csv.createWriteStream({ headers: true }))
  .pipe(fs.createWriteStream('./import.csv', { encoding: 'utf8' }))
