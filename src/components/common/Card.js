import styled from 'styled-components';
import Flex from './Flex';

export const Card = styled.div`
  margin: 10px;
  flex: 1 1 200px;
  max-width: 300px;

  height: 300px;
  padding: 20px;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  text-align: center;

  background-color: ${props => props.theme.secondaryColor};
  box-shadow: ${props => props.theme.shadowSmall};
  border-radius: 10px;

  @media ${props => props.theme.media.tablet} {
    flex: 1 1 100%;
    margin: 20px auto;
    max-width: 100%;
  }
`;

export const CardIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.gradient};
  color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  svg {
    font-size: 2rem;
    max-width: 100%;
    max-height: 100%;
  }
`;

export const CardTitle = styled.h3`
  font-weight: normal;
  color: ${p => (p.theme.dark ? p.theme.primaryText : p.theme.primaryColor)};
`;

export const CardText = styled.p`
  font-size: 14px;
  max-width: 100%;
  overflow-wrap: break-word;
`;

export const CardFooter = styled(Flex)`
  width: 100%;
  padding: 20px;

  a {
    margin-left: 5px;
  }
`;
