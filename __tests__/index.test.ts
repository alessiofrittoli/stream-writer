import { Stream } from '@/index'
import { ErrorCode } from '@alessiofrittoli/exception/code'
import { StreamReader } from '@alessiofrittoli/stream-reader'


describe( 'Stream', () => {
	let stream: Stream

	beforeEach( () => {
		stream = new Stream()
	} )

	it( 'initializes with default headers', async () => {
		expect( stream.headers ).toEqual( new Headers( {
			'Connection'		: 'keep-alive',
			'Transfer-Encoding'	: 'chunked',
			'Cache-Control'		: 'no-cache, no-transform',
			'X-Accel-Buffering'	: 'no',
			'Content-Encoding'	: 'none',
		} ) )
	} )


	it( 'accepts a custom transformer', async () => {
		const encoder = new TextEncoder()
		const transform = jest.fn( ( chunk, controller ) => {
			controller.enqueue( encoder.encode( JSON.stringify( chunk ) ) )
		} )
		const stream = new Stream<{ message: string }, Uint8Array>( { transform } )

		const streamData = async () => {
			await stream.write( { message: 'somedata' } )
			await new Promise( resolve => setTimeout( resolve, 50 ) )
			await stream.write( { message: 'somedata 2' } )
		}

		streamData()
			.then( () => stream.close() )
		
		const chunks = await new StreamReader( stream.readable ).read()

		expect( transform )
			.toHaveBeenCalledWith( expect.any( Object ), expect.any( TransformStreamDefaultController ) )
		
		expect( chunks ).toEqual( [
			encoder.encode( JSON.stringify( { message: 'somedata' } ) ),
			encoder.encode( JSON.stringify( { message: 'somedata 2' } ) ),
		] )
	} )

} )


describe( 'Stream.write()', () => {
	let stream: Stream

	beforeEach( () => {
		stream = new Stream()
	} )

	it( 'writes data into the stream', () => {
		stream.write( 'some data' )
			.then( () => stream.close() )

		expect( new StreamReader( stream.readable ).read() )
			.resolves.toEqual( [ 'some data' ] )
			
	} )
} )


describe( 'Stream.close()', () => {
	let stream: Stream

	beforeEach( () => {
		stream = new Stream()
	} )


	it( 'closes the stream and release thw writer lock', async () => {
		const closeSpy		= jest.spyOn( stream.writer, 'close' )
		const releaseSpy	= jest.spyOn( stream.writer, 'releaseLock' )

		await stream.close()

		expect( stream.closed ).toBe( true )
		expect( closeSpy ).toHaveBeenCalled()
		expect( releaseSpy ).toHaveBeenCalled()
	} )


	it( 'closes the stream once even if called multiple times', async () => {
		const closeSpy		= jest.spyOn( stream.writer, 'close' )
		const releaseSpy	= jest.spyOn( stream.writer, 'releaseLock' )

		await ( async () => {
			stream.close()
			expect( stream[ 'isClosing' ] ).toBe( true )
			await stream.close()
			await stream.close()
			await stream.close()
			await stream.close()
		} )()

		expect( stream.closed ).toBe( true )
		expect( stream[ 'isClosing' ] ).toBe( false )
		expect( closeSpy ).toHaveBeenCalledTimes( 1 )
		expect( releaseSpy ).toHaveBeenCalledTimes( 1 )
	} )

} )


describe( 'Stream.abort()', () => {

	let stream: Stream

	beforeEach( () => {
		stream = new Stream()
	} )


	it( 'set `Stream.closed` to `true`', async () => {

		await stream.abort()
		expect( stream.closed ).toBe( true )

	} )


	it( 'calls `Stream.writer.abort()` with a default reason', async () => {

		const abortSpy	= jest.spyOn( stream.writer, 'abort' )
		const abortObj	= {
			name	: 'AbortError',
			message	: 'Stream writer aborted.',
			code	: ErrorCode.ABORT,
		}

		await stream.abort()

		expect( abortSpy )
			.toHaveBeenCalledWith(
				expect.objectContaining( abortObj )
			)
		
	} )


	it( 'calls `Stream.writer.abort()` with a custom reason', async () => {

		const abortSpy	= jest.spyOn( stream.writer, 'abort' )
		const reason	= 'Custom abort reason'
		const abortObj	= {
			name	: 'AbortError',
			message	: reason,
			code	: ErrorCode.ABORT,
		}

		await stream.abort( reason )

		expect( abortSpy )
			.toHaveBeenCalledWith(
				expect.objectContaining( abortObj )
			)
		
	} )


	it( 'aborts the stream once even if called multiple times', async () => {

		const abortSpy = jest.spyOn( stream.writer, 'abort' )
		const abortObj = {
			name	: 'AbortError',
			message	: 'Stream writer aborted.',
			code	: ErrorCode.ABORT,
		}

		const streamData = async () => {
			stream.abort()
			expect( stream[ 'isClosing' ] ).toBe( true )
			await stream.abort()
			await stream.abort()
			await stream.abort()
			await stream.abort()
			// the next `stream.write` will throw the abort reason caught in the next `catch` block.
			await stream.write( 'Trying to write after aborting.' )
		}

		await (
			streamData()
				.catch( error => {
					expect( error ).toStrictEqual( expect.objectContaining( abortObj ) )
				} )
		)

		expect( stream.closed ).toBe( true )
		expect( stream[ 'isClosing' ] ).toBe( false )
		expect( abortSpy ).toHaveBeenCalledTimes( 1 )
		expect( abortSpy ).toHaveBeenCalledWith( expect.objectContaining( abortObj ) )

	} )


	it( 'accepts custom AbortError options', async () => {

		const abortSpy	= jest.spyOn( stream.writer, 'abort' )
		const reason	= 'Custom abort reason'
		const abortObj	= {
			name	: 'AbortError',
			message	: reason,
			code	: ErrorCode.EXPIRED,
		}

		await stream.abort( reason, { code: ErrorCode.EXPIRED } )

		expect( abortSpy )
			.toHaveBeenCalledWith(
				expect.objectContaining( abortObj )
			)
		
	} )

} )