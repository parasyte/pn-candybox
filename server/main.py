#!/usr/bin/env python

import gevent.monkey
gevent.monkey.patch_all()

import bottle
import json
import urllib2

import stats


def respond(fn):
    """Decorate a function to return JSON-encoded strings"""
    def decorator(*args, **kwargs):
        bottle.response.content_type = 'text/javascript; charset="UTF-8"'
        bottle.response.set_header('Access-Control-Allow-Origin', "*")
        bottle.response.set_header('Access-Control-Allow-Methods', "GET, POST")
        return json.dumps(fn(*args, **kwargs), separators=(",", ":"))

    return decorator


@bottle.error(404)
@bottle.error(405)
@bottle.error(500)
@respond
def errorResponse(error):
    """Return an error message as a JSON string."""
    return error and error.body or []


@bottle.get("/ping")
@respond
def ping():
    """Test server availability."""
    return [ "pong" ]


@bottle.post("/save")
def save():
    """Save client game state."""
    bottle.response.set_header('Access-Control-Allow-Origin', "*")
    bottle.response.set_header('Access-Control-Allow-Methods', "POST")
    url = "http://candies.aniwey.net/scripts/save.php"
    data = bottle.request.body.read()
    req = urllib2.Request(url, data)
    return urllib2.urlopen(req).read()


@bottle.post("/update")
@respond
def update():
    """Update global game stats."""
    stats.update(bottle.request.forms)
    return [ "OK" ]


if __name__ == "__main__":
    import sys
    import config

    argc = len(sys.argv)
    config.load(sys.argv[3] if argc >= 4 else "config.json")

    stats.init()

    bottle.run(
        host=sys.argv[1] if argc >= 2 else "0.0.0.0",
        port=int(sys.argv[2]) if argc >= 3 else 8999,
        server=bottle.GeventServer
    )
