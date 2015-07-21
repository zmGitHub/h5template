'use strict';
angular
	.module('app')
	.config(function(toastrConfig, $httpProvider,$mdThemingProvider) {
		$httpProvider.interceptors.push('responseInterceptor');
		$httpProvider.interceptors.push('authInterceptor');

		angular.extend(toastrConfig, {
			allowHtml: true,
			autoDismiss: false,
			closeButton: false,
			closeHtml: '<button>&times;</button>',
			containerId: 'toast-container',
			extendedTimeOut: 0,
			iconClasses: {
				error: 'toast-error',
				info: 'toast-info',
				success: 'toast-success',
				warning: 'toast-warning'
			},
			maxOpened: 0,
			messageClass: 'toast-message',
			newestOnTop: true,
			onHidden: null,
			onShown: null,
			positionClass: 'toast-top-center',
			preventDuplicates: false,
			preventOpenDuplicates: false,
			progressBar: false,
			tapToDismiss: true,
			target: 'body',
			templates: {
				toast: 'directives/toast/toast.html',
				progressbar: 'directives/progressbar/progressbar.html'
			},
			timeOut: 0,
			titleClass: 'toast-title',
			toastClass: 'toast'
		});
	})