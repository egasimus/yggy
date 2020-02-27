#!/usr/bin/env node
const { execSync } = require('child_process')
const events = []
const yggy = require('.')
const $ = yggy(__dirname)

function validate () {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  ;[
    "$()",
    "$('')",
    "$('/')",
    "$('test.tmp')",
    "$('/test.tmp')",
    "$['/']",
    "$['/test.tmp']",
    "$['/']['test.tmp']",
  ].forEach(code=>{
    console.log()
    console.log(code, '===', { ... eval(code) })
  })
}

validate()
execSync('echo asdf > test.tmp')
validate()
execSync('rm test.tmp')
validate()
console.log(events)
