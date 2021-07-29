import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Router from 'next/link';

import withAuth from '../lib/withAuth';

const propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  user: null,
};

// eslint-disable-next-line react/prefer-stateless-function
class Index extends React.Component {
  
  componentDidMount() {
    const book = {
      slug: "how-to-be-a-web-developer",
      chapterSlug: "my-first-book-for-builder-book-applicaiton",
    };
    
    !this.props.user && 
    Router.push(`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${book.chapterSlug}`, '/');
  }
  
  render() {
    const { user } = this.props;
    
    return (<div>
      { user &&　(
        <div style={{ padding: '10px 45px' }}>
          <Head>
            <title>Settings</title>
            <meta name="description" content="List of purchased books." />
          </Head>
          <p>List of purchased books</p>
          <p>Email:&nbsp;{user.email}</p>
        </div>
      )} </div>);
  }
}

Index.propTypes = propTypes;
Index.defaultProps = defaultProps;

export default withAuth(Index, { loginRequired: false });
