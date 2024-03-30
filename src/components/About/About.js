import React from 'react';

import SkewBg from '@common/SkewBg';
import PageHeader from '@common/PageHeader';
import Flex from '@common/Flex';

import Quote from './Quote';
import Avatar from './Avatar';

import { AboutWrapper, AboutInfo } from './About.style';

const About = () => {
  return (
    <AboutWrapper id="about">
      <PageHeader>About Me</PageHeader>
      <SkewBg />
      <AboutInfo>
        <div>
          <Avatar src="hfest_avatar_2.jpg" />
        </div>
        <p>
          Hi, I'm Sagar Sahu, a self-taught passionate FullStack developer from
          India, currently studying at{' '}
          <a className="about__link" href="https://www.lpu.in/">
            Lovely Professional University
          </a>{' '}
          as a FrontStack Developer. I've been building stuff on the web since when
          I was in 12th standard, I've made countless side projects and I also
          posses magical powers of using react to build delightful user
          interfaces.
          <br />
          <br />I also love doing <b>open source</b> development,<b>Freelancing</b>, & <b>Graphic Designing</b>. It gives me a
          wonderful feeling of achievement and joy which I cannot explain in
          words.
        </p>
      </AboutInfo>

      <Flex justify="space-between" className="quotes__wrapper">
        <Quote>
          <p>
            “Simplicity for geeks is like debugging code: the fewer lines, the fewer bugs, and the more time for memes!.“
          </p>
        </Quote>
        <Quote>
          <p>
            “I know I’m not successful enough, but I’m passionate enough not to
            worry about success.“
          </p>
        </Quote>
        <Quote>
          <p>
            “Creativity is the driver of an unstoppable train called Passion.”
          </p>
        </Quote>
      </Flex>
    </AboutWrapper>
  );
};

export default About;
