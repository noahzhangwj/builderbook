import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

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
  
  constructor(props) {
    this.redirect = React.createRef();
  }
  
  componentDidMount() {
    this.redirect.current && this.redirect.current.click();
  }
  
  render() {
    const book = [{
      slug: "how-to-be-a-web-developer",
      chapterSlug: "my-first-book-for-builder-book-applicaiton",
    }];
    const { user } = this.props;
    return (<div> 
      { user ?
        (
          <div style={{ padding: '10px 45px' }}>
            <Head>
              <title>Settings</title>
              <meta name="description" content="List of purchased books." />
            </Head>
            <p>List of purchased books</p>
            <p>Email:&nbsp;{user.email}</p>
          </div>
        ):
        (
          <div>
            <Link
              as={`/`}
              href={`/public/read-chapter?bookSlug=${book[0].slug}&chapterSlug=${book[0].chapterSlug}`}
            >
              <a ref={this.redirect} style={{ margin: '0px 20px 0px auto', display:'none' }}>Book#1 How to be a web developer</a>
            </Link>
            Redirecting...
          </div>
        )
    }</div>);
  }
}

Index.propTypes = propTypes;
Index.defaultProps = defaultProps;

export default withAuth(Index, { logoutRequired: true });
