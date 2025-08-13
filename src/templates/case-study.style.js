import styled from 'styled-components';

export const InfoTitle = styled.h4`
  color: ${p => p.theme.primaryColor};
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  margin: 15px 0;

  ::after {
    content: "";
    display: inline-block;       /* make it render */
    height: 1px;                 /* thickness */
    background-color: blue;      /* color */
    flex-grow: 1;                /* take remaining space */
    margin-left: 10px;           /* space after text */
  }
`;




export const CaseStudyWrapper = styled.section`
  margin-top: 100px;
  margin-bottom: 100px;

  li {
    margin: 5px 0;
  }

  .case__title {
    margin-bottom: 50px;
    h1 {
      margin: 0;
      line-height: 70px;
    }
    .case__links {
      margin: 0;
    }
  }

  .case__info {
    margin-bottom: 70px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;

    @media ${p => p.theme.media.fablet} {
      grid-template-columns: 0.6fr 1fr;
    }
    @media ${p => p.theme.media.tablet} {
      grid-template-columns: 1fr;
    }
  }

  .case__iframe-container {
    width: 100%;
    margin: 10px 0;
  }
  h1 {
    font-size: 1.8rem;
    margin-bottom: 50px;
  }
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 20px 0;
    color: ${p => p.theme.primaryColor};
  }
`;
