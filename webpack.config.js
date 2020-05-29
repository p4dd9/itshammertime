const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// defines where the bundle file will live
const imagePattern = /\.(jpe?g|png|gif|svg)$/i;

const frontendSrcPath = path.resolve(__dirname, 'app/frontend/src');
const frontendDistPath = path.resolve(__dirname, 'app/frontend/dist');

module.exports = (_env, argv) => {
	const mode = argv.mode;
	const isProduction = mode === 'production';

	let entry = {
		main: `${frontendSrcPath}/views/VideoOverlay.ts`,
		config: `${frontendSrcPath}/views/Config.ts`,
	};

	let plugins = [
		new HtmlWebpackPlugin({
			inject: true,
			template: `${frontendSrcPath}/video_overlay.html`,
			filename: 'video_overlay.html',
			chunks: ['main'],
			title: "It's Hammer Time!",
		}),
		new HtmlWebpackPlugin({
			template: `${frontendSrcPath}/static_config.html`,
			filename: 'config.html',
			chunks: ['config'],
			title: "It's Hammer Time!",
		}),
	];

	let config = {
		entry,
		optimization: {
			minimize: false, // do not minimize due to twitch review process
		},
		devtool: isProduction ? false : 'source-map',
		module: {
			rules: [
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
			path: frontendDistPath,
		},
		plugins,
	};

	if (!isProduction) {
		config.devServer = {
			contentBase: path.join(__dirname, 'app/frontend/dist'),
			host: 'localhost',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			port: 3434,
		};
		config.devServer.https = true;
	}

	if (isProduction) {
		plugins.push(
			new MiniCssExtractPlugin({
				filename: '[name].[hash].css',
				chunkFilename: '[id].[hash].css',
			})
		);
		plugins.push(new ImageminPlugin({ test: imagePattern }));
		plugins.push(new CleanWebpackPlugin());

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
