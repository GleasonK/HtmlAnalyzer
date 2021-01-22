# HtmlAnalyzer
Lightweight chrome extension to alert when HTML of a visited site contains interesting comments

Many websites hide interesting text in HTML comments, see [NYT article on White House "A call for coders"][1]. 

Instead of wondering _how do they do that_ I decided to _make something to do that_.

I'm only just getting, but I can promise one thing - the UI won't be pretty.

# Brainstorm:
- Scan for HTML comments and try to write some rules to filter out interesting ones
- (Maybe) redirect console.log to capture log output and find interesting console output (like [kevingleason.me][2] has ofc)
- Any way to notify on hidden forms or links on the page? Might be overkill, can imagine a lot of hidden items.


[1]:https://www.nytimes.com/2021/01/20/us/politics/biden-white-house-website.html#link-23793b93
[2]:https://www.kevingleason.me
