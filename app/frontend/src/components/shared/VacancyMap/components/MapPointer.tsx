import type { RegionData } from '../data/svgMapData';

type MapPointerProps = {
    region: RegionData;
    onMouseEnter: (region: RegionData) => void;
    onClick: (region: RegionData) => void;
    onMouseLeave: () => void;
}

export default function MapPointer({ region, onMouseEnter, onMouseLeave }: MapPointerProps) {
    if (!region.pointer) return null;
    return (
        <g
            key={`${region.id}-pointer`}
            className={`pointer ${region.isActive ? 'active' : ''}`}
            transform={`translate(${region.pointer.pos.x}, ${region.pointer.pos.y})`}
            onMouseEnter={() => onMouseEnter(region)}
            onClick={() => onMouseEnter(region)}
            onMouseLeave={onMouseLeave}
        >
            <circle className="pointer-circle" r={region.pointer.radius} />
            <text
                className="pointer-text"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: region.pointer.textSize }}
            >
                {region.pointer.text}
            </text>
        </g>
    );
}