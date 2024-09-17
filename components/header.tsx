import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function Header() {
  return (
    <header className="flex items-center px-4 dark:bg-neutral-800 h-14 shadow-lg">
      <div className="">
        <ArrowLeftIcon className="size-6" />
      </div>
    </header>
  );
}
