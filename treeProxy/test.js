#!/usr/bin/env node
const { execSync } = require('child_process')
const events = []
const yggy = require('.')
const $ = yggy(__dirname)

function validate () {
  [
    "$()",
    "$('')",
    "$('/')",
    "$['/']",
    "$('test.tmp')",
    "$('/test.tmp')",
    "$['/']['test.tmp']",
  ].forEach(code=>{
    console.log(code, eval(code))
  })
}

validate()
execSync('touch test.tmp')
validate()
execSync('rm test.tmp')
console.log(events)
