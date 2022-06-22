import type { FSBaseShape } from "../FSShapeUtil"

export interface PencilShape extends FSBaseShape {
  type: 'pencil'
  points: number[][]
}
