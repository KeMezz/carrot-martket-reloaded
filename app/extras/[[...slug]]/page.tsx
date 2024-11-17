import { revalidatePath } from "next/cache";

async function getData() {
  const data = await fetch(
    "https://nomad-movies.nomadcoders.workers.dev/movies"
  );
}

export default async function Extra({
  params,
}: {
  params: { slug: string[] };
}) {
  await getData();
  const action = async () => {
    "use server";
    revalidatePath("/extras");
  };
  return (
    <div className="p-4">
      <h1 className="font-bold text-4xl font-rubik">Extras!</h1>
      <form action={action}>
        <button>revalidate</button>
      </form>
    </div>
  );
}
