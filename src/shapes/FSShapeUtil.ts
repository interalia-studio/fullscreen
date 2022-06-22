import { TLBounds, TLShape, TLShapeUtil } from '@tldraw/core'
import { ShapeStyles } from './shared/shape-styles'

export interface FSBaseShape extends TLShape {
  style: ShapeStyles
}

export abstract class FSShapeUtil<
  T extends FSBaseShape,
  E extends Element = Element
> extends TLShapeUtil<T, E> {
  /* ----------------- Custom Methods ----------------- */

  canBind = false

  hideBounds = false

  abstract getCenter: (shape: T) => number[]

  abstract getShape: (shape: Partial<T>) => T

  abstract transform: (shape: T, bounds: TLBounds, initialShape: T, scale: number[]) => void

  abstract hitTestPoint: (shape: T, point: number[]) => boolean

  abstract hitTestLineSegment: (shape: T, A: number[], B: number[]) => boolean
}
