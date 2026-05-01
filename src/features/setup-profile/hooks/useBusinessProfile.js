import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { setupProfileSchema } from "../../../schemas/setupProfileSchema";
import { normaliseVatInput } from "../../../utils/vatNumberValidation";
import {
  createBusiness,
  mapBusinessToFormValues,
  mapFormToBusinessPayload,
  subscribeBusinessByUserId,
  updateBusiness,
} from "../services/businessService";
import { deleteBusinessLogo, uploadBusinessLogo } from "../services/logoService";
import { showToast } from "../../../utils/functions";
import { messageForFirebaseStorageError } from "../../../utils/firebaseStorageMessages";
import { setupDefaultFormValues } from "../utils/setupFieldMapping";

export const useBusinessProfile = ({ logo, setLogo, defaultLogo }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const hydratedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [businessDocId, setBusinessDocId] = useState(null);
  const [storedLogoUrl, setStoredLogoUrl] = useState("");

  const form = useForm({
    resolver: zodResolver(setupProfileSchema),
    defaultValues: setupDefaultFormValues,
    mode: "onSubmit",
  });
  const { reset } = form;

  useEffect(() => {
    const unsubscribe = subscribeBusinessByUserId({
      userId: auth.currentUser.uid,
      onData: (rows) => {
        setLoading(false);

        if (rows.length === 0) {
          setBusinessDocId(null);
          setStoredLogoUrl("");
          hydratedRef.current = false;
          return;
        }

        const business = rows[0];
        setBusinessDocId(business.id);
        setStoredLogoUrl(
          typeof business.logo === "string" && business.logo.trim()
            ? business.logo.trim()
            : "",
        );

        if (!hydratedRef.current) {
          reset(mapBusinessToFormValues(business));
          setLogo(business.logo || defaultLogo);
          hydratedRef.current = true;
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });

    return () => unsubscribe();
  }, [auth.currentUser.uid, defaultLogo, reset, setLogo]);

  const metadata = useMemo(
    () => ({
      customMetadata: {
        owner: auth.currentUser.uid,
      },
    }),
    [auth.currentUser.uid],
  );

  const submitProfile = async (data) => {
    try {
      const logoIsNewUpload = typeof logo === "string" && logo.startsWith("data:");
      const logoCleared = logo === defaultLogo;
      const hasStoredLogo =
        typeof storedLogoUrl === "string" &&
        storedLogoUrl.trim().length > 0 &&
        storedLogoUrl !== defaultLogo;

      const payload = mapFormToBusinessPayload({
        data: {
          ...data,
          vat: data.isVatRegistered ? normaliseVatInput(data.vat) : "",
        },
        logo: logoCleared ? "" : storedLogoUrl || "",
      });

      if (businessDocId) {
        if (logoIsNewUpload) {
          payload.logo = await uploadBusinessLogo({
            businessId: businessDocId,
            dataUrl: logo,
            metadata,
          });
        } else if (logoCleared && hasStoredLogo) {
          await deleteBusinessLogo({ businessId: businessDocId });
          payload.logo = "";
        }

        await updateBusiness({ businessId: businessDocId, payload });
        if (logoIsNewUpload) {
          showToast("success", "Профилът е обновен и логото е заменено.");
        } else if (logoCleared && hasStoredLogo) {
          showToast("success", "Профилът е обновен и логото е премахнато.");
        } else {
          showToast("success", "Профилът е обновен.");
        }
        navigate("/dashboard");
        return;
      }

      const docRef = await createBusiness({
        userId: auth.currentUser.uid,
        payload,
      });

      if (logo !== defaultLogo) {
        try {
          const logoUrl = await uploadBusinessLogo({
            businessId: docRef.id,
            dataUrl: logo,
            metadata,
          });
          await updateBusiness({
            businessId: docRef.id,
            payload: { logo: logoUrl },
          });
          showToast("success", "Вашият бизнес профил е готов.");
        } catch (uploadErr) {
          if (uploadErr?.code === "storage/quota-exceeded") {
            showToast(
              "error",
              "Бизнес профилът е създаден, но логото не можа да се качи: квотата във Firebase Storage е изчерпана. Освободете място във Firebase Console → Storage или надградете плана, след което добавете лого от „Профил“.",
            );
            navigate("/dashboard");
            return;
          }
          throw uploadErr;
        }
      } else {
        showToast(
          "success",
          "Профилът е запазен. Можете да добавите лого по-късно от настройките.",
        );
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const storageMsg = messageForFirebaseStorageError(err);
      showToast(
        "error",
        storageMsg ?? "Профилът не можа да се запази. Опитайте отново.",
      );
    }
  };

  return {
    form,
    loading,
    businessDocId,
    submitProfile,
  };
};
