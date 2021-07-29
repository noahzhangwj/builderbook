import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import * as NProgress from 'nprogress';

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', (url) => {
  if (window && process.env.GA_MEASUREMENT_ID) {
    window.gtag('config', process.env.GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }

  NProgress.done();
});

Router.events.on('routeChangeError', () => NProgress.done());

let globalUser = null;

export default function withAuth(
  BaseComponent,
  { loginRequired = true, logoutRequired = false, adminRequired = false, homepage = false } = {},
) {
  class App extends React.Component {
    static async getInitialProps(ctx) {
      const isFromServer = typeof window === 'undefined';
      const user = ctx.req ? ctx.req.user && ctx.req.user.toObject() : globalUser;

      if (isFromServer && user) {
        user._id = user._id.toString();
      }

      const props = { user, isFromServer };

      if (BaseComponent.getInitialProps) {
        Object.assign(props, (await BaseComponent.getInitialProps(ctx)) || {});
      }

      return props;
    }

    componentDidMount() {
      const { user, isFromServer } = this.props;

      if (isFromServer) {
        globalUser = user;
      }

      if (homepage && !user) {
        const book = {
          slug: process.env.BOOK_SLUG,
          chapterSlug: process.env.BOOK_CHAPTER_SLUG,
        };
        
        Router.push(`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${book.chapterSlug}`, '/');
        return;
      }

      if (loginRequired && !logoutRequired && !user) {
        Router.push('/public/login', '/login');
        return;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        Router.push('/customer/my-books', '/my-books');
      }

      if (logoutRequired && user) {
        Router.push('/');
      }

    }

    render() {
      const { user } = this.props;

      if (homepage && !user) {
        return null;
      }
      
      if (loginRequired && !logoutRequired && !user) {
        return null;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        return null;
      }

      if (logoutRequired && user) {
        return null;
      }

      return (
        <>
          <BaseComponent {...this.props} />
        </>
      );
    }
  }

  const propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      isAdmin: PropTypes.bool,
    }),
    isFromServer: PropTypes.bool.isRequired,
  };

  const defaultProps = {
    user: null,
  };

  App.propTypes = propTypes;
  App.defaultProps = defaultProps;

  return App;
}
