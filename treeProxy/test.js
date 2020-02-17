#!/usr/bin/env node
const { execSync } = require('child_process')
const events = []
const yggy = require('.')
const $ = yggy(__dirname)
$.subscribe({ next: console.log })
execSync('touch test.tmp')
execSync('rm test.tmp')
console.log(events)
