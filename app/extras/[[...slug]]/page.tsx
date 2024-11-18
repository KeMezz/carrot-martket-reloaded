import HackedComponent from "@/components/hacked-component";
import Image from "next/image";
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from "react";
import heavyImage from "@/public/DSCF8565.jpeg";

async function getData() {
  const keys = {
    apiKey: "124124",
    secret: "0ewoijfaowe",
  };
  experimental_taintObjectReference("API Keys were leaked!", keys);
  experimental_taintUniqueValue("Secret key was exposed", keys, keys.secret);

  return keys;
}

export default async function Extra() {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold font-rubik">Extras!</h1>
      <Image src={heavyImage} alt="profile" placeholder="blur" />
      {/* <HackedComponent data={data} /> */}
    </div>
  );
}
