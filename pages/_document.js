import Document,{ Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage

    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App) => App,
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      })

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-33MLKFGHVX"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-33MLKFGHVX');
              `,
            }}
          ></script>
          <link rel="shortcut icon" href="images/SVG/logo-3.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <script src="https://sa.myfatoorah.com/cardview/v2/session.js" defer/>
        <script src="https://sa.myfatoorah.com/applepay/v2/applepay.js" defer/> 
      </Html>
    )
  };
}
export default MyDocument;
