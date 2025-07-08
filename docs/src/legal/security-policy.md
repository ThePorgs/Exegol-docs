# Security policy

At Execorp, the security of the Exegol suite and the protection of our users are our top priorities. We are committed to implementing all necessary measures to secure our systems. However, no technology is completely free from vulnerabilities.

If you discover a vulnerability or security issue, we encourage you to report it responsibly so we can address it as quickly as possible. Your assistance is crucial in helping us protect all our users.

## 1. Scope

This responsible disclosure program covers all Exegol-related services and products unless expressly stated otherwise.

The following is a non-exhaustive list of examples considered out of scope:

- Clickjacking on pages without sensitive actions
- CSRF on login, logout, or any unauthenticated actions
- Attacks requiring physical access or traffic interception (MITM)
- Social engineering attacks
- Denial of Service (DoS) attempts
- Spoofing or content injection issues without concrete security impact
- Absence of DNSSEC, CAA, or CSP headers
- Missing Secure or HttpOnly flags on non-sensitive cookies
- Dead links
- User enumeration without significant impact

## 2. Testing rules

- Do not perform mass automated scans on our platforms or those of other users
- Any automated or intensive testing activity must be pre-approved by Execorp
- Please contact us before initiating any such activities
- Do not access, alter, or destroy other users' data
- Do not continue exploitation beyond what is strictly necessary to demonstrate the existence of the issue

## 3. How to report a vulnerability

Please contact us primarily through our dedicated email address: [contact@exegol.com](mailto:contact@exegol.com)

When reporting, please:
- Provide a clear description of the issue
- Include precise reproduction steps if possible
- Attach screenshots or proof-of-concept scripts if available

### 4. Important notes

- Execorp does not systematically monitor its spam folders
- It is the sender's responsibility to ensure proper message delivery (sending parameters, headers, anti-spam measures)
- Consequently, Execorp cannot be held responsible for unreceived reports or those filtered as spam
- We commit to responding to received reports within a maximum of 5 business days

## 5. Publication and public disclosure

Please do not publicly disclose the vulnerability before we have had time to analyze and fix it.

If you wish to publish your research (conference, blog, etc.), please submit a draft at least 30 days before publication.

Any public communication must not reveal:
- Exegol user data
- Internal information regarding Execorp, its partners, employees, or sensitive infrastructure

## 6. Our commitments

- We will handle your report confidentially
- We will keep you informed of the analysis progress and measures taken
- If you wish, we can publicly acknowledge you as a security contributor
- If your approach respects this policy, we will not take any legal action against you
- We make every effort to quickly fix reported issues and greatly appreciate your contribution to our ecosystem's security
