import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/logo.jpeg"
        alt="SZEITS"
        width={1024}
        height={1024}
        priority
        className="h-12 w-12 rounded-xl bg-white object-contain p-1.5 sm:h-14 sm:w-14"
      />
    </span>
  );
}
