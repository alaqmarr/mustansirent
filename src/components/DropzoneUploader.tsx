"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface DropzoneUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  acceptImagesOnly?: boolean;
}

export function DropzoneUploader({
  label,
  value,
  onChange,
  folder = "catalog",
  acceptImagesOnly = true,
}: DropzoneUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [providerUsed, setProviderUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setError(null);
      setProviderUsed(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Upload failed");
        } else {
          onChange(data.url);
          setProviderUsed(data.storageProvider);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Upload error");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptImagesOnly
      ? { "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"] }
      : undefined,
  });

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
        <div
          {...getRootProps()}
          className={`sm:col-span-8 rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition ${
            isDragActive
              ? "border-sky-600 bg-sky-50"
              : "border-slate-300 hover:border-sky-500 bg-slate-50/70"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-1.5">
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
                <span className="text-xs font-semibold text-sky-700">
                  Uploading to Cloudflare R2 / Storage...
                </span>
              </>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-sky-600" />
                <span className="text-xs font-semibold text-slate-700">
                  {isDragActive
                    ? "Drop file here to upload..."
                    : "Drag & drop file here, or click to browse (React Dropzone + Cloudflare R2)"}
                </span>
              </>
            )}
            {providerUsed && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Uploaded ({providerUsed === "cloudflare-r2" ? "Cloudflare R2" : "Local Storage"})
              </span>
            )}
          </div>
        </div>

        {/* Preview Box */}
        <div className="sm:col-span-4 rounded-xl border border-slate-200 bg-white p-2 flex flex-col items-center justify-center min-h-[88px]">
          {value ? (
            acceptImagesOnly || value.match(/\.(svg|png|jpg|jpeg|webp)$/i) ? (
              <img
                src={value}
                alt="Preview"
                className="h-16 w-full object-contain rounded"
              />
            ) : (
              <span className="text-xs font-mono text-sky-700 truncate max-w-full px-2">
                {value}
              </span>
            )
          ) : (
            <span className="text-[11px] text-slate-400">No file selected</span>
          )}
        </div>
      </div>

      {/* Direct URL Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or enter image/file URL directly (e.g. /images/catalog/prod-nrv.svg)"
        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 font-mono focus:border-sky-600 focus:outline-none"
      />

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
