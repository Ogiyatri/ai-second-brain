'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDashboard } from '@/hooks/dashboard';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', exact: true },
  { href: '/dashboard/documents', label: 'Documents', exact: false },
  { href: '/dashboard/chat', label: 'Chat', exact: false },
  { href: '/dashboard/generate', label: 'Generate', exact: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useDashboard();

  return (
    <aside className="flex h-screen w-56 flex-col border-r bg-background">
      <div className="p-4">
        <h1 className="text-lg font-bold tracking-tight">AI Second Brain</h1>
        {user && (
          <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
        )}
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-2">
        {NAV_ITEMS.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                active && 'bg-accent text-accent-foreground font-medium',
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <Separator />
      <div className="p-2">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
          Log out
        </Button>
      </div>
    </aside>
  );
}
