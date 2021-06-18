
# jseval

Evaluate JavaScript on a URL through headless Chrome browser.

## build

```
docker build -t jseval -f jseval.dockerfile .
```

## usage

```
docker run --rm jseval --help
```

## quick start

Run:

```
$ docker run --rm jseval --url "https://www.tradingview.com/" --evaluate 'JSON.stringify([document.location.href, document.title])' --headless --output
```

stdout would be like:

```
["https://www.tradingview.com/","Free Stock Charts, Stock Quotes and Trade Ideas — TradingView"]
```

## examples

- for complicated JS

```sh
docker run jseval \
	--url "https://www.tradingview.com/ideas/bitcoin/" \
	--evaluate "$(cat <<- EOT
		JSON.stringify(
			Array.from(
				document.querySelectorAll("div.tv-feed-layout__card-item[data-widget-type=\"idea\"] > div > div > a")
			)
			.map(a => a.href)
			.concat(document.location.href)
		)
	EOT
	)" \
	--headless \
	--output
```

## help

```
Usage: jseval [options]

Options:
  --url <url>          set url
  --sleep <seconds>    set sleep (default: 0)
  --evaluate <script>  set script to evaluate
  --output             output to stdout
  --file <file>        output to file (default: "")     
  --headless           enables headless (default: false)
  --log                enables log
  -h, --help           display help for command
```

---

```
todables
  just eval js, not console.log as a default
    should be like: docker run --rm jseval --url "https://www.tradingview.com/" --evaluate 'console.log(JSON.stringify([document.location.href, document.title]))' --headless --output
  should be able to set cookies 
```
