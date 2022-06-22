import type { FSBaseShape } from "../FSShapeUtil"

export interface ArrowShape extends FSBaseShape {
  type: 'arrow'
  handles: {
    start: {
      id: 'start'
      index: number
      point: number[]
    }
    end: {
      id: 'end'
      index: number
      point: number[]
    }
  }
}
