export enum SizeStyle {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
}


export enum ColorStyle {
    White = 'white',
    LightGray = 'lightGray',
    Gray = 'gray',
    Black = 'black',
    Green = 'green',
    Cyan = 'cyan',
    Blue = 'blue',
    Indigo = 'indigo',
    Violet = 'violet',
    Red = 'red',
    Orange = 'orange',
    Yellow = 'yellow',
}

export enum DashStyle {
    Draw = 'draw',
    Solid = 'solid',
    Dashed = 'dashed',
    Dotted = 'dotted',
  }


export enum FontStyle {
    Script = 'script',
    Sans = 'sans',
    Serif = 'erif',
    Mono = 'mono',
  }

export enum AlignStyle {
    Start = 'start',
    Middle = 'middle',
    End = 'end',
    Justify = 'justify',
  }

export type ShapeStyles = {
  color: ColorStyle;
  size: SizeStyle;
  dash: DashStyle;
  font?: FontStyle;
  textAlign?: AlignStyle;
  isFilled?: boolean;
  scale?: number;
};

const fontFaces = {
  [FontStyle.Script]: '"Caveat Brush"',
  [FontStyle.Sans]: '"Source Sans Pro"',
  [FontStyle.Serif]: '"Crimson Pro"',
  [FontStyle.Mono]: '"Source Code Pro"',
}


export function getFontFace(font: FontStyle = FontStyle.Script): string {
  return fontFaces[font]
}

const fontSizes = {
  [SizeStyle.Small]: 28,
  [SizeStyle.Medium]: 48,
  [SizeStyle.Large]: 96,
  auto: 'auto',
}

const fontSizeModifiers = {
  [FontStyle.Script]: 1,
  [FontStyle.Sans]: 1,
  [FontStyle.Serif]: 1,
  [FontStyle.Mono]: 1,
}

export function getFontSize(size: SizeStyle, fontStyle: FontStyle = FontStyle.Script): number {
  return fontSizes[size] * fontSizeModifiers[fontStyle]
}

export const defaultStyle: ShapeStyles = {
  color: ColorStyle.Black,
  size: SizeStyle.Small,
  isFilled: false,
  dash: DashStyle.Draw,
  scale: 1,
}

export const defaultTextStyle: ShapeStyles = {
  ...defaultStyle,
  font: FontStyle.Script,
  textAlign: AlignStyle.Middle,
}