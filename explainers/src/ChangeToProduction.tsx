import React from 'react';
import {Arrow, Box, Captions, Cursor, Label, Stage, Step, Title, C, sec} from './kit';

export const CHANGE_TO_PRODUCTION_FRAMES = sec(75);

const START = sec(3);
const STEP = sec(7);
const at = (i: number) => START + i * STEP;
const END = at(9);

const nodes = [
  {label: 'Issue', sub: 'the job', icon: '📝', x: 60, y: 140},
  {label: 'Session', sub: 'agent + sandbox', icon: '🤖', x: 300, y: 140},
  {label: 'Pull request', sub: 'proposed change', icon: '🔀', x: 540, y: 140},
  {label: 'CI', sub: 'tests & checks', icon: '🧪', x: 780, y: 140},
  {label: 'Merge → dev', sub: 'shared test branch', icon: '🌿', x: 1020, y: 140},
  {label: 'Preview', sub: 'dev site, not live', icon: '👀', x: 60, y: 380},
  {label: 'Release', sub: 'dev → main', icon: '🚀', x: 300, y: 380},
  {label: 'main', sub: 'the live branch', icon: '🔒', x: 540, y: 380},
  {label: 'Production', sub: 'customers see it', icon: '🌍', x: 780, y: 380, accent: C.green},
];

const steps: Step[] = [
  {from: at(0), caption: 'You file an issue — the job, in plain words.'},
  {from: at(1), caption: 'A session picks it up and works in its own sandbox.'},
  {from: at(2), caption: 'It opens a pull request — the proposed change.'},
  {from: at(3), caption: 'CI runs the tests and checks on its own.'},
  {from: at(4), caption: 'Checks green? The change merges into dev, the shared test branch.'},
  {from: at(5), caption: 'dev deploys to a preview site — safe to look at, not live.'},
  {from: at(6), caption: 'When you are happy, you click Release.'},
  {from: at(7), caption: 'The Release merges dev into main, the live branch.'},
  {from: at(8), caption: 'main deploys to production. Customers see the change.'},
];

const center = (i: number): [number, number] => [nodes[i].x + 95, nodes[i].y + 55];

// arrow i connects node i → node i+1
const arrowPts = (i: number): [number, number][] => {
  const a = nodes[i], b = nodes[i + 1];
  if (i === 4) return [[a.x + 95, a.y + 110], [a.x + 95, 310], [b.x + 95, 310], [b.x + 95, b.y]];
  return [[a.x + 190, a.y + 55], [b.x, b.y + 55]];
};

export const ChangeToProduction: React.FC = () => (
  <Stage>
    <Label x={60} y={100} text="Build & check" at={at(0)} />
    <Label x={60} y={340} text="Ship" at={at(5)} />
    {nodes.map((n, i) => (
      <Box key={n.label} {...n} at={at(i)} doneAt={i === 8 ? at(8) + sec(5) : at(i + 1)} />
    ))}
    {nodes.slice(0, -1).map((_, i) => (
      <Arrow key={i} pts={arrowPts(i)} at={at(i + 1) - 4} dur={20} />
    ))}
    <Cursor
      path={[
        {f: at(0) - 20, x: 400, y: 330},
        {f: at(0) + 30, x: center(0)[0], y: center(0)[1]},
        {f: at(0) + 120, x: center(0)[0], y: center(0)[1]},
        {f: at(1) + 20, x: 640, y: 480},
        {f: at(6) - 10, x: 640, y: 480},
        {f: at(6) + 40, x: center(6)[0], y: center(6)[1]},
        {f: at(6) + 150, x: center(6)[0], y: center(6)[1]},
        {f: at(7) + 30, x: 640, y: 600},
      ]}
      clicks={[at(0) + 60, at(6) + 90]}
    />
    <Captions steps={steps} end={END} />
    {/* outro */}
    <Title title="Nothing goes live unchecked" sub="CI gates every merge · you press Release" from={END} to={sec(75)} />
    <Title title="How a change reaches production" sub="Issue → session → PR → CI → dev → Release → main → production" from={0} to={START} />
  </Stage>
);
