'use client';

import { ContactDirect, type ContactInfo } from './ContactDirect';
import { ContactForm } from './ContactForm';

type ContactProps = {
  overline: string;
  title: string;
  desc: string;
  contact: ContactInfo;
};

export function Contact({ overline, title, desc, contact }: ContactProps) {
  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="border-border bg-background border-b py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <ContactDirect overline={overline} title={title} desc={desc} contact={contact} />
          <ContactForm whatsappNumber={contact.whatsappNumber} />
        </div>
      </div>
    </section>
  );
}
