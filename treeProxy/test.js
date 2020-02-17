#!/usr/bin/env node

require('./observable')(__dirname).subscribe(
  x => console.log(x))
