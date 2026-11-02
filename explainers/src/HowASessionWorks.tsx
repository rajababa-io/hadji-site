import React from 'react';
import {Arrow, Bubble, Box, Branch, Captions, Cursor, Label, Stage, Step, Terminal, Title, C, mono, sec, useProgress} from './kit';

export const HOW_A_SESSION_WORKS_FRAMES = sec(72);

const START = sec(3);
const at = (s: number) => START + sec(s);
const END = at(62);

const steps: Step[] = [
  {from: at(0), caption: 'You ask for something, in plain words.'},
  {from: at(9), caption: 'The agent gets its own sandbox — a private copy of the project.'},
  {from: at(19), caption: 'It works there: reads code, edits, runs tests. Your live site is untouched.'},
  {from: at(31), caption: 'On anything that matters, it stops and asks for your OK.'},
  {from: at(42), caption: 'You approve. It carries on.'},
  {from: at(49), caption: 'It opens a pull request with the finished change.'},
  {from: at(57), caption: 'Checks pass, it merges — and tells you what shipped.'},
];

const Approval: React.FC = () => {
  const p = useProgress(at(31), 12);
  const approved = useProgress(at(42) + 20, 8) > 0.5;
  const gone = useProgress(at(47), 8);
  if (p === 0 || gone >= 1) return null;
  return (
    <div style={{position: 'absolute', left: 700, top: 395, width: 520, opacity: p * (1 - gone), padding: 20, borderRadius: 18, background: C.panel,
      border: `2px solid ${approved ? C.green : C.amber}`, boxShadow: `0 0 28px ${approved ? C.green : C.amber}33`}}>
      <div style={{fontSize: 14, fontWeight: 600, letterSpacing: 1.5, color: approved ? C.green : C.amber, textTransform: 'uppercase'}}>
        {approved ? 'Approved' : 'Needs your OK'}
      </div>
      <div style={{fontSize: 21, margin: '8px 0 14px'}}>Change the login database table?</div>
      <div style={{display: 'flex', gap: 12}}>
        <div style={{padding: '8px 22px', borderRadius: 12, fontWeight: 600, fontSize: 19, background: approved ? C.green : C.orange, color: C.bg}}>{approved ? '✓ Approved' : 'Approve'}</div>
        <div style={{padding: '8px 22px', borderRadius: 12, fontSize: 19, border: `1.5px solid ${C.line2}`, color: C.mute}}>Not yet</div>
      </div>
    </div>
  );
};

export const HowASessionWorks: React.FC = () => (
  <Stage>
    <Label x={60} y={90} text="Chat" at={at(0)} />
    <Label x={700} y={90} text="Agent's sandbox" at={at(9)} />
    <Bubble x={60} y={120} w={520} who="you" type at={at(0) + 15} text="Add a dark-mode toggle to the settings page." />
    <Bubble x={60} y={250} w={520} who="agent" at={at(9)} text="On it. I'm setting up a sandbox and a branch." />
    <Bubble x={60} y={380} w={520} who="agent" at={at(31)} text="I need to change a database table. OK to go ahead?" />
    <Bubble x={60} y={380 + 130} w={520} who="agent" at={at(49)} text="Done — pull request is open." />

    <Terminal
      x={700} y={120} w={520} h={250} title="sandbox · own copy of the project" at={at(9)} border={C.blue}
      lines={[
        {t: '$ git checkout -b dark-mode', at: at(10), c: C.mute},
        {t: 'reading settings/page.tsx …', at: at(19)},
        {t: 'editing theme.ts, Toggle.tsx', at: at(22)},
        {t: '$ npm test', at: at(25), c: C.mute},
        {t: '✓ 42 tests passed', at: at(28), c: C.green},
        {t: 'migration needed → pausing', at: at(31), c: C.amber},
        {t: 'resumed after your OK', at: at(43), c: C.green},
      ]}
    />
    <Approval />
    <Branch x={700} y={590} w={520} label="dark-mode" color={C.blue} at={at(19)} dots={[at(22), at(28), at(44)]} />

    <Box x={700} y={410} w={190} h={90} label="Pull request" icon="🔀" at={at(49)} doneAt={at(57)} />
    <Box x={1000} y={410} w={190} h={90} label="Merged" sub="in dev" icon="🌿" at={at(57)} doneAt={at(57) + sec(5)} accent={C.green} />
    <Arrow pts={[[890, 455], [1000, 455]]} at={at(57)} />

    <Cursor
      path={[
        {f: at(40), x: 1100, y: 640},
        {f: at(42) + 10, x: 770, y: 480},
        {f: at(43), x: 770, y: 480},
        {f: at(44), x: 1100, y: 650},
      ]}
      clicks={[at(42) + 20]}
    />
    <Captions steps={steps} end={END} />
    <Title title="How a session works" sub="Ask · sandbox · your OK · pull request · merge" from={0} to={START} />
    <Title title="You stay in charge" sub="The agent does the work. You approve what matters." from={END} to={sec(72)} />
  </Stage>
);
