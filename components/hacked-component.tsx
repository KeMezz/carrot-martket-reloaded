"use client";

import { fetchFromAPI } from "@/app/extras/action";

export default function HackedComponent({ data }: { data: any }) {
  fetchFromAPI();

  return <div>hacked!</div>;
}
