# Real-Time Stats for Candy Box!

We like games here at PubNub, but not as much as we like real-time. Combine the
two, and you've got pure mega-awesome. During the PubNub Hackathon, Jay Oster
took a popular text adventure game called Candy Box, and updated its stats page
to provide a real-time overview of the global game statistics. The updated game
can be played at [candybox.pubnub.co](http://candybox.pubnub.co/index.html), and
the new real-time stats page is [here](http://candybox.pubnub.co/stats.html).
Full source code is available
[on github](https://github.com/parasyte/pn-candybox).

In this article, we'll guide you through how the game was modified, and how to
build a very simple, yet hyper-scalable server infrastructure to serve real-time
statistics. Today we're using JavaScript on the client-side, and Python on the
server-side. So let's dig in!

![Castle Entrance](http://i.imgur.com/ORRfYin.png)

Since Candy Box is a very new game, there isn't a public source code repository
available. So I started this project by mirroring the original website,
[candies.aniwey.net](http://candies.aniwey.net/), with wget. It's also possible
to load the URL into a browser and use File->Save Page As... to get a complete
local copy of the game.


## Download the Game Code

With all of the JavaScript downloaded, I had to make some minor adjustments in
some places to get a few things working correctly. Loading and saving had to be
modified; moving some of the original server-side logic right into JavaScript.
I'll spare the details, and the curious among you can have a look at
[load.js](https://github.com/parasyte/pn-candybox/blob/master/public/js/load.js)
for some insight. To allow saving, the stats server just proxies save requests
to the original server. The proxy is required because the original server does
not support [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing),
meaning newer browsers will reject the save attempt.


## Building the Stats Server

With the baseline game ready, it's time to start thinking about the server-side,
particularly how to handle the high load that such a popular game will generate.
High load is the reason the original stats page is updated only infrequently.
The challenge is to record and report game statistics for thousands of
simultaneous players in real-time, with very frequent updates (refreshing stats
about once every second). With this in mind, I came up with the following list
of requirements while designing the server:

* In-memory statistics aggregation
* Horizontally scalable
* Stateful-design, but distributed

Sounds simple, right? Do calculations in memory to make it fast, and scale
horizontally to handle any load. A panacea! But how can we sum and average
hundreds of thousands of accounts per second? Well, we can cheat a bit by doing
the summing on the client-side, and only keep the result of the sums on the
server. In other words, client logic will be responsible for calculating the
deltas between each status update, so the server just needs to worry about
adding those deltas into its internal state. Therefore, each status update is a
snapshot in time, and the server records only the sum over all snapshots.

To share state between servers, we'll use the same idea; deltas between updates,
and periodically publish to a common PubNub channel to distribute changes to the
internal state. This method of replication introduces its own challenges, such
as update latencies with multiple servers. This is acceptable because the
statistics in this game are quite volatile anyway. No one will notice any
latencies.


### Server Implementation Details

For the server, I decided to use [Bottle](http://bottlepy.org/) to handle the
REST interface, and [gevent](http://www.gevent.org/) for non-blocking sockets.
This will give us a great deal of flexibility for the server.

After writing a few stubs for the REST interface, I started on the distribution
mechanism, which is just a PubNub subscribe that handles messages from other
servers. Ideally, each server will periodically share the updates they have
received from clients. The server only needs to add deltas from the user to its
own internal delta for distribution to other servers. It can't distribute every
client request, because traffic would be much too high. And it would defeat the
purpose of horizontally scaling, anyway. This is also where distribution latency
comes in; a delta from a client may take a few seconds to reach every server.


### Integrating PubNub

gevent makes the subscribe super easy; just the normal `Pubnub.subscribe()`,
wrapped in a call to `gevent.spawn()`. There are initially two such subscribes:
a "control" subscription, which will recursively re-subscribe after handling
each message, and a "sync" subscription to initially synchronize with other
servers.

The "control" subscription does three things:

1. Respond to "sync" requests; providing the current game state to other servers
1. Update config; allowing you to remotely reconfigure all servers
1. Update game state; receive deltas from other servers

I'll explain more about the config updating later. After Both subscriptions are
established, a "sync" request is published to any listening servers. The first
"sync" response that comes within 5 minutes will cause the game state to be
updated with the provided values.

The server then goes to sleep until a user makes an "update" request. That will
start a recursive timer (the interval is configurable) which will send stat
updates to clients, and stat delta updates to other servers. The timer recursion
automatically stops 5 minutes after the last user "update" request.

And that's about all there really is to the server. You could also do some other
fancy things like persisting the state to disk periodically. It isn't a lot of
data to store, but these stats are also not critical, especially for the demo.


### Running the Stats Server

Starting the server is easy as well, just start the main script with python, or
run it directly in a shell (it has exec permissions and a shebang). The script
accepts three optional arguments for listening IP, listening port, and config
file. The config file is just JSON, in the same format as in
[config.py](https://github.com/parasyte/pn-candybox/blob/master/server/config.py)

Here's an example:

    $ python main.py 0.0.0.0 8999 ~/config.json


## Hacking the Client

Back on the client-side, we just need a function to record the deltas, and
another to send the "update" requests to the server. I decided to use the
[localStorage API](https://developer.mozilla.org/en-US/docs/Web/Guide/DOM/Storage#localStorage)
to record the update state between each request, allowing the deltas to be
calculated correctly even after restarting the browser.

As far as security goes, I will be ignoring the possibility of cheaters for the
demo. Stats can also be skewed by saves that have completed the game, because
**SPOILER ALERT** the computer tab grants access to generating candies and
lollipops at an impossible rate, and changing pretty much every variable in
strange ways. **SPOILER ALERT**

Client requirements are as follows:

* Turn a blind eye to cheaters (simplifies everything)
* Periodically send "update" requests (once every 5 seconds is a good start)
* Do not send "update" requests after the game has been completed

The update interval will be once every 5 seconds by default, which will be quick
enough to affect the stats updates that users end up seeing, and slow enough to
handle a large number of simultaneous players with low server resources; With
2,000 users, the server only needs to handle 400 requests per second. The
gevent-based server will *easily* handle that without a hiccup, even on
commodity hardware. In fact, each server should handle about 1,000 concurrent
connections. If more than 5,000 users are playing, just launch another stats
server and put it behind nginx (reverse proxy) as a load balancer. More on that
later.


### The Hook

[main.js](https://github.com/parasyte/pn-candybox/blob/master/public/js/main.js)
is where the game loop runs. It's implemented as a simple interval that fires
once per second. This is the place to add the stats updates. The code is very
simple; just throttle a function call to once every 5 seconds:

```javascript
// Save to PubNub CandyBox stats server periodically
if ((this.nbrOfSecondsSinceLastMinInterval % 5) === 0) {
    stats.update();
}
```

The `stats.update()` function is where the magic happens. It records the
interesting bits of game state, calculates the delta, and sends the request to
the stat server.

![Real-Time update by PubNub](http://i.imgur.com/Y9PIHGp.png)


### Delta Calculation

The delta calculation is very easy (as you might imagine). I just keep a record
of the last game stat after a successful "update" request (and save this object
to localStorage), and the delta is calculated with a small iterator:

```javascript
$.each(currentUpdate, function (k, v) {
    if (typeof(v) !== "string")
        delta[k] = lastUpdate[k] - v;
});
```

Should be self-explanatory, but basically the difference between values in
`lastUpdate` and values in `currentUpdate` are recorded as the `delta`, with a
safety net for the `code` key (not shown) which is a string value. The `delta`
is then sent to the stats server in an "update" request.

The server does its work, and periodically publishes a message for the stats
page. The listener code is in
[stats.js](https://github.com/parasyte/pn-candybox/blob/master/public/js/stats.js)
and you can see it does the percentage calculation client-side. It is otherwise
incredibly basic.


## Server Configuration

With the client and server ready to go, it's time to start thinking about the
operational side of the project; configuring servers, DNS, an even dynamically
scaling and remote-control reconfiguration.

I'm using [nginx](http://nginx.org/) as a host for the client code and it also
doubles as a front-end load balancer for the stats server. The nginx config
looks like this:

```nginx
upstream stats_server {
    server localhost:8999;
    #server localhost:8998;
    #server localhost:8997;
    #server localhost:8996;

    keepalive 32;
}

server {
    listen 80;

    root /home/ubuntu/pn-candybox/public;
    index index.html;

    server_name candybox.pubnub.co;

    location /ping {
        proxy_pass http://stats_server;
    }

    location /save {
        proxy_pass http://stats_server;
    }

    location /update {
        proxy_pass http://stats_server;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

I did some load testing with ApacheBench and found that nginx with a single
stats server can handle about 763 requests per second with 100 concurrent
connections, or about 305 requests per second with 200 concurrent. All tests
were done on a t1.micro AWS instance (E5507 @ 2.27GHz, 589MB RAM) running Ubuntu
13.04 with *no TCP kernel tuning*. This setup is good enough for our "2,000
simultaneous players" requirement.


### Dynamically Scaling

With the server config in place, we can easily scale up by adding more upstream
stats servers (commented in the config above). Then reloading nginx. The stats
servers will automatically synchronize with one another over PubNub. We can also
reconfigure the servers at runtime to tune the message publishing rates. I just
have to open the [PubNub console](http://www.pubnub.com/console) and publish a
specially constructed message to the "candybox_update" channel. Here's an
example message that reconfigures the servers to publish only once every 5
seconds:

```json
{
    "uuid"      : "master",
    "action"    : "config",
    "data"      : {
        "update_interval"   : 5
    }
}
```

Publish that message, and all servers will instantly adjust their message
publishing interval to 5 seconds. This is just one example of what makes PubNub
truly awesome. :)


## Wrapping Up

With all of that, we now have Candy Box sending periodic updates to our stats
server, and our stats servers periodically sending updates to the stats page.
And it's all done in a dynamically scalable way, with a ridiculously small
memory footprint, and low bandwidth requirements.

All done! Now you should [play the game](http://candybox.pubnub.co/index.html),
[check the stats](http://candybox.pubnub.co/stats.html), and
[fork me](https://github.com/parasyte/pn-candybox)!
