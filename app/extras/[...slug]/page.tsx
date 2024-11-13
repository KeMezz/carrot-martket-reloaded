export default function Extra({ params }: { params: { slug: string[] } }) {
  console.log(params.slug);
  return (
    <div className="p-4">
      <h1 className="font-bold text-4xl font-rubik">Extras!</h1>
    </div>
  );
}
