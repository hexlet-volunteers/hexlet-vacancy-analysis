/**
 * Измеряет ширину текста с использованием Canvas API.
 * Кэширует canvas элемент для производительности.
 */
const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;

type TextMeasureOptions = {
  size?: number;
  family?: string;
}

export function getTextWidth(
  text: string,
  { size = 10, family = 'arial' }: TextMeasureOptions = {}
): number {
  if (!canvas) return text.length * size;

  const context = canvas.getContext('2d');
  if (!context) return text.length * size;

  context.font = `${size}px ${family}`;
  return context.measureText(text).width;
}
