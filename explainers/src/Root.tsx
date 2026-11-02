import React from 'react';
import {Composition} from 'remotion';
import {ChangeToProduction, CHANGE_TO_PRODUCTION_FRAMES} from './ChangeToProduction';
import {HowASessionWorks, HOW_A_SESSION_WORKS_FRAMES} from './HowASessionWorks';
import {FPS, H, W} from './kit';

// Composition ids are the media ids: docs/media/<id>.mp4
export const Root: React.FC = () => (
  <>
    <Composition id="change-to-production" component={ChangeToProduction} durationInFrames={CHANGE_TO_PRODUCTION_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="how-a-session-works" component={HowASessionWorks} durationInFrames={HOW_A_SESSION_WORKS_FRAMES} fps={FPS} width={W} height={H} />
  </>
);
