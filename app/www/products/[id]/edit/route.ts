import db from "@/lib/db";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";

// TODO: 기존 사진 파일 삭제하는 처리 추가하기
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();

    const id = Number(params.id);
    const title = formData.get("title") + "";
    const price = Number(formData.get("price"));
    const description = formData.get("description") + "";
    let photo = formData.get("photo");

    if (photo instanceof File) {
      const photoData = await photo.arrayBuffer();
      await fs.appendFile(`./public/${photo.name}`, Buffer.from(photoData));
      photo = `/${photo.name}`;
    } else {
      photo = null;
    }

    const updatingData = {
      title,
      price,
      description,
    };

    if (photo) {
      Object.assign(updatingData, { photo });
    }

    await db.product.update({
      where: {
        id,
      },
      data: updatingData,
    });

    revalidatePath("/home");
    return new Response("Updated", { status: 200 });
  } catch (error) {
    return new Response("Error Occured", { status: 400 });
  }
}
