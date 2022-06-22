import type { FSBaseShape } from "../FSShapeUtil"

// The shape created by the sticky tool
export interface StickyShape extends FSBaseShape {
    type: 'sticky',
    size: number[]
    text: string
  }
  