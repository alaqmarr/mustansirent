import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSiteSettings } from "./settings";
import fs from "fs/promises";
import path from "path";

export async function uploadFileToStorage(
  buffer: Buffer,
  originalFilename: string,
  contentType: string,
  folder: string = "uploads"
): Promise<{ url: string; storageProvider: "cloudflare-r2" | "local-fallback" }> {
  const settings = await getSiteSettings();

  const accountId = settings.r2AccountId || process.env.R2_ACCOUNT_ID || "";
  const accessKeyId = settings.r2AccessKeyId || process.env.R2_ACCESS_KEY_ID || "";
  const secretAccessKey = settings.r2SecretAccessKey || process.env.R2_SECRET_ACCESS_KEY || "";
  const bucketName = settings.r2BucketName || process.env.R2_BUCKET_NAME || "";
  const publicUrl = (settings.r2PublicUrl || process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

  const safeName = originalFilename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
  const timestamp = Date.now();
  const objectKey = `${folder}/${timestamp}-${safeName}`;

  if (accountId && accessKeyId && secretAccessKey && bucketName) {
    try {
      const s3 = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
          Body: buffer,
          ContentType: contentType,
        })
      );

      const finalUrl = publicUrl
        ? `${publicUrl}/${objectKey}`
        : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${objectKey}`;

      return {
        url: finalUrl,
        storageProvider: "cloudflare-r2",
      };
    } catch (err) {
      console.error("Cloudflare R2 upload failed, falling back to local public/uploads:", err);
    }
  }

  // Local fallback so react-dropzone works out-of-the-box before R2 keys are entered
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });
  const localFileName = `${timestamp}-${safeName}`;
  await fs.writeFile(path.join(uploadDir, localFileName), buffer);

  return {
    url: `/uploads/${folder}/${localFileName}`,
    storageProvider: "local-fallback",
  };
}
