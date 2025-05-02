import { AbortError, type AbortErrorOptions } from "@alessiofrittoli/exception/abort"

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
export class Stream<I = unknown, O = I> extends TransformStream<I, O>
{
	/** The {@link WritableStreamDefaultWriter} instance. */
	writer: WritableStreamDefaultWriter<I>
	/** Flag whether {@link WritableStreamDefaultWriter} has been closed or not. */
	closed: boolean
	/** Common headers to return in a Server Response. */
	headers: Headers

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
	 * 
	 * @property writable	— The `WritableStream<I>`.
	 * @property readable	— The `ReadableStream<O>`.
	 * @property writer		— The `WritableStreamDefaultWriter<I>` for writing to the stream.
	 * @property closed		— A boolean indicating whether the stream is closed.
	 * @property headers	— Common headers to return in a Server Response.
	 */
	constructor(
		transformer?		: Transformer<I, O>,
		writableStrategy?	: QueuingStrategy<I>,
		readableStrategy?	: QueuingStrategy<O>,
	)
	{
		super( transformer, writableStrategy, readableStrategy )

		this.writer		= this.writable.getWriter()
		this.closed		= false
		this.headers	= new Headers( {
			'Connection'		: 'keep-alive',
			'Transfer-Encoding'	: 'chunked',
			'Cache-Control'		: 'no-cache, no-transform',
			'X-Accel-Buffering'	: 'no',
			'Content-Encoding'	: 'none',
		} )
	}


	/**
	 * Writes data into the stream.
	 *
	 * @param chunk The data chunk to stream.
	 * @returns A promise that resolves when the data has been written.
	 */
	write( chunk: I )
	{
		return (
			this.writer.ready
				.then( () => this.writer.write( chunk ) )
				.then( () => this )
		)
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
	async close()
	{
		if ( this.closed || this.isClosing ) return this
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
	async abort( reason: string = 'Stream writer aborted.', options?: AbortErrorOptions )
	{
		if ( this.closed || this.isClosing ) return this

		this.isClosing = true

		try {
			await this.writer.abort( new AbortError( reason, options ) )
		} finally {
			this.closed		= true
			this.isClosing	= false
		}

		return this
	}
}