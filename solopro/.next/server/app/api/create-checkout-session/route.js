/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/create-checkout-session/route";
exports.ids = ["app/api/create-checkout-session/route"];
exports.modules = {

/***/ "(rsc)/./app/api/create-checkout-session/route.ts":
/*!**************************************************!*\
  !*** ./app/api/create-checkout-session/route.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var stripe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stripe */ \"(rsc)/./node_modules/stripe/esm/stripe.esm.node.js\");\n\n\n// Initialize Stripe with your secret key\nconst stripeSecretKey = process.env.STRIPE_SECRET_KEY;\n// Check if we have a Stripe key\nif (!stripeSecretKey) {\n    console.error(\"Missing STRIPE_SECRET_KEY environment variable\");\n}\nconst stripe = new stripe__WEBPACK_IMPORTED_MODULE_1__[\"default\"](stripeSecretKey || \"\", {\n    apiVersion: \"2025-04-30.basil\"\n});\nasync function POST(request) {\n    try {\n        console.log(\"API: create-checkout-session called\");\n        const body = await request.json();\n        const { priceId, paymentMode = \"payment\", embeddedCheckout = true } = body;\n        console.log(\"Received request with priceId:\", priceId, \"mode:\", paymentMode, \"embedded:\", embeddedCheckout);\n        if (!priceId) {\n            console.error(\"API Error: Price ID is required but was not provided\");\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Price ID is required\"\n            }, {\n                status: 400\n            });\n        }\n        if (!stripeSecretKey) {\n            console.error(\"API Error: Stripe secret key is not configured\");\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Payment service is not properly configured\"\n            }, {\n                status: 500\n            });\n        }\n        console.log(`Creating Stripe checkout session for price ID: ${priceId}`);\n        // Get the origin for redirect URLs\n        const origin = \"http://localhost:3002\" || 0;\n        console.log(\"Using origin for redirects:\", origin);\n        // Common session parameters\n        const sessionParams = {\n            payment_method_types: [\n                \"card\"\n            ],\n            line_items: [\n                {\n                    price: priceId,\n                    quantity: 1\n                }\n            ],\n            mode: paymentMode,\n            allow_promotion_codes: true,\n            billing_address_collection: \"auto\",\n            phone_number_collection: {\n                enabled: true\n            }\n        };\n        if (embeddedCheckout) {\n            // For embedded checkout, we use ui_mode: 'embedded' and return_url\n            sessionParams.ui_mode = 'embedded';\n            sessionParams.return_url = `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`;\n        } else {\n            // For redirect checkout, we use success_url and cancel_url\n            sessionParams.success_url = `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`;\n            sessionParams.cancel_url = `${origin}/?canceled=true`;\n        }\n        const session = await stripe.checkout.sessions.create(sessionParams);\n        console.log(\"Checkout session created successfully:\", session.id);\n        if (embeddedCheckout) {\n            console.log(\"Returning client secret for embedded checkout\");\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                clientSecret: session.client_secret,\n                sessionId: session.id\n            });\n        } else {\n            // Return the URL for redirect\n            if (!session.url) {\n                throw new Error(\"Failed to generate checkout URL\");\n            }\n            console.log(\"Checkout URL created:\", session.url);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                url: session.url\n            });\n        }\n    } catch (error) {\n        console.error(\"Error creating checkout session:\", error);\n        // Extract more details from the Stripe error if available\n        let errorMessage = \"Failed to create checkout session\";\n        if (error instanceof stripe__WEBPACK_IMPORTED_MODULE_1__[\"default\"].errors.StripeError) {\n            errorMessage = `Stripe error: ${error.type} - ${error.message}`;\n            console.error(\"Stripe error details:\", {\n                type: error.type,\n                code: error.code,\n                param: error.param\n            });\n        } else if (error instanceof Error) {\n            errorMessage = error.message;\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: errorMessage\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NyZWF0ZS1jaGVja291dC1zZXNzaW9uL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEyQztBQUNmO0FBRTVCLHlDQUF5QztBQUN6QyxNQUFNRSxrQkFBa0JDLFFBQVFDLEdBQUcsQ0FBQ0MsaUJBQWlCO0FBRXJELGdDQUFnQztBQUNoQyxJQUFJLENBQUNILGlCQUFpQjtJQUNwQkksUUFBUUMsS0FBSyxDQUFDO0FBQ2hCO0FBRUEsTUFBTUMsU0FBUyxJQUFJUCw4Q0FBTUEsQ0FBQ0MsbUJBQW1CLElBQUk7SUFDL0NPLFlBQVk7QUFDZDtBQUVPLGVBQWVDLEtBQUtDLE9BQWdCO0lBQ3pDLElBQUk7UUFDRkwsUUFBUU0sR0FBRyxDQUFDO1FBRVosTUFBTUMsT0FBTyxNQUFNRixRQUFRRyxJQUFJO1FBQy9CLE1BQU0sRUFBRUMsT0FBTyxFQUFFQyxjQUFjLFNBQVMsRUFBRUMsbUJBQW1CLElBQUksRUFBRSxHQUFHSjtRQUV0RVAsUUFBUU0sR0FBRyxDQUFDLGtDQUFrQ0csU0FBUyxTQUFTQyxhQUFhLGFBQWFDO1FBRTFGLElBQUksQ0FBQ0YsU0FBUztZQUNaVCxRQUFRQyxLQUFLLENBQUM7WUFDZCxPQUFPUCxxREFBWUEsQ0FBQ2MsSUFBSSxDQUN0QjtnQkFBRVAsT0FBTztZQUF1QixHQUNoQztnQkFBRVcsUUFBUTtZQUFJO1FBRWxCO1FBRUEsSUFBSSxDQUFDaEIsaUJBQWlCO1lBQ3BCSSxRQUFRQyxLQUFLLENBQUM7WUFDZCxPQUFPUCxxREFBWUEsQ0FBQ2MsSUFBSSxDQUN0QjtnQkFBRVAsT0FBTztZQUE2QyxHQUN0RDtnQkFBRVcsUUFBUTtZQUFJO1FBRWxCO1FBRUFaLFFBQVFNLEdBQUcsQ0FBQyxDQUFDLCtDQUErQyxFQUFFRyxTQUFTO1FBRXZFLG1DQUFtQztRQUNuQyxNQUFNSSxTQUFTaEIsdUJBQWdDLElBQUksQ0FBdUI7UUFDMUVHLFFBQVFNLEdBQUcsQ0FBQywrQkFBK0JPO1FBRTNDLDRCQUE0QjtRQUM1QixNQUFNRSxnQkFBcUQ7WUFDekRDLHNCQUFzQjtnQkFBQzthQUFPO1lBQzlCQyxZQUFZO2dCQUNWO29CQUNFQyxPQUFPVDtvQkFDUFUsVUFBVTtnQkFDWjthQUNEO1lBQ0RDLE1BQU1WO1lBQ05XLHVCQUF1QjtZQUN2QkMsNEJBQTRCO1lBQzVCQyx5QkFBeUI7Z0JBQ3ZCQyxTQUFTO1lBQ1g7UUFDRjtRQUVBLElBQUliLGtCQUFrQjtZQUNwQixtRUFBbUU7WUFDbkVJLGNBQWNVLE9BQU8sR0FBRztZQUN4QlYsY0FBY1csVUFBVSxHQUFHLEdBQUdiLE9BQU8sMkNBQTJDLENBQUM7UUFDbkYsT0FBTztZQUNMLDJEQUEyRDtZQUMzREUsY0FBY1ksV0FBVyxHQUFHLEdBQUdkLE9BQU8sd0RBQXdELENBQUM7WUFDL0ZFLGNBQWNhLFVBQVUsR0FBRyxHQUFHZixPQUFPLGVBQWUsQ0FBQztRQUN2RDtRQUVBLE1BQU1nQixVQUFVLE1BQU0zQixPQUFPNEIsUUFBUSxDQUFDQyxRQUFRLENBQUNDLE1BQU0sQ0FBQ2pCO1FBRXREZixRQUFRTSxHQUFHLENBQUMsMENBQTBDdUIsUUFBUUksRUFBRTtRQUVoRSxJQUFJdEIsa0JBQWtCO1lBQ3BCWCxRQUFRTSxHQUFHLENBQUM7WUFDWixPQUFPWixxREFBWUEsQ0FBQ2MsSUFBSSxDQUFDO2dCQUN2QjBCLGNBQWNMLFFBQVFNLGFBQWE7Z0JBQ25DQyxXQUFXUCxRQUFRSSxFQUFFO1lBQ3ZCO1FBQ0YsT0FBTztZQUNMLDhCQUE4QjtZQUM5QixJQUFJLENBQUNKLFFBQVFRLEdBQUcsRUFBRTtnQkFDaEIsTUFBTSxJQUFJQyxNQUFNO1lBQ2xCO1lBRUF0QyxRQUFRTSxHQUFHLENBQUMseUJBQXlCdUIsUUFBUVEsR0FBRztZQUNoRCxPQUFPM0MscURBQVlBLENBQUNjLElBQUksQ0FBQztnQkFBRTZCLEtBQUtSLFFBQVFRLEdBQUc7WUFBQztRQUM5QztJQUNGLEVBQUUsT0FBT3BDLE9BQU87UUFDZEQsUUFBUUMsS0FBSyxDQUFDLG9DQUFvQ0E7UUFFbEQsMERBQTBEO1FBQzFELElBQUlzQyxlQUFlO1FBRW5CLElBQUl0QyxpQkFBaUJOLDhDQUFNQSxDQUFDNkMsTUFBTSxDQUFDQyxXQUFXLEVBQUU7WUFDOUNGLGVBQWUsQ0FBQyxjQUFjLEVBQUV0QyxNQUFNeUMsSUFBSSxDQUFDLEdBQUcsRUFBRXpDLE1BQU0wQyxPQUFPLEVBQUU7WUFDL0QzQyxRQUFRQyxLQUFLLENBQUMseUJBQXlCO2dCQUNyQ3lDLE1BQU16QyxNQUFNeUMsSUFBSTtnQkFDaEJFLE1BQU0zQyxNQUFNMkMsSUFBSTtnQkFDaEJDLE9BQU81QyxNQUFNNEMsS0FBSztZQUNwQjtRQUNGLE9BQU8sSUFBSTVDLGlCQUFpQnFDLE9BQU87WUFDakNDLGVBQWV0QyxNQUFNMEMsT0FBTztRQUM5QjtRQUVBLE9BQU9qRCxxREFBWUEsQ0FBQ2MsSUFBSSxDQUN0QjtZQUFFUCxPQUFPc0M7UUFBYSxHQUN0QjtZQUFFM0IsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR0aGV3c2ltb24vRG9jdW1lbnRzL0dpdGh1Yi9zb2xvcHJvL3NvbG9wcm8vYXBwL2FwaS9jcmVhdGUtY2hlY2tvdXQtc2Vzc2lvbi9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCBTdHJpcGUgZnJvbSBcInN0cmlwZVwiO1xuXG4vLyBJbml0aWFsaXplIFN0cmlwZSB3aXRoIHlvdXIgc2VjcmV0IGtleVxuY29uc3Qgc3RyaXBlU2VjcmV0S2V5ID0gcHJvY2Vzcy5lbnYuU1RSSVBFX1NFQ1JFVF9LRVk7XG5cbi8vIENoZWNrIGlmIHdlIGhhdmUgYSBTdHJpcGUga2V5XG5pZiAoIXN0cmlwZVNlY3JldEtleSkge1xuICBjb25zb2xlLmVycm9yKFwiTWlzc2luZyBTVFJJUEVfU0VDUkVUX0tFWSBlbnZpcm9ubWVudCB2YXJpYWJsZVwiKTtcbn1cblxuY29uc3Qgc3RyaXBlID0gbmV3IFN0cmlwZShzdHJpcGVTZWNyZXRLZXkgfHwgXCJcIiwge1xuICBhcGlWZXJzaW9uOiBcIjIwMjUtMDQtMzAuYmFzaWxcIixcbn0pO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc29sZS5sb2coXCJBUEk6IGNyZWF0ZS1jaGVja291dC1zZXNzaW9uIGNhbGxlZFwiKTtcbiAgICBcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgY29uc3QgeyBwcmljZUlkLCBwYXltZW50TW9kZSA9IFwicGF5bWVudFwiLCBlbWJlZGRlZENoZWNrb3V0ID0gdHJ1ZSB9ID0gYm9keTtcblxuICAgIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgcmVxdWVzdCB3aXRoIHByaWNlSWQ6XCIsIHByaWNlSWQsIFwibW9kZTpcIiwgcGF5bWVudE1vZGUsIFwiZW1iZWRkZWQ6XCIsIGVtYmVkZGVkQ2hlY2tvdXQpO1xuXG4gICAgaWYgKCFwcmljZUlkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQVBJIEVycm9yOiBQcmljZSBJRCBpcyByZXF1aXJlZCBidXQgd2FzIG5vdCBwcm92aWRlZFwiKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogXCJQcmljZSBJRCBpcyByZXF1aXJlZFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIXN0cmlwZVNlY3JldEtleSkge1xuICAgICAgY29uc29sZS5lcnJvcihcIkFQSSBFcnJvcjogU3RyaXBlIHNlY3JldCBrZXkgaXMgbm90IGNvbmZpZ3VyZWRcIik7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiUGF5bWVudCBzZXJ2aWNlIGlzIG5vdCBwcm9wZXJseSBjb25maWd1cmVkXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGBDcmVhdGluZyBTdHJpcGUgY2hlY2tvdXQgc2Vzc2lvbiBmb3IgcHJpY2UgSUQ6ICR7cHJpY2VJZH1gKTtcbiAgICBcbiAgICAvLyBHZXQgdGhlIG9yaWdpbiBmb3IgcmVkaXJlY3QgVVJMc1xuICAgIGNvbnN0IG9yaWdpbiA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0JBU0VfVVJMIHx8IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCI7XG4gICAgY29uc29sZS5sb2coXCJVc2luZyBvcmlnaW4gZm9yIHJlZGlyZWN0czpcIiwgb3JpZ2luKTtcblxuICAgIC8vIENvbW1vbiBzZXNzaW9uIHBhcmFtZXRlcnNcbiAgICBjb25zdCBzZXNzaW9uUGFyYW1zOiBTdHJpcGUuQ2hlY2tvdXQuU2Vzc2lvbkNyZWF0ZVBhcmFtcyA9IHtcbiAgICAgIHBheW1lbnRfbWV0aG9kX3R5cGVzOiBbXCJjYXJkXCJdLFxuICAgICAgbGluZV9pdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJpY2U6IHByaWNlSWQsXG4gICAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgbW9kZTogcGF5bWVudE1vZGUsXG4gICAgICBhbGxvd19wcm9tb3Rpb25fY29kZXM6IHRydWUsXG4gICAgICBiaWxsaW5nX2FkZHJlc3NfY29sbGVjdGlvbjogXCJhdXRvXCIsXG4gICAgICBwaG9uZV9udW1iZXJfY29sbGVjdGlvbjoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgaWYgKGVtYmVkZGVkQ2hlY2tvdXQpIHtcbiAgICAgIC8vIEZvciBlbWJlZGRlZCBjaGVja291dCwgd2UgdXNlIHVpX21vZGU6ICdlbWJlZGRlZCcgYW5kIHJldHVybl91cmxcbiAgICAgIHNlc3Npb25QYXJhbXMudWlfbW9kZSA9ICdlbWJlZGRlZCc7XG4gICAgICBzZXNzaW9uUGFyYW1zLnJldHVybl91cmwgPSBgJHtvcmlnaW59L2Rhc2hib2FyZD9zZXNzaW9uX2lkPXtDSEVDS09VVF9TRVNTSU9OX0lEfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZvciByZWRpcmVjdCBjaGVja291dCwgd2UgdXNlIHN1Y2Nlc3NfdXJsIGFuZCBjYW5jZWxfdXJsXG4gICAgICBzZXNzaW9uUGFyYW1zLnN1Y2Nlc3NfdXJsID0gYCR7b3JpZ2lufS9kYXNoYm9hcmQ/c3VjY2Vzcz10cnVlJnNlc3Npb25faWQ9e0NIRUNLT1VUX1NFU1NJT05fSUR9YDtcbiAgICAgIHNlc3Npb25QYXJhbXMuY2FuY2VsX3VybCA9IGAke29yaWdpbn0vP2NhbmNlbGVkPXRydWVgO1xuICAgIH1cblxuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBzdHJpcGUuY2hlY2tvdXQuc2Vzc2lvbnMuY3JlYXRlKHNlc3Npb25QYXJhbXMpO1xuXG4gICAgY29uc29sZS5sb2coXCJDaGVja291dCBzZXNzaW9uIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5OlwiLCBzZXNzaW9uLmlkKTtcbiAgICBcbiAgICBpZiAoZW1iZWRkZWRDaGVja291dCkge1xuICAgICAgY29uc29sZS5sb2coXCJSZXR1cm5pbmcgY2xpZW50IHNlY3JldCBmb3IgZW1iZWRkZWQgY2hlY2tvdXRcIik7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBcbiAgICAgICAgY2xpZW50U2VjcmV0OiBzZXNzaW9uLmNsaWVudF9zZWNyZXQsXG4gICAgICAgIHNlc3Npb25JZDogc2Vzc2lvbi5pZFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJldHVybiB0aGUgVVJMIGZvciByZWRpcmVjdFxuICAgICAgaWYgKCFzZXNzaW9uLnVybCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2VuZXJhdGUgY2hlY2tvdXQgVVJMXCIpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zb2xlLmxvZyhcIkNoZWNrb3V0IFVSTCBjcmVhdGVkOlwiLCBzZXNzaW9uLnVybCk7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyB1cmw6IHNlc3Npb24udXJsIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgY3JlYXRpbmcgY2hlY2tvdXQgc2Vzc2lvbjpcIiwgZXJyb3IpO1xuICAgIFxuICAgIC8vIEV4dHJhY3QgbW9yZSBkZXRhaWxzIGZyb20gdGhlIFN0cmlwZSBlcnJvciBpZiBhdmFpbGFibGVcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gXCJGYWlsZWQgdG8gY3JlYXRlIGNoZWNrb3V0IHNlc3Npb25cIjtcbiAgICBcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBTdHJpcGUuZXJyb3JzLlN0cmlwZUVycm9yKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSBgU3RyaXBlIGVycm9yOiAke2Vycm9yLnR5cGV9IC0gJHtlcnJvci5tZXNzYWdlfWA7XG4gICAgICBjb25zb2xlLmVycm9yKFwiU3RyaXBlIGVycm9yIGRldGFpbHM6XCIsIHtcbiAgICAgICAgdHlwZTogZXJyb3IudHlwZSxcbiAgICAgICAgY29kZTogZXJyb3IuY29kZSxcbiAgICAgICAgcGFyYW06IGVycm9yLnBhcmFtXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IGVycm9yTWVzc2FnZSB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufSAiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiU3RyaXBlIiwic3RyaXBlU2VjcmV0S2V5IiwicHJvY2VzcyIsImVudiIsIlNUUklQRV9TRUNSRVRfS0VZIiwiY29uc29sZSIsImVycm9yIiwic3RyaXBlIiwiYXBpVmVyc2lvbiIsIlBPU1QiLCJyZXF1ZXN0IiwibG9nIiwiYm9keSIsImpzb24iLCJwcmljZUlkIiwicGF5bWVudE1vZGUiLCJlbWJlZGRlZENoZWNrb3V0Iiwic3RhdHVzIiwib3JpZ2luIiwiTkVYVF9QVUJMSUNfQkFTRV9VUkwiLCJzZXNzaW9uUGFyYW1zIiwicGF5bWVudF9tZXRob2RfdHlwZXMiLCJsaW5lX2l0ZW1zIiwicHJpY2UiLCJxdWFudGl0eSIsIm1vZGUiLCJhbGxvd19wcm9tb3Rpb25fY29kZXMiLCJiaWxsaW5nX2FkZHJlc3NfY29sbGVjdGlvbiIsInBob25lX251bWJlcl9jb2xsZWN0aW9uIiwiZW5hYmxlZCIsInVpX21vZGUiLCJyZXR1cm5fdXJsIiwic3VjY2Vzc191cmwiLCJjYW5jZWxfdXJsIiwic2Vzc2lvbiIsImNoZWNrb3V0Iiwic2Vzc2lvbnMiLCJjcmVhdGUiLCJpZCIsImNsaWVudFNlY3JldCIsImNsaWVudF9zZWNyZXQiLCJzZXNzaW9uSWQiLCJ1cmwiLCJFcnJvciIsImVycm9yTWVzc2FnZSIsImVycm9ycyIsIlN0cmlwZUVycm9yIiwidHlwZSIsIm1lc3NhZ2UiLCJjb2RlIiwicGFyYW0iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/create-checkout-session/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcreate-checkout-session%2Froute&page=%2Fapi%2Fcreate-checkout-session%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcreate-checkout-session%2Froute.ts&appDir=%2FUsers%2Fmatthewsimon%2FDocuments%2FGithub%2Fsolopro%2Fsolopro%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmatthewsimon%2FDocuments%2FGithub%2Fsolopro%2Fsolopro&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcreate-checkout-session%2Froute&page=%2Fapi%2Fcreate-checkout-session%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcreate-checkout-session%2Froute.ts&appDir=%2FUsers%2Fmatthewsimon%2FDocuments%2FGithub%2Fsolopro%2Fsolopro%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmatthewsimon%2FDocuments%2FGithub%2Fsolopro%2Fsolopro&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_matthewsimon_Documents_Github_solopro_solopro_app_api_create_checkout_session_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/create-checkout-session/route.ts */ \"(rsc)/./app/api/create-checkout-session/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/create-checkout-session/route\",\n        pathname: \"/api/create-checkout-session\",\n        filename: \"route\",\n        bundlePath: \"app/api/create-checkout-session/route\"\n    },\n    resolvedPagePath: \"/Users/matthewsimon/Documents/Github/solopro/solopro/app/api/create-checkout-session/route.ts\",\n    nextConfigOutput,\n    userland: _Users_matthewsimon_Documents_Github_solopro_solopro_app_api_create_checkout_session_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZjcmVhdGUtY2hlY2tvdXQtc2Vzc2lvbiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGY3JlYXRlLWNoZWNrb3V0LXNlc3Npb24lMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZjcmVhdGUtY2hlY2tvdXQtc2Vzc2lvbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1hdHRoZXdzaW1vbiUyRkRvY3VtZW50cyUyRkdpdGh1YiUyRnNvbG9wcm8lMkZzb2xvcHJvJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRm1hdHRoZXdzaW1vbiUyRkRvY3VtZW50cyUyRkdpdGh1YiUyRnNvbG9wcm8lMkZzb2xvcHJvJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM2QztBQUMxSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL21hdHRoZXdzaW1vbi9Eb2N1bWVudHMvR2l0aHViL3NvbG9wcm8vc29sb3Byby9hcHAvYXBpL2NyZWF0ZS1jaGVja291dC1zZXNzaW9uL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9jcmVhdGUtY2hlY2tvdXQtc2Vzc2lvbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2NyZWF0ZS1jaGVja291dC1zZXNzaW9uXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9jcmVhdGUtY2hlY2tvdXQtc2Vzc2lvbi9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9tYXR0aGV3c2ltb24vRG9jdW1lbnRzL0dpdGh1Yi9zb2xvcHJvL3NvbG9wcm8vYXBwL2FwaS9jcmVhdGUtY2hlY2tvdXQtc2Vzc2lvbi9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcreate-checkout-session%2Froute&page=%2Fapi%2Fcreate-checkout-session%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcreate-checkout-session%2Froute.ts&appDir=%2FUsers%2Fmatthewsimon%2FDocuments%2FGithub%2Fsolopro%2Fsolopro%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmatthewsimon%2FDocuments%2FGithub%2Fsolopro%2Fsolopro&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/stripe","vendor-chunks/math-intrinsics","vendor-chunks/es-errors","vendor-chunks/qs","vendor-chunks/call-bind-apply-helpers","vendor-chunks/get-proto","vendor-chunks/object-inspect","vendor-chunks/has-symbols","vendor-chunks/gopd","vendor-chunks/function-bind","vendor-chunks/side-channel","vendor-chunks/side-channel-weakmap","vendor-chunks/side-channel-map","vendor-chunks/side-channel-list","vendor-chunks/hasown","vendor-chunks/get-intrinsic","vendor-chunks/es-object-atoms","vendor-chunks/es-define-property","vendor-chunks/dunder-proto","vendor-chunks/call-bound"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcreate-checkout-session%2Froute&page=%2Fapi%2Fcreate-checkout-session%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcreate-checkout-session%2Froute.ts&appDir=%2FUsers%2Fmatthewsimon%2FDocuments%2FGithub%2Fsolopro%2Fsolopro%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmatthewsimon%2FDocuments%2FGithub%2Fsolopro%2Fsolopro&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();