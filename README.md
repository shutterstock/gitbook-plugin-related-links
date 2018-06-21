# gitbook-plugin-related-links

This plugin manages related links for the Markdown files in your Gitbook.
It retrieves the title for the links so you can just list the filename and not worry about changing files when your topic titles change.

The plugin takes file names from the front matter of a Markdown file, gets the titles from those files, and generates a related links section at the bottom of the file with links to each of those files.
This keeps your related links sections consistent and keeps you from having to hard-code the titles of links to other pages in your Gitbook.

Notes:
- This plugin currently supports only Markdown files, not AsciiDoc files.
- To determine the title of a page, the plugin retrieves the first H1 in the file and uses its text.
The plugin could be enhanced to use the title from front matter or from the summary file.
- If the file name does not end in `.md`, the plugin copies the link to the related links section without changing anything.
In this way you can specify custom link text as usual by using a standard Markdown link, or you can link to an external site by putting in a URL.
However, to keep the YAML legal, you must surround Markdown links with single quotes.
See the example below.

## Installation

Add the plugin to your `book.json`:

``` json
{
  "plugins": [ "related-links@git://github.shuttercorp.net/tmcmackin/gitbook-plugin-related-links.git" ],
  "pluginsConfig": {
     "header": "### Related topics"
  }
}
```

Then run `gitbook install`.

## Configuration

- `header`: Specify the heading under which to put the related links.
The plugin adds this heading and an unordered list of links under it at the bottom of the Markdown file.
The default is "### Related topics".

## Example

Here's a Markdown file with some links in the front matter:
```markdown
---
relatedLinks:
- myFile.md
- http://gitbook.com
- ../otherfiles/relatedFile.md
- '[My custom link text](someOtherFile.md)'
---
# Here's my file that needs related links
```

At build time, before Gitbook converts the Markdown to HTML, the plugin gets the link titles from the MD files in the front matter.
The resulting file looks like this:
```markdown
# Here's my file that needs related links

### Related links
- [My special file](myFile.md)
- http://gitbook.com
- [My related file](../otherfiles/relatedFile.md)
- [My custom link text](someOtherFile.md)
```

### Tests

To run tests, run these commands:
```bash
npm install
npm run test
```

### Contributing

- See [issue_template.md](issue_template.md) for information to submit in an issue.
- Please refer to Shutterstock’s [Code of Conduct](https://github.com/shutterstock/code-of-conduct) for contributors.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
