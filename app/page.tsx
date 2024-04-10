export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen p-5 bg-gray-300 ">
      <div className="flex flex-col w-full max-w-screen-sm gap-4 p-5 bg-white shadow-lg rounded-2xl">
        <input
          className="w-full h-12 px-5 py-2 transition-shadow bg-gray-200 rounded-full outline-none ring ring-transparent focus:ring-orange-300 focus:ring-offset-1 placeholder:drop-shadow-sm"
          type="text"
          placeholder="Search here..."
        />
        <button className="py-2 font-medium text-white transition-transform bg-black rounded-full outline-none active:scale-90">
          Search
        </button>
      </div>
    </main>
  );
}
