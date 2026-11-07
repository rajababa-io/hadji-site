---
id: settings/video-skill
title: The video skill
summary: What a chat does with an uploaded video or a YouTube link, what leaves the sandbox, and how to turn it off.
screens: []
kind: explainer
order: 170
---

# The video skill

Hadji chats have a **video** skill. It is **on for every organization** until an org admin turns it off. This page tells you what it does, what leaves the sandbox, and how to change it.

## What it does

When you upload a video, a chat can work out what happens in it.

- It reads the speech in the video.
- It picks stills where the picture changes.
- It zooms in on the moment that matters.
- It shows you the proof.

It reads at most 30 stills. Then it reads 30 more on one moment. Then it asks you.

A public YouTube link works too. A chat reads the video and can show you a moment from it. See [Video links](#video-links).

## What leaves the sandbox

Some of it leaves the chat's sandbox. Here is what, and to whom.

- **The sound from an uploaded video goes to OpenAI.** OpenAI turns the speech into text. A voice in a recording goes with it. So does any customer name said in the recording.
- **A public YouTube link goes to Google.** Google reads the video itself and sends back words. No file passes through the sandbox.
- **A still from a YouTube link comes from Browser Use.** Browser Use runs the browser that opens the public video on YouTube and takes a screenshot of the player. It sees the link and the page it opens. No video file is downloaded.
- **Stills and typed words** also reach the AI company running the chat, as with any file a chat reads.
- **An uploaded video** stays in your organization's storage. It leaves the sandbox only as stills and sound.

Hadji pays for the speech-to-text, for reading links and for the browser. No setup by any org is needed: your organization needs no account with OpenAI, Google or Browser Use.

## What OpenAI keeps

OpenAI's [data controls page](https://developers.openai.com/api/docs/guides/your-data), read on 2026-11-06, lists the speech-to-text service (`/v1/audio/transcriptions`) as:

- not used for training
- no abuse-monitoring retention
- no stored application state

Hadji has no separate agreement with OpenAI on this.

## Every reply tells you

Every reply about a video says what was read and where the sound went. If the sound could not be read, the reply says that instead.

## Turn it off

An org admin opens **Settings → Skills → Video** and turns it off. Chats then use stills only and send no sound.

A project or a person can also turn it off for their own chats.

## Change it another way

- Write **org chat instructions**. See [Session instructions](/docs/settings/instructions/).
- Or keep **your organization's own skill** in your repository.

Hadji's updates never touch either of these.

## Video links

A chat can read a **public YouTube link**. Paste it and the chat gives you a summary with chapters.

- **Google reads the video.** Google watches the video itself and answers in words. No file passes through the sandbox.
- **Stills come from a browser.** To show a moment, a browser that Hadji rents from Browser Use opens the public video on YouTube, on Hadji's account, and takes a screenshot of the player. A still is a screenshot, not a downloaded video. Nothing signs in.
- **Limits.** Each workspace gets 200 stills a day. A chat asks you before it takes more than 60 stills of one video.
- **If YouTube or the browser refuses**, the chat says there is no still for that moment and carries on from the words.
- **Chapter times are approximate.** In a test most matched the video's own chapters exactly, but one was 11 seconds late.
- **Private and unlisted videos cannot be read**, and neither can links from other sites. The chat says so and asks you to upload the file instead.

Turning the skill off stops links too.
