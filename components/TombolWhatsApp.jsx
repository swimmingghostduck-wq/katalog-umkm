import Link from "next/link";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const nama = produk?.nama ?? "";
  const harga =
    produk?.harga !== undefined
      ? formatRupiah(produk.harga).replace(/\u00A0/g, " ")
      : "";
  const nomorBersih = (toko.nomorWhatsApp || "").replace(/\D/g, "");
  const nomor = nomorBersih.startsWith("0")
    ? "62" + nomorBersih.slice(1)
    : nomorBersih;

  const pesan = `Halo, saya ingin memesan ${nama} seharga ${harga}.`;
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <Link
      href={urlWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </Link>
  );
}
