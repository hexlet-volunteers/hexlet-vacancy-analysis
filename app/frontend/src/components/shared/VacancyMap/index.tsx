import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Map.css';

import { Tooltip } from '@mantine/core';
import MapPointer from './components/MapPointer';
import MapRegion from './components/MapRegion';
import { ZoomControls } from './components/ZoomControls';
import { REGIONS_DATA, type RegionData } from './data/svgMapData';
import calculatePointerData from './utils/calculatePointerData';
import mathRound10 from './utils/mathRandom10';
import type { MapData } from './types/VacancyMap';



const MAP_WIDTH = 1280;
const MAP_HEIGHT = 760;
const INITIAL_VIEW_BOX = { x: 0, y: 0, width: 1220, height: 860 };
const SCALE_FACTOR = .1;
const MIN_SCALE = .1;
const MAX_SCALE = 1;


type TooltipPosition = {
  x: number;
  y: number;
}

type VacancyMapProps = {
  mapData: MapData[] | undefined;
}


export default function VacancyMap({ mapData }: VacancyMapProps) {
  const [regions, setRegions] = useState<RegionData[]>(() =>
    REGIONS_DATA.map((r) => ({ ...r, pointer: null })),
  );
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(
    null,
  );
  const [mousePos, setMousePos] = useState<TooltipPosition>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);


  // Загрузка данных о вакансиях
  useEffect(() => {

    function loadVacancies() {
      if (!mapData) {
        setError('Нет вакансий для загрузки')
        return
      }
      const regionsMap = new Map(mapData.map(region => [String(region.region_id), region]))

      const updatedRegions = regions.map(item => {
        const region = regionsMap.get(String(item.id))
        if (!region) return item
        const totalVacancies = region.totalVacancies
        const pointer = calculatePointerData({ ...item, totalVacancies })
        return { ...item, pointer, totalVacancies }
      })
      setRegions(updatedRegions);
      setIsLoading(false);
      setError(null)
    }

    loadVacancies()
  }, []);


  // Обработчики мыши
  const handleMouseEnter = useCallback((region: RegionData) => {
    setHoveredRegion({ ...region, isActive: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredRegion(null);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  // Zoom контролы
  const handleZoomIn = useCallback(() => {
    setScale((prev) => mathRound10(prev - SCALE_FACTOR, -1));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => mathRound10(prev + SCALE_FACTOR, -1));
  }, []);

  const regionsWithPointers = useMemo(() => {
    const mapRegions: React.ReactNode[] = [];
    const mapPointers: React.ReactNode[] = [];

    for (const region of regions) {
      const pointer = region.totalVacancies ? calculatePointerData(region, scale) : null;
      const regionWithPointer: RegionData = { ...region, pointer };

      mapRegions.push(
        <MapRegion
          key={region.id}
          region={regionWithPointer}
          onMouseEnter={handleMouseEnter}
          onClick={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />,
      );

      if (pointer) {
        mapPointers.push(
          <MapPointer
            key={`${region.id}-pointer`}
            region={regionWithPointer}
            onMouseEnter={handleMouseEnter}
            onClick={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />,
        );
      }
    }

    return [...mapRegions, ...mapPointers];
  }, [regions, scale, handleMouseEnter, handleMouseLeave]);

  return (
    <div className="map-container">
      {isLoading && <div className="map-loading">Загрузка данных...</div>}
      {error && <div className="map-error">{error}</div>}

      <svg
        ref={svgRef}
        className="map-svg"
        width={MAP_WIDTH / scale}
        height={MAP_HEIGHT / scale}
        viewBox={`${INITIAL_VIEW_BOX.x} ${INITIAL_VIEW_BOX.y} ${INITIAL_VIEW_BOX.width} ${INITIAL_VIEW_BOX.height}`}
        onMouseMove={handleMouseMove}
      >
        {regionsWithPointers}

        {hoveredRegion && (
          <>
            <MapRegion
              key={`${hoveredRegion.id}-hovered`}
              region={hoveredRegion}
              onMouseEnter={handleMouseEnter}
              onClick={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <MapPointer
              key={`${hoveredRegion.id}-hovered-pointer`}
              region={hoveredRegion}
              onMouseEnter={handleMouseEnter}
              onClick={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </>
        )}
      </svg>

      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        canZoomOut={scale < MAX_SCALE}
        canZoomIn={scale > MIN_SCALE}
      />

      {hoveredRegion && (
        <Tooltip
          position="top"
          opened
          label={hoveredRegion.name}
          offset={{ mainAxis: 40, crossAxis: 70 }}
        >
          <div
            className='map-tooltip'
            style={{
              left: mousePos.x,
              top: mousePos.y,
            }}
          >
          </div>
        </Tooltip>
      )}
    </div>
  );
}
