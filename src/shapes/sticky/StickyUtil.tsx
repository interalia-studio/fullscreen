/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import { TLShapeUtil, SVGContainer } from '@tldraw/core'
import { TextAreaUtils } from '~/src/lib/TextAreaUtils'
import { getBoundsRectangle } from '~/src/lib/getBoundsRectange'
import { Utils, HTMLContainer, TLBounds } from '@tldraw/core'
import { GHOSTED_OPACITY } from '~/src/state/constants'

import { styled } from "~/src/theme";
import { getTextSvgElement } from '../shared/getTextSvgElement'
import { defaultTextStyle, AlignStyle, SizeStyle, ShapeStyles, ColorStyle } from '../shared/shape-styles'
import { StickyShape } from './StickyShape';
import { FSShapeUtil } from "~/src/shapes/FSShapeUtil";
import { stopPropagation } from '~/src/components/stopPropagation'


type T = StickyShape
type E = HTMLDivElement

const fixNewLines = /\r?\n|\r/g

function normalizeText(text: string) {
  return text
    .replace(fixNewLines, '\n')
    .split('\n')
    .map((x) => x || ' ')
    .join('\n')
}

const stickyFontSizes = {
  [SizeStyle.Small]: 24,
  [SizeStyle.Medium]: 36,
  [SizeStyle.Large]: 48,
  auto: 'auto',
}

export function getStickyFontSize(size: SizeStyle): number {
  return stickyFontSizes[size]
}


export function getStickyFontStyle(style: ShapeStyles): string {
  const fontSize = getStickyFontSize(style.size)
  const fontFace = "Caveat Brush"
  const { scale = 1 } = style

  return `${fontSize * scale}px/1 ${fontFace}`
}

export function getStickyShapeStyle(style: ShapeStyles, isDarkMode = false) {
  const { color } = style

  const theme = 'light'
  const adjustedColor =
    color === ColorStyle.White || color === ColorStyle.Black ? ColorStyle.Yellow : color

  return {
    fill: adjustedColor,
    stroke: adjustedColor,
    color: '#0d0d0d',
  }
}

export class StickyUtil extends FSShapeUtil<T, E> {
  type = 'sticky' as const

  canBind = true

  canEdit = true

  canClone = true

  hideResizeHandles = true

  showCloneHandles = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: 'sticky',
        name: 'Sticky',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [200, 200],
        text: '',
        rotation: 0,
        style: defaultTextStyle,
      },
      props
    )
  }

  Component = TLShapeUtil.Component<T, E>(
    ({ shape, meta, events, isGhost, isBinding, isEditing, onShapeBlur, onShapeChange }, ref) => {
      const font = getStickyFontStyle(shape.style)

      const { color, fill } = getStickyShapeStyle(shape.style, meta.isDarkMode)

      const rContainer = React.useRef<HTMLDivElement>(null)

      const rTextArea = React.useRef<HTMLTextAreaElement>(null)

      const rText = React.useRef<HTMLDivElement>(null)

      const rIsMounted = React.useRef(false)

      const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
        e.stopPropagation()
      }, [])

      const onChange = React.useCallback(
        (text: string) => {
          onShapeChange?.({
            id: shape.id,
            type: shape.type,
            text: normalizeText(text), 
          })
        },
        [shape.id]
      )

      const handleTextChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(e.currentTarget.value)
        },
        [onShapeChange, onChange]
      )

      const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Escape') return

          if (e.key === 'Tab' && shape.text.length === 0) {
            e.preventDefault()
            return
          }

          if (!(e.key === 'Meta' || e.metaKey)) {
            e.stopPropagation()
          } else if (e.key === 'z' && e.metaKey) {
            if (e.shiftKey) {
              document.execCommand('redo', false)
            } else {
              document.execCommand('undo', false)
            }
            e.stopPropagation()
            e.preventDefault()
            return
          }

          if (e.key === 'Tab') {
            e.preventDefault()
            if (e.shiftKey) {
              TextAreaUtils.unindent(e.currentTarget)
            } else {
              TextAreaUtils.indent(e.currentTarget)
            }

            onShapeChange?.({ ...shape, text: normalizeText(e.currentTarget.value) })
          }
        },
        [shape, onShapeChange]
      )

      const handleBlur = React.useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
        e.currentTarget.setSelectionRange(0, 0)
        onShapeBlur?.()
      }, [])

      const handleFocus = React.useCallback(
        (e: React.FocusEvent<HTMLTextAreaElement>) => {
          if (!isEditing) return
          if (!rIsMounted.current) return
          e.currentTarget.select()
        },
        [isEditing]
      )

      // Focus when editing changes to true
      React.useEffect(() => {
        if (isEditing) {
          rIsMounted.current = true
          const elm = rTextArea.current!
          elm.focus()
          elm.select()
        }
      }, [isEditing])

      // Resize to fit text
      React.useEffect(() => {
        const text = rText.current!

        const { size } = shape
        const { offsetHeight: currTextHeight } = text
        const minTextHeight = MIN_CONTAINER_HEIGHT - PADDING * 2
        const prevTextHeight = size[1] - PADDING * 2

        // Same size? We can quit here
        if (currTextHeight === prevTextHeight) return

        if (currTextHeight > minTextHeight) {
          // Snap the size to the text content if the text only when the
          // text is larger than the minimum text height.
          onShapeChange?.({ id: shape.id, size: [size[0], currTextHeight + PADDING * 2] })
          return
        }

        if (currTextHeight < minTextHeight && size[1] > MIN_CONTAINER_HEIGHT) {
          // If we're smaller than the minimum height and the container
          // is too tall, snap it down to the minimum container height
          onShapeChange?.({ id: shape.id, size: [size[0], MIN_CONTAINER_HEIGHT] })
          return
        }

        const textarea = rTextArea.current
        textarea?.focus()
      }, [shape.text, shape.size[1], shape.style])

      const style = {
        font,
        color,
        textShadow: meta.isDarkMode
          ? `0.5px 0.5px 2px rgba(255, 255, 255,.25)`
          : `0.5px 0.5px 2px rgba(255, 255, 255,.5)`,
      }

      return (
        <HTMLContainer ref={ref} {...events}>
          <StyledStickyContainer
            ref={rContainer}
            isDarkMode={meta.isDarkMode}
            isGhost={isGhost}
            style={{ backgroundColor: fill, ...style }}
          >
            <StyledText ref={rText} isEditing={isEditing} alignment={shape.style.textAlign}>
              {shape.text}&#8203;
            </StyledText>
            {isEditing && (
              <StyledTextArea
                ref={rTextArea}
                onPointerDown={handlePointerDown}
                value={shape.text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                tabIndex={-1}
                autoComplete="false"
                autoCapitalize="false"
                autoCorrect="false"
                autoSave="false"
                autoFocus
                spellCheck={true}
                alignment={shape.style.textAlign}
                onContextMenu={stopPropagation}
                onCopy={stopPropagation}
                onPaste={stopPropagation}
                onCut={stopPropagation}
              />
            )}
          </StyledStickyContainer>
        </HTMLContainer>
      )
    }
  )

  Indicator = TLShapeUtil.Indicator<T>(({ shape }) => {
    const {
      size: [width, height],
    } = shape

    return (
      <rect x={0} y={0} rx={3} ry={3} width={Math.max(1, width)} height={Math.max(1, height)} />
    )
  })

  getBounds = (shape: T) => {
    return getBoundsRectangle(shape, this.boundsCache)
  }

  shouldRender = (prev: T, next: T) => {
    return next.size !== prev.size || next.style !== prev.style || next.text !== prev.text
  }

  transformSingle = (shape: T): Partial<T> => {
    return shape
  }

  getSvgElement = (shape: T, isDarkMode: boolean): SVGElement | void => {
    const bounds = this.getBounds(shape)
    const textBounds = Utils.expandBounds(bounds, -PADDING)
    const textElm = getTextSvgElement(shape.text, shape.style, textBounds)
    const style = getStickyShapeStyle(shape.style, isDarkMode)
    textElm.setAttribute('fill', style.color)
    textElm.setAttribute('transform', `translate(${PADDING}, ${PADDING})`)

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('width', bounds.width + '')
    rect.setAttribute('height', bounds.height + '')
    rect.setAttribute('fill', style.fill)
    rect.setAttribute('rx', '3')
    rect.setAttribute('ry', '3')

    g.appendChild(rect)
    g.appendChild(textElm)

    return g
  }
}

/* -------------------------------------------------- */
/*                       Helpers                      */
/* -------------------------------------------------- */

const PADDING = 16
const MIN_CONTAINER_HEIGHT = 200

const StyledStickyContainer = styled('div', {
  pointerEvents: 'all',
  position: 'relative',
  backgroundColor: 'rgba(255, 220, 100)',
  fontFamily: 'sans-serif',
  height: '100%',
  width: '100%',
  padding: PADDING + 'px',
  borderRadius: '3px',
  perspective: '800px',
  variants: {
    isGhost: {
      false: { opacity: 1 },
      true: { transition: 'opacity .2s', opacity: GHOSTED_OPACITY },
    },
    isDarkMode: {
      true: {
        boxShadow:
          '2px 3px 12px -2px rgba(0,0,0,.3), 1px 1px 4px rgba(0,0,0,.3), 1px 1px 2px rgba(0,0,0,.3)',
      },
      false: {
        boxShadow:
          '2px 3px 12px -2px rgba(0,0,0,.2), 1px 1px 4px rgba(0,0,0,.16),  1px 1px 2px rgba(0,0,0,.16)',
      },
    },
  },
})

const commonTextWrapping = {
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
}

const StyledText = styled('div', {
  position: 'absolute',
  top: PADDING,
  left: PADDING,
  width: `calc(100% - ${PADDING * 2}px)`,
  height: 'fit-content',
  font: 'inherit',
  pointerEvents: 'none',
  userSelect: 'none',
  variants: {
    isEditing: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 1,
      },
    },
    alignment: {
      [AlignStyle.Start]: {
        textAlign: 'left',
      },
      [AlignStyle.Middle]: {
        textAlign: 'center',
      },
      [AlignStyle.End]: {
        textAlign: 'right',
      },
      [AlignStyle.Justify]: {
        textAlign: 'justify',
      },
    },
  },
  ...commonTextWrapping,
})

const StyledTextArea = styled('textarea', {
  width: '100%',
  height: '100%',
  border: 'none',
  overflow: 'hidden',
  background: 'none',
  outline: 'none',
  textAlign: 'left',
  font: 'inherit',
  padding: 0,
  color: 'transparent',
  verticalAlign: 'top',
  resize: 'none',
  caretColor: 'black',
  ...commonTextWrapping,
  variants: {
    alignment: {
      [AlignStyle.Start]: {
        textAlign: 'left',
      },
      [AlignStyle.Middle]: {
        textAlign: 'center',
      },
      [AlignStyle.End]: {
        textAlign: 'right',
      },
      [AlignStyle.Justify]: {
        textAlign: 'justify',
      },
    },
  },
  '&:focus': {
    outline: 'none',
    border: 'none',
  },
})