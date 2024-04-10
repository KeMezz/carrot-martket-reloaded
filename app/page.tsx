export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen p-5 bg-slate-400 dark:bg-black">
      <div className="w-full max-w-screen-sm p-5 bg-white rounded-md shadow-md dark:bg-slate-800 dark:text-white">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="-mb-1 font-semibold text-gray-600">
              In transit
            </span>
            <span className="text-4xl font-semibold">Coolblue</span>
          </div>
          <div className="bg-orange-400 rounded-full size-14" />
        </div>
        <div className="flex items-center gap-2 my-2">
          <span className="px-3 py-1.5 text-xs font-medium text-white uppercase bg-green-400 rounded-full transition hover:bg-green-600 hover:scale-125">
            today
          </span>
          <span>9:30-10:30u</span>
        </div>
        <div className="relative mb-3">
          <div className="w-full h-2 bg-gray-200 rounded-full" />
          <div className="absolute top-0 w-2/3 h-2 bg-green-400 rounded-full" />
        </div>
        <div className="flex items-center justify-between text-gray-600 dark:text-white">
          <span>Expected</span>
          <span>Sorting center</span>
          <span>In transit</span>
          <span className="text-gray-300 dark:text-gray-600">Delivered</span>
        </div>
      </div>
    </main>
  );
}
