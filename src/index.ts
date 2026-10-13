import { AbortError, type AbortErrorOptions } from '@alessiofrittoli/exception/abort'

/**
 * Stream class.
 *
 * This class extends the [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream) interface with additional convenience methods.
 *
 * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)
 *
 *
 * @example
 * ```ts
 * // create a new instance.
 * const stream = new Stream()
 * // write into the the stream.
 * stream.write( { ... } )
 * // abort stream.
 * stream.abort( 'Abort reason custom message.' )
 * // close the stream.
 * stream.close()
 * ```
 */
export class Stream<I = unknown, O = I> extends TransformStream<I, O> {
	/**
	 * The {@link WritableStreamDefaultWriter} instance.
	 *
	 */
	public readonly writer: WritableStreamDefaultWriter<I>
	/**
	 * Common headers to return in a Server Response.
	 *
	 */
	public readonly headers: Headers

	/**
	 * Flag whether {@link WritableStreamDefaultWriter} has been closed or not.
	 *
	 */
	protected _closed: boolean

	protected set closed(value: typeof this._closed) {
		this._closed = value
	}

	/**
	 * Flag whether {@link WritableStreamDefaultWriter} has been closed or not.
	 *
	 */
	public get closed(): typeof this._closed {
		return this._closed
	}

	/**
	 * Indicates whether the connection is in the process of closing.
	 * This flag is internally used to prevent multiple close operations from being initiated.
	 */
	private isClosing: boolean = false

	/**
	 * Constructs a new instance of the Stream class.
	 *
	 * @param transformer		(Optional) A custom transformer.
	 * @param writableStrategy	(Optional) A custom writable strategy.
	 * @param readableStrategy	(Optional) A custom readable strategy.
	 */
	public constructor(
		transformer?: Transformer<I, O>,
		writableStrategy?: QueuingStrategy<I>,
		readableStrategy?: QueuingStrategy<O>,
	) {
		super(transformer, writableStrategy, readableStrategy)

		this.writer = this.writable.getWriter()
		this._closed = false
		this.headers = new Headers({
			Connection: 'keep-alive',
			'Transfer-Encoding': 'chunked',
			'Cache-Control': 'no-cache, no-transform',
			'X-Accel-Buffering': 'no',
			'Content-Encoding': 'none',
		})
	}

	/**
	 * Writes data into the stream.
	 *
	 * @param chunk The data chunk to stream.
	 * @returns A promise that resolves when the data has been written.
	 */
	public async write(chunk: I): Promise<this> {
		await this.writer.ready
		await this.writer.write(chunk)
		return this
	}

	/**
	 * Close the Stream.
	 *
	 * - Closes the writer if it is not already closed or in the process of closing.
	 * - Sets the `isClosing` flag to `true` to prevent multiple close operations when `.close()` is not awaited.
	 * - Closes the writer and releases the lock.
	 * - Resets the `isClosing` flag to `false` after the operation.
	 *
	 * @returns A new Promise with the current `Stream` instance for chaining purposes.
	 */
	public async close(): Promise<this> {
		if (this.closed || this.isClosing) return this

		this.isClosing = true

		try {
			await this.writer.close()
			this.closed = true
			this.writer.releaseLock()
		} finally {
			this.isClosing = false
		}

		return this
	}

	/**
	 * Aborts the {@link Stream.writer}.
	 *
	 * @param reason An optional string providing the reason for the abort.
	 * @returns A new Promise with the current `Stream` instance for chaining purposes.
	 */
	public async abort(
		reason: string = 'Streming writer aborted.',
		options?: Omit<AbortErrorOptions, 'message'>,
	): Promise<this> {
		if (this.closed || this.isClosing) return this

		this.isClosing = true

		try {
			await this.writer.abort(new AbortError({ message: reason, ...options }))
		} finally {
			this.closed = true
			this.isClosing = false
		}

		return this
	}
}
