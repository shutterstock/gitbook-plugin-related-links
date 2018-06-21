var fs = require('fs')

const DEFAULTS = {
  heading: '### Related links'
}

// Concat a base path and a relative path into a single straightforward path
var absolute = function (base, relative) {
  var stack = base.split('/')
  var parts = relative.split('/')
  stack.pop() // remove current file name (or empty string)
  // (omit if "base" is the current folder without trailing slash
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === '.') { continue }
    if (parts[i] === '..') { stack.pop() } else { stack.push(parts[i]) }
  }
  return stack.join('/')
}

// Get the title of a markdown file
// Currently, this function uses the first H1 in the file
// If there is no H1, the function fails
var getFileTitle = function (page, link) {
  // Currently supports markdown; should I support asciidoc, too?
  var data = fs.readFileSync(absolute(page.rawPath, link), 'utf-8')
  // This regex matches the first line that starts with a single #,
  // skips a space, and snags the rest of the line to get the heading
  // from a markdown file.
  var matchTitleRegex = /^#\s(.*)$/m
  var matches = matchTitleRegex.exec(data)
  if (!matches) {
    throw (new Error('Was not able to resolve H1 from ' + link))
  }
  return (matches[1])
}

module.exports = {
  getFileTitle: getFileTitle,
  absolute: absolute,
  hooks: {
    'page:before': function (page) {
      // Retrive a list of links from the front matter, resolve the markdown
      // links, and copy the links to a new related links section at the bottom
      // of the page.
      if (page.relatedLinks) {
        const options = Object.assign({},
          DEFAULTS,
          this.config.get('pluginsConfig.related-links') || {}
        )
        var heading = options.heading
        page.content += '\n\n' + heading + '\n'
        // This regex detects strings that look like a markdown file name with no spaces.
        var matchMarkdownFileName = /^[^\n\s]*.md$/gm
        for (var i = 0; i < page.relatedLinks.length; i++) {
          // If the link looks like a markdown file name, resolve it into
          // a markdown link with the correct file title.
          if (page.relatedLinks[i].match(matchMarkdownFileName)) {
            page.content += '- [' + getFileTitle(page, page.relatedLinks[i]) + '](' + page.relatedLinks[i] + ')\n'
          } else {
            page.content += '- ' + page.relatedLinks[i] + '\n'
          }
        }
        return page
      }
    }
  }
}
