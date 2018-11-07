# Advertisement request enhancer
Microservice endpoint that enhances an incoming Advertisement Request with additional contextual information.

# Setup

Install all packages

```
npm install
```

Create `.env` file at root directory and add following content

```
NODE_ENV=development
PORT=8080
```

Start server

```npm start```

Use postman to hit following URL:

`URL` 

```http://localhost:8080/advertisement/enhance```


Payload 

```{
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

### Tests

To run unit tests

```
npm test
```

To Integration tests suite

```npm run test:integration```




