"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatCurrency } from "@/lib/format";
import { StoreStatusBadge } from "./store-status-badge";
import type { StoreNetworkPoint } from "@/types/stores";

interface StoreNetworkMapInnerProps {
  stores: StoreNetworkPoint[];
  selectedStoreId: string | null;
  onSelectStore: (storeId: string) => void;
  onViewDetail: (storeId: string) => void;
  onSwitchStore?: (store: {
    id: string;
    name: string;
    code: string;
    city: string;
    state: string;
    region: string;
  }) => void;
}

// Glowing Pin Icon Generator matching legend
function createGlowMarkerIcon(
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE",
  isSelected: boolean
) {
  let colorBg = "bg-emerald-400";
  let ringBg = "bg-emerald-400/35";

  if (status === "MAINTENANCE") {
    colorBg = "bg-amber-400";
    ringBg = "bg-amber-400/35";
  } else if (status === "INACTIVE") {
    colorBg = "bg-[#0071DC]";
    ringBg = "bg-blue-400/35";
  } else {
    colorBg = "bg-emerald-400";
    ringBg = "bg-emerald-400/35";
  }

  const selectedClass = isSelected
    ? "scale-150 ring-4 ring-white ring-offset-2 ring-offset-slate-900 z-50"
    : "hover:scale-125";

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${selectedClass}">
      <span class="absolute w-6 h-6 rounded-full ${ringBg} animate-pulse"></span>
      <div class="w-3.5 h-3.5 rounded-full ${colorBg} border-2 border-white shadow-md"></div>
    </div>
  `;

  return L.divIcon({
    className: "store-glow-marker",
    html,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14]
  });
}

// Map Auto-Fitter & FlyTo
function MapController({
  stores,
  selectedStoreId
}: {
  stores: StoreNetworkPoint[];
  selectedStoreId: string | null;
}) {
  const map = useMap();
  const prevSelectedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const valid = stores.filter((s) => s.latitude != null && s.longitude != null);
    if (valid.length === 0) return;

    if (valid.length === 1 && valid[0].latitude != null && valid[0].longitude != null) {
      map.setView([valid[0].latitude, valid[0].longitude], 9);
      return;
    }

    const bounds = L.latLngBounds(
      valid.map((s) => [s.latitude as number, s.longitude as number])
    );
    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 11
    });
  }, [stores, map]);

  React.useEffect(() => {
    if (selectedStoreId && selectedStoreId !== prevSelectedRef.current) {
      const selected = stores.find((s) => s.id === selectedStoreId);
      if (selected && selected.latitude != null && selected.longitude != null) {
        map.flyTo([selected.latitude, selected.longitude], 10, {
          duration: 1.0
        });
      }
      prevSelectedRef.current = selectedStoreId;
    }
  }, [selectedStoreId, stores, map]);

  return null;
}

export default function StoreNetworkMapInner({
  stores,
  selectedStoreId,
  onSelectStore,
  onViewDetail,
  onSwitchStore
}: StoreNetworkMapInnerProps) {
  const mappedStores = React.useMemo(
    () => stores.filter((s) => s.latitude != null && s.longitude != null),
    [stores]
  );

  const defaultCenter: [number, number] = [21.5, 78.9];

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full z-0 [&_.leaflet-tile]:contrast-[1.08] [&_.leaflet-tile]:saturate-[1.32] [&_.leaflet-tile]:brightness-[0.98]"
        style={{ height: "100%", width: "100%", background: "#0b2545" }}
      >
        <ZoomControl position="bottomright" />

        {/* ESRI World Topographic tiles with Navy Blue (oceans), Green (parks/vegetation), Sand/Terrain (landmass) */}
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Esri, USGS, NOAA'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        />

        <MapController stores={stores} selectedStoreId={selectedStoreId} />

        {mappedStores.map((store) => {
          const isSelected = store.id === selectedStoreId;
          const icon = createGlowMarkerIcon(store.status, isSelected);

          return (
            <Marker
              key={store.id}
              position={[store.latitude as number, store.longitude as number]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectStore(store.id)
              }}
            >
              <Popup className="store-dark-popup">
                <div className="p-1 min-w-[210px] space-y-2 text-slate-900">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                    <span className="font-mono text-2xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {store.code}
                    </span>
                    <StoreStatusBadge status={store.status} size="sm" isNewThisYear={store.isNewThisYear} />
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">
                      {store.name}
                    </h4>
                    <p className="text-2xs text-slate-500 mt-0.5">
                      {store.city}, {store.state} {store.region ? `• ${store.region.name}` : ""}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl text-2xs">
                    <div>
                      <span className="text-slate-400 block font-medium">30D Sales</span>
                      <span className="font-bold text-slate-800 tabular-nums">
                        {formatCurrency(store.salesRevenue, true)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Inventory</span>
                      <span className="font-bold text-slate-800 tabular-nums">
                        {formatCurrency(store.inventoryValue, true)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(store.id);
                      }}
                      className="flex-1 py-1.5 px-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-2xs font-semibold text-center transition-colors shadow-xs cursor-pointer"
                    >
                      View Store
                    </button>
                    {onSwitchStore && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSwitchStore({
                            id: store.id,
                            name: store.name,
                            code: store.code,
                            city: store.city || "",
                            state: store.state || "",
                            region: store.region?.name || "General"
                          });
                        }}
                        className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-2xs font-semibold text-center transition-colors cursor-pointer"
                        title="Set as active store"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Blue and Green color atmospheric layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0071DC]/10 via-transparent to-[#10B981]/12 pointer-events-none z-[400]" />

      {/* Center watermark label matching reference design */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
        <span className="text-slate-800/30 font-bold text-sm tracking-wider uppercase select-none drop-shadow-xs">
          Store Network
        </span>
      </div>

      {/* Floating Liquid Glass Legend with Blue and Green Highlights */}
      <div className="absolute top-2.5 right-2.5 z-[1000] bg-slate-900/85 backdrop-blur-md border border-white/20 rounded-xl p-2.5 text-white shadow-xl pointer-events-auto space-y-1.5 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-xs ring-2 ring-emerald-400/40" />
          <span className="font-semibold text-white">Operational</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-xs ring-2 ring-amber-400/40" />
          <span className="font-semibold text-amber-200">Under Maint.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0071DC] shrink-0 shadow-xs ring-2 ring-blue-400/40" />
          <span className="font-semibold text-blue-200">Regional Hub</span>
        </div>
      </div>
    </div>
  );
}
