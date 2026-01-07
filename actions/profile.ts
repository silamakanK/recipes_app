"use server";

import supabaseAdmin from "@/supabase/admin";
import supabase, { getUser } from "@/supabase/client";
import { getSession } from "@/utils/sessions";
import { getAvatarBucketName, getAvatarPublicUrl } from "@/utils/avatar";

type UpdateProfileResult =
  | { success: true; data: ProfileRecord }
  | { success: false; message: string };

type ProfileRecord = {
  avatar_url: string | null;
  avatar_public_url: string | null;
  age: number | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
  activity_level: string | null;
  goal: string | null;
  kcal_per_day: number | null;
  intolerance: string[] | null;
};

const AVATAR_BUCKET = getAvatarBucketName();

export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Veuillez vous connecter pour modifier votre profil." };
  }

  const user = await getUser();
  if (!user) {
    return { success: false, message: "Utilisateur non authentifié." };
  }

  const client = await supabase();
  const parseNumber = (value: FormDataEntryValue | null) => {
    if (typeof value !== "string" || value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const age = parseNumber(formData.get("age"));
  const weight = parseNumber(formData.get("weight"));
  const height = parseNumber(formData.get("height"));
  const kcalPerDay = parseNumber(formData.get("kcalPerDay"));
  const gender = getString(formData.get("gender"));
  const activity = getString(formData.get("activity"));
  const goal = getString(formData.get("goal"));

  const intoleranceRaw = formData.get("intolerances");
  let intolerances: string[] = [];
  if (typeof intoleranceRaw === "string" && intoleranceRaw.length) {
    try {
      const parsed = JSON.parse(intoleranceRaw);
      if (Array.isArray(parsed)) {
        intolerances = parsed.map((value) => `${value}`.trim()).filter(Boolean);
      }
    } catch (error) {
      console.error("intolerance parsing error", error);
    }
  }

  let avatarKey = getString(formData.get("currentAvatarKey"));
  const avatar = formData.get("avatar") as File | null;
  if (avatar && avatar.size > 0) {
    const storageClient = await supabaseAdmin();
    if (!storageClient) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY env variable for storage uploads.");
      return {
        success: false,
        message: "Configuration incomplète : impossible de téléverser l'avatar pour le moment.",
      };
    }

    const filePath = user.id;
    const { error: uploadError } = await storageClient.storage.from(AVATAR_BUCKET).upload(filePath, avatar, {
      cacheControl: "3600",
      upsert: true,
      contentType: avatar.type,
    });

    if (uploadError) {
      console.error(uploadError);
      return { success: false, message: "Échec du téléversement de l'avatar." };
    }

    avatarKey = filePath;
  }

  const profileFields = {
    avatar_url: avatarKey,
    age,
    gender,
    weight,
    height,
    activity_level: activity,
    goal,
    kcal_per_day: kcalPerDay,
    intolerance: intolerances,
  };

  const { data, error } = await client
    .from("profiles")
    .update(profileFields)
    .eq("user_id", user.id)
    .select("avatar_url, age, gender, weight, height, activity_level, goal, kcal_per_day, intolerance")
    .single();

  let profileData = data;

  if (error?.code === "PGRST116") {
    console.warn("No profile record to update, creating one instead.");
    const { data: created, error: createError } = await client
      .from("profiles")
      .insert({ user_id: user.id, ...profileFields })
      .select("avatar_url, age, gender, weight, height, activity_level, goal, kcal_per_day, intolerance")
      .single();

    if (createError || !created) {
      console.error(createError);
      return { success: false, message: "Impossible de créer votre profil." };
    }

    profileData = created;
  } else if (error || !profileData) {
    console.error(error);
    return { success: false, message: "Impossible de mettre à jour votre profil." };
  }

  return {
    success: true,
    data: {
      ...profileData,
      avatar_public_url: getAvatarPublicUrl(profileData.avatar_url),
    },
  };
}

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}
