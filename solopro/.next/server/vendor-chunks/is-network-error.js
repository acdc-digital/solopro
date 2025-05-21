"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-network-error";
exports.ids = ["vendor-chunks/is-network-error"];
exports.modules = {

/***/ "(ssr)/./node_modules/is-network-error/index.js":
/*!************************************************!*\
  !*** ./node_modules/is-network-error/index.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ isNetworkError)\n/* harmony export */ });\nconst objectToString = Object.prototype.toString;\n\nconst isError = value => objectToString.call(value) === '[object Error]';\n\nconst errorMessages = new Set([\n\t'network error', // Chrome\n\t'Failed to fetch', // Chrome\n\t'NetworkError when attempting to fetch resource.', // Firefox\n\t'The Internet connection appears to be offline.', // Safari 16\n\t'Load failed', // Safari 17+\n\t'Network request failed', // `cross-fetch`\n\t'fetch failed', // Undici (Node.js)\n\t'terminated', // Undici (Node.js)\n]);\n\nfunction isNetworkError(error) {\n\tconst isValid = error\n\t\t&& isError(error)\n\t\t&& error.name === 'TypeError'\n\t\t&& typeof error.message === 'string';\n\n\tif (!isValid) {\n\t\treturn false;\n\t}\n\n\t// We do an extra check for Safari 17+ as it has a very generic error message.\n\t// Network errors in Safari have no stack.\n\tif (error.message === 'Load failed') {\n\t\treturn error.stack === undefined;\n\t}\n\n\treturn errorMessages.has(error.message);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXMtbmV0d29yay1lcnJvci9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvbWF0dGhld3NpbW9uL0RvY3VtZW50cy9HaXRodWIvc29sb3Byby9zb2xvcHJvL25vZGVfbW9kdWxlcy9pcy1uZXR3b3JrLWVycm9yL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuY29uc3QgaXNFcnJvciA9IHZhbHVlID0+IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBFcnJvcl0nO1xuXG5jb25zdCBlcnJvck1lc3NhZ2VzID0gbmV3IFNldChbXG5cdCduZXR3b3JrIGVycm9yJywgLy8gQ2hyb21lXG5cdCdGYWlsZWQgdG8gZmV0Y2gnLCAvLyBDaHJvbWVcblx0J05ldHdvcmtFcnJvciB3aGVuIGF0dGVtcHRpbmcgdG8gZmV0Y2ggcmVzb3VyY2UuJywgLy8gRmlyZWZveFxuXHQnVGhlIEludGVybmV0IGNvbm5lY3Rpb24gYXBwZWFycyB0byBiZSBvZmZsaW5lLicsIC8vIFNhZmFyaSAxNlxuXHQnTG9hZCBmYWlsZWQnLCAvLyBTYWZhcmkgMTcrXG5cdCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJywgLy8gYGNyb3NzLWZldGNoYFxuXHQnZmV0Y2ggZmFpbGVkJywgLy8gVW5kaWNpIChOb2RlLmpzKVxuXHQndGVybWluYXRlZCcsIC8vIFVuZGljaSAoTm9kZS5qcylcbl0pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc05ldHdvcmtFcnJvcihlcnJvcikge1xuXHRjb25zdCBpc1ZhbGlkID0gZXJyb3Jcblx0XHQmJiBpc0Vycm9yKGVycm9yKVxuXHRcdCYmIGVycm9yLm5hbWUgPT09ICdUeXBlRXJyb3InXG5cdFx0JiYgdHlwZW9mIGVycm9yLm1lc3NhZ2UgPT09ICdzdHJpbmcnO1xuXG5cdGlmICghaXNWYWxpZCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIFdlIGRvIGFuIGV4dHJhIGNoZWNrIGZvciBTYWZhcmkgMTcrIGFzIGl0IGhhcyBhIHZlcnkgZ2VuZXJpYyBlcnJvciBtZXNzYWdlLlxuXHQvLyBOZXR3b3JrIGVycm9ycyBpbiBTYWZhcmkgaGF2ZSBubyBzdGFjay5cblx0aWYgKGVycm9yLm1lc3NhZ2UgPT09ICdMb2FkIGZhaWxlZCcpIHtcblx0XHRyZXR1cm4gZXJyb3Iuc3RhY2sgPT09IHVuZGVmaW5lZDtcblx0fVxuXG5cdHJldHVybiBlcnJvck1lc3NhZ2VzLmhhcyhlcnJvci5tZXNzYWdlKTtcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/is-network-error/index.js\n");

/***/ })

};
;