import json

config = {
    'pubkey'            : "demo",
    'subkey'            : "demo",
    'update_interval'   : 1
}

def load(file):
    try:
        config.update(json.loads(open(file).read()))
    except IOError:
        pass
