#!/usr/bin/env node
const { execSync } = require('child_process')
const events = []
const root = __dirname
const yggy = new (require('.'))(root)
yggy.subscribe({ next: console.log })
execSync('touch test.tmp')
execSync('rm test.tmp')
console.log(events)
