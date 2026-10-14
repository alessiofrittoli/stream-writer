<h1 align="center">Stream Writer 🪶</h1>
<h2 align="center">
  Easly push data to a Stream
</h2>
<p align="center">
The <code>Stream</code> class extends the <a href="https://developer.mozilla.org/en-US/docs/Web/API/TransformStream"><code>TransformStream</code></a> interface, providing additional convenience methods for handling streams, such as writing, closing, and aborting reducing the amount of code required for those operations.
</p>
<p align="center">
If you're interested in a simple and effective way to read streams, take a look at <a href="https://npmjs.com/package/@alessiofrittoli/stream-reader"><code>@alessiofrittoli/stream-reader</code></a>package.
</p>
<p align="center">
  <a href="https://npmjs.org/package/@alessiofrittoli/stream-writer">
    <img src="https://img.shields.io/npm/v/@alessiofrittoli/stream-writer" alt="Latest version"/>
  </a>
  <a href="https://coveralls.io/github/alessiofrittoli/stream-writer">
    <img src="https://coveralls.io/repos/github/alessiofrittoli/stream-writer/badge.svg" alt="Test coverage"/>
  </a>
  <a href="https://socket.dev/npm/package/@alessiofrittoli/stream-writer/overview">
    <img src="https://socket.dev/api/badge/npm/package/@alessiofrittoli/stream-writer" alt="Socket Security score"/>
  </a>
  <a href="https://npmjs.org/package/@alessiofrittoli/stream-writer">
    <img src="https://img.shields.io/npm/dm/@alessiofrittoli/stream-writer.svg" alt="npm downloads"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/stream-writer">
    <img src="https://badgen.net/bundlephobia/dependency-count/@alessiofrittoli/stream-writer" alt="Dependencies"/>
  </a>
  <a href="https://libraries.io/npm/%40alessiofrittoli%2Fstream-writer">
    <img src="https://img.shields.io/librariesio/release/npm/@alessiofrittoli/stream-writer" alt="Dependencies status"/>
  </a>
</p>
<p align="center">
  <a href="https://bundlephobia.com/package/@alessiofrittoli/stream-writer">
    <img src="https://badgen.net/bundlephobia/min/@alessiofrittoli/stream-writer" alt="minified"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/stream-writer">
    <img src="https://badgen.net/bundlephobia/minzip/@alessiofrittoli/stream-writer" alt="minizipped"/>
  </a>
  <a href="https://bundlephobia.com/package/@alessiofrittoli/stream-writer">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@alessiofrittoli/stream-writer" alt="Tree shakable"/>
  </a>
</p>
<p align="center">
  <a href="https://github.com/sponsors/alessiofrittoli">
    <img src="https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2" alt="Fund this package"/>
  </a>
</p>

[sponsor-badge]: https://img.shields.io/static/v1?label=Fund%20this%20package&message=%E2%9D%A4&logo=GitHub&color=%23DB61A2
[sponsor-url]: https://github.com/sponsors/alessiofrittoli

### Table of Content

- [Getting started](#getting-started)
- [Key features](#key-features)
- [Development](#development)
  - [Local development](#local-development)
  - [Production build](#production-build)
  - [Unit tests](#unit-tests)
    - [Run tests with coverage](#run-tests-with-coverage)
  - [Contributing](#contributing)
  - [Security](#security)
- [API Reference](#api-reference)
  - [Importing the library](#importing-the-library)
  - [Properties](#properties)
  - [Constructor](#constructor)
  - [Methods](#methods)
    - [`Stream.write()`](#streamwrite)
    - [`Stream.close()`](#streamclose)
    - [`Stream.abort()`](#streamabort)
- [Examples](#examples)
  - [Writing data into a stream](#writing-data-into-a-stream)
  - [Writing data into a stream with a custom transformer](#writing-data-into-a-stream-with-a-custom-transformer)
  - [Aborting the stream](#aborting-the-stream)
- [Credits](#made-with-)

---

### Getting started

Run the following command to start using `stream-writer` in your projects:

```bash
npm i @alessiofrittoli/stream-writer
```

or using `pnpm`

```bash
pnpm i @alessiofrittoli/stream-writer
```

---

### Key features

#### Extends `TransformStream`

- Inherits all the functionality of the [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream) API, allowing for custom transformations of input to output streams.
- Provides seamless integration with modern streaming APIs.

#### Convenient Stream Management

- `write` Method: A high-level abstraction for writing chunks of data into the stream. It handles readiness and ensures proper sequencing of write operations.
- `close` Method: Safely closes the stream while preventing multiple or concurrent close operations.
- `abort` Method: Gracefully aborts the stream with an optional reason, making it easier to handle errors or interruptions.

#### Built-In Headers for Server Responses

- The `headers` property contains default headers commonly used in server responses, such as:
  - `Connection: keep-alive`
  - `Transfer-Encoding: chunked`
  - `Cache-Control: no-cache, no-transform`
  - `X-Accel-Buffering: no`
  - `Content-Encoding: none`

#### Stream Writer Abstraction

- The `writer` property provides direct access to the underlying `WritableStreamDefaultWriter`, enabling fine-grained control over the writable stream.
- Ensures proper handling of stream readiness, errors, and resource management (e.g., releasing locks).

#### Type Safety

- Generic parameters (`I` for input, `O` for output) make the class type-safe and adaptable to various use cases, such as processing specific data types.

#### Designed for Robustness

- Internal mechanisms, ensure the class behaves predictably and avoids race conditions.

#### Chainable API

- Methods like `write`, `close`, and `abort` return the current `Stream` instance, enabling method chaining for more concise and readable code.

#### Compatibility and Modularity

- The `Stream` class can be used in both client-side and server-side applications where the `TransformStream` API is supported.
- Its modular design makes it easy to extend or customize further for specific application needs.

#### Focused on Developer Experience

- Clear and concise API with thoughtful defaults.
- Built-in documentation and examples make it easy to understand and integrate into existing projects.

These features make the `Stream` class a versatile and developer-friendly abstraction for working with streams in modern JavaScript and TypeScript environments.

---

### Development

Run the following to start development

```shell
nvm use

pnpm i
```

#### Local development

Run the following

```shell
pnpm dev
```

This will generate unminified output code, sourcemaps and will enable source file watcher.

---

#### Production build

Run the following to create a local production build

```shell
pnpm build
```

This will generate minified output code without sourcemaps.

---

#### Unit tests

Run all the defined test suites by running the following:

```shell
# Run tests and watch file changes.
pnpm test:watch

# Run tests in a CI environment.
pnpm test:ci
```

---

##### Run tests with coverage

An HTTP server is then started to serve coverage files from `./coverage` folder.

⚠️ You may see a blank page the first time you run this command. Simply refresh the browser to see the updates.

```shell
pnpm test:coverage:serve
```

---

#### Contributing

Contributions are truly welcome!

Please refer to the [Contributing Doc](./CONTRIBUTING.md) for more information on how to start contributing to this project.

Help keep this project up to date with [GitHub Sponsor][sponsor-url].

[![GitHub Sponsor][sponsor-badge]][sponsor-url]

---

#### Security

If you believe you have found a security vulnerability, we encourage you to **_responsibly disclose this and NOT open a public issue_**. We will investigate all legitimate reports. Email `security@alessiofrittoli.it` to disclose any security vulnerabilities.

---

### API Reference

### Importing the library

```ts
import { Stream } from '@alessiofrittoli/stream-writer'
```

---

### Properties

| Property   | Type                             | Description                                    |
| ---------- | -------------------------------- | ---------------------------------------------- |
| `writable` | `WritableStream<I>`              | The writable stream instance.                  |
| `readable` | `ReadableStream<O>`              | The readable stream instance.                  |
| `writer`   | `WritableStreamDefaultWriter<I>` | The writer instance for the writable stream.   |
| `closed`   | `boolean`                        | Indicates whether the stream is closed.        |
| `headers`  | `Headers`                        | Common headers to return in a server response. |

---

### Constructor

Constructs a new instance of the `Stream` class.

| Parameter          | Type                 | Description                                           |
| ------------------ | -------------------- | ----------------------------------------------------- |
| `transformer`      | `Transformer<I, O>`  | (Optional) A custom transformer for the stream.       |
| `writableStrategy` | `QueuingStrategy<I>` | (Optional) A custom strategy for the writable stream. |
| `readableStrategy` | `QueuingStrategy<O>` | (Optional) A custom strategy for the readable stream. |

---

### Methods

#### `Stream.write()`

Writes data into the stream.

##### Parameters

| Parameter | Type | Description                            |
| --------- | ---- | -------------------------------------- |
| `chunk`   | `I`  | The data chunk to write to the stream. |

##### Returns

Type: `Promise<Stream>`

- A Promise that resolves to the current `Stream` instance.

---

#### `Stream.close()`

Closes the stream.

- Closes the writer if it is not already closed or in the process of closing.
- Prevents multiple close operations when .close() is not awaited.
- Releases the lock on the writer.

##### Returns

Type: `Promise<Stream>`

- A Promise that resolves to the current `Stream` instance.

---

#### `Stream.abort()`

Aborts the stream with an optional reason.

##### Parameters

| Parameter | Type     | Description                                    |
| --------- | -------- | ---------------------------------------------- |
| `reason`  | `string` | (Optional) The reason for aborting the stream. |

##### Returns

Type: `Promise<Stream>`

- A Promise that resolves to the current `Stream` instance.

---

### Examples

#### Writing data into a stream

```ts
const routeHandler = () => {
  const stream = new Stream()

  const streamTask = async () => {
    await stream.write('data')
    await stream.write('data 2')
    await stream.write('data 3')
    await stream.write('data 4')
  }

  streamTask().then(() => stream.close())

  return new Response(stream.readable, { headers: stream.headers })
}
```

---

#### Writing data into a stream with a custom transformer

```ts
const routeHandler = () => {
  const encoder = new TextEncoder()
  const stream = new Stream<string, Uint8Array>({
    transform(chunk, controller) {
      controller.enqueue(encoder.encode(chunk))
    },
  })

  const streamTask = async () => {
    await stream.write('data')
    await stream.write('data 2')
    await stream.write('data 3')
    await stream.write('data 4')
  }

  streamTask().then(() => stream.close())

  return new Response(stream.readable, { headers: stream.headers })
}
```

---

#### Aborting the stream

```ts
const routeHandler = request => {
  request.signal.addEventListener('abort', () => {
    stream.abort('The user aborted the request.')
  })

  const stream = new Stream()

  const streamTask = async () => {
    await stream.write('data')
    await stream.write('data 2')
    await stream.write('data 3')
    await stream.write('data 4')
  }

  streamTask()
    .catch(error => {
      if (error.name === 'AbortError') {
        return console.log('AbortError:', error.message)
      }
      await stream.write(error.message)
    })
    .finally(() => stream.close())

  return new Response(stream.readable, { headers: stream.headers })
}
```

---

### Made with ☕

<table style='display:flex;gap:20px;'>
  <tbody>
    <tr>
      <td>
        <img alt="avatar" src='https://avatars.githubusercontent.com/u/35973186' style='width:60px;border-radius:50%;object-fit:contain;'>
      </td>
      <td>
        <table style='display:flex;gap:2px;flex-direction:column;'>
          <tbody>
              <tr>
                <td>
                  <a href='https://github.com/alessiofrittoli' target='_blank' rel='noopener'>Alessio Frittoli</a>
                </td>
              </tr>
              <tr>
                <td>
                  <small>
                    <a href='https://alessiofrittoli.it' target='_blank' rel='noopener'>https://alessiofrittoli.it</a> |
                    <a href='mailto:info@alessiofrittoli.it' target='_blank' rel='noopener'>info@alessiofrittoli.it</a>
                  </small>
                </td>
              </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
