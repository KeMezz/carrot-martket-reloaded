"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Input from "./input";
import Button from "./button";
import { SubmitHandler, useForm } from "react-hook-form";

interface EditProductFormData {
  photo: File;
  title: string;
  price: number;
  description: number;
}

export default function EditProductForm() {
  const [preview, setPreview] = useState("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;

    const file = files[0];
    if (file.size > 1024 * 1024 * 5) {
      alert("5MB 이하의 파일만 업로드 가능합니다.");

      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EditProductFormData>();

  const onSubmit = (formData: EditProductFormData) => {
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-5 flex flex-col gap-5">
      <div>
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer hover:border-orange-500 *:hover:text-orange-400 transition-colors bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </div>
            </>
          ) : null}
        </label>
        {errors?.photo ? (
          <span className="text-red-500 font-medium flex items-center gap-2 text-sm mt-3">
            <ExclamationTriangleIcon className="size-4 mt-[0.5px]" />
            {errors.photo.message}
          </span>
        ) : null}
      </div>
      <input
        {...register("photo", { required: "사진을 추가해주세요." })}
        onChange={onImageChange}
        type="file"
        id="photo"
        name="photo"
        accept="image/*"
        className="hidden"
      />
      <Input
        register={register("title", {
          required: "상품명을 입력해주세요.",
          maxLength: {
            value: 20,
            message: "상품명은 20자 이내로 입력해주세요.",
          },
        })}
        name="title"
        required
        placeholder="상품명"
        type="text"
        errors={errors.title ? [errors?.title?.message!] : undefined}
      />
      <Input
        register={register("price", {
          required: "가격을 입력해주세요.",
          max: {
            value: 99999999999999999999,
            message: "올바른 가격을 입력해주세요.",
          },
        })}
        name="price"
        type="number"
        required
        placeholder="가격"
        errors={errors.price ? [errors?.price?.message!] : undefined}
      />
      <Input
        register={register("description", {
          required: "상품 설명을 입력해주세요",
          maxLength: {
            value: 100000,
            message: "상품 설명은 100,000자 이내로 입력해주세요.",
          },
        })}
        name="description"
        type="text"
        required
        placeholder="자세한 설명"
        errors={
          errors.description ? [errors?.description?.message!] : undefined
        }
      />
      <Button text="작성 완료" />
    </form>
  );
}
