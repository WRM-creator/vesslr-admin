import { api } from "@/lib/api";
import { useState } from "react";

interface UploadedFile {
  url: string;
  name: string;
}

/**
 * Hook for uploading files to S3 via presigned URLs
 */
export const useFileUpload = () => {
  const { mutateAsync: getPresignedUrls } =
    api.storage.presignedUrls.useMutation();

  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: File[]): Promise<UploadedFile[]> => {
    setIsUploading(true);
    try {
      if (files.length === 0) return [];

      const presignedData = await getPresignedUrls({
        body: {
          files: files.map((file) => ({
            filename: file.name,
            contentType: file.type,
          })),
        },
      });

      if (!presignedData) {
        throw new Error("Failed to get presigned URLs");
      }

      return await Promise.all(
        presignedData.map(async (item, index) => {
          const file = files[index];
          const presignedUrl = item["url"] as string;
          const publicUrl = item["publicUrl"] as string;
          const response = await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });
          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }
          return { url: publicUrl, name: file.name };
        }),
      );
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFiles, isUploading };
};
