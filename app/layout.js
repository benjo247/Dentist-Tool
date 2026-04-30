import './globals.css';

export const metadata = {
  title: 'Funktionsstatus · Sprach-Erfassung',
  description: 'DGFDT Klinischer Funktionsstatus mit Sprachsteuerung',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
