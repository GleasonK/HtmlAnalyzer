# HtmlAnalyzer
Lightweight chrome extension to alert when HTML of a visited site contains interesting comments

Many websites hide interesting text in HTML comments or dev console logs, see [NYT article on White House "A call for coders"][1]. 

Instead of wondering _how do people find this stuff_ I decided to _make something to find this stuff_.

I'm only just getting started, but I can promise one thing - the UI won't be pretty.

# Samples

### A call to dev's is hidden in the White House's HTML comments
![White House website example](https://github.com/GleasonK/HtmlAnalyzer/blob/main/images/WhiteHouse_Example.PNG?raw=true)
Ref: [WhiteHouse.gov][2]

### Medium hides a job link in their dev console logs
![Medium job link in dev console](https://github.com/GleasonK/HtmlAnalyzer/blob/main/images/Medium_Example.PNG?raw=true)
Ref: [Medium.com][3]

### Reddit also hides a job link in their dev console logs
![Reddit job link in dev console](https://github.com/GleasonK/HtmlAnalyzer/blob/main/images/Reddit_Example.PNG?raw=true)
Ref: [Reddit.com][5]


### My personal page has a prize for 10x devs
![KevinGleason.me dev console reward](https://github.com/GleasonK/HtmlAnalyzer/blob/main/images/PersonalSite_Example.PNG?raw=true)
Ref: [KevinGleason.me][4]

# Brainstorm:
- (Done) Scan for HTML comments and try to write some rules to filter out interesting ones
- (Done) redirect console.log to capture log output and find interesting console output
  + Todo: In order to get access to dev log, needs to inject code into DOM and overwrite the `console.log` function. Should be able to opt out of this. Use chrome.storage APIs. 
- Todo: Any way to notify on hidden forms or links on the page? Might be overkill, can imagine a lot of hidden items.


[1]:https://www.nytimes.com/2021/01/20/us/politics/biden-white-house-website.html#link-23793b93
[2]:https://www.whitehouse.gov/
[3]:https://barackobama.medium.com/a-new-day-for-america-d4b04bda47d1
[4]:https://www.kevingleason.me
[5]:https://reddit.com
