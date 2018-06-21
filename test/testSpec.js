var tester = require('gitbook-tester')
var jasmine = require('jasmine-node')
var fs = require('fs')
var path = require('path')
var related_links = require('../index.js')

// The following line prevents Standard from flagging these commands
/* global describe it expect */

// set timeout of jasmine async test. Default is 5000ms. That can
// be too low for a complete test (install, build, expects)
jasmine.getEnv().defaultTimeoutInterval = 60000

// Load test input and output and standardize line breaks
var testInput = fs.readFileSync(path.resolve(path.join(__dirname, '/testInput.md')), 'utf-8').replace(/\r?\n|\r/g, '\n')
var expectedOutput = fs.readFileSync(path.resolve(path.join(__dirname, '/expectedOutput.html')), 'utf-8').replace(/\r?\n|\r/g, '\n')
var testTargetFileWithH1 = fs.readFileSync(path.resolve(path.join(__dirname, '/testTargetFileWithH1.md')), 'utf-8').replace(/\r?\n|\r/g, '\n')
var testTargetFileCustom = fs.readFileSync(path.resolve(path.join(__dirname, '/testTargetFileCustom.md')), 'utf-8').replace(/\r?\n|\r/g, '\n')

// test absolute path function
describe('The absolute path function', function (){
  it('should assemble relative paths correctly', function (testDone) {
    expect(related_links.absolute('/whatever/file/path', '../other/path')).toEqual('/whatever/other/path')
    expect(related_links.absolute('different/file/path', 'differentpath')).toEqual('different/file/differentpath')
    expect(related_links.absolute('other/file/path/longer', '../../deeper/path/to/folder')).toEqual('other/deeper/path/to/folder')
    testDone()
  })
})

// test getFileTitle function
describe('The getFileTitle function', function (){
  it('should return the first H1 in a file and throw an error if there is no H1', function (testDone) {
    // The getFileTitle function accepts a gitbook page, but we can mock this by setting the rawPath property
    var sourcePage = {
      rawPath: ".",
    }
    expect(related_links.getFileTitle(sourcePage,'./test/testTargetFileWithH1.md')).toEqual('Target file')
    expect(function() {
      related_links.getFileTitle(sourcePage,'./test/testTargetFileWithoutH1.md')
    }).toThrow()
    testDone()
  })
})


// Make sure that the output of a relatedLinks front matter section is what is expected
describe('When the front matter includes a relatedLinks: section with links, ', function () {
  it('the plugin should parse the front matter and create a <ul> of related links.', function (testDone) {
    tester.builder()
      .withContent(testInput)
      .withLocalPlugin(path.join(__dirname, '/..'))
      .withPage("testTargetFileWithH1", testTargetFileWithH1)
      .withPage("testTargetFileCustom", testTargetFileCustom)
      .create()
      .then(function (result) {
        expect(result[0].content).toEqual(expectedOutput)
      })
      .fin(testDone)
      .done()
  })
})

// Test a conversion with empty front matter to make sure that the plugin isn't messing with other files

var nullInput = fs.readFileSync(path.resolve(path.join(__dirname, '/nullInput.md')), 'utf-8').replace(/\r?\n|\r/g, '\n')
var expectedNullOutput = fs.readFileSync(path.resolve(path.join(__dirname, '/expectedNullOutput.html')), 'utf-8').replace(/\r?\n|\r/g, '\n')

describe('When the front matter has no links, ', function () {
  it('the plugin should not affect the output.', function (testDone) {
    tester.builder()
      .withContent(nullInput)
      .withLocalPlugin(path.join(__dirname, '/..'))
      .create()
      .then(function (result) {
        expect(result[0].content).toEqual(expectedNullOutput)
      })
      .fin(testDone)
      .done()
  })
})

// Test that the plugin throws an error when the target file has no H1.
// In this case, the test can't use the toThrow() check because Gitbook swallows the actual exception and just returns a message.
var testInputWithLinkToPageWithoutH1 = fs.readFileSync(path.resolve(path.join(__dirname, '/testInputWithLinkToPageWithoutH1.md')), 'utf-8').replace(/\r?\n|\r/g, '\n')
var testTargetFileWithoutH1 = fs.readFileSync(path.resolve(path.join(__dirname, '/testTargetFileWithoutH1.md')), 'utf-8').replace(/\r?\n|\r/g, '\n')

describe('When a link target file has no H1, ', function () {
  it('the plugin should throw an error.', function (testDone) {
    tester.builder()
      .withContent(testInputWithLinkToPageWithoutH1)
      .withLocalPlugin(path.join(__dirname, '/..'))
      .withPage("testTargetFileWithoutH1", testTargetFileWithoutH1)
      .create()
      .then(function (result) {
        expect('We should not reach this because').toEqual('the plugin should have thrown an error by now.')
        // We should not reach this because the plugin should have thrown an error by now.
        testDone()
      }).fail(function (error) {
      // This is what we're expecting because the gitbook should throw an error
        expect(error).toBeDefined()
        testDone()
      })
  })
})
