module.export = {
  tokyoResponse: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head><meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>Tokyo Toshokan :: #tokyotosho @ irc.rizon.net :: Torrent Search</title><link rel="stylesheet" type="text/css" href="https://ttcdn.info/css12.php" title="Default" />
		<link rel="alternate stylesheet" type="text/css" href="https://ttcdn.info/css_inverse.php" title="Inverse" />
	<link rel="icon" type="image/png" href="https://ttcdn.info/favicon.png" />
	
	<link rel="shortcut icon" href="https://www.tokyotosho.info/favicon.ico" /><link rel="stylesheet" type="text/css" href="https://ttcdn.info/20130401/clippyjs/build/clippy.css" media="all" /><link rel="alternate" title="Tokyo Toshokan RSS" href="rss.php" type="application/rss+xml" />
	<link rel="search" type="application/opensearchdescription+xml" title="Tokyo Toshokan" href="/tokyotosho-search.php" /></head><body><script type="text/javascript" src="https://ttcdn.info/styleswitcher.js"></script><div id="main">
<h1>Tokyo <span title="Japanese: Libary">Toshokan</span></h1>
<div class="centertext">東京 図書館</div>
<h2><a class="h2" style="font-size: 9pt" href="irc://irc.rizon.net/tokyotosho">#tokyotosho @ irc.rizon.net</a><br />
<span style="font-size: 8pt"><a href="http://tokyotosho.info">http://tokyotosho.info</a> <a href="http://tokyotosho.se">http://tokyotosho.se</a> <a href="http://tokyo-tosho.net">http://tokyo-tosho.net</a></span>
</h2>
<h3>A BitTorrent <span title="English: Toshokan">Library</span> for Japanese Media</h3>

<ul class="menuwrapper">
<li class="menu"><a class="head" title="Lost?" href="index.php">Home</a> (<a class="head" href="https://www.tokyotosho.info/">SSL</a>) ::</li>
<li class="menu"><a class="head" href="settings.php">Customize</a> ::</li>
<li class="menu"><a class="head" href="login.php">Register/Login</a> ::</li>
<li class="menu"><a class="head" title="Tell us about a torrent we don't know about" href="new.php">Submit New Torrent</a> ::</li>
<li class="menu"><a class="head" title="We probably have what you're looking for!" href="search.php">Search</a> ::</li>
<li class="menu"><a class="head" title="Keep on top of the releases" href="rss.php">RSS</a> (<a class="head" title="Or just some of the releases" href="rss_customize.php">Customize</a>)<br /></li>
<li class="menu"><a class="head" title="Documents!" href="/pico">Docs</a> ::</li>
<li class="menu"><a class="head" title="Chat or idle with us on IRC" href="irc://irc.rizon.net/tokyotosho">Chat</a> ::</li>
<li class="menu"><a class="head" title="It's teh moniez" href="/donate.php">Donate!</a> ::</li>
<li class="menu"><a class="head" title="Let's hear from you!" href="/contact.php">Contact</a> ::</li>
<li class="menu"><strong><a class="head" href="https://www.privateinternetaccess.com/pages/protect-tt/">VPN Service</a></strong> ::</li>
<li class="menu"><a class="head" href="http://idlerpg.tokyotosho.info">IdleRPG</a> ::</li>
<li class="menu"><a class="head" title="Off site status page" href="http://status.tokyotosho.info">Status Page</a></li>
</ul>
<table class="centertext" style="width: 100%; margin-left: auto; margin-right: auto; padding-bottom: 1em; margin: 0;">
<tr><td id="tsearch">Torrent Search</td></tr>
</table>
<p class="centertext"><a href="https://www.privateinternetaccess.com/pages/protect-tt/"><img alt="Private Internet Access" src="https://ttcdn.info/pia_wide.png" /></a></p>	<form style="margin: 0; padding; 0" action="/search.php" method="get" accept-charset="utf-8">
	<table class="centertext" cellspacing="0" cellpadding="0" style="width: 100%; padding-bottom: 1em; margin: 0;">
	<tr><td>
	<input size="60" type="text" name="terms" value="SNIS910" />
	<select name="type">
	<option value="0">All</option>
	<option value="1">Anime</option><option value="10">Non-English</option><option value="3">Manga</option><option value="8">Drama</option><option value="2">Music</option><option value="9">Music Video</option><option value="7">Raws</option><option value="4">Hentai</option><option value="12">Hentai (Anime)</option><option value="13">Hentai (Manga)</option><option value="14">Hentai (Games)</option><option value="11">Batch</option><option value="15">JAV</option><option value="5">Other</option>	</select><br />
	<input type="checkbox" name="searchName" value="true" checked="checked" id="searchName" /><label for="searchName">Search name</label>
	<span style="font-variant: small-caps;">Or</span>
	<input type="checkbox" name="searchComment" value="true" checked="checked" id="searchComment" /><label for="searchComment">Search comment</label><br />
	<label for="minMB">Torrent Size (Min MB):</label>
	<input id="minMB" size="4" type="text" name="size_min" value="" />
	<label for="maxMB">(Max MB):</label>
	<input size="4" type="text" name="size_max" id="maxMB" value="" />
	<br /><label for="submitter">Submitter:</label>
	<input id="submitter" size="12" type="text" name="username" value="" /><br />
	<input type="submit" value="Search" /><br />
	</td></tr>
	</table>
	</form>
	<table class="listing">
<tr><td class="centertext" colspan="3"><a href="/rss.php?terms=SNIS910&amp;type=0&amp;searchName=true&amp;searchComment=true&amp;size_min=&amp;size_max=&amp;username="><img src="https://ttcdn.info/feed-icon-14x14.png" alt="RSS" /> RSS Feed of these results</a></td></tr><tr class="shade category_0"><td rowspan="2"><a href="/?cat=15"><img class="icon" alt="JAV" src="https://ttcdn.info/cat_jav5.png" /></a></td><td class="desc-top"><a href="magnet:?xt=urn:btih:EOJZPIL47X2CUFO3ZOROAGDKIZENKJDI&amp;tr=udp%3A%2F%2F9.rarbg.com%3A2710%2Fannounce&amp;tr=udp%3A%2F%2F9.rarbg.me%3A2710%2Fannounce&amp;tr=udp%3A%2F%2Fmgtracker.org%3A2710%2Fannounce&amp;tr=http%3A%2F%2Ftracker.tfile.me%2Fannounce&amp;tr=http%3A%2F%2Fopen.acgtracker.com%3A1096%2Fannounce&amp;tr=http%3A%2F%2Fmgtracker.org%3A2710%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.ex.ua%3A80%2Fannounce&amp;tr=http%3A%2F%2Fwww.365shares.net&amp;tr=http%3A%2F%2Fwww.2121.club&amp;tr=http%3A%2F%2F88files.net&amp;tr=http%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"><span class="sprite_magnet"></span></a> <a rel="nofollow" type="application/x-bittorrent" href="https://onejav.com/goto/t/snis910">SNIS-910</a></td><td class="web"><a href="https://onejav.com/torrent/snis910">Website</a> | <a rel="nofollow" href="details.php?id=1096063">Details</a></td></tr><tr class="shade category_0"><td class="desc-bot">Submitter: Anonymous | Size: 1.39GB | Date: 2017-05-16 07:00 UTC | Comment: https://onejav.com - SNIS910 Aoi - Big Tits, Bride, Young Wife, Cuckold, Kiss, Married Woman, Risky Mosaic, Solowork</td><td align="right" style="color: #BBB; font-family: monospace" class="stats">S: <span style="color: red">0</span> L: <span style="color: red">0</span> C: <span style="color: red">0</span> ID: 1096063</td></tr></table><p style="text-align: center">Returned 1 result.</p><form action="/search.php" method="get" accept-charset="utf-8">
<table class="centertext" cellspacing="0" cellpadding="0" style="width: 100%; padding-bottom: 1em; margin: 0;">
<tr><td>
<label for="terms2">Search Terms:</label>
<input id="terms2" size="60" type="text" name="terms" value="" />
<select name="type">
<option value="0">All</option>
<option value="1">Anime</option>
<option value="10">Non-English</option>
<option value="8">Drama</option>
<option value="3">Manga</option>
<option value="2">Music</option>
<option value="9">Music-Video</option>
<option value="7">Raws</option>
<option value="4">Hentai</option>
<option value="11">Batch</option>
<option value="5">Other</option>
</select><br />
<input type="checkbox" name="searchName" value="true" checked="checked" id="searchName2" /><label for="searchName2">Search name</label>
<span style="font-variant: small-caps;">Or</span>
<input type="checkbox" name="searchComment" value="true" checked="checked" id="searchComment2" /><label for="searchComment2">Search comment</label><br />
<label for="minMB2">Torrent Size (Min MB):</label><input id="minMB2" size="4" type="text" name="size_min" value="" />
<label for="maxMB2">(Max MB):</label><input id="maxMB2" size="4" type="text" name="size_max" value="" /><br />
<label for="submitter2">Submitter:</label><input size="12" type="text" name="username" value="" id="submitter2" /><br />
<input type="submit" value="Search" /><br />
</td></tr>
</table>
</form>
</div><p class="footer">
<a href="https://www.privateinternetaccess.com/pages/protect-tt/"><img alt="Private Internet Access" src="https://ttcdn.info/pia.png" /></a><br />
<br />
Rolling visitor numbers <br />IPv4: 24h [47,198] 60min [3,632] 5min [486] 1min [143] - 5 minute rolling average [857]<br />
IPv6: 24h [12,795] 60min [925] 5min [97] 1min [21] - 5 minute rolling average [172]

<br />Hosted at:<br />
<a href="http://serioustubes.org/"><img alt="Serious Tubes" src="https://ttcdn.info/serioustubes.png" /></a><br />Page generated in 202ms.<br />You are connecting from: 140.207.25.100 <b>SSL</b><b> (SNI supported)</b></p></body></html>
    `
};
