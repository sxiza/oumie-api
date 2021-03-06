'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const User = use('Oumie/Models/User')

Route.get('/', async () => {
	return `Currently ${(await User.getCount())} Oumie happiness collaborators`
})

// Authentication
Route.group(() => {
	// Login
	Route.post('login', 'Oumie/Api/Http/Controllers/Auth/AuthController.login')
		.as('auth.login')
		.validator('Login')
	// Register
	Route.post('register', 'Oumie/Api/Http/Controllers/Auth/AuthController.register')
		.as('auth.register')
		.validator('RegisterUser')
	// Self
	Route.get('self', 'Oumie/Api/Http/Controllers/Auth/AuthController.self')
		.as('user.self')
		.middleware('auth')
}).prefix('auth')

// Beneficiaries
Route.resource('beneficiary', 'Oumie/Api/Http/Controllers/Beneficiary/BeneficiaryController')
	.apiOnly()
	.middleware(new Map([
		[['index', 'show', 'create'], ['auth']]
	]))
	.validator(new Map([
		[['beneficiary.store'], ['Beneficiary/BeneficiaryCreate']]
	]))

// Soundclips
Route.resource('soundclip', 'Oumie/Api/Http/Controllers/Soundclip/SoundclipController')
	.apiOnly()
	.middleware(new Map([
		[['index'], ['auth', 'policy-soundclip:index']]
	]))
	.validator(new Map([
		[['soundclip.store'], ['Soundclip/SoundclipCreate']]
	]))
Route.get('soundclip/:id/play', 'Oumie/Api/Http/Controllers/Soundclip/SoundclipController.play').middleware('auth')