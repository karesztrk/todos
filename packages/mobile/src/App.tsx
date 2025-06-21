import { useCallback, useEffect, useState } from '@lynx-js/react';

import './styles/app.css';
import './App.css';
import arrow from './assets/arrow.png';
import lynxLogo from './assets/lynx-logo.png';
import reactLynxLogo from './assets/react-logo.png';
import Footer from './components/Footer/Footer.js';
import Header from './components/Header/Header.js';

export function App(props: { onMounted?: () => void }) {
  const [alterLogo, setAlterLogo] = useState(false);

  useEffect(() => {
    console.info('Hello, ReactLynx');
    props.onMounted?.();
  }, []);

  const onTap = useCallback(() => {
    'background only';
    setAlterLogo(!alterLogo);
  }, [alterLogo]);

  return (
    <view>
      <Header />
      <view className="main">
        {/* <view className="Banner"> */}
        {/*   <view className="Logo" bindtap={onTap}> */}
        {/*     {alterLogo ? ( */}
        {/*       <image src={reactLynxLogo} className="Logo--react" /> */}
        {/*     ) : ( */}
        {/*       <image src={lynxLogo} className="Logo--lynx" /> */}
        {/*     )} */}
        {/*   </view> */}
        {/*   <text className="Title">React</text> */}
        {/*   <text className="Subtitle">on Lynx</text> */}
        {/* </view> */}
        <view className="content">
          <text className="description">Tap the logo and have fun!</text>
          <text className="hint">
            Edit<text style={{ fontStyle: 'italic' }}>{' src/App.tsx '}</text>
            to see updates!
          </text>
        </view>
        <Footer />
      </view>
    </view>
  );
}
