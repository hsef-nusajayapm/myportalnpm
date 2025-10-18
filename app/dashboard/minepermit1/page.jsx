"use client";

import FormSubmitMP from "@/components/FormSubmitMP";

export default function MinePermitPage1() {
  return (
    <div className="rounded-xl bg-white p-8 shadow">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">
        Form Mine Permit & SIMPER
      </h1>
      <p className="mb-8 text-center text-gray-700">
        Formulir ini digunakan untuk pengajuan Mine Permit dan/atau SIMPER di WIUP PT NPM. Pastikan
        data yang Anda isi benar dan akurat.
      </p>
      <FormSubmitMP />
    </div>
  );
}
