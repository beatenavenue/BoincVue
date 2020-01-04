# BoincVue
Web status viewer for BOINC
![BoincVue image](BoincVue.png)

___
## Project Goal
- Contribute for [World Community Grid](https://www.worldcommunitygrid.org/).

___
## Dependency
### Backend
#### Basic
- [BOINC client](https://packages.debian.org/stable/boinc-client)

#### Scripts
- [bash](https://packages.debian.org/stable/bash)
- [sed](https://packages.debian.org/stable/sed)
- [awk](https://packages.debian.org/stable/gawk)
- [jq](https://packages.debian.org/stable/jq)

#### Server
- HTTP Web server. (Apache, Nginx, other..)

___
### Frontend
- Vue.js (Runtime loading from CDN)
- ElementUI (Runtime loading from CDN)

___
## Setup
getting ready..

### Central Manage Environment with SSH PortForward
For multi site contributor.
I just uses central manage server. It's simple idea to gather BOINC management ports.

    # /lib/systemd/system/boincfw.service
    
    [Unit]
    Description = BOINC management port to gather central server
    After = network-online.target
    
    [Service]
    # ExecStart /usr/bin/autossh -i /path/to/private_key -o ExitOnForwardFailure=yes -NTR 30000:localhost:31416 user@central.server.address
    Restart = always
    ExecStop = /bin/kill $MAINPID
    
    [Install]
    WantedBy = network-online.target

and central server's hosts make.

    # /etc/hosts
    
    127.0.0.1 boinc-host1
    127.0.0.1 boinc-host2
    127.0.0.1 boinc-host3

ok? try connect next sample.

    boinccmd --host boinc-host1:30000 --get_tasks

___
## License
MIT License.
