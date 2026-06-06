import type { RegionData } from '../data/svgMapData';

type MapRegionProps = {
    region: RegionData;
    onMouseEnter: (region: RegionData) => void;
    onClick: (region: RegionData) => void;
    onMouseLeave: () => void;
}

export default function MapRegion({ region, onMouseEnter, onMouseLeave }: MapRegionProps) {
    return (
        <g key={region.id} className={`region ${region.isActive ? 'active' : ''}`}>
            <path
                d={region.path}
                onMouseEnter={() => onMouseEnter(region)}
                onClick={() => onMouseEnter(region)}
                onMouseLeave={onMouseLeave}
            />
        </g>
    );
}
