import React, { useState } from 'react';
import * as styles from './EmailSignature.module.css';

export interface EmailSignatureProps {
  fullName?: string;
  pronouns?: string;
  jobTitle?: string;
  email?: string;
  mobile?: string;
  officePhone?: string;
  office?: 'la' | 'fr' | 'nl';
  labelLang?: 'en' | 'fr' | 'nl';
  linkedinUrl?: string;
  sigType?: 'new' | 'reply';
  logoUrl?: string;
  legalLine?: string;
}

const OFFICE_DATA = {
  la: {
    label: 'Los Angeles',
    line1: '500 S Grand Ave, Suite 2060',
    line2: 'Los Angeles, CA 90071',
    country: { en: 'United States', fr: 'États-Unis', nl: 'Verenigde Staten' },
    defaultLang: 'en',
    dial: '+1',
    path: '',
  },
  fr: {
    label: 'Versailles',
    line1: '7 rue des Chantiers',
    line2: '78000 Versailles',
    country: { en: 'France', fr: 'France', nl: 'Frankrijk' },
    defaultLang: 'fr',
    dial: '+33',
    path: '',
  },
  nl: {
    label: 'Amsterdam',
    line1: 'Kabelweg 57',
    line2: '1014 BA Amsterdam',
    country: { en: 'Netherlands', fr: 'Pays-Bas', nl: 'Nederland' },
    defaultLang: 'nl',
    dial: '+31',
    path: '',
  },
};

const LABELS = {
  en: { mobile: 'Mobile', office: 'Office', email: 'Email', web: 'Web' },
  fr: { mobile: 'Portable', office: 'Bureau', email: 'E-mail', web: 'Site web' },
  nl: { mobile: 'Mobiel', office: 'Kantoor', email: 'E-mail', web: 'Website' },
};

export const EmailSignature: React.FC<EmailSignatureProps> = ({
  fullName = 'John Hansen',
  pronouns = '',
  jobTitle = 'Lead Web/Print Designer & Web Operations',
  email = 'john@capte.co',
  mobile = '+1 858 231 2916',
  officePhone = '',
  office = 'la',
  labelLang = 'en',
  linkedinUrl = '',
  sigType = 'new',
  logoUrl = '{{LOGO_URL}}',
  legalLine = '',
}) => {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  const selectedOffice = OFFICE_DATA[office] || OFFICE_DATA.la;
  const selectedLabels = LABELS[labelLang] || LABELS.en;
  const countryName = selectedOffice.country[labelLang] || selectedOffice.country.en;
  const siteUrl = `https://www.capte.co${selectedOffice.path || ''}?utm_source=email-signature&utm_medium=email&utm_campaign=employee-signature&utm_content=office-${office}`;
  const telDigits = mobile.replace(/[^0-9+]/g, '');
  const officeTelDigits = officePhone ? officePhone.replace(/[^0-9+]/g, '') : '';

  const handleCopy = async () => {
    try {
      const container = document.getElementById(`capte-sig-preview-${office}-${labelLang}-${sigType}`);
      if (container) {
        const html = container.innerHTML;
        const plain = `${fullName}${pronouns ? ` (${pronouns})` : ''}\n${jobTitle}, Capte Technologies\nMobile: ${mobile}\nEmail: ${email}\nWeb: capte.co`;
        if (navigator.clipboard && window.ClipboardItem) {
          const htmlBlob = new Blob([html], { type: 'text/html' });
          const plainBlob = new Blob([plain], { type: 'text/plain' });
          await navigator.clipboard.write([
            new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': plainBlob }),
          ]);
          setCopiedStatus('Copied!');
          setTimeout(() => setCopiedStatus(null), 2500);
        }
      }
    } catch (e) {
      console.warn('Copy error:', e);
    }
  };

  return (
    <div className={styles.signatureWrapper}>
      <div
        id={`capte-sig-preview-${office}-${labelLang}-${sigType}`}
        className={styles.signatureContainer}
      >
        {sigType === 'reply' ? (
          <table
            role="presentation"
            lang={labelLang}
            cellPadding={0}
            cellSpacing={0}
            border={0}
            style={{ borderCollapse: 'collapse', fontFamily: 'Arial,Helvetica,sans-serif' }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    fontFamily: 'Arial,Helvetica,sans-serif',
                    fontSize: '15px',
                    lineHeight: '20px',
                    fontWeight: 'bold',
                    color: '#001384',
                    padding: '0',
                  }}
                >
                  {fullName}
                  {pronouns ? (
                    <span style={{ fontWeight: 'normal', fontSize: '13px', color: '#5C6470' }}>
                      &nbsp;({pronouns})
                    </span>
                  ) : null}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontFamily: 'Arial,Helvetica,sans-serif',
                    fontSize: '13px',
                    lineHeight: '18px',
                    color: '#0F0F11',
                    padding: '0 0 10px 0',
                  }}
                >
                  {jobTitle}, Capte Technologies
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0' }}>
                  <table
                    role="presentation"
                    cellPadding={0}
                    cellSpacing={0}
                    border={0}
                    style={{ borderCollapse: 'collapse' }}
                  >
                    <tbody>
                      <tr>
                        <td
                          width="64"
                          style={{
                            fontFamily: 'Arial,Helvetica,sans-serif',
                            width: '64px',
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#5C6470',
                            padding: '0',
                            verticalAlign: 'top',
                          }}
                        >
                          {selectedLabels.mobile}
                        </td>
                        <td
                          style={{
                            fontFamily: 'Arial,Helvetica,sans-serif',
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#0F0F11',
                            padding: '0',
                            verticalAlign: 'top',
                          }}
                        >
                          <a
                            href={`tel:${telDigits}`}
                            style={{ color: '#0F0F11', textDecoration: 'none' }}
                          >
                            {mobile}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table
            role="presentation"
            lang={labelLang}
            cellPadding={0}
            cellSpacing={0}
            border={0}
            style={{ borderCollapse: 'collapse', fontFamily: 'Arial,Helvetica,sans-serif' }}
          >
            <tbody>
              <tr>
                <td style={{ padding: '0' }}>
                  <a href={siteUrl} style={{ textDecoration: 'none' }}>
                    <img
                      src={logoUrl}
                      width={189}
                      height={92}
                      alt="Capte Technologies"
                      style={{
                        display: 'block',
                        border: 0,
                        outline: 'none',
                        width: '189px',
                        height: '92px',
                      }}
                    />
                  </a>
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontFamily: 'Arial,Helvetica,sans-serif',
                    fontSize: '15px',
                    lineHeight: '20px',
                    fontWeight: 'bold',
                    color: '#001384',
                    padding: '2px 0 0 22px',
                  }}
                >
                  {fullName}
                  {pronouns ? (
                    <span style={{ fontWeight: 'normal', fontSize: '13px', color: '#5C6470' }}>
                      &nbsp;({pronouns})
                    </span>
                  ) : null}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontFamily: 'Arial,Helvetica,sans-serif',
                    fontSize: '13px',
                    lineHeight: '18px',
                    color: '#0F0F11',
                    padding: '0 0 10px 22px',
                  }}
                >
                  {jobTitle}
                </td>
              </tr>
              {/* Mobile */}
              <tr>
                <td style={{ padding: '0 0 0 22px' }}>
                  <table
                    role="presentation"
                    cellPadding={0}
                    cellSpacing={0}
                    border={0}
                    style={{ borderCollapse: 'collapse' }}
                  >
                    <tbody>
                      <tr>
                        <td
                          width="64"
                          style={{
                            fontFamily: 'Arial,Helvetica,sans-serif',
                            width: '64px',
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#5C6470',
                            padding: '0',
                            verticalAlign: 'top',
                          }}
                        >
                          {selectedLabels.mobile}
                        </td>
                        <td
                          style={{
                            fontFamily: 'Arial,Helvetica,sans-serif',
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#0F0F11',
                            padding: '0',
                            verticalAlign: 'top',
                          }}
                        >
                          <a
                            href={`tel:${telDigits}`}
                            style={{ color: '#0F0F11', textDecoration: 'none' }}
                          >
                            {mobile}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              {/* Office Phone (optional) */}
              {officePhone ? (
                <tr>
                  <td style={{ padding: '0 0 0 22px' }}>
                    <table
                      role="presentation"
                      cellPadding={0}
                      cellSpacing={0}
                      border={0}
                      style={{ borderCollapse: 'collapse' }}
                    >
                      <tbody>
                        <tr>
                          <td
                            width="64"
                            style={{
                              fontFamily: 'Arial,Helvetica,sans-serif',
                              width: '64px',
                              fontSize: '13px',
                              lineHeight: '20px',
                              color: '#5C6470',
                              padding: '0',
                              verticalAlign: 'top',
                            }}
                          >
                            {selectedLabels.office}
                          </td>
                          <td
                            style={{
                              fontFamily: 'Arial,Helvetica,sans-serif',
                              fontSize: '13px',
                              lineHeight: '20px',
                              color: '#0F0F11',
                              padding: '0',
                              verticalAlign: 'top',
                            }}
                          >
                            <a
                              href={`tel:${officeTelDigits}`}
                              style={{ color: '#0F0F11', textDecoration: 'none' }}
                            >
                              {officePhone}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              ) : null}
              {/* Email */}
              <tr>
                <td style={{ padding: '0 0 0 22px' }}>
                  <table
                    role="presentation"
                    cellPadding={0}
                    cellSpacing={0}
                    border={0}
                    style={{ borderCollapse: 'collapse' }}
                  >
                    <tbody>
                      <tr>
                        <td
                          width="64"
                          style={{
                            fontFamily: 'Arial,Helvetica,sans-serif',
                            width: '64px',
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#5C6470',
                            padding: '0',
                            verticalAlign: 'top',
                          }}
                        >
                          {selectedLabels.email}
                        </td>
                        <td
                          style={{
                            fontFamily: 'Arial,Helvetica,sans-serif',
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#0F0F11',
                            padding: '0',
                            verticalAlign: 'top',
                          }}
                        >
                          <a
                            href={`mailto:${email}`}
                            style={{ color: '#0F0F11', textDecoration: 'none' }}
                          >
                            {email}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              {/* Web & LinkedIn */}
              <tr>
                <td style={{ padding: '0 0 0 22px' }}>
                  <table
                    role="presentation"
                    cellPadding={0}
                    cellSpacing={0}
                    border={0}
                    style={{ borderCollapse: 'collapse' }}
                  >
                    <tbody>
                      <tr>
                        <td
                          width="64"
                          style={{
                            fontFamily: 'Arial,Helvetica,sans-serif',
                            width: '64px',
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#5C6470',
                            padding: '0',
                            verticalAlign: 'top',
                          }}
                        >
                          {selectedLabels.web}
                        </td>
                        <td
                          style={{
                            fontFamily: 'Arial,Helvetica,sans-serif',
                            fontSize: '13px',
                            lineHeight: '20px',
                            color: '#0F0F11',
                            padding: '0',
                            verticalAlign: 'top',
                          }}
                        >
                          <a
                            href={siteUrl}
                            style={{ color: '#001384', textDecoration: 'underline' }}
                          >
                            capte.co
                          </a>
                          {linkedinUrl ? (
                            <>
                              &nbsp;&nbsp;
                              <a
                                href={linkedinUrl}
                                style={{ color: '#001384', textDecoration: 'underline' }}
                              >
                                LinkedIn
                              </a>
                            </>
                          ) : null}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              {/* Address */}
              <tr>
                <td
                  style={{
                    fontFamily: 'Arial,Helvetica,sans-serif',
                    fontSize: '13px',
                    lineHeight: '18px',
                    color: '#5C6470',
                    padding: '10px 0 0 22px',
                  }}
                >
                  {selectedOffice.line1}
                  <br />
                  {selectedOffice.line2}, {countryName}
                </td>
              </tr>
              {/* Optional Legal Line */}
              {legalLine ? (
                <tr>
                  <td
                    style={{
                      fontFamily: 'Arial,Helvetica,sans-serif',
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#5C6470',
                      padding: '8px 0 0 22px',
                    }}
                  >
                    {legalLine}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>
      <div className={styles.copyToolbar}>
        <button
          type="button"
          onClick={handleCopy}
          className={styles.copyButton}
          aria-label="Copy signature to clipboard"
        >
          {copiedStatus ? copiedStatus : 'Copy signature'}
        </button>
      </div>
    </div>
  );
};
