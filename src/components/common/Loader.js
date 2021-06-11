import React from 'react';
import ContentLoader from 'react-content-loader';

const DashboardLoader = (props) => (
  <ContentLoader
    speed={2}
    width={600}
    height={100}
    viewBox="0 0 600 100"
    backgroundColor="#f0f0f0"
    foregroundColor="#dedede"
    {...props}>
    <rect x="52" y="17" rx="3" ry="3" width="144" height="10" />
    <rect x="0" y="56" rx="3" ry="3" width="406" height="10" />
    <rect x="1" y="77" rx="3" ry="3" width="350" height="10" />
    <circle cx="20" cy="20" r="20" />
  </ContentLoader>
);

export { DashboardLoader };
