import Link from "next/link";
import Image from "next/image";
import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import { FaSnapchat, FaTiktok } from "react-icons/fa";

const FOOTER_LOGO = "/images/logo.png";

const socialLinks = [
  { id: "facebook", href: "#", icon: FiFacebook },
  { id: "instagram", href: "#", icon: FiInstagram },
  { id: "twitter", href: "#", icon: FiTwitter },
  { id: "snapchat", href: "#", icon: FaSnapchat },
  { id: "tiktok", href: "#", icon: FaTiktok },
];

function FooterLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-block text-sm text-(--brand-primary)/80 transition-colors hover:text-(--brand-primary) ${className}`}
    >
      {children}
      <span className="absolute bottom-0 left-0 h-px w-0 bg-(--brand-primary) transition-[width] duration-300 group-hover:w-full" />
    </Link>
  );
}

const stores = [
  {
    name: "Douala",
    address: "Cameroon",
    hours: "Every day from 10:00 AM to 8:30 PM",
    phone: "+237 670-123-456",
  },
  {
    name: "Yaoundé",
    address: "Cameroon",
    phone: "+237 680-234-567",
  },
  {
    name: "Bamenda",
    address: "Cameroon",
    phone: "+237 690-345-678",
  },
];

const aProposLinks = [
  { label: "About Abby's", href: "#" },
  { label: "Our stores", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Our services", href: "#" },
];

const servicesLinks = [
  { label: "Exclusive Offers", href: "#" },
  { label: "TRY ME", href: "#" },
  { label: "Loyalty & Referral", href: "#" },
  { label: "Book an Appointment", href: "#" },
  { label: "SODILUXE Box", href: "#" },
  { label: "Abby's & You", href: "#" },
  { label: "Delivery", href: "#" },
  { label: "Contact us", href: "#" },
];

const compteLinks = [
  { label: "FAQ", href: "#" },
  { label: "Legal information", href: "#" },
];

const legalLinks = [
  { label: "Legal notice", href: "#" },
  { label: "Terms of sale", href: "#" },
  { label: "Terms of use", href: "#" },
  { label: "Privacy policy", href: "#" },
  { label: "Cookie settings", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-(--brand-primary)/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="mb-10 block w-fit">
          <Image
            src={FOOTER_LOGO}
            alt="Abby's Corner logo"
            width={180}
            height={56}
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* Main footer content */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Stores */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
              Our stores
            </h3>
            <div className="space-y-6">
              {stores.map((store) => (
                <div key={store.name}>
                  <p className="font-semibold text-(--brand-primary)">
                    {store.name}
                  </p>
                  <p className="mt-1 text-sm text-(--brand-primary)/80">
                    {store.address}
                  </p>
                  {store.hours && (
                    <p className="mt-0.5 text-sm text-(--brand-primary)/70">
                      {store.hours}
                    </p>
                  )}
                  <p className="mt-1 text-sm font-medium text-(--brand-primary)">
                    {store.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* À propos */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
              About
            </h3>
            <ul className="space-y-2">
              {aProposLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Nos services */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
              Our services
            </h3>
            <ul className="space-y-2">
              {servicesLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Mon compte */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
              My account
            </h3>
            <ul className="space-y-2">
              {compteLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social media & Legal */}
        <div className="mt-12 border-t border-(--brand-primary)/10 pt-8">
          <div className="mb-6 flex items-center gap-4">
            {socialLinks.map(({ id, href, icon: Icon }) => (
              <a
                key={id}
                href={href}
                aria-label={id}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-(--brand-primary)/20 text-(--brand-primary) transition hover:border-(--brand-primary) hover:bg-(--brand-primary) hover:text-(--brand-light)"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-(--brand-primary)">
            Legal information
          </h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href} className="text-(--brand-primary)/70">
                  {link.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-center text-xs text-(--brand-primary)/60">
          © {new Date().getFullYear()} Abby's Corner. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
