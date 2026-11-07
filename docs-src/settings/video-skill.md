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

A public YouTube link works too, with fewer parts. See [Video links](#video-links).

## What leaves the sandbox

Some of it leaves the chat's sandbox. Here is what, and to whom.

- **The sound goes to OpenAI.** OpenAI turns the speech into text. A voice in a recording goes with it. So does any customer name said in the recording.
- **A public YouTube link goes to Google.** Google reads the video itself and sends back words. No file passes through the sandbox.
- **Stills and typed words** also reach the AI company running the chat, as with any file a chat reads.
- **The video itself** stays in your organization's storage. It leaves the sandbox only as stills and sound.

Hadji pays for the speech-to-text and for reading links. Your organization needs no account with OpenAI or Google.

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

- **Words only.** There is no file, so the chat reads no stills and cannot zoom on a moment. The reply says so.
- **Chapter times are approximate.** In a test most matched the video's own chapters exactly, but one was 11 seconds late.
- **Google reads the video.** The link goes to Google, a company that handles it for Hadji.
- **Private and unlisted videos cannot be read**, and neither can links from other sites. The chat says so and asks you to upload the file instead.

Turning the skill off stops links too.
