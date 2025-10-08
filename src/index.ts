import { password } from "bun";
import { Elysia ,t} from "elysia";
import { openapi } from '@elysiajs/openapi';
import {signin_hadle} from "./hadler";
import oauth2, { google } from '@bogeychan/elysia-oauth2';
import { randomBytes } from 'crypto';

const globalState = randomBytes(8).toString('hex')
let globalToken = null

const auth = oauth2({
	profiles: {
		// define multiple OAuth 2.0 profiles
		google: {
			provider: google(),
			scope: ['https://www.googleapis.com/auth/userinfo.profile']
		}
	},
	state: {
		// custom state verification between requests
		check(ctx, name, state) {
			return state === globalState
		},
		generate(ctx, name) {
			return globalState
		}
	},
	storage: {
		// storage of users' access tokens is up to you
		get(ctx, name) {
			return globalToken
		},
		set(ctx, name, token) {
			globalToken = token
		},
		delete(ctx, name) {
			globalToken = null
		}
	}
})
function userPage(user: {}, logout: string) {
	const html = `<!DOCTYPE html>
    <html lang="en">
    <body>
      User:
      <pre>${JSON.stringify(user, null, '\t')}</pre>
      <a href="${logout}">Logout</a>
    </body>
    </html>`

	return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}

const app = new Elysia()
  .use(openapi())
  .use(auth)
  .post("/signin", ({body:{username,password}}) => signin_hadle(username,password),{body:t.Object({username:t.String(),password:t.String()})})
  .get("/signup", () => "Hello Elysia")
  .get('/', async (ctx) => {
		// get login, callback, logout urls for one or more OAuth 2.0 profiles
		const profiles = ctx.profiles('google')
		// check if one or more OAuth 2.0 profiles are authorized
		if (await ctx.authorized('google')) {
			const user = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
				// ... and use the Authorization header afterwards
				headers: await ctx.tokenHeaders('google')
			})
			console.log(profiles.google.logout)
			return userPage(await user.json(), profiles.google.logout)
		}
		
		// Render login page
		const html = `<!DOCTYPE html>
    <html lang="en">
    <body>
      <h2>Login with <a href="${profiles.google.login}">google</a></h2>
    </body>
    </html>`
		console.log(profiles.google.login)
		return new Response(html, { headers: { 'Content-Type': 'text/html' } })
	})
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
