import Link from "next/link";
import { Pill, Phone, Clock, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-sage bg-primary-dark text-white/80">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-primary-dark">
                <Pill size={14} />
              </span>
              <span className="font-display text-xl text-white">Pharmex</span>
            </div>
            <p className="mt-3 max-w-xs text-sm">
              Your neighbourhood mart and pharmacy, now a few taps away.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-white">Shop</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/products?category=pharmacy" className="hover:text-white">Pharmacy</Link></li>
              <li><Link href="/products?category=grocery" className="hover:text-white">Grocery</Link></li>
              <li><Link href="/products?category=personal-care" className="hover:text-white">Personal care</Link></li>
              <li><Link href="/products?category=household" className="hover:text-white">Household</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-white">Contact</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} /> 0300-0000000</li>
              <li className="flex items-center gap-2"><Clock size={14} /> Open daily, 9am – 11pm</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Delivery within city limits</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-white">Payments accepted</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>JazzCash</li>
              <li>Easypaisa</li>
              <li>Cash on delivery</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © {new Date().getFullYear()} Pharmex. Prescription medicines are
          dispensed only after verification by our pharmacist.
        </div>
      </div>
    </footer>
  );
}
