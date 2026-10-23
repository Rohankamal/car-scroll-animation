'use client';

import { useEffect } from 'react';
import { initHero } from '../lib/hero';

export default function Hero() {
  useEffect(() => initHero(), []); // returns a cleanup function

  return (
    <>
      <div className="progress" id="progress"></div>

      <main className="track" id="track">
        <section className="stage" id="stage">
          <div className="ground"><div className="dots d1" id="d1"></div><div className="dots d2" id="d2"></div></div>
          <div className="speedlines" id="sl"></div>

    
          <div className="content" id="ghost">
            <h1 className="headline" aria-label="Welcome ItzFizz">WELCOME ITZFIZZ</h1>
            <div className="stats">
              <div className="stat"><b data-count="58" data-suf="%">58%</b><span>Increase in pick up point use</span></div>
              <div className="stat"><b data-count="23" data-suf="%">23%</b><span>Decreased in customer phone calls</span></div>
              <div className="stat"><b data-count="27" data-suf="%">27%</b><span>Increase in pick up point use</span></div>
              <div className="stat"><b data-count="40" data-suf="%">40%</b><span>Decreased in customer phone calls</span></div>
            </div>
          </div>

          <div className="road"><div className="lanes" id="lanes"><i className="l1"></i><i className="l2"></i><i className="l3"></i></div></div>
          <div id="trail"></div>
          <div className="content bright" id="bright" aria-hidden="true"></div>
          <div id="edge"></div>

          <div id="carWrap">
            <div className="underglow" id="underglow"></div>
            <svg id="car" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c93a00"/><stop offset="1" stopColor="#ff9242"/></linearGradient>
                <linearGradient id="beamG" x1="0" x2="1"><stop offset="0" stopColor="#eaffb0" stopOpacity=".55"/><stop offset="1" stopColor="#c6ff3d" stopOpacity="0"/></linearGradient>
                <g id="beams"><polygon points="372,58 660,24 660,92" fill="url(#beamG)"/></g>
                <g id="wheels"><rect x="266" y="10" width="56" height="26" rx="8" fill="#0a0b10"/><rect x="54" y="8" width="64" height="30" rx="9" fill="#0a0b10"/></g>
                <g id="half">
                  <path d="M14 80 L14 58 Q16 46 34 42 L96 38 Q140 34 190 33 L272 36 Q340 42 380 66 Q388 72 388 80 Z" fill="url(#bodyG)"/>
                  <path d="M34 42 L96 38 Q140 34 190 33 L272 36" fill="none" stroke="#c6ff3d" strokeWidth="1.6" opacity=".85"/>
                  <path d="M150 80 L160 58 Q176 50 206 50 L246 54 Q262 58 270 80 Z" fill="#0f121b"/>
                  <path d="M96 44 L132 42 L132 50 L100 52 Z" fill="#7a2200"/>
                  <path d="M246 36 L258 27 L266 37 Z" fill="#a82f00"/>
                  <path d="M338 50 L368 61 L350 63 Z" fill="#fff"/>
                  <rect x="14" y="50" width="5" height="11" rx="1" fill="#ff2e5b"/>
                </g>
              </defs>
              <g id="beamsG"><use href="#beams"/><use href="#beams" transform="translate(0,160) scale(1,-1)"/></g>
              <use href="#wheels"/><use href="#wheels" transform="translate(0,160) scale(1,-1)"/>
              <rect x="6" y="40" width="12" height="80" rx="3" fill="#0d0f16"/>
              <use href="#half"/><use href="#half" transform="translate(0,160) scale(1,-1)"/>
              <rect x="24" y="77" width="362" height="6" fill="#0d0f16" opacity=".5"/>
              <rect x="168" y="68" width="82" height="24" rx="7" fill="#262b3b"/>
            </svg>
          </div>

          <div className="hint"><span>Scroll to drive</span><i></i></div>
          <div className="hud"><span id="speed">000</span><small>km/h</small></div>
        </section>
      </main>

      <section className="finale">
        <p className="reveal text-sm uppercase tracking-[.4em]" style={{ color: 'var(--accent)' }}>Finish line</p>
        <h2 className="reveal">Motion that<br />feels alive.</h2>
        <p className="reveal sub">Scroll back up and the car reverses all the way to the start.</p>
      </section>
    </>
  );
}
