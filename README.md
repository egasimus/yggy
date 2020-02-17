# Yggy 🌍🌳🌎

## A missing link between Node and Unix 🤯

```sh
npm i yggy
node -r yggy
```

```js
$ = require('yggy')('/')
// the following calls are equivalent
$['/'].etc.hosts += '\nfacebook.com 127.0.0.1'
$['/etc/hosts'] += '\nfacebook.com 127.0.0.1'
$['/']['etc']['hosts'] += '\nfacebook.com 127.0.0.1'
$('/etc/hosts').write($('/etc/hosts').read()+'\nfacebook.com 127.0.0.1')
```

## API

### Initialization

### Fragment API

### Full path API

### Subscription API

### Mirror API

### Expand/collapse

### Hooks

## Rationale

Tired of Node's cumbersome FS API?

Yggy is a bidirectional adapter that establishes a mapping
between an in-memory JavaScript object and the contents of
a directory tree on the filesystem -- because both are,
fundamentally, structured as _trees_.

The main benefit of Yggy is that it lets you view and
manipulate coarse program state without special tooling.
This makes it the ideal datastore when developing scripts,
batch jobs, and one-off microfrontends.

Another way to view Yggy is as an impedance matcher for
interactive exploratory programming: it lets you incrementally
establish the data model of a problem. You can make quick
and dirty modifications to your schema and data with the
usual Unix toolset and have them immediately represented
within the address space of the custom, problem-specific
interface that you're building for your data.
