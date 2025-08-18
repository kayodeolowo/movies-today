export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent absolute top-0 left-0 animate-spin"></div>
      </div>
    </div>
  );
}