const osascript = require('node-osascript');

let Service;
let Characteristic;

module.exports = homebridge => {
	console.log(`Hooking into Homebridge v${homebridge.version}`);

	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory('homebridge-hermes-player', 'HermesPlayer', HermesPlayer);
};

function HermesPlayer(log, config) {
	const name = config.name;
	const debug = config.debug;

	this.log = function () {
		if (!debug) {
			return;
		}
		log.apply({}, Array.prototype.slice.call(arguments, 0));
	};

	log('Creating lightbulb service');
	this.lightService = new Service.Lightbulb(name);

	log('Adding ON characteristic');
	this.lightService
		.getCharacteristic(Characteristic.On)
		.on('set', this.setPowerState.bind(this))
		.on('get', this.getPowerState.bind(this));

	this.lightService
		.addCharacteristic(new Characteristic.Brightness())
		.on('set', this.setBrightness.bind(this))
		.on('get', this.getBrightness.bind(this));
}

HermesPlayer.prototype.getServices = function () {
	return [this.lightService];
};

HermesPlayer.prototype.setPowerState = function (powerState, callback) {
	this.log('SET POWERSTATE - ' + powerState);

	osascript.execute(`tell application "Hermes" to ${powerState ? 'play' : 'pause'}`, callback);
};

HermesPlayer.prototype.getPowerState = function (callback) {
	const log = this.log;
	log('GET POWERSTATE');

	osascript.execute(`tell application "Hermes" to get playback state`, (err, res) => {
		if (err) {
			log('GET POWERSTATE - ERR - ' + err);
			callback(err, null);
		} else {
			const state = res.trim() === 'playing';
			log('GET POWERSTATE SUCCESS - ' + state);
			callback(null, state);
		}
	});
};

HermesPlayer.prototype.setBrightness = function (volume, callback) {
	this.log('SET VOLUME - ' + volume);
	osascript.execute(`tell application "Hermes" to set playback volume to ${volume}`, callback);
};

HermesPlayer.prototype.getBrightness = function (callback) {
	const log = this.log;

	log('GET VOLUME');
	osascript.execute('tell application "Hermes" to get playback volume', (err, res) => {
		if (err) {
			log('GET VOLUME ERR - ' + err);
			callback(err, null);
		} else {
			const volume = res;
			log('GET VOLUME SUCCESS - ' + volume);

			callback(null, volume);
		}
	});
};
