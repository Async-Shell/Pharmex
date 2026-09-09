export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-sage border-t-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
