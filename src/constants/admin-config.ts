export type AdminNavItem = {
  href: string;
  label: string;
  group: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', group: 'Resumen' },
  { href: '/admin/messages', label: 'Mensajes', group: 'Resumen' },

  { href: '/admin/hero', label: 'Hero', group: 'Contenido' },
  { href: '/admin/contact-info', label: 'Datos de contacto', group: 'Contenido' },
  { href: '/admin/brands', label: 'Marcas', group: 'Contenido' },
  { href: '/admin/experience', label: 'Experiencia', group: 'Contenido' },
  { href: '/admin/process', label: 'Proceso', group: 'Contenido' },
  { href: '/admin/services', label: 'Servicios', group: 'Contenido' },
  { href: '/admin/projects', label: 'Proyectos', group: 'Contenido' },
  { href: '/admin/results', label: 'Resultados', group: 'Contenido' },
  { href: '/admin/testimonials', label: 'Testimonios', group: 'Contenido' },
  { href: '/admin/timeline', label: 'Trayectoria', group: 'Contenido' },
  { href: '/admin/faqs', label: 'FAQ', group: 'Contenido' },
  { href: '/admin/sections', label: 'Etiquetas de sección', group: 'Contenido' },
  { href: '/admin/media', label: 'Imágenes', group: 'Contenido' },

  { href: '/admin/seo', label: 'SEO', group: 'Sistema' },
  { href: '/admin/security', label: 'Seguridad (2FA)', group: 'Sistema' },
];

export const ADMIN_NAV_GROUPS = ['Resumen', 'Contenido', 'Sistema'] as const;
