# Yggy 🌍🌳🌎

## Install:

```sh
npm i yggy
node -r yggy
```

## The missing link between Node and Unix? 🤯

The filesystem is an elegant abstraction. Unix systems use it as their main
configuration store, and shell scripting languages (e.g. Bash)
generally have concise syntax for accessing it, making it easy to
persist small bits of state as plaintext files:

```sh
echo "facebook.com 127.0.0.1" >> /etc/hosts
```

However, high-level scripting languages such as Node or Python tend to follow the
underlying system call API, making them a bit more awkward about the whole thing:

```js
require('fs').appendSync('/etc/hosts', 'facebook.com 127.0.0.1')
```

I asked myself: why can't Node access the filesystem more concisely?

Luckily, you know what else has the same interface as a filesystem?
A tree of plain old ECMAScript objects. And guess what else ES has?
Dynamic property access using Proxies! Thus, the following becomes possible:

```js
// syntax 1 (property access):
$['/etc/hosts'] += '\nfacebook.com 127.0.0.1'  // ...or:
$['/'].etc.hosts += '\nfacebook.com 127.0.0.1' // ...or:
$['/']['etc']['hosts'] += '\nfacebook.com 127.0.0.1'

// syntax 2 (function call):
$('/etc/hosts').append('\nfacebook.com 127.0.0.1') //...or:
$('/etc/hosts').write($('/etc/hosts').read()+'\nfacebook.com 127.0.0.1')
```

This library aims to implement this in a modern, usable way.
I hope you give it a shot in your next project!

## API

### Initialization

Pass a root path to the Yggy constructor function to get a Yggy instance
backed by the content at that location.

```js
const Yggy = require('yggy')
const Y = Yggy('/my/data/root')
```

* The root path can be a file or a directory.
* TODO: consider remote backends

See [full list of initialization options](./doc/options.md)

### Backends

* WIP: Sync FS backend
* TODO: Async read FS backend
* TODO: Async read/write FS backend
* TODO: Remote backend

### Proxies

The Yggy instance is wrapped in a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
Attributes that start with `/`, `./`, or `../` are dynamically generated from
the backing storage. No more manually joining and splitting paths! Just use
attribute access to natively descend the filesystem tree.

```js
// the following are equivalent:
Y['/foo'] === Y['/']['foo'] === Y['/'].foo === {
  /* contents of /my/data/root/foo */
}
// this also means no more path.join/path.resolve:
const newFile = 'bar'
Y['/foo'][newFile] = "creating a new file is this easy"
```

See [full documentation of Yggy proxy behavior](./doc/proxies.md)

### Handles

Thanks to ECMAScript's support for functions as first-class objects, the
Yggy instance can also be invoked as a function. This will return an object
representing a filesystem node, with methods such as `exists`, `stat`, and `read`.

```js
// the following are equivalent:
Y('/foo/bar') === Y('/', 'foo', 'bar') === Y('/')('foo')('bar')
```

See [full documentation of Yggy handle behavior](./doc/proxies.md)

### Parsing data

* TODO: Support specifying hooks on matching filename patterns.
* TODO: Support automatic parsing of known data formats.

### Subscription

* TODO: Watch the file system for changes. Emit events.

### Expand/collapse

* TODO: Serialize and deserialize whole directory trees to/from single files

## Rationale

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
