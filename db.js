const mongoose = require('mongoose')
const CryptoJS = require('crypto-js')

const Schema = mongoose.Schema
const secretKey = 'dsasdasdrrth%^$$%^TERGDFDFG' // must be secret in .env file

mongoose.connect('mongodb://localhost:27017/db', {
	// your own mongodb url
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const validateEmail = (email) => {
	const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	return re.test(email)
}

const encryptPassword = (password, key) => {
	const encryptedPassword = CryptoJS.AES.encrypt(password, key).toString()

	return encryptedPassword
}

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, 'The name field is required'],
		minLength: [3, ' The minimum number of characters is 3'],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'The name field is required'],
		trim: true,
		lowercase: true,
		unique: true,
		validate: [(value) => validateEmail(value), 'Please enter a valid email!'],
	},
	password: {
		type: String,
		required: [true, 'The password field is required'],
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
})

userSchema.path('password').set((value) => encryptPassword(value, secretKey))

const User = mongoose.model('User', userSchema)

async function main() {
	console.log('s')
	const newUser = new User({
		name: 'sample',
		email: 'sample@gmail.com',
		password: 'SamplePassword',
	})

	try {
		await newUser.save((err, data) => {
			if (err) {
				if (err.code === 11000) {
					return console.log('This email already exists!')
				}
			}
		})
	} catch (e) {
		console.log('Something went wrong...')
		for (const key in e.errors) {
			console.log(e.errors[key].message)
		}
	}
}

main()

async function getUsers() {
	const users = await User.find({})

	console.log(users)
}

// getUsers()

async function getUser() {
	const user = await User.find({ email: 'Sample Email' })

	console.log(user)
}

//getUser()
