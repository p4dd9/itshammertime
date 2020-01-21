const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, 'dist/');
const imagePattern = /\.(jpe?g|png|gif|svg)$/i;

module.exports = (_env, argv) => {
	const mode = argv.mode;

	let entryPoints = {
		VideoOverlay: {
			path: './src/views/VideoOverlay.ts',
			outputHtml: 'video_overlay.html',
			build: true,
		},
	};

	let entry = {};

	// edit webpack plugins here!
	let plugins = [
		// new webpack.HotModuleReplacementPlugin(),
		new ImageminPlugin({ test: imagePattern})
	];

	for (name in entryPoints) {
		if (entryPoints[name].build) {
			entry[name] = entryPoints[name].path;
			if (mode === 'production') {
				plugins.push(
					new HtmlWebpackPlugin({
						inject: true,
						chunks: [name],
						template: './template.html',
						filename: entryPoints[name].outputHtml,
						title: 'LudeCat Twitch Extension',
					})
				);
			}
		}
	}

	let config = {
		//entry points for webpack- remove if not used/needed
		entry,
		optimization: {
			minimize: false, // neccessary to pass Twitch's review process
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.(js)$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
				},
				{
					test: /\.(ts)$/,
					exclude: /(node_modules)/,
					loader: 'awesome-typescript-loader',
				},
				{
					test: imagePattern,
					loader: 'file-loader',
				},
				{
					test: /\.(eot|ttf|woff|woff2)$/i,
					loader: 'file-loader',
				},
				{
					test: /\.(ogg|mp3|wav|mpe?g)$/i,
					loader: 'file-loader',
				},
			],
		},
		resolve: {
			extensions: ['*', '.js', '.ts'],
		},
		output: {
			filename: '[name].bundle.js',
			path: bundlePath,
		},
		plugins,
	};

	if (mode === 'development') {
		config.devServer = {
			contentBase: path.join(__dirname, 'dist'),
			host: 'localhost',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			port: 3434,
		};
		config.devServer.https = true;
	}
	if (mode === 'production') {
		config.plugins.push(new CleanWebpackPlugin());

		config.optimization.splitChunks = {
			cacheGroups: {
				default: false,
				vendors: false,
				vendor: {
					chunks: 'all',
					test: /node_modules/,
					name: false,
				},
			},
			name: false,
		};
	}

	return config;
};
