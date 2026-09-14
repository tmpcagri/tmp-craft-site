import { NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { createClient } from "@/app/lib/supabase/server";

// Kullanıcının KENDİ hesabını kalıcı olarak silmesi -- /api/users/[id] ile
// karıştırma, o sadece owner'ın BAŞKA kullanıcıları silmesi için (ve
// bilerek kendi kendini silmeyi engelliyor). Burada tam tersi: sadece
// oturum açmış kullanıcı, sadece kendi hesabını silebiliyor. Geri alınamaz.
export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Oturum açık değil" }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY tanımlı değil — .env.local'e eklenmeden hesap silinemez.",
      },
      { status: 500 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
