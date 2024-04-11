export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen p-5 bg-gray-300 sm:bg-red-400 md:bg-emerald-400 lg:bg-slate-400 xl:bg-pink-400">
      <div className="flex flex-col w-full max-w-screen-sm gap-4 p-5 bg-white shadow-lg md:flex-row rounded-2xl">
        <input
          className="w-full h-12 px-5 py-2 transition-shadow bg-gray-200 rounded-full outline-none ring ring-transparent focus:ring-orange-300 ring-offset-1 placeholder:drop-shadow-sm"
          type="text"
          placeholder="Search here..."
        />
        <button className="py-2 font-medium text-white transition-transform bg-black rounded-full outline-none active:scale-90 md:px-10">
          Search
        </button>
      </div>
    </main>
  );
}
