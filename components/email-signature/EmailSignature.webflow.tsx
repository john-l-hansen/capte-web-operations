import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { EmailSignature } from './EmailSignature';

export default declareComponent(EmailSignature, {
  name: 'Email Signature',
  description: 'Standard Outlook email signature generator matching Capte Technologies brand guidelines and accessibility standards.',
  group: 'Marketing & Internal Utilities',
  props: {
    fullName: props.Text({
      name: 'Full Name',
      defaultValue: 'John Hansen',
    }),
    pronouns: props.Text({
      name: 'Pronouns (optional)',
      defaultValue: '',
    }),
    jobTitle: props.Text({
      name: 'Job Title',
      defaultValue: 'Lead Web/Print Designer & Web Operations',
    }),
    email: props.Text({
      name: 'Email Address',
      defaultValue: 'john@capte.co',
    }),
    mobile: props.Text({
      name: 'Mobile Phone',
      defaultValue: '+1 858 231 2916',
    }),
    officePhone: props.Text({
      name: 'Office Phone (optional)',
      defaultValue: '',
    }),
    office: props.Variant({
      name: 'Office Location',
      options: ['la', 'fr', 'nl'],
      defaultValue: 'la',
    }),
    labelLang: props.Variant({
      name: 'Label Language',
      options: ['en', 'fr', 'nl'],
      defaultValue: 'en',
    }),
    linkedinUrl: props.Text({
      name: 'LinkedIn Profile URL (optional)',
      defaultValue: '',
    }),
    sigType: props.Variant({
      name: 'Signature Variant',
      options: ['new', 'reply'],
      defaultValue: 'new',
    }),
    logoUrl: props.Text({
      name: 'Hosted Logo URL',
      defaultValue: '{{LOGO_URL}}',
    }),
    legalLine: props.Text({
      name: 'Legal / Registration Line (optional)',
      defaultValue: '',
    }),
  },
});
