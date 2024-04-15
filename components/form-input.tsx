import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

interface FormInputProps {
  type: string;
  name: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
}

export default function FormInput({
  type,
  name,
  placeholder,
  required,
  errors = [],
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-500"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
      {errors?.length ? (
        <div className="flex flex-col gap-2">
          {errors.map((error, i) => (
            <span
              key={i}
              className="text-red-500 font-medium flex items-center gap-2 text-sm"
            >
              <ExclamationTriangleIcon className="size-4 mt-[0.5px]" />
              {error}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
