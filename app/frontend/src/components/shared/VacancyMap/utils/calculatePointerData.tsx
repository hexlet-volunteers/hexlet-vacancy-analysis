import type { Pointer, RegionData } from '../data/svgMapData';
import { getTextWidth } from './textMeasure';
// @ts-expect-error getPathLookup returns a path helper with getBBox method
import { getPathLookup } from 'svg-getpointatlength';

const FONT_SIZE = 20;

// Получаем параметры указателя карты
export default function calculatePointerData(
    region: RegionData,
    scale: number = 1,
    fontSize: number = FONT_SIZE,
): Pointer | null {
    if (!region.totalVacancies) return null;

    const lookup = getPathLookup(region.path);
    const { x, y, width, height } = lookup.getBBox();
// Уменьшаем указатель при приближении карты в зависимости от размера шрифта
    const scaledFont = Math.floor(fontSize * scale);
    const text = String(region.totalVacancies);
    const textLength = getTextWidth(text, { size: scaledFont });

    const pointPadding = scaledFont * 0.5;
    const pointMargin = 5;
    const radius = textLength * 0.5 + pointPadding;
    const diameter = radius * 2;

    const halfHeight = height * 0.5;
    const halfWidth = width * 0.5;

    const pointerInRegion =
        height > diameter + pointMargin && width > diameter + pointMargin;
    const offsetY = pointerInRegion ? 0 : halfHeight + radius;

    return {
        pos: { x: x + halfWidth, y: y + halfHeight - offsetY },
        text,
        textSize: scaledFont,
        radius,
    };
}