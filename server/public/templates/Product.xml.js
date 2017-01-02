//
//  Product.xml.js
//  CCC-TV
//
//  Contributors: Kris Simon
//
//  ISC 2015 aus der Technik.
//
// Abstract:
// This Template show a single event
//
// It is based on the product template 
// https://developer.apple.com/library/prerelease/tvos/documentation/LanguagesUtilities/Conceptual/ATV_Template_Guide/ProductTemplate.html#//apple_ref/doc/uid/TP40015064-CH8-SW4
//

// Convert month numbers into names
var Template = function ProductTemplate(model, callback) { 
	model.printMonth = function(number){
		switch(parseInt(number)){
			case 1:
				return "January";
			case 2:
				return "February";
			case 3:
				return "March";
			case 4:
				return "April";
			case 5:
				return "May";
			case 6:
				return "June";
			case 7:
				return "July";
			case 8:
				return "August";
			case 9:
				return "September";
			case 10:
				return "October";
			case 11:
				return "November";
			case 12:
				return "December";
		}
	};
	
	var compiled = _.template(`<?xml version="1.0" encoding="UTF-8" ?>
<document>
	<head>
		<style>
			.showTextOnHighlight {
				tv-text-highlight-style: show-on-highlight;
			}
			.whiteBadge {
				tv-tint-color: rgb(255, 255, 255);
			}
			.shelfLayout {
				padding: 20 90 50;
			}
			.subtitle-bigger {
				font-size: 30px;
			}
		</style>
	</head>
	<productTemplate theme="light">
		<banner>
		<heroImg src="<%= poster_url %>" />
		<infoList>
			<% if(persons.length > 0){ %>
				<info>
					<header>
						<title>Speaker</title>
					</header>
					<% _.each(persons, function(person){ %>
						<text><%= _.escape(person) %></text>
					<% }) %>
				</info>
			<% } %>
			<% if(date){ %>
				<info>
					<header>
						<title>Released</title>
					</header>
					<text><%= printMonth(date.substring(5, 7)) %> <%= date.substring(0, 4) %></text>
				</info>
			<% } %>
		</infoList>
		<stack>
			<title><%= _.escape(title) %></title>
			<% if(subtitle) { %>
				<subtitle class="subtitle-bigger"><%= _.escape(subtitle) %></subtitle>
			<% } %>
			<!-- <subtitle ><%= guid %></subtitle> -->
			<row>
				<% _.each(tags, function(tag){ %>
					<text><%= _.escape(tag) %></text>
				<% }) %>
			</row>
			<description allowsZooming="true" action="show-description" presentation="modalDialogPresenter"><%= _.escape(description) %></description>
			<row>
				<%
					var known_types = ['vnd.voc/h264-hd', 'video/mp4', 'audio/mpeg']; 
					recordings = _.filter(recordings, function(record){
						if(_.indexOf(known_types, record.mime_type) > -1){
							return true;
						}
					}); 
				%>
				<!-- first the video -->
				<% var h264 = _.findWhere(recordings, {mime_type: 'vnd.voc/h264-hd'}); %>
				<% if(h264){ %>
					<buttonLockup action="play-video" file="<%= h264.recording_url %>">
						<!-- <badge src="<%= resourceLoader.BASEURL %>/resources/video.png" class="whiteBadge"></badge> -->
						<badge src="resource://button-play" class="whiteBadge"></badge> 
						<title>Play Video</title>
					</buttonLockup>				
				<% } else { %>
					<% var mp4 = _.findWhere(recordings, {mime_type: 'video/mp4'}); %>
					<% if(mp4){ %>
						<buttonLockup action="play-video" file="<%= mp4.recording_url %>">
							<!-- <badge src="<%= resourceLoader.BASEURL %>/resources/video.png" class="whiteBadge"></badge> -->
							<badge src="resource://button-play" class="whiteBadge"></badge> 
							<title>Play Video</title>
						</buttonLockup>				
					<% } else { %>
						<buttonLockup action="" file="">
							<badge src="resource://button-remove" class="whiteBadge"></badge>
							<title>- no video content -</title>
						</buttonLockup>	
					<% } %>			
				<% } %>
				<!-- audio -->
				<% var mp3 = _.findWhere(recordings, {mime_type: 'audio/mpeg'}); %>
				<% if(mp3){ %>
				<buttonLockup action="play-video" file="<%= mp3.recording_url %>">
					<!-- <badge src="<%= resourceLoader.BASEURL %>/resources/audio.png" class="whiteBadge"></badge> -->
					<badge src="resource://button-artist" class="whiteBadge"></badge> 
					<title>Play Audio</title>
				</buttonLockup>	
				<% } %>
				
			</row>
		</stack>
	</banner>
	<shelf>
		<header>
			<title>More from this event</title>
		</header>
			<section>
				<%  _.each(more, function(m){ %>
					<% if(m.slug == slug){ return; } %>
					<lockup presentation="videoDialogPresenter" file="<%= m.url %>" eventurl="<%= m.url %>">
						<img src="<%= m.poster_url %>" width="402" height="226" />
						<title class="showTextOnHighlight"><%= _.escape(m.title) %></title>
					</lockup>
				<% }) %>
			</section>
		</shelf>
	</productTemplate>
</document>`);

	callback(null, compiled(model));
}
