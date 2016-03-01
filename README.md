# URL Shortener Microservice

## Synposis
Built with the [Clementine Boilerplate](https://github.com/johnstonbl01/clementinejs), this website will shortern urls and allow redirection through the new shortened url.

## Code Example
### Example Creation Usage
* [https://freecodecamp-url-shortener-will-is-coding.c9users.io/new/https://www.google.com](https://freecodecamp-url-shortener-will-is-coding.c9users.io/new/https://www.google.com)
* [https://freecodecamp-url-shortener-will-is-coding.c9users.io/http://freecodecamp.com/new](https://freecodecamp-url-shortener-will-is-coding.c9users.io/http://freecodecamp.com/new)

If you want to pass a site that doesn't exist (or an invalid url) for some reason you can do:

[https://freecodecamp-url-shortener-will-is-coding.c9users.io/new/invalidurlhere?allow=true](https://freecodecamp-url-shortener-will-is-coding.c9users.io/new/invalidurlhere?allow=true)

### Example Creation Output
`{ "original_url": "http://freecodecamp.com", "short_url": "https://freecodecamp-url-shortener-will-is-coding.c9users.io/0" }`

### Usage
[https://freecodecamp-url-shortener-will-is-coding.c9users.io/0](https://freecodecamp-url-shortener-will-is-coding.c9users.io/0)

Will redirect you to:

[http://freecodecamp.com](http://freecodecamp.com)

## License

MIT License. [Click here for more information.](LICENSE.md)
