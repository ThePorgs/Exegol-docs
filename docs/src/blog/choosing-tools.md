---
title: Choosing tools for Exegol
date: 2025-09-22
author: Charlie
description: How we choose which tools go into Exegol. We focus on what pros actually use, guided by our expertise and fair community input.
sidebar: false
---

# Choosing tools for Exegol: the art of tough decisions

Hey Exegol community! 

We've had some fantastic opportunities lately to connect face-to-face with many of you at events like leHACK in Paris, or even Black Hat and DEF CON in Las Vegas. It's always energizing to chat about your workflows, share war stories from the field, and hear your feedback firsthand. Lately, we've been getting a lot of questions following our [3.1.9 image updates](https://github.com/ThePorgs/Exegol-images/releases/tag/3.1.9), especially around how we decide which tools make the cut for inclusion in Exegol. It's a topic that's close to our hearts, so we wanted to take a moment to pull back the curtain and share our thinking process. Buckle up; this is about the delicate balance of expertise, community input, and staying true to what pros actually use.

## Our roots

We, the founders, come from a strong background in Active Directory pentesting and red teaming. That's our bread and butter. We've spent some time in the trenches, dealing with real-world ops, and we make it a point to keep honing those skills. Even as we pour our energy into Exegol's core development, we still jump into pentests and red teams to stay grounded in the challenges professionals face every day. This hands-on experience guides a lot of our decisions: we know what works, what breaks, and what saves time when you're knee-deep in an engagement.

But Exegol isn't just about our niche. We're curious explorers in areas like OSINT, where we've partnered with awesome communities like [OSINT-FR](https://osintfr.com/) and [Trace Labs](https://www.tracelabs.org/). These collaborations help us bridge gaps. We get closer to the tools and techniques that true experts rely on, and in return, we build a better OSINT toolbox for everyone. On the web side, we know our way around, but we're not claiming guru status. That's why we actively seek out bug bounty hunters and web security pros, tapping into their insights to make smarter choices.

Our community plays a huge role too. You folks often suggest new tools through Discord chats or even [pull requests on our GitHub repo](https://github.com/ThePorgs/Exegol-images/pulls), which is an amazing way to drive change and keep us on our toes. It's then our job to evaluate: we consider the tool's "weight" (how much it bloats the image), installation complexity, and above all, its features and community support. There's no hard rule like "must have X stars on GitHub," but we tend to prefer tools that people have had the chance to try out, audit, and see how they stack up against alternatives.

Tool selection is about finding that sweet spot: leaning on what we know from our own expertise, validating what we hear from trusted pros, and looping in our users through direct chats, PRs, and more structured feedback mechanisms (which we're iterating on to make more democratic, representative, and fair).

## A quick example: the ZAP story

To illustrate, take our recent experience with [ZAP (Zed Attack Proxy)](https://www.zaproxy.org/). We added it after running a Discord poll in 2024. Looking back, only about 20 people led the vote, making a decision for a user base of thousands. That's not really representative, and in hindsight, it doesn't make much sense to let such a small sample steer the direction for everyone. After deeper conversations with bug bounty communities and users, it became clear that pros overwhelmingly favor [Burp Suite](https://portswigger.net/burp) and emerging options like [Caido](https://caido.io/). So, we decided to pull ZAP to keep things aligned with what's actually used in the field, and not inflate Exegol just to tick a box or satisfy a small group. Lesson learned: we need to improve how we gather input, so our decisions reflect the broader community rather than just a select few voices.

## Better feedback mechanisms

The ZAP experience was a wake-up call. We realized that this experiment, relying on a "public-facing" Discord polls, isn't representative enough for a community our size. We need something more robust.

We're aiming to create a more balanced approach to gathering feedback, combining community input, strategic partnerships, and, when necessary, a more effective voting system. Our goal isn't just to appear more democratic, but to ensure real representation. We want to gather perspectives from all corners of our user base, from pentesters and red teamers to OSINT specialists. This way, our tool selection truly reflects the diverse needs of the entire community.

This isn't just about tool selection either. Better feedback mechanisms will help us prioritize features, understand pain points, and make Exegol more useful for everyone. We're still figuring it out as we go, but the vision is clear: every user should have a meaningful way to influence Exegol's direction.

## These decisions are hard (but worth it)

Choosing tools for Exegol is no easy feat. It's a constant push-pull. Some distros (seem to) aim to appeal to the masses first. We've all seen pros roll their eyes at [Kali Linux](https://www.kali.org/) and [ParrotSec](https://www.parrotsec.org/) for that very reason. We want to offer a different choice: putting professionals' needs first, and then making things approachable. This philosophy drives our tool choices. If pros rely on something, we include it, even if it means a steeper curve for beginners. We believe it's the right call; it equips juniors with the same powerhouse tools as the vets, helping them level up faster without dumbing down the suite.

We want to nurture our core strengths in red teaming and pentesting, but we also recognize our blind spots in other domains. That's where partnerships shine. By working close with those communities, we ensure we're including tools that pros actually use, not just what's hyped (it's not incompatible though).

We're committed to evolving our feedback loops too. Discord chats are great for quick vibes, but we're exploring better ways to poll the masses. Maybe GitHub discussions, anonymous surveys, or even integrated feedback in the tool itself. The goal? Make sure every voice counts, from casual users to hardcore operators.

We believe that this approach to making choices is what keeps Exegol relevant and powerful.

*— Charlie, Co-founder and CEO*