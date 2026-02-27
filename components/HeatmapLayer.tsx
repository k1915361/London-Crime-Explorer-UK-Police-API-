import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

// Force reload
interface HeatmapLayerProps {
  points: { lat: number; lng: number; intensity: number }[];
}

const HeatmapLayer = ({ points }: HeatmapLayerProps) => {
  const map = useMap();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!map || isReady) return;

    const checkSize = () => {
      const size = map.getSize();
      // Ensure the map has a valid size (height > 0) to prevent CanvasRenderingContext2D error
      if (size.x > 0 && size.y > 0) {
        setIsReady(true);
        map.off('resize', checkSize);
      }
    };

    checkSize();
    map.on('resize', checkSize);
    
    // Also force a size invalidation in case it's stuck
    const timeoutId = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      map.off('resize', checkSize);
      clearTimeout(timeoutId);
    };
  }, [map, isReady]);

  useEffect(() => {
    if (!map || !isReady || points.length === 0) return;

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
  }, [map, isReady, points]);

  return null; // This component does not render any DOM elements itself
};

export default HeatmapLayer;
