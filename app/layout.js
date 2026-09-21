import './globals.css'

export const metadata = {
  title: 'Elakkiya Selvarajan — Frontend Developer & React Native Engineer',
  description:
    '3+ years building mobile, web, APIs and native integrations. React Native and web products that run in production.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fraunces = the editorial display serif of the reference art
            direction; Manrope = the clean modern sans used for all UI text.
            The canvas-drawn 3D faces (canvas/textures.js) use these same two
            families so screens and DOM typography match. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
