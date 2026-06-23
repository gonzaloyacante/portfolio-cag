import { connection } from 'next/server';
import { Suspense } from 'react';

import { Search } from 'lucide-react';

import { PageHeader } from '@/components/admin/PageHeader';
import { SeoManager } from '@/components/admin/SeoManager';
import { prisma } from '@/lib/prisma';

async function SeoContent() {
  await connection();
  const configs = await prisma.seoConfig.findMany({ orderBy: { slug: 'asc' } });

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrowIcon={<Search size={11} />}
        eyebrow="Sistema · SEO"
        title="Configuración de SEO"
        description="Meta titles, descriptions, Open Graph image y robots por página. Si una página no tiene configuración acá, se usan los defaults del sitio."
      />
      <SeoManager initialConfigs={configs} />
    </div>
  );
}

export default function SeoPage() {
  return (
    <Suspense fallback={null}>
      <SeoContent />
    </Suspense>
  );
}
