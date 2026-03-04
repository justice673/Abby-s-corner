import Link from "next/link";
import Image from "next/image";

const AUTH_IMAGE = "/images/login.png";
const LOGO = "/images/logo.png";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backLabel?: string;
  backHref?: string;
};

export default function AuthLayout({
  children,
  title,
  subtitle,
  backLabel,
  backHref,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left: Image with dark overlay and text (hidden on mobile) */}
      <div className="relative hidden w-full lg:block lg:min-h-screen lg:w-1/2">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${AUTH_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-black/55" />
        {/* Logo top left */}
        <Link
          href="/"
          className="absolute left-8 top-8 z-20 block w-32 sm:w-40"
          aria-label="Abby's Corner"
        >
          <Image
            src={LOGO}
            alt="Abby's Corner"
            width={160}
            height={50}
            className="h-10 w-auto object-contain object-left"
          />
        </Link>
        <div className="relative z-10 flex h-full flex-col justify-center px-12 xl:px-16">
          <h1 className="max-w-md text-3xl font-semibold leading-tight text-white sm:text-4xl font-heading">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-(--brand-light)/90">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-(--brand-light) px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo on top of form */}
          <Link href="/" className="mb-8 block w-36 sm:w-40">
            <Image
              src={LOGO}
              alt="Abby's Corner"
              width={160}
              height={50}
              className="h-10 w-auto object-contain"
            />
          </Link>
          {/* Back link */}
          {backLabel && backHref && (
            <Link
              href={backHref}
              className="mb-4 inline-block text-sm text-(--brand-primary)/80 transition hover:text-(--brand-primary) hover:underline"
            >
              ← {backLabel}
            </Link>
          )}
          {/* Mobile header (when image is hidden) */}
          <div className="mb-6 text-center lg:hidden">
            <h1 className="text-2xl font-semibold text-(--brand-primary) font-heading">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-(--brand-primary)/70">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
