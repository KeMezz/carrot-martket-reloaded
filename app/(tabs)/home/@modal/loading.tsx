import Spinner from "@/components/loading-spinner";

export default function ModalLoading() {
  return (
    <>
      <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center z-10">
        <Spinner />
      </div>
      <div className="absolute top-0 left-0 bg-black w-full h-full opacity-30 z-0" />
    </>
  );
}
