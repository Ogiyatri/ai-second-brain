import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = { title: 'Dashboard — AI Second Brain' };

const TILES = [
  { href: '/dashboard/documents', title: 'Documents', desc: 'Upload and manage your files' },
  { href: '/dashboard/chat', title: 'Chat', desc: 'Ask questions across your documents' },
  { href: '/dashboard/generate', title: 'Generate', desc: 'Create summaries, reports, and more' },
];

export default function DashboardPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">Overview</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {TILES.map((tile) => (
          <Link key={tile.href} href={tile.href}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{tile.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tile.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
