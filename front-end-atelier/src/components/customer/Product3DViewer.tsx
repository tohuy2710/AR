import '@google/model-viewer';

type Product3DViewerProps = {
  modelUrl: string;
  productName: string;
  posterUrl?: string;
};

export default function Product3DViewer({
  modelUrl,
  productName,
  posterUrl,
}: Product3DViewerProps) {
  return (
    <div className="w-full rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Atelier 360 View
          </p>
          <h3 className="text-lg font-semibold">Interactive 3D Preview</h3>
        </div>
        <p className="text-xs text-gray-500">Rotate, zoom in, and zoom out</p>
      </div>

      <model-viewer
        src={modelUrl}
        poster={posterUrl}
        alt={productName}
        camera-controls
        auto-rotate
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1"
        exposure="1"
        environment-image="neutral"
        style={{
          width: '100%',
          height: '560px',
          backgroundColor: '#f7f4ef',
          borderRadius: '16px',
        }}
      />
    </div>
  );
}
