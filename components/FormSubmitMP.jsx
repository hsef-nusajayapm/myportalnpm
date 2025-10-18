"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// 🧱 Schema validasi Zod
const formSchema = z.object({
  namaLengkap: z.string().min(2, "Nama minimal 2 huruf"),
  perusahaan: z.string().min(1, "Perusahaan wajib diisi"),
  tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
  tanggalLahir: z
    .date({ required_error: "Tanggal lahir wajib dipilih" })
    .refine((val) => val <= new Date(), {
      message: "Tanggal lahir tidak boleh di masa depan",
    }),
  jabatan: z.string().optional(),
  jenisPengajuan: z.string().min(3, "Jenis pengajuan wajib diisi"),
  uploadFoto: z.any().refine((file) => file?.[0]?.size <= 10 * 1024 * 1024, "Ukuran maksimal 10MB"),
  suratPengajuan: z
    .any()
    .refine((file) => file?.[0]?.size <= 10 * 1024 * 1024, "Ukuran maksimal 10MB"),
});

export default function FormSubmitMP() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaLengkap: "",
      perusahaan: "",
      tempatLahir: "",
      tanggalLahir: undefined,
      jabatan: "",
      jenisPengajuan: "",
      uploadFoto: null,
      suratPengajuan: null,
    },
  });

  function onSubmit(data) {
    console.log("✅ Form data:", data);
    alert("Form berhasil disubmit! Lihat console untuk hasilnya.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2">
        {/* Nama Lengkap */}
        <FormField
          control={form.control}
          name="namaLengkap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Perusahaan */}
        <FormField
          control={form.control}
          name="perusahaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perusahaan</FormLabel>
              <FormControl>
                <Input placeholder="Perusahaan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tempat Lahir */}
        <FormField
          control={form.control}
          name="tempatLahir"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempat Lahir</FormLabel>
              <FormControl>
                <Input placeholder="Tempat Lahir" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 📅 Tanggal Lahir (dengan Calendar Picker) */}
        <FormField
          control={form.control}
          name="tanggalLahir"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Lahir</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      {field.value
                        ? field.value.toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Pilih tanggal"}
                      <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={field.value}
                    onSelect={field.onChange}
                    fromYear={1950}
                    toYear={new Date().getFullYear()}
                    disabled={(date) => date > new Date()} // 🚫 Tidak bisa pilih tanggal masa depan
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Jabatan */}
        <FormField
          control={form.control}
          name="jabatan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jabatan</FormLabel>
              <FormControl>
                <Input placeholder="Jabatan Anda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Jenis Pengajuan */}
        <FormField
          control={form.control}
          name="jenisPengajuan"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Jenis Pengajuan</FormLabel>
              <FormControl>
                <Textarea placeholder="Contoh: Permohonan SIMPER baru / perpanjangan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Upload Foto */}
        <FormField
          control={form.control}
          name="uploadFoto"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>
                Upload Foto (jpg/png) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400">
                  <Upload className="h-6 w-6 text-gray-500" />
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => onChange(e.target.files)}
                    className="mt-2 text-sm"
                    required
                    value={undefined}
                  />
                  <p className="mt-1 text-xs text-gray-500">Ukuran maksimal: 10 MB</p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Surat Pengajuan */}
        <FormField
          control={form.control}
          name="suratPengajuan"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>
                Surat Pengajuan (PDF) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-gray-400">
                  <Upload className="h-6 w-6 text-gray-500" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => onChange(e.target.files)}
                    className="mt-2 text-sm"
                    required
                    value={undefined}
                  />
                  <p className="mt-1 text-xs text-gray-500">Ukuran maksimal: 10 MB</p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tombol Submit */}
        <div className="flex justify-center md:col-span-2">
          <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
            Kirim Pengajuan
          </Button>
        </div>
      </form>
    </Form>
  );
}
