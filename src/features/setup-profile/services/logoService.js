import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "@firebase/storage";
import { storage } from "../../../firebase";

export const uploadBusinessLogo = async ({ businessId, dataUrl, metadata }) => {
  const imageRef = ref(storage, `businesses/${businessId}/image`);
  await uploadString(imageRef, dataUrl, "data_url", metadata);
  return getDownloadURL(imageRef);
};

export const deleteBusinessLogo = async ({ businessId }) => {
  const imageRef = ref(storage, `businesses/${businessId}/image`);
  try {
    await deleteObject(imageRef);
  } catch (error) {
    if (error?.code !== "storage/object-not-found") throw error;
  }
};
