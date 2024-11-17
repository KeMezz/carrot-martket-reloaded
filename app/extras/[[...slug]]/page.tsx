import HackedComponent from "@/components/hacked-component";
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from "react";

async function getData() {
  const keys = {
    apiKey: "124124",
    secret: "0ewoijfaowe",
  };
  // experimental_taintObjectReference("API Keys were leaked!", keys);
  // experimental_taintUniqueValue("Secret key was exposed", keys, keys.secret);

  return keys;
}

export default async function Extra() {
  const data = await getData();
  return (
    <div className="p-4">
      <h1 className="font-bold text-4xl font-rubik">Extras!</h1>
      <HackedComponent data={data} />
    </div>
  );
}
