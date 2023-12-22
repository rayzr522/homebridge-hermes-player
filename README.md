# Homebridge Hermes Player

This is a [Homebridge](https://github.com/nfarina/homebridge) plugin to control the [Hermes](https://github.com/HermesApp/Hermes) client for [Pandora](http://pandora.com). It allows you to play/pause and control the volume of Hermes.

## Installation

Obviously you need to install [Hermes](https://github.com/HermesApp/Hermes) first. This is a macOS-only Pandora client, and this node module is macOS-only as well since it uses `node-osascript` to control Hermes.

1. `yarn global add homebridge-hermes-player`

2. Add the following to `~/.homebridge/config.json`:

```javascript
{
    // ...
    "accessories": [
        // ...
        {
            "accessory": "HermesPlayer",
            "name": "Hermes"
        }
    ]
}
```

The `name` can be whatever you want, but the `accessory` must be `"HermesPlayer"`.
