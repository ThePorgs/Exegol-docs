---
title: Exegol goes Pro
date: 2025-05-30
author: Charlie and Mathieu
description: Learn about our story, philosophy, vision and values. Past and future. A statement on our transition to a sustainable model, and the lessons we learned from others.
sidebar: false
---

# Exegol goes Pro  

## How it started

Exegol began in 2020 as an answer to a personal frustration. I, Charlie, was fed up with the state of ethical hacking environments.

Kali Linux was the most widely adopted solution — the "industry standard," as they say. But it was giving me a hard time. Every `apt upgrade` and tool install felt like a leap of faith, often breaking things and throwing my machine into dependency hell. Tools were outdated. The design itself felt rigid: an ISO to install either as a single/dual boot or in a VM. It wasn't enough for me.

Sure, there were Docker and OVA versions, but they clearly weren't the primary focus of Offensive Security, and it showed. The other alternatives — Parrot, BlackArch — weren't solving the core issues. They offered different tools or base distros, but followed the same monolithic design philosophy.

![](/assets/blog/kali_lincox_dark.png){data-theme="dark"}
![](/assets/blog/kali_lincox_light.png){data-theme="light"}
Just teasing, we have a huge respect for what Kali brought to the community{.caption}

As a professional, I needed something more flexible. Different engagements demanded different environments. I had trainings, labs, CTF events — I couldn't afford a single system that just evolved over time. It would become unstable, unpredictable, and frankly, a security risk. 

I needed isolation and structure, but without the hassle.

Virtual machines? Too heavy and bloated.  
The answer seemed to be containers.

So I created a simple Dockerfile — initially based on Kali (now Debian-based) — and went further with the right customizations, inspired by [Thibaud Robin](https://www.linkedin.com/in/thibaud-robin/)'s [docker-kali-light](https://github.com/thibaudrobin/docker-kali-light) project: BloodHound and Neo4j properly installed and initialized, Responder configured, Impacket set up, and more. A pet project was born.

Then came a Makefile, because typing `docker run` with a thousand flags was a pain. That Makefile quickly evolved into a Python wrapper for better flexibility and multi-container management.

Around that time, my employer tasked me with building a pentesting team from scratch. What began as my solo tool became a shared asset. I open-sourced it, shared it with my direct circle, and then... COVID hit.

## Lockdown

2020 into 2021. Covid. Lockdown. I was stuck in a tiny apartment with not much else to do. Exegol became my escape — and my window to the outside world.

More importantly, it became my bridge to a growing ecosystem. People started using it. Talking about it. Contributing. The Discord server expanded organically. What began as a solution to my personal frustration was resonating with other hackers facing similar challenges.

How many times have I heard "Oh, awesome! I was just about to create something like this!".

In early 2022, [Mathieu](https://www.linkedin.com/in/mathieu-calemard-du-gardin-005803b4/) (aka [Dramelac](https://x.com/Dramelac_)) joined and completely refactored the Python wrapper. Together, we really dove deep into it and expanded on what existed, and what could be added. We presented at Black Hat Europe Arsenal that December, then again in Asia and the US in 2023. What a thrill!

![](/assets/blog/bhusa2023.png)
Mathieu (left) and I (right) at Black Hat US 2023{.caption}

We kept pushing — endless nights and weekends. We were... *committing* (pun intended). Documentation, multiple image types, resources, a comprehensive CI/CD pipeline, on-prem runners for cross-architecture support, all major operating systems supported, shell logging, a full GUI desktop environment — the list kept growing.

What started as a simple Dockerfile had evolved into a complete ecosystem. A modular, cross-platform hacking environment that saves practitioners time and lets them focus on what they do best: hack things.

Other contributors joined the adventure, such as **[Alexis Martin (aka qu35t)](https://x.com/QU35T_TV)** who took on a major role in image development and Discord support.

## The wake-up call

By the end of 2023, something was wrong.

My job had evolved significantly over the years, but I wasn't fulfilled anymore. What really drove me were the *extras* — the things I did outside of work.

In four years, I had given ~25 talks worldwide ; participated in dozens of CTFs ; created [The Hacker Recipes](https://thehacker.recipes) (200k+ users/year) ; built Exegol (thousands of users worldwide).

But this pace wasn't sustainable. I was exhausted.

I shared these feelings with Mathieu. And the conversation quickly became "What about Exegol?". By mid-2024, we faced a harsh reality: our creation would inevitably die if things didn't change.

We lacked sufficient contributors ; budget for hiring developers and investing further ; time, as our priorities would be shifting eventually. This project was costing us both time and money, it couldn't go on and on like this.

While this work meant everything to us, we were spending considerable time and money on something that didn't pay the bills.

## Searching for sustainability

Every avenue for keeping things alive was explored and considered. Donations? Our niche is too small. Sponsorships/ads? Same problem. Certifications, trainings? Developing Exegol should stay our main focus.

Even with The Hacker Recipes' 200k users, monetization attempts confirmed these weren't viable paths (but I made my peace with it. THR is knowledge I won't put behind a paywall. And it may very well live on contributions and few of my time and money).

We noticed something else. Open-source initiatives often thrived when attached to professional software offerings.

The more we considered it, the clearer it became: this wake-up call might be exactly what Exegol needed.

## From risk to opportunity

Perhaps this challenge could be a blessing in disguise. I've always tried to find silver linings in difficult situations, and this time was no different.

If we could build a company around Exegol, it wouldn't just survive — it could thrive! No longer a side venture, it would become our primary focus.

So in June 2024, we took the leap.

In the last 12 months, Mathieu and I quit our jobs, founded the company, and developed a model we hope will be sustainable: paid tiers for professionals and enterprises, while maintaining a free offering.

It's a leap of faith. There's a risk no one cares. But if they -you- do care, the possibilities are endless, and this gives us the chance to realize the vision we've always had — for all of us.

## Free, and Open-Source

When people hear "open source," they often think "free." But these are fundamentally different concepts, usually combined in a single acronym: FOSS (Free and Open-Source).

We're keeping most of our code open source because we believe in **Transparency**, **Trust** and **Community**.

Yes, having open-source code means people *could* bypass license checks. There's no technical challenge there. But we see this as a risk worth taking to truly live by our values, not just preach them.

We trust our users will understand: if we can't maintain a sustainable model, the hundreds of improvements we envision will never materialize. It's on us to keep delivering value, but we hope you'll join us in supporting this initiative.

Our model recognizes the real value in the work:
- **Community tier** remains free for learners, the curious, and CTF players
- **Pro and Enterprise tiers** for commercial use, premium features, and direct support

But here's where we're different: value flows back to those who create it, by recognizing what truly matters and organizing around it. Our users are our center.

Contributions — whether code, documentation, testing, or helping others on Discord — will be eligible for **subscription discounts up to 100%**. Because open source shouldn't mean "you work, I use" all the time. It should foster collaboration.

You're not just users. You're **community members** who can choose to support financially as customers, and/or contribute directly and be recognized for that.

## Learning from others

We're not the first to walk this path. The security community has seen various approaches to sustainability — some successful, others less so. Each story taught us something valuable.

### The success stories

**[Metasploit](https://metasploit.com/)** started as HD Moore's passion project in 2003, a Perl-based framework that revolutionized exploit development. When [Rapid7](https://www.rapid7.com/) acquired it in 2009, and maintained a robust free version while building Metasploit Pro for enterprises. They respected the community that made Metasploit great while creating a sustainable business model. Twenty years later, it's still the de facto standard for exploitation frameworks. Users win with continuous updates, Rapid7 wins with revenue, and the security community wins with a tool that keeps evolving. *Lesson: hybrid free/paid models can work when done right.*

**[BloodHound](https://bloodhound.readthedocs.io/)** represents what we consider the gold standard. When [Rohan Vazarkar](https://twitter.com/cptjesus), [Will Schroeder](https://twitter.com/harmj0y), and [Andy Robbins](https://twitter.com/_wald0) unveiled it at DEF CON 24 in 2016, it transformed Active Directory security. The creators were part of Veris Group's ATD, later acquired by Coalfire. Former Veris Group members then founded [SpecterOps](https://specterops.io/), which retained the BloodHound project. It has since balanced community and commercial interests. The Community Edition remains powerful and free, while the [Enterprise version](https://specterops.io/bloodhound-enterprise) adds features that make sense for larger organizations. When they refactored the community version to share a codebase with Enterprise, they added features. The community got APIs, a client-server model, and better performance. *Lesson: another example of a successful hybrid free/paid model, when done right.*

**[PingCastle](https://www.pingcastle.com/)** tells a more recent success story. [Vincent Letoux](https://twitter.com/vletoux) created this AD assessment tool in 2018, offering it free for most users while requiring licenses for commercial use or advanced features (iirc). It quickly became essential for AD security assessments. When [Netwrix](https://www.netwrix.com/) acquired it in 2024, it validated the model — create real value, build sustainably, and good things follow. The tool continues to evolve under corporate ownership while maintaining its community roots. *Lesson: ~~Frenchies for the win~~ another example.*

### The cautionary tales

**[CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec)** breaks our hearts because it came so close to getting it right. Marcello "[@byt3bl33d3r](https://twitter.com/byt3bl33d3r)" created this Swiss Army knife for pentesting in 2015. By 2020, when he announced Porchetta Industries, we were excited. His [blog post](https://web.archive.org/web/20201119013651/https://blog.porchetta.industries/2020/11/17/And-Now-For-Something-Completely-Diffrent/) could have been written by us — same frustrations, similar vision, same hope for sustainability.

![](/assets/blog/marcello_statement.png)
A statement from Marcello we can't disagree with{.caption}

The model seemed clever: paying subscribers got new features first, then they'd release to the public. Partnership with Kali Linux. Community involvement. But something went wrong in execution. The codebases diverged — one for subscribers, one for the public. Community contributions sat unmerged for months. Development became fragmented. When Martial "[mpgn](https://twitter.com/mpgn_x64)", the principal contributor, stepped away in September 2023, the project crumbled within weeks. The community scrambled to fork it as [NetExec](https://github.com/Pennyw0rth/NetExec), but the damage was done. Unclear revenue distribution between contributors created additional friction. Porchetta Industries shut down after barely two years. *Lesson: vision without proper execution kills projects.*

**[HackTricks](https://book.hacktricks.xyz/)** shows another path, with its own trade-offs. Carlos Polop built an incredible resource — a living encyclopedia of pentesting techniques. It became the go-to reference for students, CTF players, and professionals. Around 2023, facing the same sustainability challenges we all face, he put premium content behind a paywall and launched certifications. It works financially, but at a cost. The free version, while still useful, suffers from quality issues — copy-pasted content, inaccuracies, poor structure. It's a goldmine buried under organizational chaos. *Lesson: when you shift focus away from your core offering to pursue other revenue streams, the quality of what made you valuable in the first place can suffer.*

### The complex legacy

**[Impacket](https://github.com/fortra/impacket)** deserves a special mention. Created by [Core Security](https://www.coresecurity.com/) in the early 2000s, it's been the backbone of Windows network attacks for two decades. Through acquisitions — Core Security to HelpSystems to [Fortra](https://www.fortra.com/) — it survived. But "survived" might be generous. The library remains incredibly powerful, essential to tools we all use daily. Yet the community increasingly discusses forks or alternatives because development feels sluggish, pull requests languish, and responsiveness suffers. It lives on, probably sustained by revenue from Fortra's commercial tools like [Core Impact](https://www.coresecurity.com/core-impact) and [Cobalt Strike](https://www.cobaltstrike.com/). But is survival enough? *Lesson: free tools can persist through commercial ecosystems, but without active investment, they risk becoming relics.*

**[Kali Linux](https://www.kali.org/)** was born from BackTrack in 2013. [Offensive Security](https://www.offsec.com/) built it into *the* pentesting distribution, and still manages to maintain it, probably thanks to a large catalog of certifications (OSEP, OSED, and more), generating a steady revenue stream.

![](/assets/blog/offsec_catalog.png)
OffSec's catalog preview{.caption}

OffSec clearly is a training/certs company that happens to maintain the biggest hacking distribution around. However, despite a huge number of users (and probably contributors as well), it feels like Kali is missing out on R&D. Had they invested in making Kali truly great perhaps Exegol wouldn't have been necessary, at least not in this form. *Lesson: when your core product becomes a means to an end rather than the end itself, investing in innovation for the core product becomes indirect, and harder to justify. It may allow for a sustainable model, but it's probably not compatible with keeping your main focus on the initial thing.*

## Our path forward

These stories shaped our thinking. We see patterns in the successes: transparency, community alignment, sustainable revenue, maintaining focus. We see patterns in the failures too.

Our model synthesizes these lessons:
- Like Metasploit and BloodHound, we'll maintain strong free and paid versions — but unlike CME, we'll mostly keep them aligned.
- Like PingCastle, we'll be clear about licensing and value, and we won't let paid features diminish the free experience (on the contrary).
- Like all of them, we need sustainable revenue — but unlike some mentioned before, Exegol itself remains our north star, not certifications or training. While we don't rule out this path entirely, it won't be our top priority.

We're building the best possible hacking environment, period. The business model needs to serve that goal.

## SIGCONT

This is our turning point. We're all-in.

Like Tony Stark, we started building Exegol "in a cave with a box of scraps."

We believe there's more to it.

Unlike Tony Stark, we're not in a fantasy, with unlimited resources.

We need you.

*— Charlie & Mathieu*
