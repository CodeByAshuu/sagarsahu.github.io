import React from 'react';

import Layout from '@components/Layout/Layout';
import Seo from '@components/seo';

import { Link } from 'gatsby';

const NotFoundPage = () => (
  <Layout>
    <Seo title="404: Not found" />
    <h1>Opps, seems like you are lost!</h1>
    <p>
      Mind going back? or <Link to="/blog">read some blogs</Link>
    </p>
  </Layout>
);

export default NotFoundPage;
