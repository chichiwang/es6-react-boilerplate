'use strict';

// var SiteEvents = require('components/site');

// Initialize React's touch events
React.initializeTouchEvents(true);

var initialize = () => {
	console.log('initialize();');
	// SiteEvents.initialize();

	React.initializeTouchEvents(true);
	// require('components/root');
	// React.render <Root />, document.getElementById('Site-Container') if Root
};
initialize();