exports.config = {
	plugins: {
		react: {
			transformOptions: {
				sourceMap: 'yes'
			},
			babel: true
		}
	},
	files: {
		javascripts: {
			joinTo: {
				'javascripts/app.js': /^app/,
				'javascripts/vendor.js': /^(?!app)/
			},
			order: {
				before: [
					'bower_components/react/react-with-addons.min.js'
				]
			}
		},
		stylesheets: {
			joinTo: 'stylesheets/app.css'
		}
	}
}