import { NextResponse } from 'next/server';

// Schützt UI und API mit HTTP Basic Auth.
// Wenn DEMO_PASSWORD nicht gesetzt ist, läuft alles ohne Auth weiter.

export function middleware(request) {
  const password = process.env.DEMO_PASSWORD;
  if (!password) return NextResponse.next();

  const basicAuth = request.headers.get('authorization');
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    try {
      const decoded = atob(authValue);
      const pwd = decoded.split(':').slice(1).join(':'); // Username egal, nur Passwort prüfen
      if (pwd === password) return NextResponse.next();
    } catch {
      // ungültiges Base64 → Auth fehlgeschlagen
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Funktionsstatus Demo", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
