const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, 'dist/');
const imagePattern = /\.(jpe?g|png|gif|svg)$/i;

module.exports = (_env, argv) => {
	const mode = argv.mode;
	const isProduction = mode === 'production';

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
		new ImageminPlugin({ test: imagePattern }),
	];

	for (name in entryPoints) {
		if (entryPoints[name].build) {
			entry[name] = entryPoints[name].path;
			if (isProduction) {
				plugins.push(
					new HtmlWebpackPlugin({
						inject: true,
						chunks: [name],
						template: './src/index.html',
						filename: entryPoints[name].outputHtml,
						title: 'LudeCat Twitch Extension',
					})
				);

				plugins.push(
					new MiniCssExtractPlugin({
						filename: '[name].[hash].css',
						chunkFilename: '[id].[hash].css',
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
				{
					test: /\.s(a|c)ss$/,
					loader: [
						isProduction
							? MiniCssExtractPlugin.loader
							: 'style-loader',
						'css-loader',
						{
							loader: 'sass-loader',
							options: {
								sourceMap: !isProduction,
							},
						},
					],
				},
			],
		},
		resolve: {
			extensions: ['*', '.js', '.ts', '.scss'],
		},
		output: {
			filename: '[name].bundle.js',
			path: bundlePath,
		},
		plugins,
	};

	if (!isProduction) {
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
	if (isProduction) {
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
