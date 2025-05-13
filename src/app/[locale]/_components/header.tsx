import Image from 'next/image';
import Link from 'next/link';
import HeaderNavigation from './header-navigation';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6 bg-[var(--chat-water-blue)] text-white sm:px-12">
      <div>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={30}
            priority
            className="h-[40px] w-auto"
          />
        </Link>
      </div>
      
      {/* Use the server component for navigation */}
      <HeaderNavigation />
    </header>
  );
}