import { TextEncoder, TextDecoder } from 'util'
import { TransformStream, TransformStreamDefaultController } from 'stream/web'

Object.assign( global, { TextDecoder, TextEncoder, TransformStream, TransformStreamDefaultController } )