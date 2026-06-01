import VacancyMap from "../shared/VacancyMap";
import type { MapData } from "../shared/VacancyMap/types/VacancyMap";


type MapPageProps = {
  mapData: MapData[];
}

const MapPage = ({ mapData }: MapPageProps) => {
  return (
    <VacancyMap mapData={mapData} />
  );
};

export default MapPage;
