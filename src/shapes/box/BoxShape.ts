import type { FSBaseShape } from "../FSShapeUtil"

export interface BoxShape extends FSBaseShape {
  type: 'box'
  size: number[]
}
