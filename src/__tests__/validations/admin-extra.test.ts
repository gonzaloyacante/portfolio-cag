import { describe, expect, it } from 'vitest';

import {
  brandSchema,
  contactInfoFormSchema,
  contactInfoUpdateSchema,
  emailSettingsFormSchema,
  experienceCardSchema,
  faqItemSchema,
  heroFormSchema,
  heroStatSchema,
  heroUpdateSchema,
  processStepSchema,
  projectSchema,
  resultItemSchema,
  sectionMetaFormSchema,
  sectionMetaUpdateSchema,
  serviceSchema,
  systemSettingsFormSchema,
  testimonialSchema,
  timelineItemSchema,
} from '@/validations/admin';

// Massive density: edge cases, unusual inputs, large payloads, unicode.

describe('admin validations — extra density', () => {
  describe('heroUpdateSchema edge cases', () => {
    it.each([
      'a'.repeat(1),
      'a'.repeat(100),
      'a'.repeat(1000),
      'a'.repeat(10_000),
      'a'.repeat(100_000),
      'Hello 世界',
      'Привет мир',
      'مرحبا بالعالم',
      '🎉🚀💻',
      '   whitespace   ',
      '\n\n\n',
      '\t\t\t',
      'name<script>alert(1)</script>',
      "'; DROP TABLE heroes;--",
      '{"json":"value"}',
      'a'.repeat(50) + '\n' + 'b'.repeat(50),
    ])('accepts summaryEs of: %j', (summaryEs) => {
      const result = heroUpdateSchema.safeParse({ summaryEs });
      expect(result.success).toBe(true);
    });

    it('accepts every kind of valid portrait URL', () => {
      for (const url of [
        'http://example.com/img.jpg',
        'https://example.com/img.png',
        'https://example.com/img.webp',
        'https://res.cloudinary.com/demo/image/upload/v123/abc.jpg',
        'https://lh3.googleusercontent.com/abc',
      ]) {
        const result = heroUpdateSchema.safeParse({ portraitUrl: url });
        expect(result.success, url).toBe(true);
      }
    });

    it('rejects every kind of invalid portrait URL', () => {
      for (const url of [
        'not-a-url',
        'just text',
        'example.com/img.jpg', // missing protocol
        '//example.com/img.jpg',
        '/img.jpg',
        'img.jpg',
      ]) {
        const result = heroUpdateSchema.safeParse({ portraitUrl: url });
        expect(result.success, url).toBe(false);
      }
    });

    it('handles a full stats array of 10', () => {
      const stats = Array.from({ length: 10 }, (_, i) => ({
        value: `${i * 5}+`,
        labelEs: `Label ${i} ES`,
        labelEn: `Label ${i} EN`,
        order: i,
      }));
      const result = heroUpdateSchema.safeParse({ stats });
      expect(result.success).toBe(true);
    });

    it('handles a stats array of 100', () => {
      const stats = Array.from({ length: 100 }, (_, i) => ({
        value: `v${i}`,
        labelEs: `L${i}`,
        labelEn: `L${i}`,
      }));
      const result = heroUpdateSchema.safeParse({ stats });
      expect(result.success).toBe(true);
    });
  });

  describe('sectionMetaUpdateSchema edge cases', () => {
    it.each([
      [''],
      ['x'],
      ['x'.repeat(10_000)],
      ['emoji 🎉'],
      ['spaces in middle'],
      ['line\nbreak'],
      ['tab\there'],
      [null],
      [undefined],
    ])('accepts overlineEs of: %j', (overlineEs) => {
      const result = sectionMetaUpdateSchema.safeParse({ overlineEs });
      expect(result.success).toBe(true);
    });

    it('accepts every field as empty string', () => {
      expect(
        sectionMetaUpdateSchema.safeParse({
          overlineEs: '',
          overlineEn: '',
          titleEs: '',
          titleEn: '',
          descEs: '',
          descEn: '',
        }).success
      ).toBe(true);
    });
  });

  describe('contactInfoUpdateSchema edge cases', () => {
    it.each([
      'a@b.co',
      'a@b.io',
      'a@b.dev',
      'a@b.com',
      'a@b.museum',
      'a@b.cars',
      'a@b.technology',
      'a@b.accountants',
      'a@b.agency',
      'a+b+c@d.com',
      'with.dots@example.com',
      'with_underscores@example.com',
      'with-dashes@example.com',
      'withCAPS@DOMAIN.com',
      '1234567890@example.com',
      'very-long-local-part-that-is-still-valid@example.com',
    ])('accepts email: %s', (email) => {
      expect(contactInfoUpdateSchema.safeParse({ email }).success).toBe(true);
    });

    it.each(['', 'not-an-email', '@example.com', 'a@', 'a@.com', 'a@b..com'])(
      'rejects email: %s',
      (email) => {
        expect(contactInfoUpdateSchema.safeParse({ email }).success).toBe(false);
      }
    );

    it.each([
      'https://linkedin.com/in/user',
      'http://linkedin.com/in/user',
      'https://www.linkedin.com/in/carlos-armando-guerra',
      'https://linkedin.com/in/user-with-dashes',
      'https://linkedin.com/in/user_with_underscores',
    ])('accepts linkedinUrl: %s', (linkedinUrl) => {
      expect(contactInfoUpdateSchema.safeParse({ linkedinUrl }).success).toBe(true);
    });

    it.each(['not-a-url', 'linkedin.com/in/user', 'just text', 'a@b.com'])(
      'rejects linkedinUrl: %s',
      (linkedinUrl) => {
        expect(contactInfoUpdateSchema.safeParse({ linkedinUrl }).success).toBe(false);
      }
    );
  });

  describe('experienceCardSchema edge cases', () => {
    it.each([['A'], ['AB'], ['A'.repeat(100)], ['01'], ['1'], ['EXP-2024'], ['a-b-c']])(
      'accepts code: %s',
      (code) => {
        expect(
          experienceCardSchema.safeParse({
            code,
            titleEs: 'A',
            titleEn: 'A',
            bodyEs: 'A',
            bodyEn: 'A',
          }).success
        ).toBe(true);
      }
    );

    it.each([''])('rejects code: %j', (code) => {
      expect(
        experienceCardSchema.safeParse({
          code,
          titleEs: 'A',
          titleEn: 'A',
          bodyEs: 'A',
          bodyEn: 'A',
        }).success
      ).toBe(false);
    });
  });

  describe('processStepSchema edge cases', () => {
    it('accepts all fields with long unicode', () => {
      expect(
        processStepSchema.safeParse({
          code: '1',
          titleEs: '🔥'.repeat(50),
          titleEn: '🚀'.repeat(50),
          bodyEs: 'b'.repeat(5000),
          bodyEn: 'b'.repeat(5000),
          deliverableEs: 'd'.repeat(5000),
          deliverableEn: 'd'.repeat(5000),
        }).success
      ).toBe(true);
    });
  });

  describe('projectSchema edge cases', () => {
    it('accepts all fields with long unicode', () => {
      expect(
        projectSchema.safeParse({
          tag: '🏷️'.repeat(20),
          periodEs: '2020-2023',
          periodEn: '2020-2023',
          titleEs: 'P'.repeat(200),
          titleEn: 'P'.repeat(200),
          challengeEs: 'C'.repeat(5000),
          challengeEn: 'C'.repeat(5000),
          interventionEs: 'I'.repeat(5000),
          interventionEn: 'I'.repeat(5000),
          outcomeEs: 'O'.repeat(5000),
          outcomeEn: 'O'.repeat(5000),
        }).success
      ).toBe(true);
    });
  });

  describe('resultItemSchema edge cases', () => {
    it.each(['15+', '50', '$2M', '99.9%', '1,000', 'A+', '⭐⭐⭐⭐⭐', '🚀'])(
      'accepts k/v of: %s',
      (val) => {
        expect(resultItemSchema.safeParse({ kEs: val, kEn: val, vEs: val, vEn: val }).success).toBe(
          true
        );
      }
    );
  });

  describe('testimonialSchema edge cases', () => {
    it('accepts very long quote', () => {
      expect(
        testimonialSchema.safeParse({
          quoteEs: 'q'.repeat(10_000),
          quoteEn: 'q'.repeat(10_000),
          roleEs: 'CEO',
          roleEn: 'CEO',
          sectorEs: 'Industrial',
          sectorEn: 'Industrial',
        }).success
      ).toBe(true);
    });
  });

  describe('timelineItemSchema edge cases', () => {
    it.each([
      '2020',
      '2020-2023',
      'Q1 2024',
      'Mar 2024',
      'Jan-Dec 2024',
      '2018-2019',
      '2018 - present',
    ])('accepts period: %s', (period) => {
      expect(
        timelineItemSchema.safeParse({
          period,
          titleEs: 'A',
          titleEn: 'A',
          bodyEs: 'A',
          bodyEn: 'A',
        }).success
      ).toBe(true);
    });
  });

  describe('faqItemSchema edge cases', () => {
    it('accepts question with a question mark', () => {
      expect(
        faqItemSchema.safeParse({ qEs: '¿Cuánto cuesta?', qEn: 'How much?', aEs: 'r', aEn: 'r' })
          .success
      ).toBe(true);
    });

    it('accepts answers with line breaks', () => {
      expect(
        faqItemSchema.safeParse({
          qEs: 'q',
          qEn: 'q',
          aEs: 'l1\nl2\nl3',
          aEn: 'l1\nl2\nl3',
        }).success
      ).toBe(true);
    });
  });

  describe('brandSchema edge cases', () => {
    it.each(['A', 'A'.repeat(50), 'A'.repeat(100), 'Acme Inc.', 'A-B-C', 'A B C', 'A1B2C3'])(
      'accepts name: %s',
      (name) => {
        expect(brandSchema.safeParse({ name }).success).toBe(true);
      }
    );

    it.each([''])('rejects name: %j', (name) => {
      expect(brandSchema.safeParse({ name }).success).toBe(false);
    });
  });

  describe('serviceSchema edge cases', () => {
    it.each([
      ['Diseño industrial', 'Industrial design'],
      ['A', 'A'],
      ['A'.repeat(100), 'A'.repeat(100)],
    ])('accepts service with es=%s, en=%s', (labelEs, labelEn) => {
      expect(serviceSchema.safeParse({ labelEs, labelEn }).success).toBe(true);
    });
  });

  describe('order field handling', () => {
    it.each([0, 1, 10, 100, 1_000, 100_000])('accepts int order: %d', (order) => {
      expect(
        experienceCardSchema.safeParse({
          code: 'a',
          titleEs: 'a',
          titleEn: 'a',
          bodyEs: 'a',
          bodyEn: 'a',
          order,
        }).success
      ).toBe(true);
    });

    it.each([1.5, -1.5, NaN, Infinity, -Infinity])('rejects non-int order: %d', (order) => {
      expect(
        experienceCardSchema.safeParse({
          code: 'a',
          titleEs: 'a',
          titleEn: 'a',
          bodyEs: 'a',
          bodyEn: 'a',
          order,
        }).success
      ).toBe(false);
    });

    it('defaults order to 0 when not provided', () => {
      const r = experienceCardSchema.safeParse({
        code: 'a',
        titleEs: 'a',
        titleEn: 'a',
        bodyEs: 'a',
        bodyEn: 'a',
      });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.order).toBe(0);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Client-side form schemas (single source of truth for admin forms).
  // These are stricter than the server-side *Update schemas: every text
  // field is required so the admin can't save with empty placeholders.
  // ─────────────────────────────────────────────────────────────────────────

  describe('heroStatSchema (exported)', () => {
    it('accepts a valid stat', () => {
      const r = heroStatSchema.safeParse({
        value: '15+',
        labelEs: 'Años',
        labelEn: 'Years',
        order: 0,
      });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.order).toBe(0);
    });

    it.each([
      ['value', ''],
      ['labelEs', ''],
      ['labelEn', ''],
    ])('rejects empty %s', (field, value) => {
      const r = heroStatSchema.safeParse({
        value: 'a',
        labelEs: 'a',
        labelEn: 'a',
        order: 0,
        [field]: value,
      });
      expect(r.success).toBe(false);
    });

    it('defaults order to 0 when omitted', () => {
      const r = heroStatSchema.safeParse({ value: 'a', labelEs: 'a', labelEn: 'a' });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.order).toBe(0);
    });

    it('rejects non-int order', () => {
      expect(
        heroStatSchema.safeParse({
          value: 'a',
          labelEs: 'a',
          labelEn: 'a',
          order: 1.5,
        }).success
      ).toBe(false);
    });
  });

  describe('heroFormSchema (client-side strict)', () => {
    const validPayload = {
      overlineEs: 'Consultor',
      overlineEn: 'Consultant',
      name: 'Carlos',
      headlineEs: 'Transformo',
      headlineEn: 'I transform',
      summaryEs: 'Resumen',
      summaryEn: 'Summary',
      ctaWhatsappEs: 'WA',
      ctaWhatsappEn: 'WA',
      ctaEmailEs: 'Mail',
      ctaEmailEn: 'Mail',
      ctaLinkedinEs: 'IN',
      ctaLinkedinEn: 'IN',
      portraitUrl: null,
      stats: [{ value: '15+', labelEs: 'Años', labelEn: 'Years', order: 0 }],
    };

    it('accepts a complete valid payload', () => {
      expect(heroFormSchema.safeParse(validPayload).success).toBe(true);
    });

    it.each([
      'overlineEs',
      'overlineEn',
      'name',
      'headlineEs',
      'headlineEn',
      'summaryEs',
      'summaryEn',
      'ctaWhatsappEs',
      'ctaWhatsappEn',
      'ctaEmailEs',
      'ctaEmailEn',
      'ctaLinkedinEs',
      'ctaLinkedinEn',
    ])('rejects empty %s (client must enforce required)', (field) => {
      const r = heroFormSchema.safeParse({ ...validPayload, [field]: '' });
      expect(r.success).toBe(false);
    });

    it('rejects when stats is missing entirely', () => {
      const { stats, ...rest } = validPayload;
      void stats; // explicitly omitting to verify required-on-client behavior
      expect(heroFormSchema.safeParse(rest).success).toBe(false);
    });

    it('accepts empty stats array', () => {
      expect(heroFormSchema.safeParse({ ...validPayload, stats: [] }).success).toBe(true);
    });

    it('rejects invalid portraitUrl', () => {
      expect(heroFormSchema.safeParse({ ...validPayload, portraitUrl: 'not-a-url' }).success).toBe(
        false
      );
    });

    it('accepts portraitUrl empty string (transforms to null)', () => {
      const r = heroFormSchema.safeParse({ ...validPayload, portraitUrl: '' });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.portraitUrl).toBeNull();
    });

    it('accepts portraitUrl null', () => {
      expect(heroFormSchema.safeParse({ ...validPayload, portraitUrl: null }).success).toBe(true);
    });

    it('accepts portraitUrl undefined', () => {
      expect(heroFormSchema.safeParse({ ...validPayload, portraitUrl: undefined }).success).toBe(
        true
      );
    });
  });

  describe('contactInfoFormSchema (client-side strict)', () => {
    const validPayload = {
      name: 'Carlos',
      phoneDisplay: '+54 9 11 5555 5555',
      whatsappNumber: '5491155555555',
      email: 'carlos@example.com',
      linkedinUrl: 'https://linkedin.com/in/carlos',
      linkedinHandle: '@carlos',
      location: 'Argentina',
    };

    it('accepts a complete valid payload', () => {
      expect(contactInfoFormSchema.safeParse(validPayload).success).toBe(true);
    });

    it.each(['name', 'phoneDisplay', 'whatsappNumber', 'linkedinHandle', 'location'])(
      'rejects empty %s',
      (field) => {
        expect(contactInfoFormSchema.safeParse({ ...validPayload, [field]: '' }).success).toBe(
          false
        );
      }
    );

    it('rejects invalid email', () => {
      expect(
        contactInfoFormSchema.safeParse({ ...validPayload, email: 'not-an-email' }).success
      ).toBe(false);
    });

    it('rejects invalid linkedinUrl', () => {
      expect(
        contactInfoFormSchema.safeParse({ ...validPayload, linkedinUrl: 'not-a-url' }).success
      ).toBe(false);
    });

    it('accepts valid email formats', () => {
      for (const email of [
        'a@b.co',
        'user.name+tag@subdomain.example.com',
        'carlos@ejemplo.com.ar',
        'x@y.io',
      ]) {
        expect(contactInfoFormSchema.safeParse({ ...validPayload, email }).success).toBe(true);
      }
    });

    it('accepts valid linkedinUrl formats', () => {
      for (const linkedinUrl of [
        'https://linkedin.com/in/carlos',
        'http://linkedin.com/in/carlos',
        'https://www.linkedin.com/in/carlos-guerrero/',
      ]) {
        expect(contactInfoFormSchema.safeParse({ ...validPayload, linkedinUrl }).success).toBe(
          true
        );
      }
    });
  });

  describe('sectionMetaFormSchema (client-side)', () => {
    it('accepts all strings (no validation by design — server is permissive)', () => {
      const r = sectionMetaFormSchema.safeParse({
        overlineEs: 'Servicios',
        overlineEn: 'Services',
        titleEs: 'Lo que hago',
        titleEn: 'What I do',
        descEs: 'Desc',
        descEn: 'Desc',
      });
      expect(r.success).toBe(true);
    });

    it('accepts empty strings (server handles nullability)', () => {
      expect(
        sectionMetaFormSchema.safeParse({
          overlineEs: '',
          overlineEn: '',
          titleEs: '',
          titleEn: '',
          descEs: '',
          descEn: '',
        }).success
      ).toBe(true);
    });

    it('accepts unicode', () => {
      expect(
        sectionMetaFormSchema.safeParse({
          overlineEs: '한글',
          overlineEn: 'Japanese 日本語',
          titleEs: '🎉',
          titleEn: '🚀',
          descEs: 'a',
          descEn: 'a',
        }).success
      ).toBe(true);
    });
  });

  describe('emailSettingsFormSchema (client-side)', () => {
    it('accepts valid email + notificationsEnabled boolean', () => {
      expect(
        emailSettingsFormSchema.safeParse({
          notificationEmail: 'carlos@example.com',
          notificationsEnabled: true,
        }).success
      ).toBe(true);
    });

    it('accepts empty notificationEmail (no notifications)', () => {
      expect(
        emailSettingsFormSchema.safeParse({
          notificationEmail: '',
          notificationsEnabled: false,
        }).success
      ).toBe(true);
    });

    it('rejects malformed email even with empty literal allowed', () => {
      expect(
        emailSettingsFormSchema.safeParse({
          notificationEmail: 'not-an-email',
          notificationsEnabled: true,
        }).success
      ).toBe(false);
    });

    it('rejects notificationsEnabled missing', () => {
      expect(emailSettingsFormSchema.safeParse({ notificationEmail: 'a@b.co' }).success).toBe(
        false
      );
    });
  });

  describe('systemSettingsFormSchema (client-side)', () => {
    it('accepts acceptingProjects: true', () => {
      expect(systemSettingsFormSchema.safeParse({ acceptingProjects: true }).success).toBe(true);
    });

    it('accepts acceptingProjects: false', () => {
      expect(systemSettingsFormSchema.safeParse({ acceptingProjects: false }).success).toBe(true);
    });

    it('rejects missing acceptingProjects', () => {
      expect(systemSettingsFormSchema.safeParse({}).success).toBe(false);
    });

    it('rejects non-boolean acceptingProjects', () => {
      expect(
        systemSettingsFormSchema.safeParse({ acceptingProjects: 'yes' as unknown as boolean })
          .success
      ).toBe(false);
    });
  });
});
