# Services list

This section lists the services that can be used in Exegol containers and their associated default ports.

| Service              | Port     | Commands                                              | Comments |
|----------------------|---------|------------------------------------------------------|----------|
| **neo4j**           | 7687, 7474, 7373 | `neo4j start`, `neo4j stop`, `neo4j restart` | Used by BloodHound and BloodHound-related projects. |
| **BloodHound-CE**   | 1030    | `bloodhound-ce`, `bloodhound-ce-reset`, `bloodhound-ce-stop` | BloodHound Community Edition Web Interface |
| **postgresql**      | 5432    | `service postgresql [...]` | Used by BloodHound CE |
| **TriliumNext**         | 1991    | `triliumnext-start`, `triliumnext-stop` | Collaborative note-taking app. [GitHub](https://github.com/TriliumNext/Trilium) |
| **Burp Suite**      | 8080    | `burpsuite` | HTTP(S) Proxy |
| **Starkiller (Empire)** | TBD  | `ps-empire server` | GUI for the Empire post-exploit framework. [GitHub](https://github.com/BC-SECURITY/Empire) |
| **Havoc**           | 40056   | `havoc client/server` | C2 Framework in GO. [GitHub](https://github.com/HavocFramework/Havoc) |
| **Desktop** (VNC & Websockify) | 6336, random | `desktop-start`, `desktop-stop`, `desktop-restart` | Remote graphical desktop feature (beta). Used with `--desktop` from up-to-date wrapper. |

