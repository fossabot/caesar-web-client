import React from 'react';
// eslint-disable-next-line
import { default as NextDocument, Head, Main, NextScript } from 'next/document';
import styled, { ServerStyleSheet } from 'styled-components';
import { PORTAL_ID } from '@caesar/common/constants';
import sprite from 'svg-sprite-loader/runtime/sprite.build';

const Body = styled.body``;

export default class Document extends NextDocument {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />),
    );
    const styleTags = sheet.getStyleElement();
    const spriteContent = sprite.stringify();

    return { ...page, styleTags, spriteContent };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {this.props.styleTags}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/public/images/favicon/apple-touch-icon.png"
          />
          <link
            rel="mask-icon"
            href="/public/images/favicon/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <Body>
          <div dangerouslySetInnerHTML={{ __html: this.props.spriteContent }} />
          <div id={PORTAL_ID} />
          <Main />
          <NextScript />
        </Body>
      </html>
    );
  }
}
