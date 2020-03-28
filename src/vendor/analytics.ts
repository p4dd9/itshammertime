/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const gaNewElem: any = {};
export const gaElems: any = {};

const host = window.location.hostname;
const GA_PROPERTY_ID = 'UA-162126531-1';

function gaInit() {
	const currdate: any = new Date();

	(function(i: any, s: any, o: any, g: any, r: any, a: any, m: any) {
		i.GoogleAnalyticsObject = r;
		(i[r] =
			i[r] ||
			function() {
				(i[r].q = i[r].q || []).push(arguments);
			}),
			(i[r].l = 1 * currdate);
		(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m);
	})(
		window,
		document,
		'script',
		'//www.google-analytics.com/analytics.js',
		'ga',
		gaNewElem,
		gaElems
	);

	ga('create', GA_PROPERTY_ID, 'auto');
	ga('send', 'pageview');
}

if (host !== 'localhost') {
	gaInit();
}
