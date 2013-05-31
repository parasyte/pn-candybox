import time
import uuid
import gevent
from Pubnub import Pubnub

from config import config

## Handy variables
pubnub = None
last_update = 0

## Generate a unique ID for this server
myuuid = str(uuid.uuid4())


class adict(dict):
    """A dict class."""

    ## Boolean flag to determine if the dict has been updated
    _updated = False


## Keep track of global game stats
stats = adict({
    "_NumberOfSaves"            : 0,
    "TotalCandies"              : 0,
    "CandiesPerSecond"          : 0,
    "TotalLollipops"            : 0,
    "LollipopsPerSecond"        : 0,
    "AnsweredFrogsQuestions"    : 0,
    "KilledTheWhale"            : 0,
    "FoundTheHorn"              : 0,
    "KilledTheDevil"            : 0,
    "FinishedTheGame"           : 0,
    "EncounteredWoodPony"       : 0,
    "AnnoyedCandyMerchant"      : 0,

    ## Favorite sword
    "NumberOfSwords"            : 0,
    "Sword of Life"             : 0,
    "Sword of Flames"           : 0,
    "Sword of Summoning"        : 0,

    ## Chosen wish
    "NumberOfWishes"            : 0,
    "MultiplyCandies"           : 0,
    "MultiplyLollipops"         : 0,
    "PotionsAndScrolls"         : 0
})
delta = adict(stats)

codes = set()
codes_delta = []


def add(dest, src, internal=False):
    """Add a stat delta into global game stats."""
    dest._updated = True
    for k, v in src.iteritems():
        if k in dest and (internal or k[0] != "_"):
            dest[k] += v


def clear(dest):
    """Clear a stat delta."""
    dest._updated = False
    for k in dest.iterkeys():
        dest[k] = 0


def update(src):
    """Update stats and record update time."""
    global last_update

    try:
        code = src['code']
        del src['code']
    except KeyError:
        code = ""

    try:
        src = dict(map(lambda x: (x[0], int(x[1])), src.items()))
    except ValueError:
        return

    add(stats, src)
    add(delta, src)

    if code not in codes:
        codes.add(code)
        codes_delta.append(code)

    now = time.time()
    if now - last_update >= 300:
        last_update = now
        distribute()
    else:
        last_update = now


def send(action, data=None):
    """Publish a message with a simple container."""
    pubnub.publish({
        'channel'   : "candybox_update",
        'message'   : {
            'uuid'      : myuuid,
            'action'    : action,
            'data'      : data
        }
    })


def distribute():
    """Publish stats to users and stat deltas to other servers."""
    global codes_delta

    ## Continue distributing for up to 5 minutes
    if time.time() - last_update >= 300:
        return

    gevent.spawn_later(config['update_interval'], distribute)

    ## Send stats to users
    stats['_NumberOfSaves'] = max(len(codes), stats['_NumberOfSaves'])
    pubnub.publish({
        'channel'   : "candybox",
        'message'   : stats
    })

    ## Update other servers
    if delta._updated:
        send("update", {
            'codes' : codes_delta,
            'delta' : delta
        })
    clear(delta)
    codes_delta = []


def init():
    """Initialize stats module."""
    def sync(msg):
        """Sync state from other servers."""
        if str(msg['uuid']) != myuuid:
            add(stats, msg['data'], internal=True)

        ## Stop listening
        return False


    def handler(msg):
        """Handle requests from other servers."""
        if str(msg['uuid']) == myuuid:
            ## Continue listening
            return True

        if msg['action'] == "sync":
            ## Reply to sync request
            pubnub.publish({
                'channel'   : "candybox_sync",
                'message'   : {
                    'uuid'      : myuuid,
                    'data'      : stats
                }
            })

        elif msg['action'] == "config":
            ## Update config
            config.update(msg['data'])

        elif msg['action'] == "update":
            ## Update internal game stats
            add(stats, msg['data']['delta'], internal=True)
            codes |= set(msg['data']['codes'])

        ## Continue listening
        return True


    ## Initialize PubNub
    global pubnub
    pubnub = Pubnub(config['pubkey'], config['subkey'])

    ## Spawn a coroutine to initialize the internal game state
    gevent.spawn(pubnub.subscribe, {
        'channel'   : "candybox_sync",
        'callback'  : sync
    })
    ## And request sync data from other servers after a few seconds
    gevent.spawn_later(5, send, "sync")

    ## Spawn a coroutine that will update internal stats from other servers
    gevent.spawn(pubnub.subscribe, {
        'channel'   : "candybox_update",
        'callback'  : handler
    })
