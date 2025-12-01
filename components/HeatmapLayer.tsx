import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

interface HeatmapLayerProps {
  points: { lat: number; lng: number; intensity: number }[];
}

const HeatmapLayer = ({ points }: HeatmapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // The leaflet.heat library expects an array of [lat, lng, intensity]
    const latLngIntensity: [number, number, number][] = points.map(p => [p.lat, p.lng, p.intensity]);
    
    const heatLayer = (L as any).heatLayer(latLngIntensity, {
        radius: 25,
        blur: 15,
        maxZoom: 18,
        gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
    }).addTo(map);

    // Cleanup function to remove the layer when the component unmounts or points change
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null; // This component does not render any DOM elements itself
};

export default HeatmapLayer;
