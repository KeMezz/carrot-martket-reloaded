"use server";

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: Number(formData.get("price")),
    description: formData.get("description"),
  };

  console.log(data);
}
