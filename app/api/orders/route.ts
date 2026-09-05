import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Uses the service role key server-side only — never expose this key to the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

async function uploadFile(file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  const { error } = await supabaseAdmin.storage
    .from("order-uploads")
    .upload(fileName, bytes, { contentType: file.type });
  if (error) throw error;
  const { data } = supabaseAdmin.storage.from("order-uploads").getPublicUrl(fileName);
  return data.publicUrl;
}

async function sendOrderEmail(order: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ORDER_NOTIFY_EMAIL;
  if (!apiKey || !notifyEmail) return; // email not configured yet — order is still saved

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Pharmex Orders <orders@resend.dev>",
      to: notifyEmail,
      subject: `New order — Rs. ${order.total} from ${order.customer_name}`,
      html: `
        <h2>New Pharmex order</h2>
        <p><strong>${order.customer_name}</strong> — ${order.phone}</p>
        <p>${order.address}, ${order.city}</p>
        <p>Payment: ${order.payment_method}${
        order.payment_reference ? ` (ref: ${order.payment_reference})` : ""
      }</p>
        <p>Total: Rs. ${order.total}</p>
        <p>Prescription required: ${order.requires_prescription}</p>
        <pre>${JSON.stringify(order.items, null, 2)}</pre>
      `,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const customer_name = String(formData.get("customer_name") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const address = String(formData.get("address") ?? "");
    const city = String(formData.get("city") ?? "");
    const payment_method = String(formData.get("payment_method") ?? "cod");
    const payment_reference = String(formData.get("payment_reference") ?? "");
    const requires_prescription = formData.get("requires_prescription") === "true";
    const total = Number(formData.get("total") ?? 0);
    const items = JSON.parse(String(formData.get("items") ?? "[]"));

    const receiptFile = formData.get("receipt") as File | null;
    const prescriptionFile = formData.get("prescription") as File | null;

    let receipt_url: string | undefined;
    let prescription_url: string | undefined;

    if (receiptFile && receiptFile.size > 0) {
      receipt_url = await uploadFile(receiptFile, "receipts");
    }
    if (prescriptionFile && prescriptionFile.size > 0) {
      prescription_url = await uploadFile(prescriptionFile, "prescriptions");
    }

    const order = {
      customer_name,
      phone,
      address,
      city,
      items,
      total,
      payment_method,
      payment_reference,
      requires_prescription,
      prescription_url,
      receipt_url,
      status: "pending",
    };

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (error) throw error;

    await sendOrderEmail(order);

    return NextResponse.json({ ok: true, order: data });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json({ ok: false, error: "Order creation failed" }, { status: 500 });
  }
}
