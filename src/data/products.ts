import env100 from "@/assets/envelopes-100.png";
import env200 from "@/assets/envelopes-200.png";
import env400 from "@/assets/envelopes-400.png";
import env650 from "@/assets/envelopes-650.png";
import albumOuro650 from "@/assets/album-ouro-650.png";
import albumPrata from "@/assets/album-capa-dura.png";
import albumOuro from "@/assets/album-capa-dura-ouro.png";
import albumColor from "@/assets/album-capa-dura-color.png";
import albumBrochura from "@/assets/album-brochura.png";

export type Product = {
  id: string;
  name: string;
  img: string;
  price: string;
  old: string;
  discount: string;
  sold: string;
  rating: string;
};

export const products: Product[] = [
  { id: "650", name: "Kit Com 650 Envelopes", img: env650, price: "R$ 62,06", old: "R$ 494,90", discount: "60% OFF", sold: "4312 vendido(s)", rating: "5" },
  { id: "400", name: "Kit Com 400 Envelopes", img: env400, price: "R$ 43,08", old: "R$ 394,90", discount: "60% OFF", sold: "4312 vendido(s)", rating: "5" },
  { id: "album-2026", name: "Álbum 2026", img: albumOuro650, price: "R$ 31,43", old: "R$ 74,90", discount: "60% OFF", sold: "4312 vendido(s)", rating: "5" },
  { id: "200", name: "Kit Com 200 Envelopes", img: env200, price: "R$ 29,93", old: "R$ 194,90", discount: "60% OFF", sold: "4312 vendido(s)", rating: "5" },
  { id: "album-ouro", name: "Álbum Dourado Capa Dura", img: albumOuro, price: "R$ 25,31", old: "R$ 74,90", discount: "60% OFF", sold: "4312 vendido(s)", rating: "5" },
  { id: "album-prata", name: "Álbum Prata Capa Dura", img: albumPrata, price: "R$ 24,08", old: "R$ 74,90", discount: "60% OFF", sold: "4312 vendido(s)", rating: "5" },
  { id: "100", name: "Kit Com 100 Envelopes", img: env100, price: "R$ 21,05", old: "R$ 74,90", discount: "60% OFF", sold: "4312 vendido(s)", rating: "5" },
  { id: "album-tradicional-cd", name: "Álbum Tradicional Capa Dura", img: albumColor, price: "R$ 20,77", old: "R$ 74,90", discount: "60% OFF", sold: "4312 vendido(s)", rating: "5" },
  { id: "album-tradicional-cm", name: "Álbum Tradicional Capa Mole", img: albumBrochura, price: "R$ 14,29", old: "R$ 74,90", discount: "60% OFF", sold: "4312 vendido(s)", rating: "5" },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
