# Advertisement request enhancer
Microservice endpoint that enhances an incoming Advertisement Request with additional contextual information.

# Setup

1. Install all packages

`npm install`

2. Create `.env` file at root directory and add following content

`NODE_ENV=development
PORT=8080`

3. Start server

`npm start`

4. Use postman to hit following URL:

URL - `http://localhost:8080/advertisement/enhance`
Body - ```{
	"site": {
		"id": "123123",
		"page": "http://www.foo.com/why-foo"
	},
	"device": {
		"ip": "69.250.196.118"
	},
	"user": {
		"id": "9cb89r"
	}
}```

# Tests

1. To run unit tests

`npm test`

2. To Integration tests suite

`npm run test:integration`


